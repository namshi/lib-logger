const util = require('util');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp } = format;

const log = createLogger({
  level: 'info',
  format: combine(timestamp(), format.json()),
  transports: [new transports.Console({ json: true })],
});

const isError = e => e instanceof Error || (e && e.stack && e.message);
const isObject = obj => typeof obj === 'object' && !Array.isArray(obj);
const addMessage = (arg, obj) => obj.messages.concat(util.inspect(arg));
const addError = (arg, obj) =>
  isError(arg) &&
  Object.assign({}, obj, {
    context: {
      status: arg.statusCode || 500,
      stack: arg.stack,
    },
    messages: addMessage(arg, obj),
  });
const addObject = (arg, obj) => isObject(arg) && Object.assign({}, obj, arg);

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
  let obj = args.reduce(
    (acc, arg) =>
      (!arg && acc) ||
      addError(arg, acc) ||
      addObject(arg, acc) ||
      Object.assign({}, acc, { messages: addMessage(arg, acc) }),
    { messages: [], context: {} }
  );
  obj.messages = obj.messages.join(',');
  return obj;
};
const logByLevel = level => (...args) => {
  let obj = parseArgs(args);
  log[level](obj.messages, obj.context);
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
