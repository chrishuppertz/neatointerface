// Author: Christian Huppertz

// PACKAGE SETUP
// =============================================================================
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

var app = express();

// SSL SETUP
// =============================================================================
if (process.env.NODE_ENV === 'production') {
    app.get('*', function (req, res, next) {
        if (req.headers['x-forwarded-proto'] != 'https')
            res.redirect('https://' + req.get('Host') + req.url);
        else
            next() /* Continue to other routes if we're not redirecting */
    });
}

// APP SETUP
// =============================================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride()); // for simulating DELETE and PUT

// ROUTE SETUP
// =============================================================================
var SendHandler = require('./src/handlers/send');

//var handlers = {
//    get: new GetHandler(),
//}

var send = new SendHandler();

/**
 * GET functions
 */
app.use(cors());
app.use(express.static(__dirname + '/public', { index: 'index.html', etag: false, maxage: 1000 }));


app.get('/config', send.getConfig);
app.get('/reboot', send.reboot);

app.get('/cleanhouse', send.cleanHouse);
app.get('/cleanspot', send.cleanSpot);
app.get('/cleanstop', send.cleanStop);

app.get('/getaccel', send.getAccel);
app.get('/getcharger', send.getCharger);
app.get('/geterror', send.getErr);
app.get('/getlds', send.getLDSScan);
app.get('/gettime', send.getTime);
app.get('/getschedule', send.getSchedule);
app.get('/getversion', send.getVersion);

app.get('/playsound', send.playSound);

app.get('/settime', send.setTime);
app.get('/setschedule', send.setSchedule);





// BOOT SERVER
// =============================================================================
console.log('Starting web server...');

var port = process.env.PORT || 8001
app.listen(port);

console.log("Setup complete. Port: %d   Mode: %s.", port, app.settings.env);

module.exports = app;