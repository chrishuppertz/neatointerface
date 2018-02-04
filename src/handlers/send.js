// Author: Christian Spies, BMW Group
/**
 * Handler for all get functions
 */

var rp = require('request-promise');


var SendHandler = function () { };


const BASE_URL = 'http://neato.local/';
const BASE_URL_COMMAND = 'http://neato.local/sendcommand?command='

/**
 * GetHandler for Config Page
 */

SendHandler.prototype.getConfig = function (request, result) {
    sendRequest(BASE_URL, result);
}

SendHandler.prototype.reboot = function (request, result) {
    sendRequest(BASE_URL + 'reboot', result);
}

// Cleaning
// ===========================
SendHandler.prototype.cleanHouse = function (request, result) {
    sendRequest(BASE_URL_COMMAND + 'Clean House', result);
}

SendHandler.prototype.cleanSpot = function (request, result) {
    sendRequest(BASE_URL_COMMAND + 'Clean Spot', result);
}

SendHandler.prototype.cleanStop = function (request, result) {
    sendRequest(BASE_URL_COMMAND + 'Clean Stop', result);
}

// Get
// ===========================
SendHandler.prototype.getAccel = function (request, result) {
    // Label, Value
    sendRequest(BASE_URL_COMMAND + 'GetAccel', result);
}

SendHandler.prototype.getCharger = function (request, result) {
    // Label, Value
    var options = {
        uri: BASE_URL_COMMAND + 'GetCharger',
        json: false,
    }

    var state = {
        batterylevel: 0,
        ischarging: 0,
        isextpower: 0,
        error: 'None'
    };

    rp(options)
        .then(content => {

            // Get rid of the first two lines and last three => debug data
            var rawData = content.split("\n");
            chargerData = rawData.slice(2, rawData.length - 2);

            state.batterylevel = parseInt(chargerData[0].split(",")[1]);
            state.ischarging = parseInt(chargerData[2].split(",")[1]);
            state.isextpower = parseInt(chargerData[8].split(",")[1]);

            var options2 = {
                uri: BASE_URL_COMMAND + 'GetErr',
                json: false,
            }

            return rp(options2);

        }).then(content => {

            var error = content.split("\n")[1];

            if (error != "\r") {
                state.error = error;
            }

            result.status(200).send(state);
        })

        .catch(error => {
            result.status(500).send(error);
        });
}

SendHandler.prototype.getErr = function (request, result) {
    sendRequest(BASE_URL_COMMAND + 'GetErr', result);
}

SendHandler.prototype.getLDSScan = function (request, result) {
    var options = {
        uri: BASE_URL_COMMAND + 'GetLDSScan',
        json: false,
    }

    rp(options)
        .then(content => {

            // Get rid of the first two lines and last three => debug data
            var rawData = content.split("\n");
            ldsScan = rawData.slice(2, rawData.length - 3);

            //console.log(ldsScan);

            var coors = new Array(360);
            for (var i = 0; i < ldsScan.length; i++) {

                // Seperate incomming scan line (by ",")    // AngleInDegrees, DistInMM, Intensity, ErrorCodeHEX 
                scanElem = ldsScan[i].split(',');

                // Calculate x and y coors in MM
                var sinAlpha = Math.sin(parseInt(scanElem[0]) * Math.PI / 180);
                var cosAlpha = Math.cos(parseInt(scanElem[0]) * Math.PI / 180);
                var distance = parseInt(scanElem[1]);

                coors[i] = { x: cosAlpha * distance, y: sinAlpha * distance };
            }

            //console.log(coors);

            result.status(200).send(coors);
        })

        .catch(error => {
            result.status(500).send(error);
        });

}

SendHandler.prototype.getTime = function (request, result) {
    // Day HH:MM:SS
    //sendRequest(BASE_URL_COMMAND + 'GetTime', result);

    var options = {
        uri: BASE_URL_COMMAND + 'GetTime',
        json: false,
    }

    rp(options)
        .then(content => {

            var robotTime = '00:00';

            var rawData = content.split("\n");
            var robotTime = rawData[1].slice(0, rawData[1].length - 4);

            result.status(200).send(robotTime);
        })

        .catch(error => {
            result.status(500).send(error);
        });
}

SendHandler.prototype.getSchedule = function (request, result) {
    // Schedule is Disabled Sun 00:00 - None - Mon 08:00 H Tue 08:00 H Wed 08:00 H Thu 08:00 H Fri 08:00 H Sat 00:00 - None -  
    var options = {
        uri: BASE_URL_COMMAND + 'GetSchedule',
        json: false,
    }

    rp(options)
        .then(content => {

            // Get rid of the first two lines and last three => debug data
            var rawData = content.split("\n");
            scheduleData = rawData.slice(1, rawData.length - 2);

            var enabled = !scheduleData[0].includes("Disabled");
            var dutyDays = scheduleData.slice(1, scheduleData.length);

            // Check next duty
            var date = new Date();
            var day = date.getDay();
            var nextDutyIdx = day;

            var nextDutyDay = "";

            for (var itr = 0; itr < 7; itr++) {

                nextDutyIdx++;

                // Check if the next day is SUN
                if (nextDutyIdx >= dutyDays.length) {
                    nextDutyIdx = 0;
                }

                // Break if a none "None" day was found
                if (!dutyDays[nextDutyIdx].includes("None")) {
                    nextDutyDay = dutyDays[nextDutyIdx];
                    break;
                }

            }

            var nextSchedule = {
                isEnabled: enabled,
                nextDuty: nextDutyDay,
                dutyDays: dutyDays
            }

            result.status(200).send(nextSchedule);
        })

        .catch(error => {
            result.status(500).send(error);
        });
}

SendHandler.prototype.getVersion = function (request, result) {
    // Component, Major, Minor, Build, Aux BaseID
    sendRequest(BASE_URL_COMMAND + 'GetVersion', result);
}

// Get
// ===========================
SendHandler.prototype.playSound = function (request, result) {
    sendRequest(BASE_URL_COMMAND + 'PlaySound 0', result);
}


// Set
// ===========================
SendHandler.prototype.setSchedule = function (request, result) {
    sendRequest(BASE_URL_COMMAND + 'SetSchedule' + ' ' + request.query.param, result);
}

SendHandler.prototype.setTime = function (request, result) {
    sendRequest(BASE_URL_COMMAND + 'SetTime', result);
}


function sendRequest(uriStr, result) {
    var options = {
        uri: uriStr,
        json: false,
    }

    rp(options)
        .then(content => {
            result.status(200).send(content);
        })

        .catch(error => {
            result.status(500).send(error);
        });
}


module.exports = SendHandler;
