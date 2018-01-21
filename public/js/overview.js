/**
 * @author Christian Huppertz 
 * @description 
 */


const stateIcon = document.getElementById("iconState");
const stateText = document.getElementById("stateText");

const scheduleText = document.getElementById("scheduleText");
const errorText = document.getElementById("errorText");


makeRequest('getcharger', getState);
makeRequest('getschedule', getSchedule);
makeRequest('geterror', getError);

function getSchedule() {
    if (this.status == '200') {
        
        var data = JSON.parse(this.response);

        if (data.isEnabled) {
            scheduleText.text = data.nextDuty;
        } else {
            scheduleText.text = "Disabled";
        }
        
    } else {
        // TODO: ... 
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

        // Ready for duty
        if (batteryLevel >= 80 && isExtPower == 1 && isCharging == 0) {
            stateIcon.innerHTML = 'navigation';
            stateText.text = "Ready - " + data.batterylevel + " %";
        } else if (isCharging == 1) {
            stateIcon.innerHTML = 'battery_charging_full';
            stateText.text = "Charging - " + data.batterylevel + " %"; 
        } else {
            stateIcon.innerHTML = 'near_me';
            stateText.text = "Moving - " + data.batterylevel + " %"; 
        }
        
    } else {
        // handle more HTTP response codes here;
    }
}


function makeRequest (uri, callback) {
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




