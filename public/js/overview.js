/**
 * @author Christian Huppertz 
 * @description 
 */


// Cleaning state
const stateIcon = document.getElementById("iconState");
const stateText = document.getElementById("stateText");

// Text elements
const scheduleText = document.getElementById("scheduleText");
const errorText = document.getElementById("errorText");
const timeText = document.getElementById("timeText");

// Switch elements
const switchMon = document.getElementById("list-switch-mon");
const switchTue = document.getElementById("list-switch-tue");
const switchWed = document.getElementById("list-switch-wed");
const switchThu = document.getElementById("list-switch-thu");
const switchFri = document.getElementById("list-switch-fri");
const switchSat = document.getElementById("list-switch-sat");
const switchSun = document.getElementById("list-switch-sun");

// Buttons
const cleanHouseBtn = document.getElementById("cleanHouseBtn");
const cleanSpotBtn = document.getElementById("cleanSpotBtn");
const stopBtn = document.getElementById("stopBtn");
const scheduleBtn = document.getElementById("scheduleOnOffBtn");
const searchBtn = document.getElementById("searchBtn");

// Day label
const monLabel = document.getElementById("monLabel");
const tueLabel = document.getElementById("tueLabel");
const wedLabel = document.getElementById("wedLabel");
const thuLabel = document.getElementById("thuLabel");
const friLabel = document.getElementById("friLabel");
const satLabel = document.getElementById("satLabel");
const sunLabel = document.getElementById("sunLabel");

// Convert weekday
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";


/**
 * Date Picker
 */
var monDatePicker = createDatePicker();
var tueDatePicker = createDatePicker();
var wedDatePicker = createDatePicker();
var thuDatePicker = createDatePicker();
var friDatePicker = createDatePicker();
var satDatePicker = createDatePicker();
var sunDatePicker = createDatePicker();
var timeDatePicker = createDatePicker();

function createDatePicker() {
    return new mdDateTimePicker.default({
        type: 'time',
        init: moment('22:0', 'H:m'),
        mode: true,
        orientation: 'PORTRAIT'
    });
}

/**
 * Label event Listener
 */
addDateEventListener(sunLabel, sunDatePicker, 0);
addDateEventListener(monLabel, monDatePicker, 1);
addDateEventListener(tueLabel, tueDatePicker, 2);
addDateEventListener(wedLabel, wedDatePicker, 3);
addDateEventListener(thuLabel, thuDatePicker, 4);
addDateEventListener(friLabel, friDatePicker, 5);
addDateEventListener(satLabel, satDatePicker, 6);

function addDateEventListener(label, datePicker, day) {
    label.day = day
    label.addEventListener('click', () => {
        datePicker.toggle();
    });
    datePicker.trigger = label;

    label.addEventListener('onOk', () => {
        var time = new Date(datePicker.time);
        makeRequest('setschedule?param=' + label.day + ' ' +  time.getHours() + ' ' + time.getMinutes(), null);
        setTimeout(function () { makeRequest('getschedule', getSchedule); }, 3000);
    });
}

// Set time of robot
timeText.addEventListener('click', () => {
    timeDatePicker.toggle();
});
timeDatePicker.trigger = timeText;

timeText.addEventListener('onOk', () => {
    var time = new Date(timeDatePicker.time);
    makeRequest('settime?param=' + time.getDay() + ' ' + time.getHours() + ' ' + time.getMinutes());
    setTimeout(function () { makeRequest('gettime', getTime); }, 2000);
});



/**
 * Get initial states of the robot
 */
makeRequest('getschedule', getSchedule);
makeRequest('gettime', getTime);
makeRequest('getcharger', getState);


/**
 * Button listeners
 */

// Search => Play Sound
searchBtn.addEventListener('click', () => {
    makeRequest('playsound', null);
});

// Clean House
cleanHouseBtn.addEventListener('click', () => {
    makeRequest('cleanhouse', null);
    setTimeout(function () { makeRequest('getcharger', getState); }, 3000);
});

// Clean Spot
cleanSpotBtn.addEventListener('click', () => {
    makeRequest('cleanspot', null);
    setTimeout(function () { makeRequest('getcharger', getState); }, 3000);
});

// Stop cleaning
stopBtn.addEventListener('click', () => {
    makeRequest('cleanstop', null);
    setTimeout(function () { makeRequest('getcharger', getState); }, 3000);
});

/**
 * Set schedule
 */
scheduleBtn.addEventListener('click', () => {
    if (scheduleBtn.innerHTML.includes('Disable')) {
        makeRequest('setschedule?param=Off', null);
    } else if (scheduleBtn.innerHTML.includes("Enable")) {
        makeRequest('setschedule?param=On', null);
    }

    setTimeout(function () { makeRequest('getschedule', getSchedule); }, 3000);
});

/**
 * Switch schedule states
 */
switchSun.addEventListener('click', function () { setSchedule(switchSun, '0', sunDatePicker); });
switchMon.addEventListener('click', function () { setSchedule(switchMon, '1', monDatePicker); });
switchTue.addEventListener('click', function () { setSchedule(switchTue, '2', tueDatePicker); });
switchWed.addEventListener('click', function () { setSchedule(switchWed, '3', wedDatePicker); });
switchThu.addEventListener('click', function () { setSchedule(switchWed, '4', thuDatePicker); });
switchFri.addEventListener('click', function () { setSchedule(switchFri, '5', friDatePicker); });
switchSat.addEventListener('click', function () { setSchedule(switchSat, '6', satDatePicker); });

/**
 * Toggles the schedule day on off on switch click
 * @param {*} switchElement The button that was clicke
 * @param {*} day The day to be modified
 */
function setSchedule(switchElement, day, datePicker) {
    if (switchElement.checked === true) {
        //makeRequest('setschedule?param=' + day + ' 8 0', null);
        datePicker.toggle();
    } else if (switchElement.checked === false) {
        makeRequest('setschedule?param=' + day + ' 0 0 None', null);
    }

    setTimeout(function () { makeRequest('getschedule', getSchedule); }, 6000);
}

/**
 * Get and set the schedule accordingly
 */
function getSchedule() {
    if (this.status == '200') {

        var data = JSON.parse(this.response);

        if (data.isEnabled) {
            scheduleText.text = data.nextDuty;
            scheduleBtn.innerHTML = "Disable Schedule"
        } else {
            scheduleText.text = "Disabled";
            scheduleBtn.innerHTML = "Enable Schedule"
        }

        setScheduleToggleBtn(data.dutyDays[0], switchSun, sunLabel);
        setScheduleToggleBtn(data.dutyDays[1], switchMon, monLabel);
        setScheduleToggleBtn(data.dutyDays[2], switchTue, tueLabel);
        setScheduleToggleBtn(data.dutyDays[3], switchWed, wedLabel);
        setScheduleToggleBtn(data.dutyDays[4], switchThu, thuLabel);
        setScheduleToggleBtn(data.dutyDays[5], switchFri, friLabel);
        setScheduleToggleBtn(data.dutyDays[6], switchSat, satLabel);
    } else {
        // handle more HTTP response codes here;
    }
}

/**
 * Toggles a switch button based on the day paramter
 * @param {*} day The duty day
 * @param {*} toggleSwitch The switch to be toggled
 */
function setScheduleToggleBtn(day, toggleSwitch, label) {
    if (day.includes("None")) {
        toggleSwitch.parentElement.MaterialSwitch.off();
        label.innerHTML = day.slice(0, 3);
    } else {
        toggleSwitch.parentElement.MaterialSwitch.on();
        label.innerHTML = day;
    }
}

/**
 * Get the state of the robot (charging, cleaning, battery level)
 */
function getState() {
    if (this.status == '200') {

        var data = JSON.parse(this.response);

        var isCharging = data.ischarging;
        var isExtPower = data.isextpower;
        var batteryLevel = data.batterylevel;
        var error = data.error;

        if (error.includes("None")) {
            errorText.text = "i.O.";
        } else {
            errorText.text = data.error;
        }

        // Ready for duty
        if (batteryLevel >= 80 && isExtPower == 1 && isCharging == 0) {
            stateIcon.innerHTML = 'navigation';
            stateText.text = "Ready - " + data.batterylevel + " %";
        } else if (isCharging == 1) {
            stateIcon.innerHTML = 'battery_charging_full';
            stateText.text = "Charging - " + data.batterylevel + " %";
        } else {
            if (error.includes("None")) {
                stateIcon.innerHTML = 'near_me';
                stateText.text = "Moving - " + data.batterylevel + " %";
            } else {
                stateIcon.innerHTML = 'all_out';
                stateText.text = "Stoped - " + data.batterylevel + " %";
            }
        }

    } else {
        // handle more HTTP response codes here;
    }
}

/**
 * Get the time of the robot and the current client time
 */
function getTime() {
    if (this.status == '200') {

        var date = new Date();

        timeText.text = this.response + ' --- ' + weekday[date.getDay()] + ' ' + date.getHours() + ':' + date.getMinutes();
    } else {
        // handle more HTTP response codes here;
    }
}

/**
 * Make a request to the server
 * @param {*} uri The url to be called
 * @param {*} callback The callback function to be execute on success
 */
function makeRequest(uri, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = callback;
    xhttp.onerror = error;
    xhttp.open('GET', 'http://localhost/' + uri, true);
    xhttp.send();
}

/**
 * Plot the error to the console
 * @param {*} error 
 */
function error(error) {
    console.log(this);
    console.error(error);
    // do something with this.status, this.statusText
}

 /*
const devider = 10;
const offset = 500;

var canvas = document.getElementById("map");
var ctx = canvas.getContext("2d");

var button = document.getElementById("load");

button.addEventListener('click', () =>  {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = parseData;
    xhttp.onerror = error;
    xhttp.open('GET', 'http://localhost:8005/getlds', true);
    xhttp.send();
});


function parseData() {
    if (this.status == 200) { // request succeeded
        
        var response = this.response;
        var dataPoints = JSON.parse(response);

        dataPoints.forEach( elem =>  {
            ctx.fillRect(elem.x/devider+offset, elem.y/devider+offset, 1, 1);
        });
        //for (var i = 1; i < dataPoints.length; i++) {
        //    ctx.lineTo(dataPoints[i-1].x/devider+offset, dataPoints[i-1].y/devider+offset)
        //    ctx.lineTo(dataPoints[i].x/devider+offset, dataPoints[i].y/devider+offset);
        //    ctx.stroke();
        //}

        //dataPoints.forEach( elem => {
        //    console.log(elem);
        //});

    } else {
        // handle more HTTP response codes here;
    }
}
function error(error) {
    console.log(this);
    console.error(error);
    // do something with this.status, this.statusText
}


//ctx.clearRect(0, 0, canvas.width, canvas.height);
*/




