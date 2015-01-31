"use strict";

function addStateStoreService(module) {
    module.factory("$stateStore", ["$store", "$stateRouter"], function($store, $stateRouter) {
        var store = $store();
        var states = null;
        var name = null;

        store.onAction($stateRouter.changed, function(activeStates) {
            states = activeStates;
            if (activeStates.length) {
                name = activeStates[activeStates.length - 1].name;
            }
            else {
                name = null;
            }

            store.changed.trigger();
        });

        return recurve.extend(store, {
            getStates: function() {
                return states;
            },

            getName: function() {
                return name;
            }
        });
    });
}