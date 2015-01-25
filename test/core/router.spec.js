"use strict";

describe("$router", function() {
    var $router;
    var callback;

    function pushState(path, stateObj) {
        window.history.pushState(stateObj, null, path);
    }

    function setupRoute(path, notFound) {
        $include(null, function(module) {
            var routes = {};
            routes[path] = callback;
            module.config("$router", {
                routes: routes,
                notFound: notFound
            });
        });

        $invoke(["$router"], function(router) {
            $router = router;
        });
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

    describe("config.routes", function() {
        it("should call route callback for string matcher with no params", function() {
            setupRoute("/a");
            pushState("/a");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should not require leading slash in string matcher", function() {
            setupRoute("a");
            pushState("/a");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should call route callback for string matcher with one param", function() {
            setupRoute("a/:id", callback);
            pushState("/a/1");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should call route callback for string matcher with multiple params", function() {
            setupRoute("a/:id/b/:time");
            pushState("/a/1/b/21");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should not call route callback if doesn't match string matcher", function() {
            setupRoute("a/:id");
            pushState("/a/1/b");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should call route callback for regexp matcher", function() {
            setupRoute("test/[0-9]{3}$");
            pushState("/test/123");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should not call route callback if doesn't match regexp matcher", function() {
            setupRoute("test/[0-9]{3}$");
            pushState("/test/12");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should return params with keys for string path", function() {
            setupRoute("a/:id/b/:time");
            pushState("/a/1/b/21");

            $router.start();

            expect(callback).toHaveBeenCalledWith({id: "1", time: "21"});
        });

        it("should return params splat array for regexp path", function() {
            setupRoute("test/(.+)", callback);
            pushState("/wow/test/this/should/work");

            $router.start();

            expect(callback).toHaveBeenCalledWith({splat: ["this/should/work"]});
        });

        it("should return query string params for string path", function() {
            setupRoute("a/:id");
            pushState("/a/1?query=2");

            $router.start();

            expect(callback).toHaveBeenCalledWith({id: "1", query: "2"});
        });

        it("should return query string params for regexp path", function() {
            setupRoute("test/(.+)");
            pushState("/wow/test/this/should/work?query=2");

            $router.start();

            expect(callback).toHaveBeenCalledWith({splat: ["this/should/work"], query: "2"});
        });

        it("should ignore trailing space location", function() {
            setupRoute("a");
            pushState("/a   ");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        it("should decode location for special characters", function() {
            setupRoute("å");
            pushState("%C3%A5");

            $router.start();

            expect(callback).toHaveBeenCalled();
        });

        describe("error handling", function() {
            function setup(routeCallback) {
                $include(null, function(module) {
                    module.config("$router", {
                        routes: {a: routeCallback}
                    });
                });

                $invoke(["$router"], function(router) {
                    $router = router;
                });
            }

            it("should throw error for null callback", function() {
                expect(function() {
                    setup(null);
                }).toThrowError("callback must exist for route 'a'");
            });

            it("should throw error for undefined callback", function() {
                expect(function() {
                    setup();
                }).toThrowError("callback must exist for route 'a'");
            });

            it("should throw error for number callback", function() {
                expect(function() {
                    setup(0);
                }).toThrowError("callback must exist for route 'a'");
            });

            it("should throw error for string callback", function() {
                expect(function() {
                    setup("a");
                }).toThrowError("callback must exist for route 'a'");
            });
        });

        it("should call notFound callback if no match", function() {
            var noMatch = jasmine.createSpy("noMatch");
            setupRoute("a", noMatch);
            pushState("b");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
            expect(noMatch).toHaveBeenCalled();
        });

        it("should call notFound callback with path as parameter", function() {
            var noMatch = jasmine.createSpy("noMatch");
            setupRoute("a", noMatch);
            pushState("b");

            $router.start();

            expect(callback).not.toHaveBeenCalledWith("b");
            expect(noMatch).toHaveBeenCalled();
        });
    });

    describe("on", function() {
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

        it("should override config route for same path", function() {
            setupRoute("a");
            var callback2 = jasmine.createSpy("callback2");
            $router.on("a", callback2);

            pushState("/a");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });

        it("should match path with regexp object", function() {
            $router.on(/\/test\/(.+)/, callback);
            pushState("/wow/test/should/work");

            $router.start();
            expect(callback).toHaveBeenCalled();
        });

        it("should not match path with non matching regexp object", function() {
            $router.on(/\/test\/(.+)/, callback);
            pushState("/wow/tast/should/work");

            $router.start();
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe("notFound", function() {
        var notFound;

        beforeEach(function() {
            notFound = jasmine.createSpy("noMatch");
        });

        it("should call callback if no match", function() {
            $router.on("a", callback);
            $router.notFound(notFound);

            pushState("b");

            $router.start();

            expect(callback).not.toHaveBeenCalled();
            expect(notFound).toHaveBeenCalled();
        });

        it("should override config notFound", function() {
            setupRoute("a", notFound);
            var notFound2 = jasmine.createSpy("notFound2");
            $router.notFound(notFound2);

            pushState("b");

            $router.start();

            expect(notFound).not.toHaveBeenCalled();
            expect(notFound2).toHaveBeenCalled();
        });
    });

    describe("navigate", function() {
        beforeEach(function() {
            setupRoute("a");
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
            $router.navigate("a", null, {trigger: false});

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
            setupRoute("a");
        });

        it("should call route callback for match", function() {
            $router.start();
            $router.navigate("a", null, {replace: true});

            expect(callback).toHaveBeenCalled();
        });

        it("should return state object", function() {
            $router.start();
            $router.navigate("a", {b: 2}, {replace: true});

            expect(callback.calls.first().args[1]).toEqual({b: 2});
        });

        it("should not call route callback if trigger is false", function() {
            $router.start();
            $router.navigate("a", null, {trigger: false, replace: true});

            expect(callback).not.toHaveBeenCalled();
        });

        it("should not call route callback before start", function() {
            $router.navigate("a", null, {replace: true});
            expect(callback).not.toHaveBeenCalled();
        });

        it("should not require leading slash", function() {
            $router.start();
            $router.navigate("/a", null, {replace: true});

            expect(callback).toHaveBeenCalled();
        });

        it("should ignore trailing space", function() {
            $router.start();
            $router.navigate("a      ", null, {replace: true});

            expect(callback).toHaveBeenCalled();
        });
    });

    describe("back", function() {
        beforeEach(function() {
            setupRoute("a");
        });

        it("should call route callback for popped path", function(done) {
            $router.navigate("a", null, {trigger: false});
            $router.navigate("b", null, {trigger: false});
            $router.start();
            $router.back();

            setTimeout(function() {
                expect(callback).toHaveBeenCalled();
                done();
            }, 0);
        });

        it("should call route callback with state for popped path", function(done) {
            $router.navigate("a", {b: 1}, {trigger: false});
            $router.navigate("b", null, {trigger: false});
            $router.start();
            $router.back();

            setTimeout(function() {
                expect(callback.calls.first().args[1]).toEqual({b: 1});
                done();
            }, 0);
        });

        it("should not call route callback before start", function(done) {
            $router.navigate("a", null, {trigger: false});
            $router.navigate("b", null, {trigger: false});
            $router.back();

            setTimeout(function() {
                expect(callback).not.toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    describe("forward", function() {
        beforeEach(function() {
            setupRoute("b");
        });

        it("should call route callback for forward path", function(done) {
            $router.navigate("a", null, {trigger: false});
            $router.navigate("b", null, {trigger: false});
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
            $router.navigate("a", null, {trigger: false});
            $router.navigate("b", {b: 1}, {trigger: false});
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
            $router.navigate("a", null, {trigger: false});
            $router.navigate("b", null, {trigger: false});
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
            setupRoute("a");
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
            $router.navigate("a", null, {trigger: false});
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
        function setup(root, path) {
            $include(null, function($mockable) {
                var config = {root: root};
                if (path) {
                    config.routes = {};
                    config.routes[path] = callback;
                }

                $mockable.config("$router", config);
            });

            $invoke(["$router"], function(router) {
                $router = router;
            });

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
            $router.navigate("b", null, {replace: true});

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
            $router.navigate("", null, {replace: true});

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
            $router.navigate("b", null, {replace: true});
            $router.navigate("b", null, {replace: true});
            $router.navigate("b", null, {replace: true});

            setTimeout(function() {
                expect(location.pathname).toEqual("/a/b");
                done();
            }, 0);
        });

        it("should not append empty root multiple times with multiple calls to replace", function(done) {
            setup("");
            $router.navigate("a/b", null, {replace: true});
            $router.navigate("a/b", null, {replace: true});
            $router.navigate("a/b", null, {replace: true});

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
            setup("a", "test/[0-9]{3}$");
            $router.navigate("test/123");

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

        it("should set root to '/' for undefined config root", function(done) {
            setup();
            $router.navigate("b");
            setTimeout(function() {
                expect(location.pathname).toEqual("/b");
                done();
            }, 0);
        });

        it("should set root to '/' for null config root", function(done) {
            setup(null);
            $router.navigate("b");
            setTimeout(function() {
                expect(location.pathname).toEqual("/b");
                done();
            }, 0);
        });

        it("should set root to '/' for empty string config root", function(done) {
            setup("");
            $router.navigate("b");
            setTimeout(function() {
                expect(location.pathname).toEqual("/b");
                done();
            }, 0);
        });
    });

    describe("currentPath", function() {
        it("should return current path", function() {
            $router.start();
            $router.navigate("/c");
            expect($router.currentPath()).toEqual("c");
        });

        it("should include root", function() {
            $include(null, function($mockable) {
                $mockable.config("$router", {root: "a"});
            });

            $invoke(["$router"], function(router) {
                $router = router;
            });

            $router.start();
            $router.navigate("c");

            expect($router.currentPath()).toEqual("a/c");
        });
    });
});