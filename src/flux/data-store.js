"use strict";

function addDataStoreService(module) {
    module.factory("$dataStore", ["$signal", "$dispatcher"], function($signal, $dispatcher) {
        return {
            extend: function(obj) {
                return recurve.extend({
                    changed: $signal(),

                    on: function(actionId, callback) {
                        $dispatcher.on(actionId, callback, this);
                    },

                    trigger: function() {
                        this.changed.trigger.apply(this.changed, arguments);
                    }
                }, obj);
            }
        };
    });
}