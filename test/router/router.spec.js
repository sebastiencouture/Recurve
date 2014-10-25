"use strict";

ddescribe("$router", function() {
    var $router;
    var callback;

    function pushState(path, stateObj) {
        window.history.pushState(stateObj, null, path);
    }

    beforeEach(function() {
        $include(recurve.router.$module);

        $invoke(["$router"], function(router) {
            $router = router;
        });

        callback = jasmine.createSpy("callback");
    });

    it("should be invokable", function() {
        expect($router).toBeDefined();
        expect(isFunction($router)).toEqual(false);
    });

    describe("match", function() {
        it("should call callback for string path with no params", function() {
            $router.match("a").to(callback);
            pushState("a");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should call callback for string path with one param", function() {
            $router.match("a/:id").to(callback);
            pushState("a/1");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should call callback for string path with multiple params", function() {
            $router.match("a/:id/b/:time").to(callback);
            pushState("a/1/b/21");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should not call callback if doesn't match string path", function() {
            $router.match("a/:id").to(callback);
            pushState("a/1/b");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should call callback for regexp path", function() {
            $router.match(/recurve/i).to(callback);
            pushState("this-is-recurve");

            $router.start();

            expect(callback).toHaveBeenCalled(  );
        });

        it("should not call callback if doesn't match regexp path", function() {
            $router.match(/recurve/i).to(callback);
            pushState("this-is");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should call multiple callbacks for route", function() {
            $router.match("a").to(callback);
            var callback2 = jasmine.createSpy("callback2");
            $router.match("a").to(callback2);
            var callback3 = jasmine.createSpy("callback3");
            $router.match("a").to(callback3);

            pushState("a");

            $router.start();

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });

        it("should return params with keys for string path", function() {
            $router.match("a/:id/b/:time").to(callback);
            pushState("a/1/b/21");

            $router.start();

            expect(callback).toHaveBeenCalledWith({id: "1", time: "21"});
        });

        it("should return params splat array for regexp path", function() {
            $router.match(/\/test\/(.+)/).to(callback);
            pushState("/wow/test/this/should/work");

            $router.start();

            expect(callback).toHaveBeenCalledWith({splat: ["this/should/work"]});
        });

        it("should return query string params for string path", function() {
            $router.match("a/:id").to(callback);
            pushState("a/1?query=2");

            $router.start();

            expect(callback).toHaveBeenCalledWith({id: "1", query: "2"});
        });

        it("should return query string params for regexp path", function() {
            $router.match(/\/test\/(.+)/).to(callback);
            pushState("/wow/test/this/should/work?query=2");

            $router.start();

            expect(callback).toHaveBeenCalledWith({splat: ["this/should/work"], query: "2"});
        });
    });

    it("should call noMatch handler if no match", function() {
        $router.match("a").to(callback);
        var noMatch = jasmine.createSpy("noMatch");
        $router.noMatch(noMatch);
        pushState("b");

        $router.start();

        expect(callback).not.toHaveBeenCalled();
        expect(noMatch).toHaveBeenCalled();
    });

    describe("navigate", function() {
        beforeEach(function() {
            $router.match("a").to(callback);
        });

        it("should call route callback for matching path", function() {
            $router.start();
            $router.navigate("a");

            expect(callback).toHaveBeenCalled();
        });

        iit("should return state object", function() {
            $router.start();
            $router.navigate("a", {b: 2});
            expect(callback).toHaveBeenCalledWith([{}, {b: 2}]);
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