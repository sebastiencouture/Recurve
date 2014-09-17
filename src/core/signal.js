"use strict";

function addSignalService(module) {
    module.factory("$signal", null, factory);

    function factory() {
        return function() {
            var listeners = [];
            var disabled;

            function listenerExists(callback, context) {
                var exists = false;

                forEach(listeners, function(listener) {
                    if (listener.isSame(callback, context)) {
                        exists = true;
                        return false;
                    }
                });

                return exists;
            }

            return {
                on: function(callback, context) {
                    assert(callback, "callback must exist");

                    if (listenerExists(callback, context)) {
                        return;
                    }

                    listeners.push(signalListener(callback, context));
                },

                once: function(callback, context) {
                    assert(callback, "callback must exist");

                    if (listenerExists(callback, context)) {
                        return;
                    }

                    listeners.push(signalListener(callback, context, true));
                },

                off: function(callback, context) {
                    if (!callback && !context) {
                        this.clear();
                        return;
                    }

                    for (var index = listeners.length - 1; 0 <= index; index--) {
                        var listener = listeners[index];
                        var match;

                        if (!callback) {
                            if (listener.isSameContext(context)) {
                                match = true;
                            }
                        }
                        else if (listener.isSame(callback, context)) {
                            match = true;
                        }
                        else {
                            // do nothing - no match
                        }

                        if (match) {
                            removeAt(listeners, index);

                            // can only be one match if callback specified
                            if (callback) {
                                return;
                            }
                        }
                    }
                },

                trigger: function() {
                    if (disabled) {
                        return;
                    }

                    for (var index = listeners.length - 1; 0 <= index; index--) {
                        var listener = listeners[index];

                        listener.trigger(arguments);

                        if (listener.onlyOnce) {
                            removeAt(listeners, index);
                        }
                    }

                },

                clear: function() {
                    listeners = [];
                },

                disable: function(value) {
                    if (undefined === value) {
                        value = true;
                    }

                    disabled = value;
                }
            };
        }
    };

    function signalListener(callback, context, onlyOnce) {
        return Object.create(signalListenerPrototype).init(callback, context, onlyOnce);
    }

    var signalListenerPrototype = {
        init: function(callback, context, onlyOnce) {
            this.callback = callback;
            this.context = context;
            this.onlyOnce = onlyOnce;

            return this;
        },

        isSame: function(callback, context) {
            if (!context) {
                return this.callback === callback;
            }

            return this.callback === callback && this.context === context;
        },

        isSameContext: function(context) {
            return this.context === context;
        },

        trigger: function(args) {
            this.callback.apply(this.context, args);
        }
    };
}