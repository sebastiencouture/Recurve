"use strict";

describe("$state", function() {
    var $async;
    var $promise;
    var $state;
    var $stateConfig;

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.react.$module);

        $invoke(["$async", "$promise", "$state", "$stateConfig"],
            function(asyncService, promiseService, stateService, stateConfigService) {
            $async = asyncService;
            $promise = promiseService;
            $state = stateService;
            $stateConfig = stateConfigService;
        });
    });

    it("should be invokable", function() {
        expect($state).toBeDefined();
        expect(isFunction($state)).toEqual(true);
    });

    describe("beforeResolve/afterResolve", function() {
        function test(method) {
            function beforeAfterResolve(redirect) {
                redirect("b", "c", "d", "e");
            }

            var resolver = {path: "a"};
            resolver[method] = beforeAfterResolve;
            var config = $stateConfig("a", {path: "a", resolver: resolver});
            var state = $state(config);

            var redirectSpy = jasmine.createSpy("redirectSpy");
            state[method](redirectSpy);
            expect(redirectSpy).toHaveBeenCalledWith("b", "c", "d", "e");
        }

        it("should call beforeResolve onRedirect callback if invoked", function() {
            test("beforeResolve");
        });

        it("should call afterResolve onRedirect callback if invoked", function() {
            test("afterResolve");
        });
    });

    describe("resolve", function() {
        var state;
        var callback;

        function setup(resolver, parent, params, onSuccess, onError) {
            var config = $stateConfig("a", {path: "a", resolver: resolver});
            state = $state(config, parent, params);
            state.resolve().then(onSuccess, onError);
            $async.flush();
        }

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

        beforeEach(function() {
            callback = jasmine.createSpy("callback");
        })

        it("should return promise", function() {
            setup({});
            expect(state.resolve().then).toBeDefined();
        });

        it("should resolve promise on completion", function() {
            setup({}, null, null, callback);
            state.resolve().then(callback);
        });

        it("should reject promise on error", function() {
            setup({
                resolve: {
                    a: function() {
                        throw new Error("!");
                    }
                }
            }, null, null, null, callback);
        });

        it("should support data to be returned by method call", function() {
            setup({
                resolve: {
                    a: function() {
                        return "b";
                    }
                }
            });

            expect(state.data).toEqual({a: "b"});
        });

        it("should support data to be returned with method call", function() {
            setup({
                resolve: {
                    a: "b"
                }
            });

            expect(state.data).toEqual({a: "b"});
        });

        it("should merge resolved data with static/custom data", function() {
            setup({
                data: {
                    a: "c"
                },
                resolve: {
                    b: function() {
                        return "d";
                    }
                }
            });

            expect(state.data).toEqual({a: "c", b: "d"});
        });

        it("should overwrite resolved data over static/custom data", function() {
            setup({
                data: {
                    a: "c"
                },
                resolve: {
                    a: function() {
                        return "d";
                    }
                }
            });

            expect(state.data).toEqual({a: "d"});
        });

        it("should support promises returned by method call", function() {
            setup({
                resolve: {
                    a: returnLater("b", 100)
                }
            });

            expect(state.data).toEqual({a: "b"});
        });

        it("should wait for all promises to resolve before completing", function() {
            setup({
                resolve: {
                    a: returnLater("d", 100),
                    b: returnLater("e", 500),
                    c: returnLater("f", 200)
                }
            });

            expect(state.data).toEqual({a: "d", b: "e", c: "f"});
        });

        it("should allow mixture of promises and static data", function() {
            setup({
                resolve: {
                    a: returnLater("d", 100),
                    b: "e",
                    c: function() {return "f";}
                }
            });

            expect(state.data).toEqual({a: "d", b: "e", c: "f"});
        });

        it("should reject promise if resolve factory method throws error", function() {
            var error = new Error("oops!");
            setup({
                resolve: {
                    a: function() {
                        throw error
                    }
                }
            }, null, null, null, callback);

            expect(callback).toHaveBeenCalledWith(error);
        });

        it("should reject promise if resolve promise rejects", function() {
            setup({
                resolve: {
                    a: rejectLater("b", 100)
                }
            }, null, null, null, callback);

            expect(callback).toHaveBeenCalledWith("b");
        });

        it("should pass in route params to resolve methods", function() {
            // not using spy since it seems to be async? its returning the data with
            // the child resolved value?
            setup({
                resolve: {
                    a: function(params) {
                        expect(params).toEqual({id: "b"});
                    }
                }
            }, null, {id: "b"});
        });

        describe("parent data", function() {
            function setupWithParent(parentResolver, childResolver) {
                var parentConfig = $stateConfig("parent", {path: "a", resolver: parentResolver});
                var parent = $state(parentConfig);

                var stateConfig = $stateConfig("parent.child", {path: "b", resolver: childResolver});
                state = $state(stateConfig, parent);

                parent.resolve();
                $async.flush();
                state.resolve();
                $async.flush();
            }

            it("should pass in resolve parent data to child resolve methods", function() {
                // not using spy on resolver since it seems to be async? its returning the data with
                // the child resolved value?
                setupWithParent({
                    resolve: {
                        a: returnLater("b", 100)
                    }
                }, {
                    resolve: {
                        b: function(params, data) {
                            expect(data).toEqual({a: "b"});
                        }
                    }
                });
            });

            it("should inherit parent resolved data", function() {
                // not using spy on resolver since it seems to be async? its returning the data with
                // the child resolved value?
                setupWithParent({
                    resolve: {
                        a: returnLater("c", 100)
                    }
                }, {
                    resolve: {
                        b: function(params, data) {
                            return data.a + "d";
                        }
                    }
                });

                expect(state.data).toEqual({a: "c", b: "cd"});
            });

            it("should overwrite parent resolved data", function() {
                // not using spy on resolver since it seems to be async? its returning the data with
                // the child resolved value?
                setupWithParent({
                    resolve: {
                        a: returnLater("c", 100),
                        b: returnLater("d", 500)
                    }
                }, {
                    resolve: {
                        a: function(params, data) {
                            return data.a + data.b + "e";
                        }
                    }
                });

                expect(state.data).toEqual({a: "cde", b: "d"});
            });
        });
    });

    describe("config static/custom data", function() {
        var parent;
        var child;
        var callback;

        beforeEach(function() {
            callback = jasmine.createSpy("callback");
            var parentConfig = $stateConfig("a", {path: "a", resolver: {data: {test: 1, other: 2, dontCall: callback}}});
            parent = $state(parentConfig);

            var childConfig = $stateConfig("b", {path: "b", parent: parent, resolver: {data: {something: 2, other: 3}}});
            child = $state(childConfig, parent);

            parent.resolve();
            child.resolve();
            $async.flush();
        });

        it("should inherit and overwrite parent data", function() {
            expect(child.data).toEqual({test: 1, something: 2, other: 3, dontCall: callback});
        });

        it("should not alter parent data object", function() {
            expect(parent.data).toEqual({test: 1, other: 2, dontCall: callback});
        });

        it("should not invoke methods", function() {
            expect(callback).not.toHaveBeenCalled();
        });
    });
});