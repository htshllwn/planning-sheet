const log4js = require('log4js');
const fs = require('fs');
const path = require('path');
const CWD = process.cwd();
const logsDir = path.join(CWD, 'logs');

if(!fs.existsSync(logsDir)){
    fs.mkdirSync(logsDir);
}

log4js.configure(
  {
    appenders: {
      file: {
        type: 'file',
        filename: path.join(logsDir, 'latestLog.log'),
        maxLogSize: 10 * 1024 * 1024, // = 10Mb
        numBackups: 5, // keep five backup files
        compress: true, // compress the backups
        encoding: 'utf-8',
        mode: 0o0640,
        flags: 'w+'
      },
      dateFile: {
        type: 'dateFile',
        filename: path.join(logsDir, 'allLogs.log'),
        pattern: 'yyyy-MM-dd-hh',
        compress: true
      },
      out: {
        type: 'stdout'
      }
    },
    categories: {
      default: { appenders: ['file', 'dateFile', 'out'], level: 'trace' }
    }
  }
);

// const logger = log4js.getLogger('logger');
// logger.debug('This little thing went to market');
// logger.info('This little thing stayed at home');
// logger.error('This little thing had roast beef');
// logger.fatal('This little thing had none');
// logger.trace('and this little thing went wee, wee, wee, all the way home.');

module.exports = log4js;

