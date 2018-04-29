import winston from 'winston';
import moment from 'moment';

const loggerLevels = {
  levels: {
    purchase: 0,
    info: 1,
    warning: 2,
    error: 3
  },
  colors: {
    purchase: 'green',
    info: 'white',
    warning: 'yellow',
    error: 'red'
  }
};

winston.configure({
  level: 'error',
  levels: loggerLevels.levels,
  transports: [
    new (winston.transports.Console)({
      level: 'error',
      levels: loggerLevels.levels,
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: function () {
        return moment().format('DD-MM-YYYY [a las] h:mm:ss a');
      }
    }),
    new (winston.transports.File)({
      name: 'error-file',
      json: true,
      filename: `logs/error.log.json`,
      handleExceptions: true,
      level: 'error',
      levels: loggerLevels.levels,
      timestamp: function () {
        return moment().format('DD-MM-YYYY [a las] h:mm:ss a');
      }
    }),
    new (winston.transports.File)({
      level: 'purchase',
      levels: loggerLevels.levels,
      name: 'purchase-file',
      handleExceptions: false,
      humanReadableUnhandledException: false,
      json: true,
      filename: `logs/purchases.log.json`,
      timestamp: function () {
        return moment().format('DD-MM-YYYY [a las] h:mm:ss a');
      }
    })
  ]
});

winston.addColors(loggerLevels.colors);

export default winston;