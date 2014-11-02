"use strict";

function addActionCreatorService(module) {
    module.factory("$actionCreator", ["$dispatcher"], function($dispatcher) {
        return {
            extend: function(obj) {
                return recurve.extend({
                    trigger: function(action) {
                        $dispatcher.trigger(action);
                    }
                }, obj);
            }
        };
    });
}