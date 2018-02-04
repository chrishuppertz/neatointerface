/**
 * @author Christian Huppertz 
 * @description 
 */


const stateIcon = document.getElementById("iconState");
const stateText = document.getElementById("stateText");

const scheduleText = document.getElementById("scheduleText");
const errorText = document.getElementById("errorText");
const timeText = document.getElementById("timeText");

const switchMon = document.getElementById("list-switch-mon");
const switchTue = document.getElementById("list-switch-tue");
const switchWed = document.getElementById("list-switch-wed");
const switchThu = document.getElementById("list-switch-thu");
const switchFri = document.getElementById("list-switch-fri");
const switchSat = document.getElementById("list-switch-sat");
const switchSun = document.getElementById("list-switch-sun");

const cleanHouseBtn = document.getElementById("cleanHouseBtn");
const cleanSpotBtn = document.getElementById("cleanSpotBtn");
const stopBtn = document.getElementById("stopBtn");
const scheduleBtn = document.getElementById("scheduleOnOffBtn");
const searchBtn = document.getElementById("searchBtn");

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";


searchBtn.addEventListener('click', () => {
    makeRequest('playsound', null);
});

cleanHouseBtn.addEventListener('click', () => {
    makeRequest('cleanhouse', null);
    makeRequest('getcharger', getState);
});

cleanSpotBtn.addEventListener('click', () => {
    makeRequest('cleanspot', null);
    makeRequest('getcharger', getState);
});

stopBtn.addEventListener('click', () => {
    makeRequest('cleanstop', null);
    makeRequest('getcharger', getState);
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


switchMon.addEventListener('click', () => {

    if (switchMon.checked === true) {
        makeRequest('setschedule?param=1 8 0', null);
    } else if (switchMon.checked === false) {
        makeRequest('setschedule?param=1 8 0 None', null);
    }

    setTimeout(function () { makeRequest('getschedule', getSchedule); }, 3000);
});

switchTue.addEventListener('click', () => {

    if (switchTue.checked === true) {
        makeRequest('setschedule?param=2 8 0', null);
    } else if (switchTue.checked === false) {
        makeRequest('setschedule?param=2 8 0 None', null);
    }

    setTimeout(function () { makeRequest('getschedule', getSchedule); }, 3000);
});

switchWed.addEventListener('click', () => {

    if (switchWed.checked === true) {
        makeRequest('setschedule?param=3 8 0', null);
    } else if (switchWed.checked === false) {
        makeRequest('setschedule?param=3 8 0 None', null);
    }

    setTimeout(function () { makeRequest('getschedule', getSchedule); }, 3000);
});

switchThu.addEventListener('click', () => {

    if (switchThu.checked === true) {
        makeRequest('setschedule?param=4 8 0', null);
    } else if (switchThu.checked === false) {
        makeRequest('setschedule?param=4 8 0 None', null);
    }

    setTimeout(function () { makeRequest('getschedule', getSchedule); }, 3000);
});

switchFri.addEventListener('click', () => {

    if (switchFri.checked === true) {
        makeRequest('setschedule?param=5 8 0', null);
    } else if (switchFri.checked === false) {
        makeRequest('setschedule?param=5 8 0 None', null);
    }

    setTimeout(function () { makeRequest('getschedule', getSchedule); }, 3000);
});

switchSat.addEventListener('click', () => {

    if (switchSat.checked === true) {
        makeRequest('setschedule?param=6 8 0', null);
    } else if (switchSat.checked === false) {
        makeRequest('setschedule?param=6 8 0 None', null);
    }

    setTimeout(function () { makeRequest('getschedule', getSchedule); }, 3000);
});

switchSun.addEventListener('click', () => {

    if (switchSun.checked === true) {
        makeRequest('setschedule?param=0 8 0', null);
    } else if (switchSun.checked === false) {
        makeRequest('setschedule?param=0 8 0 None', null);
    }

    setTimeout(function () { makeRequest('getschedule', getSchedule); }, 3000);
});

//makeRequest('geterror', getError);
makeRequest('getschedule', getSchedule);
makeRequest('gettime', getTime);
makeRequest('getcharger', getState);


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

        if (data.dutyDays[0].includes("None")) {
            switchSun.parentElement.MaterialSwitch.off();
        } else {
            switchSun.parentElement.MaterialSwitch.on();
        }

        if (data.dutyDays[1].includes("None")) {
            switchMon.parentElement.MaterialSwitch.off();
        } else {
            switchMon.parentElement.MaterialSwitch.on();
        }

        if (data.dutyDays[2].includes("None")) {
            switchTue.parentElement.MaterialSwitch.off();
        } else {
            switchTue.parentElement.MaterialSwitch.on();
        }

        if (data.dutyDays[3].includes("None")) {
            switchWed.parentElement.MaterialSwitch.off();
        } else {
            switchWed.parentElement.MaterialSwitch.on();
        }

        if (data.dutyDays[4].includes("None")) {
            switchThu.parentElement.MaterialSwitch.off();
        } else {
            switchThu.parentElement.MaterialSwitch.on();
        }

        if (data.dutyDays[5].includes("None")) {
            switchFri.parentElement.MaterialSwitch.off();
        } else {
            switchFri.parentElement.MaterialSwitch.on();
        }

        if (data.dutyDays[6].includes("None")) {
            switchSat.parentElement.MaterialSwitch.off();
        } else {
            switchSat.parentElement.MaterialSwitch.on();
        }
    } else {
        // handle more HTTP response codes here;
    }
}

function getError() {
    if (this.status == '200') {
        var response = this.response;

        if (!response.includes("GetErr")) {
            errorText.text = response;
        } else {
            errorText.text = "i.O.";
        }
    } else {
        // handle more HTTP response codes here;
    }
}

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

        console.log(data);

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

function getTime() {
    if (this.status == '200') {

        var date = new Date();

        timeText.text = this.response + ' --- ' + weekday[date.getDay()] + ' ' + date.getHours() + ':' + date.getMinutes();
    } else {
        // handle more HTTP response codes here;
    }
}


function makeRequest(uri, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = callback;
    xhttp.onerror = error;
    xhttp.open('GET', 'http://localhost/' + uri, true);
    xhttp.send();
}

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




