"use strict";

describe("$state", function() {
    var $router;
    var $state;

    beforeEach(function() {
        $include(recurve.flux.$module);
        $include(recurve.flux.state.$module);

        $invoke(["$router", "$state"], function(routerService, stateService) {
            $router = routerService;
            $state = stateService;
        });
    });

    it("should be invokable", function() {
        expect($state).toBeDefined();
        expect(isFunction($state)).toEqual(false);
    });

    describe("start", function() {

    });

    describe("state", function() {

    });

    describe("actions", function() {

    });

    describe("navigate", function() {

    });

    describe("back", function() {

    });

    describe("forward", function() {

    });

    describe("reload", function() {

    });
});