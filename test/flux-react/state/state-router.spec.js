"use strict";

describe("$stateRouter", function() {
    var $async;
    var $router;
    var $stateRouter;

    function setup(states, redirects, root, noSpies) {
        $include(null, function(module) {
            recurve.forEach(states, function(state) {
                if (state && !state.resolver) {
                    state.resolver = {};
                    state.resolver.components = {};
                }
            });

            module.config("$stateRouter", {
                root: root,
                states: states,
                redirects: redirects
            });

            if (!noSpies) {
                module.decorator("$router", null, function($router) {
                    spyOn($router, "on");
                    spyOn($router, "navigate");
                    spyOn($router, "reload");
                    spyOn($router, "setRoot");
                    spyOn($router, "notFound");

                    return $router;
                });
            }
        });

        $invoke(["$async", "$router", "$stateRouter"],
            function(asyncService, routerService, stateRouterService) {
            $async = asyncService;
            $router = routerService;
            $stateRouter = stateRouterService;
        });
    }

    function setupNoSpies(states, redirects, root) {
        setup(states, redirects, root, true);
    }

    function testProxyRouterMethod(method) {
        it("should call $router." + method, function() {
            spyOn($router, method);
            $stateRouter[method]();

            expect($router[method]).toHaveBeenCalled();
        });
    }

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.$module);
        $include(recurve.flux.react.$module);

        $invoke(["$async", "$router", "$stateRouter"], function(asyncService, routerService, stateRouterService) {
            $async = asyncService;
            $router = routerService;
            $stateRouter = stateRouterService;
        });

        // Make sure we start at some other path before each
        window.history.pushState(null, null, "/start-at-some-other-path");
    });

    it("should be invokable", function() {
        expect($stateRouter).toBeDefined();
        expect(isFunction($stateRouter)).toEqual(false);
    });

    describe("start", function() {
        testProxyRouterMethod("start");
    });

    describe("config", function() {
        function testMostRecent(path) {
            expect($router.on.calls.mostRecent().args[0]).toEqual(path);
        }

        describe("states", function() {
            it("should call $router.on with path", function() {
                setup({test: {path: "a"}});
                expect($router.on).toHaveBeenCalled(); 
            });

            it("should include parent path", function() {
                setup({
                    "parent" : {
                        path: "a"
                    },
                    "parent.child": {
                        path: "b"
                    }
                });

                testMostRecent("a/b");
            });

            it("should allow deeply nested parents", function() {
                setup({
                    "parent" : {
                        path: "a"
                    },
                    "parent.childA" : {
                        path: "b"
                    },
                    "parent.childA.childB": {
                        path: "c"
                    }
                });

                testMostRecent("a/b/c");
            });

            it("should throw error for parent that does not exist", function() {
                expect(function() {
                    setup({
                        "parent.child": {
                            path: "b"
                        }
                    });
                }).toThrowError("no parent exists for state config 'parent.child'");
            });

            it("should throw error for parent that is defined after child", function() {
                expect(function() {
                    setup({
                        "parent.child": {
                            path: "b"
                        },
                        "parent" : {
                            path: "a"
                        }
                    });
                }).toThrowError("no parent exists for state config 'parent.child'");
            });

            it("should throw error for empty name", function() {
                expect(function() {
                    setup({"": {path: "b"}});
                }).toThrowError("state name must be set for path 'b'");
            });

            it("should throw error for no state config", function() {
                expect(function() {
                    setup({"a": null});
                }).toThrowError("state config must be set for name 'a'");
            });

            it("should throw error for no resolver", function() {
                expect(function() {
                    $include(null, function(module) {
                        module.config("$stateRouter", {
                            states: {
                                "a": {
                                    path: "a"
                                }
                            }
                        });
                    });

                    $invoke(["$async", "$router", "$stateRouter"],
                        function(asyncService, routerService, stateRouterService) {
                            $async = asyncService;
                            $router = routerService;
                            $stateRouter = stateRouterService;
                        }
                    );

                }).toThrowError("state resolver must be set for path 'a'");
            });

            it("should throw error for no resolver components", function() {
                expect(function() {
                    setup({
                        "a": {
                            path: "a",
                            resolver: {}
                        }
                    });
                }).toThrowError("state resolver components must be set for path 'a'");
            });
        });

        describe("redirects", function() {
            function redirect(states, redirects, initialPath) {
                setupNoSpies(states, redirects);

                var currentStates;
                $stateRouter.changeAction.on(function(states) {
                    currentStates = states;
                });

                $router.start();
                $router.navigate(initialPath);
                $async.flush();

                return currentStates[0];
            }

            it("should redirect to the state", function() {
                var state = redirect({
                    test: {
                        path: "a"
                    }
                }, [{from: "b", to: "test"}], "b");

                expect(state.name).toEqual("test");
            });

            it("should allow params in the path", function() {
                var state = redirect({
                    test: {
                        path: "a"
                    }
                }, [{from: "b/:id", to: "test"}], "b/1");

                expect(state.name).toEqual("test");
            });

            it("should pass through params", function() {
                var state = redirect({
                    test: {
                        path: "a"
                    }
                }, [{from: "b/:id", to: "test"}], "b/1");

                expect(state.params).toEqual({id: "1"});
            });

            it("should allow to pass additional params", function() {
                var state = redirect({
                    test: {
                        path: "a"
                    }
                }, [{from: "b/:id", to: "test", params: {name: "sebastien"}}], "b/1");

                expect(state.params).toEqual({id: "1", name: "sebastien"});
            });

            it("should default 'from' path to '.*' if not defined", function() {
                var state = redirect({
                    test: {
                        path: "a"
                    }
                }, [{to: "test"}], "d");

                expect(state.name).toEqual("test");
            });

            it("should throw an error if redirect path is a state path", function() {
                expect(function() {
                    setupNoSpies({
                        test: {
                            path: "a"
                        }
                    }, [{from: "a", to: "test"}]);
                }).toThrowError("state 'test' is defined for redirect path 'a'");
            });

            it("should throw an error if the 'to' state does not exist", function() {
                expect(function() {
                    setupNoSpies({
                        test: {
                            path: "a"
                        }
                    }, [{from: "b", to: "test1"}]);
                }).toThrowError("state 'test1' does not exist for redirect path 'b'");
            });

            it("should throw an error if 'to' is not defined", function() {
                expect(function() {
                    setupNoSpies({
                        test: {
                            path: "a"
                        }
                    }, [{from: "b"}]);
                }).toThrowError("'to' must be set for redirect path 'b'");
            });
        });
    });

    describe("nameToPath", function() {
        it("should return path specified in config", function() {
            setup({test: {path: "a"}});
            expect($stateRouter.nameToPath("test")).toEqual("a");
        });

        it("should include parent path", function() {
            setup({
                "parent" : {
                    path: "a"
                },
                "parent.child": {
                    path: "b"
                }
            });

            expect($stateRouter.nameToPath("parent.child")).toEqual("a/b");
        });

        it("should not include a forward slash for empty string parent path", function() {
            setup({
                "parent" : {
                    path: ""
                },
                "parent.child": {
                    path: "b"
                }
            });

            expect($stateRouter.nameToPath("parent.child")).toEqual("b");
        });

        it("should replace named params", function() {
            setup({test: {path: "a/:id/b/:count"}});
            expect($stateRouter.nameToPath("test", {id: 1, count: 2})).toEqual("a/1/b/2");
        });

        it("should encode named params", function() {
            setup({test: {path: "a/:id"}});
            expect($stateRouter.nameToPath("test", {id: "$"})).toEqual("a/%24");
        });

        describe("query params", function() {
            function testQuery(params, expected) {
                setup({test: {path: "a"}});
                expect($stateRouter.nameToPath("test", params)).toEqual("a" + expected);
            }

            it("should separate the first param with ?", function() {
                testQuery({a: 1}, "?a=1");
            });

            it("should separate others with &", function() {
                testQuery({a: 1, b:2, c:3}, "?a=1&b=2&c=3");
            });

            it("should encode param keys", function() {
                testQuery({"$":1}, "?%24=1");
            });

            it("should encode param values", function() {
                testQuery({"$":1}, "?%24=1");
            });

            it("should encode ?/& in key and values", function() {
                testQuery({"?&": "&?", a: 2}, "?%3F%26=%26%3F&a=2");
            });

            it("should convert date param to ISO", function() {
                testQuery({a:new Date(Date.UTC(2014,1,1))}, "?a=2014-02-01T00%3A00%3A00.000Z");
            });

            it("should convert object to JSON", function() {
                testQuery({a: {b:2}}, "?a=%7B%22b%22%3A2%7D");
            });
        });

        it("should throw error if state does not exist", function() {
            setup({
                test: {
                    path: "a"
                }
            });

            expect(function() {
                $stateRouter.nameToPath("other");
            }).toThrowError("state 'other' does not exist");
        });
    });

    describe("nameToHref", function() {
        it("should include a forward slash at the beginning", function() {
            setup({test: {path: "a"}});
            expect($stateRouter.nameToHref("test")).toEqual("/a");
        });

        it("should not include multiple forward slashes for empty string parent path", function() {
            setup({
                "parent" : {
                    path: ""
                },
                "parent.child": {
                    path: "b"
                }
            });

            expect($stateRouter.nameToHref("parent.child")).toEqual("/b");
        });
    });

    describe("navigate", function() {
        it("should replace params in the path", function() {
            setup({
                test: {
                    path: "a/:id"
                }
            });

            $stateRouter.navigate("test", {id: 1});
            $async.flush();

            expect($router.navigate.calls.mostRecent().args[0]).toEqual("a/1");
        });

        it("should include parent path", function() {
            setup({
                "parent" : {
                    path: "a"
                },
                "parent.child": {
                    path: "b"
                }
            });

            $stateRouter.navigate("parent.child");
            $async.flush();

            expect($router.navigate.calls.mostRecent().args[0]).toEqual("a/b");
        });

        it("should pass through options to $router.navigate", function() {
            setup({
                test: {
                    path: "a"
                }
            });

            $stateRouter.navigate("test", null, null, {a: 1});
            $async.flush();

            expect($router.navigate.calls.mostRecent().args[2]).toEqual({a: 1});
        });

        it("should pass through history state to $router.navigate", function() {
            setup({
                test: {
                    path: "a"
                }
            });

            $stateRouter.navigate("test", null, "state!");
            $async.flush();

            expect($router.navigate.calls.mostRecent().args[1]).toEqual("state!");
        });

        it("should force reload if same path with options.reload=true", function() {
            setup({
                test: {
                    path: "a"
                }
            });

            $router.currentPath = function() {
                return "a";
            };

            $stateRouter.navigate("test", null, null, {reload: true});
            $async.flush();

            expect($router.reload).toHaveBeenCalled();
        });

        it("should not force a reload if different path with options.reload=true", function() {
            setup({
                test: {
                    path: "a"
                }
            });

            $router.currentPath = function() {
                return "b";
            };

            $stateRouter.navigate("test", null, null, {reload: true});
            $async.flush();

            expect($router.reload).not.toHaveBeenCalled();
        });

        it("should throw error for a state that does not exist", function() {
            expect(function() {
                $stateRouter.navigate("test");
            }).toThrowError("state 'test' does not exist");
        });
    });

    describe("back", function() {
        testProxyRouterMethod("back");
    });

    describe("forward", function() {
        testProxyRouterMethod("forward");
    });

    describe("reload", function() {
        testProxyRouterMethod("reload");
    });

    describe("root", function() {
        it("should set the root on $router", function() {
            setup({}, {}, "a");
            expect($router.setRoot).toHaveBeenCalledWith("a");
        });

        it("should set the root on $router with null", function() {
            setup({}, {}, null);
            expect($router.setRoot).toHaveBeenCalledWith(null);
        });

        it("should set the root on $router with undefined", function() {
            setup({}, {}, undefined);
            expect($router.setRoot).toHaveBeenCalledWith(undefined);
        });

        it("should set the root on $router with empty string", function() {
            setup({}, {}, "");
            expect($router.setRoot).toHaveBeenCalledWith("");
        });
    });

    describe("actions", function() {
        var callback;

        beforeEach(function() {
            callback = jasmine.createSpy("changedCallback");
        });

        describe("changeAction", function() {
            function mostRecentCallState() {
                return callback.calls.mostRecent().args[0][0];
            }

            it("should trigger after calling start", function() {
                setupNoSpies({
                    test : {
                        path: "a"
                    }
                });

                $stateRouter.changeAction.on(callback);

                $stateRouter.start();
                $stateRouter.navigate("test");
                $async.flush();

                expect(callback).toHaveBeenCalled();
            });

            it("should include the set of states as param", function() {
                setupNoSpies({
                    test : {
                        path: "a"
                    }
                });

                $stateRouter.changeAction.on(callback);

                $stateRouter.start();
                $stateRouter.navigate("test");
                $async.flush();

                expect(mostRecentCallState().name).toEqual("test");
            });

            it("should trigger on loading if there is data to resolve", function() {
                setupNoSpies({
                    test : {
                        path: "a",
                        resolver: {
                            resolve: {
                                a: function() {
                                    return 1;
                                }
                            },
                            components: {}
                        }
                    }
                });

                var calledOnLoading = false;
                $stateRouter.changeAction.on(function(states) {
                    if (states[0].loading) {
                        calledOnLoading = true;
                    }
                });

                $stateRouter.start();
                $stateRouter.navigate("test");
                $async.flush();

                expect(calledOnLoading).toEqual(true);
            });

            it("should trigger on resolved", function() {
                setupNoSpies({
                    test : {
                        path: "a",
                        resolver: {
                            resolve: {
                                a: function() {
                                    return 1;
                                }
                            },
                            components: {}
                        }
                    }
                });

                $stateRouter.changeAction.on(callback);

                $stateRouter.start();
                $stateRouter.navigate("test");
                $async.flush();

                expect(mostRecentCallState().resolved).toEqual(true);
            });

            it("should trigger on error", function() {
                var error = new Error("oops!");
                setupNoSpies({
                    test : {
                        path: "a",
                        resolver: {
                            resolve: {
                                a: function() {
                                    throw error;
                                }
                            },
                            components: {}
                        }
                    }
                });

                $stateRouter.changeAction.on(callback);

                $stateRouter.start();
                $stateRouter.navigate("test");
                $async.flush();

                expect(mostRecentCallState().error).toEqual(error);
            });
        });

        describe("notFoundAction", function() {
            it("should trigger if there is no matching state or redirect path", function() {
                setupNoSpies({
                    test : {
                        path: "a"
                    }
                });

                $stateRouter.notFoundAction.on(callback);

                $router.start();
                $router.navigate("somewhere");
                $async.flush();

                expect(callback).toHaveBeenCalled();
            });

            it("should include the path as param", function() {
                setupNoSpies({
                    test : {
                        path: "a"
                    }
                });

                $stateRouter.notFoundAction.on(callback);

                $router.start();
                $router.navigate("somewhere");
                $async.flush();

                expect(callback).toHaveBeenCalledWith("somewhere");
            });
        });
    });

    it("should redirect during transition", function() {
        setupNoSpies({
            a: {
                path: "a",
                resolver: {
                    beforeResolve: function(redirect) {
                        redirect("b");
                    },
                    resolve: {
                        test: function() {
                            return 1;
                        }
                    },
                    components: {}
                }
            },
            b: {
                path: "b"
            }
        });

        var currentStates;
        $stateRouter.changeAction.on(function(states) {
            currentStates = states;
        });

        $stateRouter.start();
        $stateRouter.navigate("a");
        $async.flush();

        expect(currentStates[0].name).toEqual("b");
    });
});