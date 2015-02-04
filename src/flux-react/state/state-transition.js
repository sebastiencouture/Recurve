"use strict";

function addStateTransitionService(module) {
    module.factory("$stateTransition", ["$signal", "$state"], function($signal, $state) {
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

                // TODO TBD should we handle beforeResolve/afterResolve throwing error?
                try {
                    state.beforeResolve(triggerRedirect);
                }
                catch (error) {
                    errorHandler(error);
                    return;
                }

                if (canceled) {
                    return;
                }

                state.loading = true;
                triggerChange();

                state.resolve().then(function() {
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
                }, errorHandler).then(null, errorHandler);

                function errorHandler(error) {
                    if (!canceled) {
                        state.loading = false;
                        state.error = error;
                        triggerChange();
                    }
                }
            }

            function transitionToChild() {
                currentStateIndex++;
                transition();
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
                    transition();
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