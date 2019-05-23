const util = require("util");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp } = format;

const log = createLogger({
  level: "info",
  format: combine(timestamp(), format.json()),
  transports: [new transports.Console({ json: true })]
});

const isError = e => e instanceof Error || (e && e.stack && e.message && true) || false;
const isObject = obj => typeof obj === "object" && !Array.isArray(obj) && obj !== null;
const stringify = data => (isError(data) ? util.inspect(data) : typeof data === "string" ? data : JSON.stringify(data));
const sanatize = data => data.replace(/\\n|\n|\\t|\t|\\r|\r/g, " ");
const dataStringify = data => sanatize(stringify(data));
const addMessage = (arg, { messages = [] } = {}) => (arg || arg === 0 ? messages.concat(dataStringify(arg)) : messages);

const addArg = (data, res = { context: {}, messages: [] }) => (isError(data) && withError(data, res)) || (isObject(data) && withObject(data, res)) || withMessage(data, res);
const withError = (err, res = { context: {}, messages: [] }) => {
  if (err) {
    const { statusCode: status = 500, stack, message } = err;
    let messages = res.messages || [];
    if (message) {
      messages = messages.concat(`Error: ${message}`);
    }
    return { ...res, context: Object.assign({}, res.context, status && { status }, stack && { stack }), messages };
  }
  return res;
};
const withObject = (obj, res = { context: {}, messages: [] }) => (obj ? { ...res, context: Object.assign({}, res.context, obj), messages: res.messages || [] } : res);
const withMessage = (obj, res = { context: {}, messages: [] }) => Object.assign({}, res, { messages: addMessage(obj, res) });

const parseArgs = args => {
  const obj = args.reduce((res, data) => addArg(data, res), { context: {}, messages: [] });
  return { ...obj, messages: obj.messages.join(",") };
};
const logByLevel = level => (...args) => {
  const { messages, context } = parseArgs(args);
  return log[level](messages, context);
};

const logger = Object.keys(log.levels).reduce((acc, val) => {
  acc[val] = logByLevel(val);
  return acc;
}, {});

logger.setLevel = level => {
  log.transports = log.transports.map(transport => ({ ...transport, level }));
};

module.exports = logger;
module.exports.default = logger;
