const util = require('util');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp } = format;

const log = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    format.json(),
  ),
  transports: [new transports.Console({ json: true })],
});

const isError = e => (
  e instanceof Error || (e && e.stack && e.message)
);
const isObject = e => (typeof e === 'object' && !Array.isArray(e))
const readableMessage = o => Object.assign({},o,{message:o.message.reduce( (acc,item) => item+', '+acc, [])})
const createAddMessage = o => e => Object.assign({},{message:o.message.concat(util.inspect(e))});
const createAddObject = o => e => Object.assign(o,e);
const createAddError = o => e => Object.assign({},{status:e.status || 500, stack:e.stack, message:e.message});
/**
 * Parse the list arguments passed to be be logged and return a single JSON object
 * If the arg is an Error object, we need only to extract message, stack and statusCode. message is appended to the log message with a prefix 'Error: '
 * If not an error, extend the original objToLog with all arg properties
 * If an argument is a primitive or an array, append it to the log message after converting to a string.
 * @param {*} args The passed parameters to be logged
 * @return objToLog: JSON object contains all parameters to be sent to winston context including a message string
 * TODO: use async?
 */
const parseArgs = (args) => {
  let objToLog = { message: [] };
  const addMessage = createAddMessage(objToLog);
  const addError = createAddError(objToLog);
  const addObject = createAddObject(objToLog);
  args.forEach((arg) => {
    if (!arg) {
      return;
    }
    objToLog = readableMessage(isError(arg) && addMessage(addError(arg)) || isObject(arg) && addObject(arg) || addMessage(arg));

  });
    
  return objToLog;
};

// define Logger
const logger = {};
Object.keys(log.levels).forEach((level) => {
  logger[level] = (...args) => {
    const obj = parseArgs(args);
    log[level](obj.message, obj);
  };
});

logger.setLevel = (level) => {
    log.transports = log.transports.map(item => createAddObject(item)({level:level}));
};

module.exports = logger;
module.exports.default = logger;
