"use strict";

describe("$stateTransition", function() {
    var $async;
    var $stateConfig;
    var $state;
    var $stateTransition;

    var parentConfig;
    var childConfig;
    var stateTransition;

    function setupParent(beforeResolve, afterResolve, resolve) {
        parentConfig = $stateConfig("parent", {path: "a", resolver: {
            beforeResolve: beforeResolve,
            afterResolve: afterResolve,
            resolve: {
                a: resolve
            }
        }});
    }

    function setupChild(beforeResolve, afterResolve, resolve) {
        childConfig = $stateConfig("parent.child", {path: "b", parent: parentConfig, resolver: {
            beforeResolve: beforeResolve,
            afterResolve: afterResolve,
            resolve: {
                a: resolve
            }
        }});
    }

    function transition(configs, prevStates, params, onChanged, onRedirected) {
        stateTransition = $stateTransition(configs, prevStates, params);
        if (onChanged) {
            stateTransition.changed.on(onChanged);
        }
        if (onRedirected) {
            stateTransition.redirected.on(onRedirected);
        }

        stateTransition.start();
        $async.flush();
    }

    function clearTransition() {
        if (!stateTransition) {
            return;
        }

        stateTransition.cancel();
        stateTransition.changed.off();
        stateTransition.redirected.off();
    }

    function getParentState() {
        return stateTransition.getStates()[0];
    }

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.react.$module);

        $invoke(["$async", "$stateConfig", "$state", "$stateTransition"],
            function(asyncService, stateConfigService, stateService, stateTransitionService) {
            $async = asyncService;
            $stateConfig = stateConfigService;
            $state = stateService;
            $stateTransition = stateTransitionService;
        });
    });

    afterEach(function() {
        clearTransition();
    });

    it("should be invokable", function() {
        expect($stateTransition).toBeDefined();
        expect(isFunction($stateTransition)).toEqual(true);
    });

    describe("start", function() {
        describe("config", function() {
            var stateConfigs;
            var prevStates;
            var states;
            var routeParams = {id: 1};

            function addStateConfig(name, createPrevState) {
                var stateConfig = $stateConfig(name, {path: name, resolver: {}});
                stateConfigs.push(stateConfig);

                if (createPrevState) {
                    var state = $state(stateConfig);
                    prevStates.push(state);
                }
            }

            beforeEach(function() {
                prevStates = [];
                stateConfigs = [];

                addStateConfig("a", true);
                addStateConfig("b", true);
                addStateConfig("c");

                var transition = $stateTransition(stateConfigs, prevStates, routeParams);
                transition.start();
                states = transition.getStates();
            });

            it("should maintain the same state order as the passed in state configs", function() {
                expect(states[0].config).toBe(stateConfigs[0]);
                expect(states[1].config).toBe(stateConfigs[1]);
                expect(states[2].config).toBe(stateConfigs[2]);
            });

            it("should not re-create states for configs that exist in the set of previous states", function() {
                expect(states[0]).toBe(prevStates[0]);
                expect(states[1]).toBe(prevStates[1]);
            });

            it("should set the route params on new states", function() {
                expect(states[2].params).toBe(routeParams);
            });

            it("should update the route params on previous states", function() {
                expect(states[0].params).toBe(routeParams);
                expect(states[1].params).toBe(routeParams);
            })
        });

        it("should call beforeResolve before resolving", function() {
            var beforeResolve = jasmine.createSpy();
            var called = false;
            setupParent(beforeResolve, null, function() {
                called = true;
                expect(beforeResolve).toHaveBeenCalled();
            });

            transition([parentConfig]);
            expect(called).toEqual(true);
        });

        it("should error if beforeResolve throws an error", function() {
            var error = new Error("oops!");
            setupParent(function() {
                throw error;
            });
            transition([parentConfig]);

            expect(getParentState().error).toBe(error);
            expect(getParentState().loading).toEqual(false);
        });

        it("should stop transition if beforeResolve redirects", function() {
            function beforeResolve(redirect) {
                redirect("b");
            }
            var resolve = jasmine.createSpy("resolve");
            var afterResolve = jasmine.createSpy("afterResolve");
            setupParent(beforeResolve, afterResolve, resolve);
            transition([parentConfig]);

            expect(resolve).not.toHaveBeenCalled();
            expect(afterResolve).not.toHaveBeenCalled();
        });

        it("should error if resolve throws an error", function() {
            var error = new Error("oops!");
            setupParent(null, null, function() {
                throw error;
            });
            transition([parentConfig]);

            expect(getParentState().error).toBe(error);
            expect(getParentState().loading).toEqual(false);
        });

        it("should call afterResolve after resolving", function() {
            var resolve = jasmine.createSpy();
            var called = false;
            setupParent(null, function() {
                called = true;
                expect(resolve).toHaveBeenCalled();
            }, resolve);

            transition([parentConfig]);

            expect(called).toEqual(true);
        });

        it("should error if afterResolve throws an error", function() {
            var error = new Error("oops!");
            setupParent(null, function() {
                throw error;
            });
            transition([parentConfig]);

            expect(getParentState().error).toBe(error);
            expect(getParentState().loading).toEqual(false);
        });

        // TODO TBD not sure if should or shouldn't set to resolved?
        it("should not alter the state if afterResolve redirects", function() {
            setupParent(null, function(redirect) {
                redirect("c");
            }, null);

            transition([parentConfig]);

            var state = getParentState();
            expect(state.resolved).toEqual(false);
            expect(state.loading).toEqual(true);
            expect(state.error).toEqual(null);
        });

        it("should not resolve anymore states if afterResolve redirects", function() {
            setupParent(null, function(redirect) {
                redirect("c");
            }, null);

            var callback = jasmine.createSpy("callback");
            setupChild(callback, callback, callback);

            transition([parentConfig, childConfig]);

            expect(callback).not.toHaveBeenCalled();
        });

        it("should set the state to resolved after resolving", function() {
            setupParent();
            transition([parentConfig]);

            expect(getParentState().resolved).toEqual(true);
        });

        it("should start resolving the next state after resolving the previous", function() {
            setupParent();

            var called = false;
            setupChild(function() {
                called = true;
                expect(getParentState().resolved).toEqual(true);
            });

            transition([parentConfig, childConfig]);

            expect(called).toEqual(true);
        });

        it("should not attempt to resolve anymore states if one errors", function() {
            var error = new Error("oops!");
            setupParent(null, function() {
                throw error;
            });

            var callback = jasmine.createSpy("callback");
            setupChild(callback, callback, callback);

            transition([parentConfig, childConfig]);

            expect(callback).not.toHaveBeenCalled();
        });

        it("should throw an error if already started", function() {
            setupParent();
            transition([parentConfig]);

            expect(function() {
                stateTransition.start();
            }).toThrowError("state transition can only be started once");
        });

        describe("previous states", function() {
            it("should not attempt to resolve a state that is already resolved", function() {
                var callback = jasmine.createSpy("callback");
                setupParent(null, null, callback);
                transition([parentConfig]);

                var prevStates = stateTransition.getStates();

                clearTransition();
                callback.calls.reset();

                setupChild();
                transition([parentConfig, childConfig], prevStates);

                expect(callback).not.toHaveBeenCalled();
            });

            it("should resolve a state that was not resolved in the previous state set", function() {
                var callback = jasmine.createSpy("callback");
                var throwError = true;
                setupParent(function() {
                    if (throwError) {
                        throwError = false;
                        throw new Error("ooops!");
                    }
                    throwError = false;
                }, null, callback);
                transition([parentConfig]);

                var prevStates = stateTransition.getStates();
                clearTransition();
                callback.calls.reset();

                setupChild();
                transition([parentConfig, childConfig], prevStates);

                expect(callback).toHaveBeenCalled();
            });

            it("should not call beforeResolve for a state that is already resolved", function() {
                var callback = jasmine.createSpy("callback");
                setupParent(callback);
                transition([parentConfig]);

                var prevStates = stateTransition.getStates();

                clearTransition();
                callback.calls.reset();

                setupChild();
                transition([parentConfig, childConfig], prevStates);

                expect(callback).not.toHaveBeenCalled();
            });

            it("should not call afterResolve for a state that is already resolved", function() {
                var callback = jasmine.createSpy("callback");
                setupParent(null, callback);
                transition([parentConfig]);

                var prevStates = stateTransition.getStates();

                clearTransition();
                callback.calls.reset();

                setupChild();
                transition([parentConfig, childConfig], prevStates);

                expect(callback).not.toHaveBeenCalled();
            });
        });
    });

    describe("cancel", function() {
        var callback;

        beforeEach(function() {
            callback = jasmine.createSpy("callback");
        });

        it("should stop transition if canceled while resolving", function() {
            setupParent(null, null, function() {
                stateTransition.cancel();
            });

            transition([parentConfig], null, null, callback);

            expect(getParentState().resolved).toEqual(false);
            expect(getParentState().loading).toEqual(true);
            expect(callback.calls.count()).toEqual(1);
        });

        it("should not transition if called before start", function() {
            setupParent();

            stateTransition = $stateTransition([parentConfig]);
            stateTransition.changed.on(callback);

            stateTransition.cancel();
            stateTransition.start();
            $async.flush();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should not throw an error if called multiple times", function() {
            setupParent();

            stateTransition = $stateTransition([parentConfig]);
            stateTransition.cancel();
            stateTransition.cancel();
        });
    });

    describe("changed", function() {
        var callback;

        beforeEach(function() {
            callback = jasmine.createSpy("callback");
        });

        it("should trigger if beforeResolve throws an error", function() {
            var error = new Error("oops!");
            setupParent(function() {
                throw new Error("oops!");
            });

            var callback = jasmine.createSpy("callback");
            transition([parentConfig], null, null, callback);

            expect(callback).toHaveBeenCalled();
        });

        it("should not trigger after redirecting during beforeResolve", function() {
            setupParent(function(redirect) {
                redirect("c");
            });

            var callback = jasmine.createSpy("callback");
            transition([parentConfig], null, null, callback);

            expect(callback).not.toHaveBeenCalled();
        });

        it("should trigger with the state set to loading before resolving", function() {
            var resolve = jasmine.createSpy("resolve");
            setupParent(null, null, resolve);

            var callCount = 0;
            transition([parentConfig], null, null, function(states) {
                callCount++;
                if (1 < callCount) {
                    return;
                }

                expect(states[0].loading).toEqual(true);
                expect(resolve).not.toHaveBeenCalled();
            });

            expect(callCount).toEqual(2);
        });

        it("should trigger if resolve throws an error", function() {
            var error = new Error("oops!");
            setupParent(null, null, function() {
                throw error;
            });
            transition([parentConfig], null, null, callback);

            expect(callback.calls.count()).toEqual(2);
        });

        it("should trigger after successfully resolving", function() {
            setupParent();

            var callback = jasmine.createSpy("callback");
            transition([parentConfig], null, null, callback);

            expect(callback.calls.count()).toEqual(2);
        });

        it("should trigger if afterResolve throws an error", function() {
            var error = new Error("oops!");
            setupParent(null, function() {
                throw error;
            }, null);
            transition([parentConfig], null, null, callback);

            expect(callback.calls.count()).toEqual(2);
        });

        it("should not trigger after redirecting during beforeResolve", function() {
            setupParent(null, function(redirect) {
                redirect("c");
            }, null);

            var callback = jasmine.createSpy("callback");
            transition([parentConfig], null, null, callback);

            expect(callback.calls.count()).toEqual(1);
        });

        it("should include the set of states as params", function() {
            setupParent();

            var callback = jasmine.createSpy("callback");
            transition([parentConfig], null, null, callback);

            expect(callback.calls.mostRecent().args[0]).toEqual(stateTransition.getStates());
        });
    });

    describe("redirected", function() {
        function testRedirect(beforeResolve, afterResolve) {
            setupParent(beforeResolve, afterResolve);

            var callback = jasmine.createSpy("callback");
            transition([parentConfig], null, null, null, callback);

            expect(callback.calls.count()).toEqual(1);
        }

        function redirectHandler(redirect) {
            redirect("name", "params", "historyState", "options");
        }

        it("should trigger on redirect within beforeResolve", function() {
            testRedirect(redirectHandler);
        });

        it("should trigger on redirect within afterResolve", function() {
            testRedirect(null, redirectHandler);
        });

        it("should include name, params, historyState, options as params", function() {
            setupParent(redirectHandler);

            var callback = jasmine.createSpy("callback");
            transition([parentConfig], null, null, null, callback);

            expect(callback.calls.mostRecent().args).toEqual(["name", "params", "historyState", "options"]);
        });
    });
})