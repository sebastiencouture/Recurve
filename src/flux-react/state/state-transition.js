"use strict";

function addStateTransitionService(module) {
    module.factory("$stateTransition", ["$signal", "$async", "$log", "$state"], function($signal, $async, $log, $state) {
        return function(stateConfigs, prevStates, params) {
            var states = [];
            var changed = $signal();
            var redirected = $signal();
            var canceled = false;
            var started = false;
            var currentStateIndex = 0;

            function createStates() {
                states = [];
                recurve.forEach(stateConfigs, function(config) {
                    var found = recurve.find(prevStates, "config", config);
                    if (found) {
                        found.params = params;
                        states.push(found);
                    }
                    else {
                        var parentState = states[states.length - 1];
                        states.push($state(config, parentState, params));
                    }
                });
            }

            function transition() {
                if (canceled || states.length - 1 < currentStateIndex) {
                    return;
                }

                var state = states[currentStateIndex];
                if (state.resolved) {
                    transitionToChild();
                    return;
                }

                state.beforeResolve(triggerRedirect);
                if (canceled) {
                    return;
                }

                state.loading = true;
                if (state.shouldShowLoading()) {
                    triggerChange();
                }

                state.resolve().then(function() {
                    // don't want any errors that happen due triggering the change and afterResolve to get catched, only want
                    // to catch data resolve errors, everything else should throw
                    $async(function() {
                        if (canceled) {
                            return;
                        }

                        state.afterResolve(triggerRedirect);
                        if (canceled) {
                            return;
                        }

                        state.loading = false;
                        state.resolved = true;

                        triggerChange();
                        transitionToChild();
                    }, 0);
                }, errorHandler);

                function errorHandler(error) {
                    if (canceled) {
                        return;
                    }

                    $log.error("error resolving state", error, state);

                    state.loading = false;
                    state.error = error;
                    triggerChange();

                }
            }

            function transitionToChild() {
                currentStateIndex++;
                transition();
            }

            function areAllResolved() {
                var allResolved;
                recurve.forEach(states, function(state) {
                    allResolved = state.resolved;
                    if (!allResolved) {
                        return false;
                    }
                });

                return allResolved;
            }

            function triggerChange() {
                changed.trigger(states);
            }

            function triggerRedirect() {
                canceled = true;
                redirected.trigger.apply(redirected, arguments);
            }

            return {
                changed: changed,
                redirected: redirected,

                start: function() {
                    recurve.assert(!started, "state transition can only be started once");

                    if (canceled) {
                        return;
                    }

                    started = true;
                    createStates();

                    // ensure we trigger a change at least once, all states could already be resolved if there is no
                    // data to resolve
                    if (areAllResolved()) {
                        triggerChange();
                    }
                    else {
                        transition();
                    }
                },

                cancel: function() {
                    canceled = true;
                },

                getStates: function() {
                    return states;
                }
            };
        };
    });
}