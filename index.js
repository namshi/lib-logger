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
const dataStringify = data => (isError(data) ? util.inspect(data) : JSON.stringify(data)).replace(/\n|\t|\r/g, "");
const addMessage = (arg, { messages = [] } = {}) => (arg || arg === 0 ? messages.concat(dataStringify(arg)) : messages);

const addArg = (data, res = { context: {}, messages: [] }) => (isError(data) && withError(data, res)) || (isObject(data) && withObject(data, res)) || withMessages(data, res);
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
const withMessages = (obj, res = { context: {}, messages: [] }) => Object.assign({}, res, { messages: addMessage(obj, res) });
/**
 * Parse passed arguments list and return a single JSON object to be be logged.
 * If the arg is an Error object, we need only to extract message, stack and statusCode.
 * message is appended to the log message with a prefix 'Error: '
 * If not an error, extend the original objToLog with all arg properties
 * If an argument is a primitive or an array, append it to the log message after converting to a string.
 * @param {*} args The passed parameters list to be logged
 * @return objToLog: JSON object contains all parameters to be sent to winston context including a message string
 * TODO: make it async?
 */

const parseArgs = args => {
  const obj = args.reduce((acc, data) => addArg(data, acc), { context: {}, messages: [] });
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
  log.transports.forEach(transport => {
    transport.level = level;
  });
};

module.exports = logger;
module.exports.default = logger;
