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

        // Make sure we start at some other path for each test
        pushState("startElsewhere");
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

        it("should ignore leading '/' in location", function() {
            $router.match("a").to(callback);
            pushState("/a");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should ignore trailing space location", function() {
            $router.match("a").to(callback);
            pushState("a   ");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should decode location for special characters", function() {
            $router.match("å").to(callback);
            pushState("%C3%A5");

            $router.start();

            expect(callback).toHaveBeenCalled();
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

        it("should return state object", function() {
            $router.start();
            $router.navigate("a", {b: 2});

            expect(callback.calls.mostRecent().args[1]).toEqual({b: 2});
        });

        it("should not call route callback if trigger is false", function() {
            $router.start();
            $router.navigate("a", null, false);

            expect(callback).not.toHaveBeenCalled();
        });

        it("should not call route callback before start", function() {
            $router.navigate("a");
            expect(callback).not.toHaveBeenCalled();
        });

        it("should ignore leading '/'", function() {
            $router.start();
            $router.navigate("/a");

            expect(callback).toHaveBeenCalled();
        });

        it("should ignore trailing space", function() {
            $router.start();
            $router.navigate("a    ");

            expect(callback).toHaveBeenCalled();
        });
    });

    describe("replace", function() {
        beforeEach(function() {
            $router.match("a").to(callback);
        });

        it("should call route callback for matching path", function() {
            $router.start();
            $router.replace("a");

            expect(callback).toHaveBeenCalled();
        });

        it("should return state object", function() {
            $router.start();
            $router.replace("a", {b: 2});

            expect(callback.calls.first().args[1]).toEqual({b: 2});
        });

        it("should not call route callback if trigger is false", function() {
            $router.start();
            $router.replace("a", null, false);

            expect(callback).not.toHaveBeenCalled();
        });

        it("should not call route callback before start", function() {
            $router.replace("a");
            expect(callback).not.toHaveBeenCalled();
        });

        it("should ignore leading hash", function() {
            $router.start();
            $router.replace("/a");

            expect(callback).toHaveBeenCalled();
        });

        it("should ignore trailing space", function() {
            $router.start();
            $router.replace("a      ");

            expect(callback).toHaveBeenCalled();
        });
    });

    describe("back", function() {
        beforeEach(function() {
            $router.match("a").to(callback);
        });

        it("should call route callback for popped path", function(done) {
            $router.navigate("a", null, false);
            $router.navigate("b", null, false);
            $router.start();
            $router.back();

            setTimeout(function() {
                expect(callback).toHaveBeenCalled();
                done();
            }, 0);
        });

        it("should call route callback with state for popped path", function(done) {
            $router.navigate("a", {b: 1}, false);
            $router.navigate("b", null, false);
            $router.start();
            $router.back();

            setTimeout(function() {
                expect(callback.calls.first().args[1]).toEqual({b: 1});
                done();
            }, 0);
        });

        it("should not call route callback before start", function(done) {
            $router.navigate("a", null, false);
            $router.navigate("b", null, false);
            $router.back();

            setTimeout(function() {
                expect(callback).not.toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    describe("forward", function() {
        beforeEach(function() {
            $router.match("b").to(callback);
        });

        it("should call route callback for forward path", function(done) {
            $router.navigate("a", null, false);
            $router.navigate("b", null, false);
            $router.start();
            callback.calls.reset();
            $router.back();

            setTimeout(function() {
                $router.forward();

                setTimeout(function() {
                    expect(callback).toHaveBeenCalled();
                    done();
                }, 0);
            }, 0);
        });

        it("should call route callback with state for popped path", function(done) {
            $router.navigate("a", null, false);
            $router.navigate("b", {b: 1}, false);
            $router.start();
            callback.calls.reset();
            $router.back();

            setTimeout(function() {
                $router.forward();

                setTimeout(function() {
                    expect(callback.calls.first().args[1]).toEqual({b: 1});
                    done();
                }, 0);
            }, 0);
        });

        it("should not call route callback before start", function(done) {
            $router.navigate("a", null, false);
            $router.navigate("b", null, false);
            callback.calls.reset();
            $router.back();

            setTimeout(function() {
                $router.forward();

                setTimeout(function() {
                    expect(callback).not.toHaveBeenCalled();
                    done();
                }, 0);
            }, 0);
        });
    });

    describe("reload", function() {
        beforeEach(function() {
            $router.match("a").to(callback);
        });

        it("should call current route callback", function() {
            $router.navigate("a");
            $router.start();
            $router.reload();

            expect(callback.calls.count()).toEqual(2);
        });

        it("should call current route callback with state", function() {
            $router.navigate("a", {b: 1});
            $router.start();
            $router.reload();

            expect(callback.calls.mostRecent().args[1]).toEqual({b: 1});
        });

        it("should call even if navigate/replace was silent", function() {
            $router.start();
            $router.navigate("a", null, false);
            $router.reload();

            expect(callback.calls.count()).toEqual(1);
        });

        it("should not call route callback before start", function() {
            $router.navigate("a", {a: 1});
            $router.reload();

            expect(callback).not.toHaveBeenCalled();

            $router.start();

            expect(callback.calls.count()).toEqual(1);
        });
    });

    describe("root", function() {
        function setup(root, matcher) {
            $include(recurve.router.$module, function($mockable) {
                $mockable.config("$route", {root: root})
            });

            $invoke(["$router"], function(router) {
                $router = router;
            });

            $router.match(matcher).to(callback);
            $router.start();
        }

        it("should add root to navigate path", function() {
            setup("root", "root/a");
            $router.navigate("a");

            expect(callback).toHaveBeenCalled();
        });

        it("should add root to replace path", function() {
            setup("root", "root/a");
            $router.replace("a");

            expect(callback).toHaveBeenCalled();
        });

        it("should remove root from current location", function() {

        });

        it("should not require match to include root", function() {

        });

        it("should ignore leading '/'", function() {

        });

        it("should ignore trailing space", function() {

        });
    });
});