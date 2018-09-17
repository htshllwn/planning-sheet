var filePaths = require('./config/filePaths');
var xlsxHelper = require('./helpers/xlsxToJson');
var formatDataHelper = require('./helpers/formatData');
var logger = require('./helpers/logger').getLogger(__filename);
var fs = require('fs');


var mailList, data, mailListIsAvailable = false, dataIsAvailable = false;


xlsxHelper
    .generate(filePaths.xlsxInputPath, filePaths.jsonOutputPath, 'milestones')
    .then((res) => {
        logger.info('xlsxHelper.generate milestones Promise Accepted : ' + res.length + ' objects');
        // logger.info(res.length + " objects");
        mailListGetter();
        formatDataCaller(res);
    })
    .catch((err) => {
        logger.error('xlsxHelper.generate Promise Rejected');
        logger.error(err);
    });

function mailListGetter(){
    xlsxHelper
    .generate(filePaths.xlsxInputPath, filePaths.mailAddsPath, 'mails')
    .then((res) => {
        logger.info('xlsxHelper.generate mails Promise Accepted : ' + res.length + ' objects');
        formatMailListCaller(res);
        // logger.info(res.length + " objects");
        // mailListGetter(res);
    })
    .catch((err) => {
        logger.error('xlsxHelper.generate Promise Rejected');
        logger.error(err);
    });
}

function formatMailListCaller(data) {
    // console.log(data)
    formatDataHelper
        .formatMailList(data)
        .then((res) => {
            logger.info('formatMailList Promise Accepted : ' + res.length + ' objects');
            mailList = res;
            mailListIsAvailable = true;
            sendMails();
            // logger.info(res.length + " objects");
        })
        .catch((err) => {
            logger.error('formatMailList Promise Rejected');
        })
};

function formatDataCaller(data) {
    // console.log(data)
    formatDataHelper
        .formatData(data)
        .then((res) => {
            logger.info('formatDataHelper Promise Accepted : ' + res.length + ' objects');
            data = res;
            dataIsAvailable = true;
            sendMails();
            // logger.info(res.length + " objects");
        })
        .catch((err) => {
            logger.error('formatDataHelper Promise Rejected');
        })
};

function sendMails() {
    if(mailListIsAvailable && dataIsAvailable) {
        logger.debug('mailList and data Available. sendMails executing');
    }
    else {
        logger.debug('mailList or data is NOT Available. Cannot execute')
    }
}