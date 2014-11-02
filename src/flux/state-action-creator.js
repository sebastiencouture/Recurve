"use strict";

function addStateActionCreatorService(module) {
    // TODO TBD move $router to core recurve?
    module.factory("$stateActionCreator", ["$router", "$actionCreator"], function($router, $actionCreator) {
        return {

        };
    });
}