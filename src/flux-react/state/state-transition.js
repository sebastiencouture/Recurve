"use strict";

function addStateTransitionService(module) {
    module.factory("$stateTransition", ["$signal", "$async", "$state"], function($signal, $async, $state) {
        return function(stateConfigs, prevStates, params, history) {
            var states = [];
            var changed = $signal();
            var redirected = $signal();
            var canceled = false;
            var started = false;
            var triggeredChange = false;
            var currentStateIndex = 0;
            var currentState;

            function createStates() {
                states = [];
                recurve.forEach(stateConfigs, function(config) {
                    var found = recurve.find(prevStates, "config", config);
                    if (found) {
                        found.params = params;
                        found.history = history;
                        states.push(found);
                    }
                    else {
                        var parentState = states[states.length - 1];
                        states.push($state(config, parentState, params, history));
                    }
                });
            }

            function setAllUnResolvedStatesToLoading() {
                recurve.forEach(states, function(state) {
                    if (!state.resolved) {
                        state.loading = true;
                    }
                });
            }

            function transition() {
                if (canceled) {
                    return;
                }

                if (states.length - 1 < currentStateIndex) {
                    // ensure we trigger a change at least once, all states could already be resolved if there is no
                    // data to resolve
                    if (!triggeredChange) {
                        triggerChange();
                    }
                    return;
                }

                currentState = states[currentStateIndex];

                currentState.changed.on(triggerChange);
                currentState.redirected.on(triggerRedirect);

                currentState.resolve().then(function() {
                    currentState.changed.off();
                    currentState.redirected.off();
                    $async(function() {
                        transitionToChild();
                    });
                }, function() {
                    currentState.changed.off();
                    currentState.redirected.off();
                    canceled = true;
                });
            }

            function transitionToChild() {
                currentStateIndex++;
                transition();
            }

            function triggerChange() {
                if (canceled) {
                    return;
                }

                triggeredChange = true;
                changed.trigger(states);
            }

            function triggerRedirect() {
                if (canceled) {
                    return;
                }

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
                    setAllUnResolvedStatesToLoading();
                    transition();
                },

                cancel: function() {
                    canceled = true;
                    if (currentState) {
                        currentState.cancelResolve();
                    }
                },

                getStates: function() {
                    return states;
                }
            };
        };
    });
}