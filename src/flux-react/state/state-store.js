"use strict";

function addStateStoreService(module) {
    module.factory("$stateStore", ["$store", "$stateRouter"], function($store, $stateRouter) {
        var store = $store();
        var states = [];
        var name = null;

        store.onAction($stateRouter.changeAction, function(activeStates) {
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
            getAll: function() {
                return states;
            },

            getAtDepth: function(depth) {
                if (0 > depth || depth > states.length - 1) {
                    return null;
                }

                return states[depth];
            },

            getName: function() {
                return name;
            },

            getErrorState: function() {
                var errorStates = states.filter(function(state) {
                    return state.error;
                });

                return 0 < errorStates.length ? errorStates[0] : null;
            },

            getError: function() {
                var errorState = this.getErrorState();
                return errorState ? errorState.error : null;
            }
        });
    });
}