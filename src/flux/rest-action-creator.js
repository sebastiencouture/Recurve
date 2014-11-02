"use strict";

function addRestActionCreatorService(module) {
    module.factory("$restActionCreator", ["$http", "$actionCreator"], function($http, $actionCreator) {
        // functionality:
        // - define resources for REST api
        // - trigger success, error, and cancelled actions
        return {

        };
    });
}