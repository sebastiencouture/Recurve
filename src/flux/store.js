"use strict";

function addStoreService(module) {
    module.factory("$store", ["$signal"], function($signal) {
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