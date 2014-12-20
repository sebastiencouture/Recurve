"use strict";

describe("$state", function() {
    var $async;
    var $promise;
    var $router;
    var $state;

    beforeEach(function() {
        $include(recurve.flux.$module);
        $include(recurve.flux.state.$module);

        $invoke(["$async", "$promise", "$router", "$state"],
            function(asyncService, promiseService, routerService, stateService) {
            $async = asyncService;
            $promise = promiseService;
            $router = routerService;
            $state = stateService;
        });
    });

    function setup(states, noSpies) {
        $include(null, function(module) {
            module.config("$state", {
                states: states
            });

            if (!noSpies) {
                module.decorator("$router", null, function($router) {
                    spyOn($router, "on");
                    spyOn($router, "navigate");
                    spyOn($router, "reload");

                    return $router;
                });
            }
        });

        $invoke(["$async", "$promise", "$router", "$state"],
            function(asyncService, promiseService, routerService, stateService) {
            $async = asyncService;
            $promise = promiseService;
            $router = routerService;
            $state = stateService;
        });
    }

    function setupNoSpies(states) {
        setup(states, true);
    }

    function testCallRouterMethod(method) {
        it("should call $router." + method, function() {
            spyOn($router, method);
            $state[method]();

            expect($router[method]).toHaveBeenCalled();
        });
    }

    it("should be invokable", function() {
        expect($state).toBeDefined();
        expect(isFunction($state)).toEqual(false);
    });

    describe("start", function() {
        testCallRouterMethod("start");
    });

    describe("state config", function() {
        function testMostRecent(path) {
            expect($router.on.calls.mostRecent().args[0]).toEqual(path);
        }

        it("should call $router.on with path", function() {
            setup([{
                test: {
                    path: "a"
            }}]);

            expect($router.on).toHaveBeenCalled();
        });

        it("should include parent path", function() {
            setup([{
                "parent" : {
                    path: "a"
                }}, {
                "parent.child": {
                    path: "b"
            }}]);

            testMostRecent("a/b");
        });

        it("should allow deeply nested parents", function() {
            setup([{
                "parent" : {
                    path: "a"
                }}, {
                "parent.childA" : {
                    path: "b"
                }}, {
                "parent.childA.childB": {
                    path: "c"
                }}]);

            testMostRecent("a/b/c");
        });

        it("should strip additional slashes joining parent and child path", function() {
            setup([{
                "parent" : {
                    path: "a"
                }}, {
                "parent.child": {
                    path: "b"
                }}]);

            testMostRecent("a/b");
        });

        it("should throw error for parent that does not exist", function() {
            expect(function() {
                setup([{
                    "parent.child": {
                        path: "b"
                    }}]);
            }).toThrowError("no parent exists for state 'parent.child'");
        });

        it("should throw error for parent that is defined after child", function() {
            expect(function() {
                setup([{
                    "parent.child": {
                        path: "b"
                    }}, {
                    "parent" : {
                        path: "a"
                    }
                }]);
            }).toThrowError("no parent exists for state 'parent.child'");
        });

        it("should throw error for empty name", function() {
            expect(function() {
                setup([{
                    "": {
                        path: "b"
                    }}]);
            }).toThrowError("state name must be set for path 'b'");
        });

        it("should throw error for null path", function() {
            expect(function() {
                setup([{
                    test: {
                    }}]);
            }).toThrowError("state path must be set for name 'test'");
        });

        it("should throw error for empty path", function() {
            expect(function() {
                setup([{
                    test: {
                        path: ""
                    }}]);
            }).toThrowError("state path must be set for name 'test'");
        });
    });

    describe("nameToPath", function() {
        it("should return path specified in config", function() {
            setup([{
                test: {
                    path: "a"
            }}]);

            expect($state.nameToPath("test")).toEqual("a");
        });

        it("should include parent path", function() {
            setup([{
                "parent" : {
                    path: "a"
                }}, {
                "parent.child": {
                    path: "b"
            }}]);

            expect($state.nameToPath("parent.child")).toEqual("a/b");
        });

        it("should replace named params", function() {
            setup([{
                test: {
                    path: "a/:id/b/:count"
                }}]);

            expect($state.nameToPath("test", {id: 1, count: 2})).toEqual("a/1/b/2");
        });

        it("should encode named params", function() {
            setup([{
                test: {
                    path: "a/:id"
                }}]);

            expect($state.nameToPath("test", {id: "$"})).toEqual("a/%24");
        });

        describe("query params", function() {
            function testQuery(params, expected) {
                setup([{
                    test: {
                        path: "a"
                    }}]);

                expect($state.nameToPath("test", params)).toEqual("a" + expected);
            }

            it("should separate the first parameter with ?", function() {
                testQuery({a: 1}, "?a=1");
            });

            it("should separate others with &", function() {
                testQuery({a: 1, b:2, c:3}, "?a=1&b=2&c=3");
            });

            it("should encode parameter keys", function() {
                testQuery({"$":1}, "?%24=1");
            });

            it("should encode parameter values", function() {
                testQuery({"$":1}, "?%24=1");
            });

            it("should encode ?/& in key and values", function() {
                testQuery({"?&": "&?", a: 2}, "?%3F%26=%26%3F&a=2");
            });

            it("should convert date parameter to ISO", function() {
                testQuery({a:new Date(2014,1,1)}, "?a=2014-02-01T08%3A00%3A00.000Z");
            });

            it("should convert object to JSON", function() {
                testQuery({a: {b:2}}, "?a=%7B%22b%22%3A2%7D");
            });
        });

        it("should return null if state does not exist", function() {
            setup([{
                test: {
                    path: "a"
                }}]);

            expect($state.nameToPath("other")).toEqual(null);
        });
    });

    describe("navigate", function() {
        it("should replace parameters in the path", function() {
            setup([{
                test: {
                    path: "a/:id"
            }}]);

            $state.navigate("test", {id: 1});
            expect($router.navigate.calls.mostRecent().args[0]).toEqual("a/1");
        });

        it("should include parent path", function() {
            setup([{
                "parent" : {
                    path: "a"
                }}, {
                "parent.child": {
                    path: "b"
                }}]);

            $state.navigate("parent.child");
            expect($router.navigate.calls.mostRecent().args[0]).toEqual("a/b");
        });

        it("should pass through options to $router.navigate", function() {
            setup([{
                test: {
                    path: "a"
                }}]);

            $state.navigate("test", null, null, {a: 1});
            expect($router.navigate.calls.mostRecent().args[2]).toEqual({a: 1});
        });

        it("should pass through history state to $router.navigate", function() {
            setup([{
                test: {
                    path: "a"
                }}]);

            $state.navigate("test", null, "state!");
            expect($router.navigate.calls.mostRecent().args[1]).toEqual("state!");
        });

        it("should force reload if same path for options.reload=true", function() {
            setup([{
                test: {
                    path: "a"
                }}]);

            $router.currentPath = function() {
                return "a";
            };

            $state.navigate("test", null, null, {reload: true});
            expect($router.reload).toHaveBeenCalled();
        });

        it("should not force a reload if different path for options.reload=true", function() {
            setup([{
                test: {
                    path: "a"
                }}]);

            $router.currentPath = function() {
                return "b";
            };

            $state.navigate("test", null, null, {reload: true});
            expect($router.reload).not.toHaveBeenCalled();
        });

        it("should throw error for state that does not exist", function() {
            expect(function() {
                $state.navigate("test");
            }).toThrowError("state 'test' does not exist");
        });
    });

    describe("actions", function() {
        var callback;

        beforeEach(function() {
            callback = jasmine.createSpy("actionCallback");
        });

        describe("startChangeAction", function() {
            it("should trigger before changeAction/errorAction", function() {
                setupNoSpies([{
                    test: {
                        path: "a"
                    }}]);

                $state.changeAction.on(callback);
                $state.startChangeAction.on(function() {
                    expect(callback).not.toHaveBeenCalled();
                });

                $router.start();
                $state.navigate("test");
            });

            it("should trigger before resolving data", function() {
                var compute = jasmine.createSpy("compute");
                setupNoSpies([{
                    test: {
                        path: "a",
                        resolve: {
                            compute: compute
                        }
                    }}]);

                $state.startChangeAction.on(function() {
                    expect(compute).not.toHaveBeenCalled();
                });

                $router.start();
                $state.navigate("test");
            });

            it("should include name and route params as action parameters", function() {
                setupNoSpies([{
                    test: {
                        path: "a/:id"
                    }}]);

                $state.startChangeAction.on(callback);

                $router.start();
                $state.navigate("test", {id: "1"});

                expect(callback).toHaveBeenCalledWith("test", {id: "1"});
            });
        });

        describe("changeAction", function() {
            it("should include name, route params and data as action parameters", function() {
                setupNoSpies([{
                    test: {
                        path: "a/:id",
                        data: {
                            some: "data"
                        }
                    }}]);

                $state.changeAction.on(callback);

                $router.start();
                $state.navigate("test", {id: "1"});
                $async.flush();

                expect(callback).toHaveBeenCalledWith("test", {id: "1"}, {some: "data"});
            });

            it("should trigger after resolving data", function() {
                setupNoSpies([{
                    test: {
                        path: "a/:id",
                        resolve: {
                            someDataLater: function() {
                                var deferred = $promise.defer();
                                $async(function() {
                                    deferred.resolve(1);
                                }, 0);

                                return deferred.promise;
                            }
                        }
                    }}]);

                $state.changeAction.on(callback);

                $router.start();
                $state.navigate("test", {id: "1"});
                $async.flush();

                expect(callback).toHaveBeenCalledWith("test", {id: "1"}, {someDataLater: 1});
            });
        });

        describe("errorAction", function() {
            beforeEach(function() {
                setupNoSpies([{
                    test: {
                        path: "a/:id",
                        resolve: {
                            someDataLater: function() {
                                throw new Error("oops!");
                            }
                        }
                    }
                }]);

                $state.errorAction.on(callback);
            });

            it("should include error, name, route params and data as action parameters", function() {
                $state.errorAction.on(callback);

                $router.start();
                $state.navigate("test", {id: "1"});
                $async.flush();

                expect(callback).toHaveBeenCalledWith(new Error("oops!"), "test", {id: "1"}, {});
            });

            it("should not call change action if error action is triggered", function() {
                var changeCallback = jasmine.createSpy("changeCallback");
                $state.changeAction.on(changeCallback);

                $router.start();
                $state.navigate("test", {id: "1"});
                $async.flush();

                expect(callback).toHaveBeenCalled();
                expect(changeCallback).not.toHaveBeenCalled();
            });
        });
    });

    describe("data resolve", function() {
        it("should trigger change action if no data to resolve", function() {

        });

        it("should trigger change action if no resolve key on the state config object", function() {

        });

        it("should set the resolved data to the corresponding key on the returned object", function() {

        });

        it("should allow static data", function() {

        });

        it("should allow data returned by function call", function() {

        });

        it("should wait for promise returned by function call", function() {

        });

        it("should wait for all promises to resolve before triggering change action", function() {

        });

        it("should allow mixture of promises and static data", function() {

        });

        it("should trigger error action if resolve factory method throws error", function() {

        });

        it("should merge resolved data over config data", function() {

        });

        it("should trigger error action if resolve promise errors", function() {

        });

        it("should resolve parent data first", function() {

        });

        it("should pass in resolved parent data to child resolve methods", function() {

        });

        it("should inherit parent resolved data", function() {

        });

        it("should overwrite parent resolved data", function() {

        });
    });

    describe("data custom", function() {
        it("should not invoke methods", function() {

        });

        it("should inherit parent data", function() {

        });

        it("should overwrite parent data", function() {

        });

        it("should overwrite with resolved data", function() {

        });
    });

    describe("back", function() {
        testCallRouterMethod("back");
    });

    describe("forward", function() {
        testCallRouterMethod("forward");
    });

    describe("reload", function() {
        testCallRouterMethod("reload");
    });

    describe("rootPath", function() {
        it("should set the root on $router", function() {

        });
    });
});