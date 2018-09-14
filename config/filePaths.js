var fs = require('fs');
var path = require('path');
var CWD = process.cwd();
var logger = require('../helpers/logger').getLogger(__filename);

var dataDir = path.join(CWD, 'data');

if(!fs.existsSync(dataDir)){
    logger.info(dataDir + " does not exist");
    fs.mkdirSync(dataDir);
    logger.info(dataDir + " created successfully");
}

var exportObj = {
    xlsxInputPath: path.join(CWD, 'config/sample.xlsx'),
    jsonOutputPath: path.join(dataDir, 'xlsxJson.json')
}

// console.log(exportObj)

module.exports = exportObj