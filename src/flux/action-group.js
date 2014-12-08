"use strict";

function addActionGroupService(module) {
    module.factory("$actionGroup", null, function() {
        return function() {
            var actions = [];
            var listeners = [];

            function addListener(callback, context, dataStore) {
                var exists;
                recurve.forEach(listeners, function(listener) {
                    if (listener.callback === callback) {
                        exists = true;
                        return false;
                    }
                });

                if (!exists) {
                    listeners.push({callback: callback, context: context, dataStore: dataStore});
                }
            }

            function removeListener(callback) {
                recurve.forEach(listeners, function(listener, index) {
                    if (listener.callback === callback) {
                        listeners.splice(index, 1);
                        return false;
                    }
                });
            }

            return {
                add: function(action) {
                    recurve.assert(-1 === actions.indexOf(action), "action is already in the group");

                    actions.push(action);
                    recurve.forEach(listeners, function(listener) {
                        action.on(listener.callback, listener.context, listener.dataStore);
                    });
                },

                remove: function(action) {
                    var index = actions.indexOf(action);
                    recurve.assert(-1 !== index, "action is not in the group");

                    actions.splice(index, 1);
                    recurve.forEach(listeners, function(listener) {
                        action.off(listener.callback);
                    });
                },

                on: function(callback, context, dataStore) {
                    addListener(callback, context, dataStore);
                    recurve.forEach(actions, function(action) {
                        action.on(callback, context, dataStore);
                    });
                },

                off: function(callback) {
                    removeListener(callback);
                    recurve.forEach(actions, function(action) {
                        action.off(callback);
                    });
                },

                waitFor: function(dataStores) {
                    // don't assert if no action is being triggered since only some actions within the group might
                    // being registered with a data store
                    recurve.forEach(actions, function(action) {
                        if (action.isTriggering()) {
                            action.waitFor(dataStores);
                            return false;
                        }
                    });
                }
            };
        };
    });
}