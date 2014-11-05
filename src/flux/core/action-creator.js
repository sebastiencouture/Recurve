"use strict";

function addActionCreatorService(module) {
    module.factory("$actionCreator", ["$dispatcher"], function($dispatcher) {
        return {
            extend: function(obj) {
                return recurve.extend({
                    dispatch: function(payload) {
                        $dispatcher.dispatch(payload);
                    }
                }, obj);
            }
        };
    });
}