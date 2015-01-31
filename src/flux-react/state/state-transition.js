"use strict";

function addStateTransitionService(module) {
    module.factory("$stateTransition", ["$signal", "$state"], function($signal, $state) {
        return function(stateConfigs, prevStates, params) {
            var states = [];
            var changed = $signal();
            var redirected = $signal();
            var canceled = false;
            var started = false;
            var transitionStateIndex = 0;

            function createStates() {
                states = [];
                recurve.forEach(stateConfigs, function(config) {
                    var found = recurve.find(prevStates, "config", config);
                    if (found) {
                        states.push(found);
                    }
                    else {
                        var parentState = states[states.length - 1];
                        states.push($state(config, parentState, params));
                    }
                });
            }

            function transition() {
                if (canceled || states.length < transitionStateIndex) {
                    return;
                }

                var state = states[transitionStateIndex];
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
                }, errorHandler);

                function errorHandler(error) {
                    if (!canceled) {
                        state.error = error;
                        triggerChange();
                    }
                }
            }

            function transitionToChild() {
                transitionStateIndex++;
                transition();
            }

            function triggerChange() {
                changed.trigger(states);
            }

            function triggerRedirect(options) {
                canceled = true;
                redirected.trigger(options);
            }

            return {
                changed: changed,
                redirected: redirected,

                start: function() {
                    recurve.assert(!started, "state transition can only be started once");

                    started = true;
                    createStates();
                    transition();
                    triggerChange();
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