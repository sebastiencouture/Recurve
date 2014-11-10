"use strict";

function addDataStoreService(module) {
    module.factory("$dataStore", ["$signal"], function($signal) {
        return function() {
            return {
                changed: $signal(),

                onAction: function(action, callback, context) {
                    action.on(callback, context, this);
                },

                offAction: function(action, callback) {
                    action.off(callback);
                }
            };
        };
    });
}