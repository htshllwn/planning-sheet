var filePaths = require('./config/filePaths');
var xlsxHelper = require('./helpers/xlsxToJson');
var formatDataHelper = require('./helpers/formatData');
var logger = require('./helpers/logger').getLogger(__filename);
var moment = require('moment');
var now = moment();
var nodemailer = require('nodemailer');
var fs = require('fs');


var mailList = [], dataXL = [], mailListIsAvailable = false, dataIsAvailable = false;

var officeConfig = {
    host: 'relay.konylabs.net', // Office 365 server
    port: 25,     // secure SMTP
    secure: false,
    tls: {
        ciphers: 'SSLv3'
    }
}

var transporter = nodemailer.createTransport(officeConfig);

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
            dataXL = res;
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
        var noOfDays = 1;

        logger.debug('mailList and data Available. sendMails executing');
        logger.info("Today's date: " + now.format('Do MMM'));

        // console.log(dataXL.length);
        // console.log(mailList.length);

        for(var i = 0; i < dataXL.length; i++){
            // console.log(i);
            element = dataXL[i];
            var date = moment(element.Date, 'Do MMM');
            var dateBefore = moment(element.Date, 'Do MMM').subtract(noOfDays, 'days');
            // logger.info(i + " Sample date: " + date.format('Do MMM') + " | date before: " + dateBefore.format('Do MMM'));
            if(now.isSame(dateBefore, 'day')){
                // logger.debug("Equal Date Found")
                logger.info(i + " Actual date: " + date.format('Do MMM') + " | date before: " + dateBefore.format('Do MMM'));
                var atleastOne = false;
                for(var j = 0; j < mailList.length; j++){
                    mailListElement = mailList[j];
                    if(element.Milestones.indexOf(mailListElement.Group) > -1){
                        atleastOne = true;
                        logger.info('Mail Match Found ' + mailListElement.Group);
                        sendMail(mailListElement.Mail, element.Milestones, element.Milestones);
                    }
                }
                if(!atleastOne){
                    logger.info('No Mail Match Found');
                    var defaultMail = mailList.find((el) => {
                        return el.Group == "default";
                    });
                    sendMail(defaultMail.Mail, element.Milestones, element.Milestones);
                }
            }
        }
        
    }
    else {
        logger.debug('mailList or data is NOT Available. Cannot execute');
    }
}

function sendMail(recipients, subject, body){
    console.log(recipients, subject, body);

    var mailOptions = {
        from: 'no-reply-upgrades@kony.com',
        to: recipients,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            logger.error(error);
            logger.error(recipients, subject, body);
        } else {
            logger.info('Email sent: ' + info.response);
            logger.info(recipients, subject, body);
        }
    });
}