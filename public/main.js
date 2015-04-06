(function() {
    'use strict';

    window.onload = function() {
        var gpio = {};
        var gpioParent = document.getElementById('gpios');
        var listeners = {};
        var socket = io('http://' + window.location.hostname + ':8081');
        
        socket.on('connect', function() { 
            console.log('web socket connected');
            socket.emit('ping', {status: 'ok'});
        });

        socket.on('gpio', function(state) { 
            console.log('gpio', state);
            listeners[state.pin] && listeners[state.pin].handler && listeners[state.pin].handler(state)
        });

        socket.on('disconnect', function() {
            console.log('socket disconnected');
        });

        gpioParent.addEventListener('click', function clickHandler(ev) {
            var target = ev.target;
            var parent = ev.target.parentNode.parentNode;
            var inputs = ev.target.parentNode.querySelectorAll('input');
            var direction = inputs[0].checked ? 'in' : inputs[1].checked ? 'out' : 'none';
            var isOn = inputs[2].checked;
            var pin = parseInt(parent.id.substring(4));

            console.log('Status %s is on %s, pin %s', direction, isOn, pin);
            
            // trigger a pin write
            if (!isNaN(pin) && target.type === 'checkbox' && direction === 'out') {
                socket.emit('gpio-write', { pin: pin, value: +isOn, dir: direction });
            }

            // watch/unwatch pin
            if (!isNaN(pin) && target.type === 'radio') {
                console.log('emit', pin, +isOn, direction);
                socket.emit('gpio', { pin: pin, value: +isOn, dir: direction });
                if (direction === 'in') {
                    watch(pin, parent);
                } else {
                    unwatch(pin);
                }
            }
        });

        function watch(pin, el) {
            var listener = {
                pin: pin,
                element: el,
                handler: function(state) {
                    console.log('handling pin', listener.pin);
                    el.querySelector('span').classList[state.value ? 'add' : 'remove']('gpio-on');
                }
            };

            listeners[pin] = listener;
        }

        function unwatch(pin) {
            var listener = listeners[pin];
            if (!listener) return;
            
            listener.el && listener.el.classList.remove('gpio-on');
            
            delete listeners[pin];
        }
    };

})();