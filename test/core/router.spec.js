"use strict";

describe("$router", function() {
    var $router;
    var callback;

    function pushState(path, stateObj) {
        window.history.pushState(stateObj, null, path);
    }

    beforeEach(function() {
        $invoke(["$router"], function(router) {
            $router = router;
        });

        callback = jasmine.createSpy("callback");

        // Make sure we start at some other path before each
        pushState("/start-at-some-other-path");
    });

    it("should be invokable", function() {
        expect($router).toBeDefined();
        expect(isFunction($router)).toEqual(false);
    });

    describe("on", function() {
        it("should call route callback for string matcher with no params", function() {
            $router.on("/a", callback);
            pushState("/a");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should not require leading slash in string matcher", function() {
            $router.on("a", callback);
            pushState("/a");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should call route callback for string matcher with one param", function() {
            $router.on("a/:id", callback);
            pushState("/a/1");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should call route callback for string matcher with multiple params", function() {
            $router.on("a/:id/b/:time", callback);
            pushState("/a/1/b/21");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should not call route callback if doesn't match string matcher", function() {
            $router.on("a/:id", callback);
            pushState("/a/1/b");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should call route callback for regexp matcher", function() {
            $router.on(/recurve/i, callback);
            pushState("/this-is-recurve");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should not call route callback if doesn't match regexp matcher", function() {
            $router.on(/recurve/i, callback);
            pushState("/this-is");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should only register last callback for a path", function() {
            $router.on("a", callback);
            var callback2 = jasmine.createSpy("callback2");
            $router.on("a", callback2);
            var callback3 = jasmine.createSpy("callback3");
            $router.on("a", callback3);

            pushState("/a");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });

        it("should return params with keys for string path", function() {
            $router.on("a/:id/b/:time", callback);
            pushState("/a/1/b/21");

            $router.start();

            expect(callback).toHaveBeenCalledWith({id: "1", time: "21"});
        });

        it("should return params splat array for regexp path", function() {
            $router.on(/\/test\/(.+)/, callback);
            pushState("/wow/test/this/should/work");

            $router.start();

            expect(callback).toHaveBeenCalledWith({splat: ["this/should/work"]});
        });

        it("should return query string params for string path", function() {
            $router.on("a/:id", callback);
            pushState("/a/1?query=2");

            $router.start();

            expect(callback).toHaveBeenCalledWith({id: "1", query: "2"});
        });

        it("should return query string params for regexp path", function() {
            $router.on(/\/test\/(.+)/, callback);
            pushState("/wow/test/this/should/work?query=2");

            $router.start();

            expect(callback).toHaveBeenCalledWith({splat: ["this/should/work"], query: "2"});
        });

        it("should ignore trailing space location", function() {
            $router.on("a", callback);
            pushState("/a   ");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should decode location for special characters", function() {
            $router.on("å", callback);
            pushState("%C3%A5");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should throw error for null callback", function() {
            expect(function() {
                $router.on("a", null);
            }).toThrowError("callback must exist");
        });

        it("should throw error for undefined callback", function() {
            expect(function() {
                $router.on("a");
            }).toThrowError("callback must exist");
        });

        it("should throw error for number callback", function() {
            expect(function() {
                $router.on("a", 0);
            }).toThrowError("callback must exist");
        });

        it("should throw error for string callback", function() {
            expect(function() {
                $router.on("a", "a");
            }).toThrowError("callback must exist");
        });
    });

    it("should call otherwise callback if no match", function() {
        $router.on("a", callback);
        var noMatch = jasmine.createSpy("noMatch");
        $router.otherwise(noMatch);
        pushState("b");

        $router.start();

        expect(callback).not.toHaveBeenCalled();
        expect(noMatch).toHaveBeenCalled();
    });

    describe("off", function() {
        it("should remove path callback", function() {
            $router.on("a", callback);
            $router.off("a");

            pushState("a");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should call otherwise after path callback has been removed", function() {
            $router.on("a", callback);
            $router.off("a", callback);
            var noMatch = jasmine.createSpy("noMatch");
            $router.otherwise(noMatch);
            pushState("a");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
            expect(noMatch).toHaveBeenCalled();
        });
    });

    describe("navigate", function() {
        beforeEach(function() {
            $router.on("a", callback);
        });

        it("should call route callback for match", function() {
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

        it("should not require leading slash", function() {
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
            $router.on("a", callback);
        });

        it("should call route callback for match", function() {
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

        it("should not require leading slash", function() {
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
            $router.on("a", callback);
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
            $router.on("b", callback);
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
            $router.on("a", callback);
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
            $include(null, function($mockable) {
                $mockable.config("$router", {root: root});
            });

            $invoke(["$router"], function(router) {
                $router = router;
            });

            if (matcher) {
                $router.on(matcher, callback);
            }

            $router.start();
        }

        it("should add root to navigate path", function(done) {
            setup("a");
            $router.navigate("b");

            setTimeout(function() {
                expect(location.pathname).toEqual("/a/b");
                done();
            }, 0);
        });

        it("should add root to replace path", function(done) {
            setup("a");
            $router.replace("b");

            setTimeout(function() {
                expect(location.pathname).toEqual("/a/b");
                done();
            }, 0);
        });

        it("should navigate to root for empty path", function(done) {
            setup("a");
            $router.navigate("");

            setTimeout(function() {
                expect(location.pathname).toEqual("/a");
                done();
            }, 0);
        });

        it("should replace to root for empty path", function(done) {
            setup("a");
            $router.replace("");

            setTimeout(function() {
                expect(location.pathname).toEqual("/a");
                done();
            }, 0);
        });

        it("should not append root multiple times with multiple calls to navigate", function(done) {
            setup("a");
            $router.navigate("b");
            $router.navigate("b");
            $router.navigate("b");

            setTimeout(function() {
                expect(location.pathname).toEqual("/a/b");
                done();
            }, 0);
        });

        it("should not append empty root multiple times with multiple calls to navigate", function(done) {
            setup("");
            $router.navigate("a/b");
            $router.navigate("a/b");
            $router.navigate("a/b");

            setTimeout(function() {
                expect(location.pathname).toEqual("/a/b");
                done();
            }, 0);
        });

        it("should not append empty root multiple times with multiple calls to replace", function(done) {
            setup("a");
            $router.replace("b");
            $router.replace("b");
            $router.replace("b");

            setTimeout(function() {
                expect(location.pathname).toEqual("/a/b");
                done();
            }, 0);
        });

        it("should not append empty root multiple times with multiple calls to replace", function(done) {
            setup("");
            $router.replace("a/b");
            $router.replace("a/b");
            $router.replace("a/b");

            setTimeout(function() {
                expect(location.pathname).toEqual("/a/b");
                done();
            }, 0);
        });

        it("should match if root is in matcher", function() {
            setup("a", "a/b");
            $router.navigate("b");

            expect(callback).toHaveBeenCalled();
        });

        it("should match if root is not in matcher", function() {
            setup("a", "b");
            $router.navigate("b");

            expect(callback).toHaveBeenCalled();
        });

        it("should match regexp with root", function() {
            setup("a", /b/);
            $router.navigate("b");

            expect(callback).toHaveBeenCalled();
        });

        it("should allow root to include leading '/'", function() {
            setup("/a", "a/b");
            $router.navigate("b");

            expect(callback).toHaveBeenCalled();
        });

        it("should ignore trailing space in root", function() {
            setup("a    ", "a/b");
            $router.navigate("b");

            expect(callback).toHaveBeenCalled();
        });

        it("should allow root to include '/' after first character", function() {
            setup("a/b", "a/b/c");
            $router.navigate("c");

            expect(callback).toHaveBeenCalled();
        });
    });
});