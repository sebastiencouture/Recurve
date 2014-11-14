"use strict";

function addActionGroupService(module) {
    module.factory("$actionGroup", null, function() {
        return function() {
            var actions = [];

            return {
                add: function(action) {
                    recurve.assert(-1 === actions.indexOf(action), "action is already in the group");
                    actions.push(action);
                },

                remove: function(action) {
                    var index = actions.indexOf(action);
                    recurve.assert(-1 !== index, "action is not in the group");
                    actions.split(1, index);
                },

                on: function(callback, context, dataStore) {
                    recurve.forEach(actions, function(action) {
                        action.on(callback, context, dataStore);
                    });
                },

                off: function(callback) {
                    recurve.forEach(actions, function(action) {
                        action.off(callback);
                    });
                },

                waitFor: function(dataStores) {
                    var handled;
                    recurve.forEach(actions, function(action) {
                        if (action.isTriggering()) {
                            action.waitFor(dataStores);
                            handled = true;
                            return false;
                        }
                    });

                    recurve.assert(handled, "expected one action in the group to be triggering");
                }
            };
        };
    });
}