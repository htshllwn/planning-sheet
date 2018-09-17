var xlsxj = require("xlsx-to-json");
var logger = require('./logger').getLogger(__filename);

var generate = function (xlsxInput, jsonOutput, sheet) {
    return new Promise(function (resolve, reject) {
        xlsxj({
            input: xlsxInput,
            output: jsonOutput,
            sheet: sheet
        }, function (err, result) {
            if (err) {
                // console.error(err);
                logger.error("xlsx to json conversion FAIL")
                logger.error(err);
                reject(err);
            } else {
                // console.log(result);
                logger.debug(jsonOutput + " generated successfully");
                resolve(result);
            }
        });
    });
};

module.exports = {
    generate: generate
}