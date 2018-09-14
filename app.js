var xlsxHelper = require('./helpers/xlsxToJson');
var filePaths = require('./config/filePaths');
var logger = require('./helpers/logger').getLogger(__filename);


xlsxHelper
    .generate(filePaths.xlsxInputPath, filePaths.jsonOutputPath)
    .then((res) => {
        logger.info('xlsxHelper Promise Accepted. JSON file path :-');
        logger.info(res);
    })
    .catch((err) => {
        logger.error('xlsxHelper Promise Rejected');
    });