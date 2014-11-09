"use strict";

function addActionService(module) {
    module.factory("$action", null, function() {

        var currentPayload;
        var currentListener;

        function actionListener(callback, context, dataStore) {
            return Object.create(actionListenerPrototype).init(callback, context, dataStore);
        }

        var actionListenerPrototype = {
            init: function(callback, context, dataStore) {
                this.callback = callback;
                this.context = context;
                this.dataStore = dataStore;

                return this;
            },

            isSame: function(callback) {
                return this.callback === callback;
            },

            trigger: function() {
                if (this.triggered) {
                    return;
                }

                this.triggered = true;
                this.callback.call(this.context, currentPayload);
            },

            reset: function() {
                this.triggered = false;
            }
        };

        return function() {
            var listeners = [];
            var triggering;

            return {
                trigger: function(payload) {
                    recurve.assert(!currentListener, "cannot trigger an action while another action is being triggered");

                    currentPayload = payload;

                    try {
                        recurve.forEach(listeners, function(listener) {
                            currentListener = listener;
                            listener.trigger();
                        });
                    }
                    finally {
                        currentListener = undefined;
                        currentPayload = undefined;

                        recurve.forEach(listeners, function(listener) {
                            listener.reset();
                        });
                    }
                },

                on: function(callback, context, dataStore) {
                    recurve.assert(recurve.isFunction(callback), "callback must exist");

                    var replaced;
                    recurve.forEach(listeners, function(listener, index) {
                        if (listener.isSame(callback)) {
                            listeners[index] = actionListener(callback, context, dataStore);
                            replaced = true;
                            return false;
                        }
                    });

                    if (!replaced) {
                        listeners.push(actionListener(callback, context, dataStore));
                    }
                },

                off: function(callback) {
                    recurve.assert(recurve.isFunction(callback), "callback must exist");

                    var removed;
                    recurve.forEach(listeners, function(listener, index) {
                        if (listener.isSame(callback)) {
                            removed = true;
                            listeners.splice(index, 1);
                            return false;
                        }
                    });

                    recurve.assert(removed, "no listener exists for the callback");
                },

                waitFor: function(dataStores) {
                    recurve.assert(currentListener, "can only wait for while in the middle of triggering an action");
                    recurve.assert(currentListener.dataStore,
                        "data store must be set for current action listener to detect circular dependencies");

                    recurve.forEach(dataStores, function(dataStore, index) {
                        recurve.assert(dataStore !== currentListener.dataStore,
                            "circular dependency detected while waiting for current action listener at index {0}", index);

                        var found = false;
                        recurve.forEach(listeners, function(listener) {
                            if (listener.dataStore === dataStore) {
                                found = true;
                                listener.trigger();
                            }
                        });

                        recurve.assert(found, "no action listener found for the wait for data store at index {0}", index);
                    });
                }
            };
        };
    });
}