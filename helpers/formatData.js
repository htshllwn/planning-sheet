const moment = require('moment');
var logger = require('./logger').getLogger(__filename);

var formatDataFunc = function (data) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Before Filteration: ' + data.length + ' objects');
            data = data.filter(obj => obj.Milestones != "" && obj.Date != "");
            logger.debug('After Filteration: ' + data.length + ' objects');
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

var formatMailListFunc = function (data) {
    return new Promise((resolve, reject) => {
        try {
            logger.debug('Mail List Before Filteration: ' + data.length + ' objects');
            data = data.filter(obj => obj.Group != "" && obj.Mail != "");
            logger.debug('Mail List After Filteration: ' + data.length + ' objects');
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    formatData: formatDataFunc,
    formatMailList: formatMailListFunc
};