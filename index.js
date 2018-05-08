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

const isError = e => (e instanceof Error || (e && e.stack && e.message));

const isObject = obj => (typeof obj === 'object' && !Array.isArray(obj));

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
const parseArgs = (args) => {
  const { messages, context } = args.reduce((acc, arg) => {
    if (arg) {
      if (isError(arg)) {
        acc.context.status = arg.statusCode || 500;
        acc.context.stack = arg.stack;
        acc.messages.push(util.inspect(arg));
      } else if (isObject(arg)) {
        acc.context = Object.assign({}, acc.context, arg);
      } else {
        acc.messages.push(util.inspect(arg));
      }
    }

    return acc;
  }, { messages: [], context: {} });

  return {
    context,
    message: messages.join(', '),
  };
};

// define Logger
const logger = {};
Object.keys(log.levels).forEach((level) => {
  logger[level] = (...args) => {
    const { message, context } = parseArgs(args);
    log[level](message, context);
    return { message, context };
  };
});

logger.setLevel = (level) => {
  log.transports.forEach((transport) => {
    transport.level = level;
  });
};

module.exports = logger;
module.exports.default = logger;
