'use strict';

var restify = require('restify');
var Gpio = require('onoff').Gpio;
var server = restify.createServer();
var io = require('socket.io')(8081);
var fs = require('fs');
var watchers = {};

server.get(/\/?.*/, restify.serveStatic({
    directory: './public',
    default: 'index.html'
}));


function setGpio(options) {
    var pin = parseInt(options.pin, 10);
    var value = +options.value;
    var gpio = new Gpio(pin, 'out');
    gpio.writeSync(value);
    console.log('wrote to %d with val %d', pin, value);
}

function watch(pin) {
    console.log('watch pin %d', pin);
    var gpio = new Gpio(pin, 'in', 'both');
    gpio.watch(function(err, value) {
        console.log('pin %d triggered %d', pin, value);
        if (err) return console.error(err);

        io.emit('gpio', { pin: pin, value: value });
    });

    watchers[pin] = watchers[pin] || gpio;
}

function unwatch(pin) {
    console.log('unwatch pin %d', pin);
    watchers[pin] && watchers[pin].handler && watchers[pin].handler.unexport();
}

function exit() {
    var exportedPins;
    var pin;
    var unexport;

    console.log('process quitting, cleaning up ...');

    try {
        exportedPins = fs.readdirSync('/sys/class/gpio');
        exportedPins && exportedPins.forEach(function(name) {
            pin = name.match(/gpio(\d+)/);
            if (pin && pin[1]) {
                unexport = pin[1];
                console.log('unexport pin %s', unexport);
                fs.writeFileSync('/sys/class/gpio/unexport', unexport);
            }
        });
    } catch (err) { 
        console.error(err); 
    }
    
    process.exit();
}

io.sockets.on('connection', function (socket) {
    console.log('web socket connected');
    
    socket.on('ping', function (data) {
        console.log(data);
    });

    socket.on('gpio', function(state) {
        console.log('gpio', state);
        state.dir === 'in' && watch(state.pin);
    });

    socket.on('gpio-write', function(state) {
        console.log('gpio-write', state);
        setGpio(state);
    });

});

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
server.listen(8080);