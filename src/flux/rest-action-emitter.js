"use strict";

function addRestActionEmitterService(module) {
    module.factory("$restActionEmitter", ["$http", "$action"], function($http, $action) {
        // functionality:
        // - define resources for REST api
        // - trigger success, error, and cancelled actions
        return {

        };
    });
}