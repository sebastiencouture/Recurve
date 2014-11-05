"use strict";

function addDataStoreService(module) {
    module.factory("$dataStore", ["$signal", "$dispatcher"], function($signal, $dispatcher) {
        return {
            extend: function(obj) {
                return recurve.extend({
                    changed: $signal(),

                    register: function(callback, match) {
                        this.dispatchToken = $dispatcher.register(callback, match);
                    },

                    trigger: function() {
                        this.changed.trigger.apply(this.changed, arguments);
                    }
                }, obj);
            }
        };
    });
}