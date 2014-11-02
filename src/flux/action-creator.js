"use strict";

function addActionCreatorService(module) {
    module("$actionCreator", ["$dispatcher"], function($dispatcher) {
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