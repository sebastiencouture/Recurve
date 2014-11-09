"use strict";

function addDataStoreService(module) {
    module.factory("$dataStore", ["$signal"], function($signal) {
        // TODO TBD optional name for error handling
        return function (name) {
            return {
                changed: $signal(),

                onAction: function(action, callback, context) {
                    action.on(callback, context, this);
                },

                offAction: function(action, callback, context) {
                    action.off(callback, context, this);
                }
            };
        };
    });
}