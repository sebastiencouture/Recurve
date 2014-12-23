"use strict";

describe("$state", function() {
    var $async;
    var $promise;
    var $router;
    var $state;
    var callback;

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

        callback = jasmine.createSpy("callback");
    });

    function setup(states, root, notFound, noSpies) {
        $include(null, function(module) {
            module.config("$state", {
                root: root,
                states: states,
                notFound: notFound
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

        $invoke(["$async", "$promise", "$router", "$state"],
            function(asyncService, promiseService, routerService, stateService) {
            $async = asyncService;
            $promise = promiseService;
            $router = routerService;
            $state = stateService;
        });
    }

    function setupNoSpies(states, root, notFound) {
        setup(states, root, notFound, true);
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
            }});

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
                }});

            testMostRecent("a/b/c");
        });

        it("should strip additional slashes joining parent and child path", function() {
            setup({
                "parent" : {
                    path: "a"
                },
                "parent.child": {
                    path: "b"
                }});

            testMostRecent("a/b");
        });

        it("should throw error for parent that does not exist", function() {
            expect(function() {
                setup({
                    "parent.child": {
                        path: "b"
                    }});
            }).toThrowError("no parent exists for state 'parent.child'");
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
            }).toThrowError("no parent exists for state 'parent.child'");
        });

        it("should throw error for empty name", function() {
            expect(function() {
                setup({"": {path: "b"}});
            }).toThrowError("state name must be set for path 'b'");
        });

        it("should throw error for null path", function() {
            expect(function() {
                setup({test: {}});
            }).toThrowError("state path must be set for name 'test'");
        });

        it("should throw error for empty path", function() {
            expect(function() {
                setup({test: {path: ""}});
            }).toThrowError("state path must be set for name 'test'");
        });

        it("should throw error for RegExp object path", function() {
            expect(function() {
                setup({test: {path: /a/g}});
            }).toThrowError("state path must be a string for name 'test'");
        });
    });

    describe("nameToPath", function() {
        it("should return path specified in config", function() {
            setup({test: {path: "a"}});
            expect($state.nameToPath("test")).toEqual("a");
        });

        it("should include parent path", function() {
            setup({
                "parent" : {
                    path: "a"
                },
                "parent.child": {
                    path: "b"
            }});

            expect($state.nameToPath("parent.child")).toEqual("a/b");
        });

        it("should replace named params", function() {
            setup({test: {path: "a/:id/b/:count"}});
            expect($state.nameToPath("test", {id: 1, count: 2})).toEqual("a/1/b/2");
        });

        it("should encode named params", function() {
            setup({test: {path: "a/:id"}});
            expect($state.nameToPath("test", {id: "$"})).toEqual("a/%24");
        });

        describe("query params", function() {
            function testQuery(params, expected) {
                setup({test: {path: "a"}});
                expect($state.nameToPath("test", params)).toEqual("a" + expected);
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
                testQuery({a:new Date(2014,1,1)}, "?a=2014-02-01T08%3A00%3A00.000Z");
            });

            it("should convert object to JSON", function() {
                testQuery({a: {b:2}}, "?a=%7B%22b%22%3A2%7D");
            });
        });

        it("should throw error if state does not exist", function() {
            setup({
                test: {
                    path: "a"
                }});

            expect(function() {
                $state.nameToPath("other");
            }).toThrowError("state 'other' does not exist");
        });
    });

    describe("navigate", function() {
        it("should replace params in the path", function() {
            setup({
                test: {
                    path: "a/:id"
            }});

            $state.navigate("test", {id: 1});
            expect($router.navigate.calls.mostRecent().args[0]).toEqual("a/1");
        });

        it("should include parent path", function() {
            setup({
                "parent" : {
                    path: "a"
                },
                "parent.child": {
                    path: "b"
                }});

            $state.navigate("parent.child");
            expect($router.navigate.calls.mostRecent().args[0]).toEqual("a/b");
        });

        it("should pass through options to $router.navigate", function() {
            setup({
                test: {
                    path: "a"
                }});

            $state.navigate("test", null, null, {a: 1});
            expect($router.navigate.calls.mostRecent().args[2]).toEqual({a: 1});
        });

        it("should pass through history state to $router.navigate", function() {
            setup({
                test: {
                    path: "a"
                }});

            $state.navigate("test", null, "state!");
            expect($router.navigate.calls.mostRecent().args[1]).toEqual("state!");
        });

        it("should force reload if same path for options.reload=true", function() {
            setup({
                test: {
                    path: "a"
                }});

            $router.currentPath = function() {
                return "a";
            };

            $state.navigate("test", null, null, {reload: true});
            expect($router.reload).toHaveBeenCalled();
        });

        it("should not force a reload if different path for options.reload=true", function() {
            setup({
                test: {
                    path: "a"
                }});

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
        describe("startChangeAction", function() {
            it("should trigger before changeAction/errorAction", function() {
                setupNoSpies({
                    test: {
                        path: "a"
                    }});

                $state.changeAction.on(callback);
                $state.startChangeAction.on(function() {
                    expect(callback).not.toHaveBeenCalled();
                });

                $router.start();
                $state.navigate("test");
            });

            it("should trigger before resolving data", function() {
                var compute = jasmine.createSpy("compute");
                setupNoSpies({
                    test: {
                        path: "a",
                        resolve: {
                            compute: compute
                        }
                    }});

                $state.startChangeAction.on(function() {
                    expect(compute).not.toHaveBeenCalled();
                });

                $router.start();
                $state.navigate("test");
            });

            it("should include name and route params as action params", function() {
                setupNoSpies({
                    test: {
                        path: "a/:id"
                    }});

                $state.startChangeAction.on(callback);

                $router.start();
                $state.navigate("test", {id: "1"});

                expect(callback).toHaveBeenCalledWith("test", {id: "1"});
            });
        });

        describe("changeAction", function() {
            it("should include name, route params and data as action params", function() {
                setupNoSpies({
                    test: {
                        path: "a/:id",
                        data: {
                            some: "data"
                        }
                    }});

                $state.changeAction.on(callback);

                $router.start();
                $state.navigate("test", {id: "1"});
                $async.flush();

                expect(callback).toHaveBeenCalledWith("test", {id: "1"}, {some: "data"});
            });

            it("should trigger after resolving data", function() {
                setupNoSpies({
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
                    }});

                $state.changeAction.on(callback);

                $router.start();
                $state.navigate("test", {id: "1"});
                $async.flush();

                expect(callback).toHaveBeenCalledWith("test", {id: "1"}, {someDataLater: 1});
            });
        });

        describe("errorAction", function() {
            beforeEach(function() {
                setupNoSpies({
                    test: {
                        path: "a/:id",
                        resolve: {
                            someDataLater: function() {
                                throw new Error("oops!");
                            }
                        }
                    }
                });

                $state.errorAction.on(callback);
            });

            it("should include error, name, route params and data as action params", function() {
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

    describe("data", function() {
        function setupChangeAction(state, errorCallback, params) {
            $state.changeAction.on(callback);
            if (errorCallback) {
                $state.errorAction.on(errorCallback);
            }

            $router.start();
            $state.navigate(state, params);
            $async.flush();
        }

        describe("resolve", function() {
            function returnLater(data, timeMs) {
                return function() {
                    var deferred = $promise.defer();
                    $async(function() {
                        deferred.resolve(data);
                    }, timeMs || 0);

                    return deferred.promise;
                };
            }

            function rejectLater(reason, timeMs) {
                return function() {
                    var deferred = $promise.defer();
                    $async(function() {
                        deferred.reject(reason);
                    }, timeMs);

                    return deferred.promise;
                };
            }

            it("should trigger change action if no data to resolve", function() {
                setupNoSpies({
                    test: {
                        path: "a"
                    }});

                setupChangeAction("test");
                expect(callback).toHaveBeenCalled();
            });

            it("should allow data returned by function call", function() {
                setupNoSpies({
                    test: {
                        path: "a",
                        resolve: {
                            a: function() {
                                return "1";
                            }
                        }
                    }});

                setupChangeAction("test");
                expect(callback).toHaveBeenCalledWith("test", {}, {a: "1"});
            });

            it("should allow static data", function() {
                setupNoSpies({
                    test: {
                        path: "a",
                        resolve: {
                            a: "1"
                        }
                    }});

                setupChangeAction("test");
                expect(callback).toHaveBeenCalledWith("test", {}, {a: "1"});
            });

            it("should wait for promise returned by function call", function() {
                setupNoSpies({
                    test: {
                        path: "a",
                        resolve: {
                            a: returnLater("1", 100)
                        }
                    }});

                setupChangeAction("test");
                expect(callback).toHaveBeenCalledWith("test", {}, {a: "1"});
            });

            it("should wait for all promises to resolve before triggering change action", function() {
                setupNoSpies({
                    test: {
                        path: "a",
                        resolve: {
                            a: returnLater("1", 500),
                            b: returnLater("2", 100)
                        }
                    }});

                setupChangeAction("test");
                expect(callback).toHaveBeenCalledWith("test", {}, {a: "1", b: "2"});
            });

            it("should allow mixture of promises and static data", function() {
                setupNoSpies({
                    test: {
                        path: "a",
                        resolve: {
                            a: returnLater("1", 100),
                            b: "2"
                        }
                    }});

                setupChangeAction("test");
                expect(callback).toHaveBeenCalledWith("test", {}, {a: "1", b: "2"});
            });

            it("should trigger error action if resolve factory method throws error", function() {
                var error = new Error("oops!");
                setupNoSpies({
                    test: {
                        path: "a",
                        resolve: {
                            a: function() {
                                throw error;
                            }
                        }
                    }});

                var errorCallback = jasmine.createSpy("errorCallback");
                setupChangeAction("test", errorCallback);
                expect(errorCallback).toHaveBeenCalledWith(error, "test", {}, {});
            });

            it("should merge resolved data over custom data", function() {
                setupNoSpies({
                    test: {
                        path: "a",
                        resolve: {
                            a: "2"
                        },
                        data: {
                            a: "1"
                        }
                    }});

                setupChangeAction("test");
                expect(callback).toHaveBeenCalledWith("test", {}, {a: "2"});
            });

            it("should trigger error action if resolve promise rejects", function() {
                setupNoSpies({
                    test: {
                        path: "a",
                        resolve: {
                            a: rejectLater("1", 0)
                        }
                    }});

                var errorCallback = jasmine.createSpy("errorCallback");
                setupChangeAction("test", errorCallback);
                expect(errorCallback).toHaveBeenCalledWith("1", "test", {}, {});
            });

            it("should pass in route params to resolve methods", function() {
                setupNoSpies({
                    test: {
                        path: "a/:id",
                        resolve: {
                            a: function(routeParams) {
                                expect(routeParams).toEqual({id: "1"});
                                return "2";
                            }
                        }
                    }
                });

                setupChangeAction("test", null, {id: "1"});
                expect(callback).toHaveBeenCalledWith("test", {id: "1"}, {a: "2"});
            });

            it("should pass in resolved parent data to child resolve methods", function() {
                setupNoSpies({
                    parent: {
                        path: "a",
                        resolve: {
                            a: returnLater("1", 100)
                        }
                    },
                    "parent.child": {
                        path: "b",
                        resolve: {
                            b: function(routeParams, parentResolved) {
                                expect(parentResolved).toEqual({a: "1"});
                                return "2";
                            }
                        }
                    }
                });

                setupChangeAction("parent.child");
                expect(callback).toHaveBeenCalledWith("parent.child", {}, {a: "1", b: "2"});
            });

            it("should inherit parent resolved data", function() {
                setupNoSpies({
                    parent: {
                        path: "a",
                        resolve: {
                            a: function() {
                                return "1";
                            }
                        }
                    },
                    "parent.child": {
                        path: "b",
                        resolve: {
                            b: function() {
                                return "2";
                            }
                        }
                    }
                });

                setupChangeAction("parent.child");
                expect(callback).toHaveBeenCalledWith("parent.child", {}, {a: "1", b: "2"});
            });

            it("should overwrite parent resolved data", function() {
                setupNoSpies({
                    parent: {
                        path: "a",
                        resolve: {
                            a: function() {
                                return "1";
                            }
                        }
                    },
                    "parent.child": {
                        path: "b",
                        resolve: {
                            a: function() {
                                return "2";
                            }
                        }
                    }
                });

                setupChangeAction("parent.child");
                expect(callback).toHaveBeenCalledWith("parent.child", {}, {a: "2"});
            });

            it("should resolve deeply nested parents without promises", function() {
                setupNoSpies({
                    grandparent: {
                        path: "a",
                        resolve: {
                            a: function() {
                                return "1";
                            }
                        }
                    },
                    "grandparent.parent": {
                        path: "b",
                        resolve: {
                            a: function() {
                                return "2";
                            },
                            b: function() {
                                return "3";
                            }
                        }
                    },
                    "grandparent.parent.child": {
                        path: "c",
                        resolve: {
                            a: function() {
                                return "4";
                            },
                            c: function() {
                                return "5";
                            }
                        }
                    }
                });

                setupChangeAction("grandparent.parent.child");
                expect(callback).toHaveBeenCalledWith("grandparent.parent.child", {}, {a: "4", b: "3", c: "5"});
            });

            it("should resolve deeply nested parents with promises", function() {
                setupNoSpies({
                    grandparent: {
                        path: "a",
                        resolve: {
                            a: returnLater("1", 500)
                        }
                    },
                    "grandparent.parent": {
                        path: "b",
                        resolve: {
                            a: returnLater("2", 200),
                            b: returnLater("3", 250)
                        }
                    },
                    "grandparent.parent.child": {
                        path: "c",
                        resolve: {
                            a: returnLater("4", 50),
                            c: returnLater("5", 10)
                        }
                    }
                });

                setupChangeAction("grandparent.parent.child");
                expect(callback).toHaveBeenCalledWith("grandparent.parent.child", {}, {a: "4", b: "3", c: "5"});
            });

            it("should throw error from deeply nested parent", function() {
                var error = new Error("oops!");
                setupNoSpies({
                    grandparent: {
                        path: "a",
                        resolve: {
                            a: rejectLater(error, 500)
                        }
                    },
                    "grandparent.parent": {
                        path: "b",
                        resolve: {
                            a: returnLater("2", 200),
                            b: returnLater("3", 250)
                        }
                    },
                    "grandparent.parent.child": {
                        path: "c",
                        resolve: {
                            a: returnLater("4", 50),
                            c: returnLater("5", 10)
                        }
                    }
                });

                var errorCallback = jasmine.createSpy("errorCallback");
                setupChangeAction("grandparent.parent.child", errorCallback);
                expect(errorCallback).toHaveBeenCalledWith(error, "grandparent.parent.child", {}, {});
            });

            it("should not attempt to resolve child data if parent throws an error", function() {
                var resolveCallback = jasmine.createSpy("resolveCallback");
                var error = new Error("oops!");

                setupNoSpies({
                    parent: {
                        path: "a",
                        resolve: {
                            a: function() {
                                throw error;
                            }
                        }
                    },
                    "parent.child": {
                        path: "b",
                        resolve: {
                            b: resolveCallback
                        }
                    }
                });

                var errorCallback = jasmine.createSpy("errorCallback");
                setupChangeAction("parent.child", errorCallback);

                expect(resolveCallback).not.toHaveBeenCalled();
                expect(errorCallback).toHaveBeenCalledWith(error, "parent.child", {}, {});
            });
        });

        describe("custom", function() {
            it("should not invoke methods", function() {
                setupNoSpies({
                    test: {
                        path: "a",
                        data: {
                            some: callback
                        }
                    }});

                $router.start();
                $state.navigate("test");

                expect(callback).not.toHaveBeenCalled();
            });

            it("should inherit parent data", function() {
                setupNoSpies({
                    parent: {
                        path: "a",
                        data: {
                            a: "1"
                        }
                    },
                    "parent.child": {
                        path: "b",
                        data: {
                            b: "2"
                        }
                    }});

                setupChangeAction("parent.child");
                expect(callback).toHaveBeenCalledWith("parent.child", {}, {a: "1", b: "2"});
            });

            it("should not inherit child data", function() {
                setupNoSpies({
                    parent: {
                        path: "a",
                        data: {
                            a: "1"
                        }
                    },
                    "parent.child": {
                        path: "b",
                        data: {
                            b: "2"
                        }
                    }});

                setupChangeAction("parent");
                expect(callback).toHaveBeenCalledWith("parent", {}, {a: "1"});
            });

            it("should overwrite parent data", function() {
                setupNoSpies({
                    parent: {
                        path: "a",
                        data: {
                            a: "1"
                        }
                    },
                    "parent.child": {
                        path: "b",
                        data: {
                            a: "2"
                        }
                    }});

                setupChangeAction("parent.child");
                expect(callback).toHaveBeenCalledWith("parent.child", {}, {a: "2"});
            });

            it("should overwrite parent resolved data with custom child data", function() {
                setupNoSpies({
                    parent: {
                        path: "a",
                        data: {
                            a: "1"
                        },
                        resolve: {
                            a: function() {
                                return "2";
                            }
                        }
                    },
                    "parent.child": {
                        path: "b",
                        data: {
                            a: "3"
                        }
                    }});

                setupChangeAction("parent.child");
                expect(callback).toHaveBeenCalledWith("parent.child", {}, {a: "3"});
            });

            it("should overwrite with resolved data from child", function() {
                setupNoSpies({
                    parent: {
                        path: "a",
                        data: {
                            a: "1"
                        }
                    },
                    "parent.child": {
                        path: "b",
                        data: {
                            a: "2"
                        },
                        resolve: {
                            a: function() {
                                return "3";
                            }
                        }
                    }});

                setupChangeAction("parent.child");
                expect(callback).toHaveBeenCalledWith("parent.child", {}, {a: "3"});
            });

            it("should merge deeply nested parents", function() {
                setupNoSpies({
                    grandparent: {
                        path: "a",
                        data: {
                            a: "1"
                        }
                    },
                    "grandparent.parent": {
                        path: "b",
                        data: {
                            a: "2",
                            b: "3"
                        }
                    },
                    "grandparent.parent.child": {
                        path: "c",
                        resolve: {
                            a: "4",
                            c: "5"
                        }
                    }
                });

                setupChangeAction("grandparent.parent.child");
                expect(callback).toHaveBeenCalledWith("grandparent.parent.child", {}, {a: "4", b: "3", c: "5"});
            });
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

    describe("root", function() {
        it("should set the root on $router", function() {
            setup({}, "a");
            expect($router.setRoot).toHaveBeenCalledWith("a");
        });

        it("should set the root on $router with null", function() {
            setup({}, null);
            expect($router.setRoot).toHaveBeenCalledWith(null);
        });

        it("should set the root on $router with undefined", function() {
            setup({}, undefined);
            expect($router.setRoot).toHaveBeenCalledWith(undefined);
        });

        it("should set the root on $router with empty string", function() {
            setup({}, "");
            expect($router.setRoot).toHaveBeenCalledWith("");
        });
    });

    it("should set not found callback on $router", function() {
        var notFoundHandler = function() {};
        setup({}, "a", notFoundHandler);
        expect($router.notFound).toHaveBeenCalledWith(notFoundHandler);
    });
});