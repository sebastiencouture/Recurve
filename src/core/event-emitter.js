"use strict";

function addEventEmitterService(module) {
    module.factory("$eventEmitter", ["$signal"], factory);

    function factory($signal) {
        return function() {
            var signals = {};
            var disabled;

            function createSignal(event) {
                var signal = getSignal(event);
                if (!signal) {
                    signal = $signal();
                    signals[event] = signal;
                }

                return signal;
            }

            function getSignal(event) {
                return signals[event];
            }

            return {
                on: function(event, callback, context) {
                    assert(event, "event must exist");
                    assert(isFunction(callback), "callback must exist");

                    forEach(event.split(" "), function(name) {
                        var signal = createSignal(name);
                        signal.on(callback, context);
                    });
                },

                once: function(event, callback, context) {
                    assert(event, "event must exist");
                    assert(isFunction(callback), "callback must exist");

                    forEach(event.split(" "), function(name) {
                        var signal = createSignal(name);
                        signal.once(callback, context);
                    });
                },

                off: function(event, callback, context) {
                    if (event) {
                        if (!callback && !context) {
                            delete signals[event];
                        }
                        else {
                            var signal = getSignal(event);
                            if (signal) {
                                signal.off(callback, context);
                            }
                        }
                    }
                    else {
                        if (!callback && !context) {
                            signals = {};
                        }
                        else {
                            forEach(signals, function(signal) {
                                signal.off(callback, context);
                            });
                        }
                    }
                },

                trigger: function(event) {
                    assert(event, "event must exist");

                    if (disabled) {
                        return;
                    }

                    var signal = getSignal(event);
                    if (signal) {
                        var args = argumentsToArray(arguments, 1);
                        signal.trigger.apply(signal, args);
                    }
                },

                clear: function() {
                    this.off();
                },

                disable: function(value) {
                    if (undefined === value) {
                        value = true;
                    }

                    disabled = value;
                }
            };
        };
    }
}