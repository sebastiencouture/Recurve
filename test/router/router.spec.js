"use strict";

describe("$router", function() {
    var $router;

    beforeEach(function() {
        $include(recurve.router.$module);

        $invoke(["$router"], function(router) {
            $router = router;
        });
    });

    it("should be invokable", function() {
        expect($router).toBeDefined();
        expect(isFunction($router)).toEqual(false);
    });

    describe("match", function() {
        it("should call callback for string path with no params", function() {

        });

        it("should call callback for string path with one param", function() {

        });

        it("should call callback for string path with multiple params", function() {

        });

        it("should call callback for regexp path", function() {

        });

        it("should call multiple callbacks for route", function() {

        });

        it("should return params with keys for string path", function() {

        });

        it("should return params splat array for regexp path", function() {

        });
    });

    it("should call noMatch handler if no match", function() {

    });

    describe("navigate", function() {
        it("should call route callback for matching path", function() {

        });

        it("should return state object", function() {

        });

        it("should not call route callback if trigger is false", function() {

        });

        it("should not call route callback before start", function() {

        });
    });

    describe("replace", function() {
        it("should call route callback for matching path", function() {

        });

        it("should return state object", function() {

        });

        it("should not call route callback if trigger is false", function() {

        });

        it("should not call route callback before start", function() {

        });
    });

    describe("back", function() {
        it("should call route callback for popped path", function() {

        });

        it("should not call route callback before start", function() {

        });
    });

    describe("forward", function() {
        it("should call route callback for forward path", function() {

        });

        it("should not call route callback before start", function() {

        });
    });

    describe("reload", function() {
        it("should call current route callback", function() {

        });

        it("should not call route callback before start", function() {

        });
    });

    describe("root", function() {
        it("should add root from navigate path", function() {

        });

        it("should add root from replace path", function() {

        });

        it("should remove root from current path", function() {

        });
    });
});