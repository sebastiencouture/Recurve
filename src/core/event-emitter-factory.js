"use strict";

function addEventEmitterService(module) {
    module.factory("$eventEmitterFactory", ["$signalFactory"], factory);

    function factory($signalFactory) {
        return {
            create: function() {
                var signals = [];
                var disabled;

                function createSignal(event) {
                    var signal = getSignal(event);
                    if (!signal) {
                        signals[event] = $signalFactory.create();
                    }

                    return signal;
                }

                function getSignal(event) {
                    return signals[event];
                }

                return {
                    on: function(event, callback, context) {
                        assert(callback, "callback must exist");

                        var signal = createSignal(event);
                        signal.on(callback, context);
                    },

                    once: function(event, callback, context) {
                        assert(callback, "callback must exist");

                        var signal = createSignal(event);
                        signal.once(callback, context);
                    },

                    off: function(event, callback, context) {
                        if (event) {
                            if (!callback && !context) {
                                delete signals[event];
                            }
                            else {
                                var signal = getSignal(event);
                                if (signal) {
                                    signal.remove(callback, context);
                                }
                            }
                        }
                        else {
                            if (!callback && !context) {
                                signals = {};
                            }
                            else {
                                ObjectUtils.forEach(signals, function(signal) {
                                    signal.remove(callback, context);
                                });
                            }
                        }
                    },

                    trigger: function(event) {
                        if (disabled) {
                            return;
                        }

                        var signal = getSignal(event);
                        if (signal) {
                            var args = ArrayUtils.argumentsToArray(arguments, 1);
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
            }
        }
    }
}