const winston = require('winston');
const { combine, timestamp } = winston.format;

const log = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

const isError = function(e) {
  return (
    e instanceof Error ||
    (e &&
      e.stack &&
      e.message &&
      typeof e.stack === 'string' &&
      typeof e.message === 'string')
  );
};

const logger = {
  warn: (...args) => {
    log.warn(...args);
  },
  error: (...args) => {
    log.error(...args);
  },
  debug: (...args) => {
    log.debug(...args);
  },
  info: (...args) => {
    log.info(...args);
  },
  level: level => {
    for (let key in log.transports) {
      log.transports[key].level = level;
    }
  },
  log: (obj, context) => {
    let error = isError(obj);
    context.status = context.status || 500;
    let level =
      !error && (!context.status || context.status < 400)
        ? 'info'
        : !error && context.status < 500 ? 'warn' : 'error';
    if (error) {
      if (obj.statusCode) {
        context.status = error.statusCode;
      }
      if (obj.stack) {
        context.stack = obj.stack;
      }
      obj = obj.message;
    }
    logger[level](obj, context);
  },
};

module.exports = { logger };
module.exports.default = logger;
