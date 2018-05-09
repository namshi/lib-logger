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
  let objToLog = { message: [] };
  args.forEach((arg) => {
    if (!arg) {
      return;
    }

    objToLog = isError(arg) && Object.assign({}, objToLog, {
        status:arg.statusCode || 500,
        stack:arg.stack,
        message:objToLog.message.concat(util.inspect(arg)),
      }) || isObject(arg) && Object.assign({}, objToLog, arg) || Object.assign({},objToLog,{
        message:objToLog.message.concat(util.inspect(arg)),
      });

  });

  objToLog.message = objToLog.message.join(', ');
  return objToLog;
};

const logByLevel = level  => (...args) => {
  let obj = parseArgs(args)
	log[level](obj.message, obj);
}
const logger = Object.assign({},...Object.keys(log.levels).map(level => ({[level]: logByLevel(level)})));

logger.setLevel = (level) => {
  log.transports.forEach((transport) => {
    transport.level = level;
  });
};
logger.info("hello world");
logger.warn({a:true});
logger.error(new Error("Error"));
module.exports = logger;
module.exports.default = logger;
