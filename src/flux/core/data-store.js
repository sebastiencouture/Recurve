"use strict";

function addDataStoreService(module) {
    module.factory("$dataStore", ["$signal"], function($signal) {
        return {
            changed: $signal(),

            onAction: function(action, callback, context) {
                action.on(callback, context, this);
            },

            offAction: function(action, callback, context) {
                action.off(callback, context, this);
            }
        };
    });
}