"use strict";

function addStateService(module) {
    module.factory("$state", ["$async", "$promise", "$signal"], function($async, $promise, $signal) {
        return function(config, parent, params, history) {
            var resolver = config.resolver;
            var canceled = false;
            var data = {};

            function updateDataBeforeResolve() {
                if (parent) {
                    recurve.extend(state.data, parent.data);
                }
                recurve.extend(state.data, resolver.data);
            }

            function beforeResolve() {
                beforeAfterResolve(resolver.beforeResolve);
            }

            function afterResolve() {
                beforeAfterResolve(resolver.afterResolve);
            }

            function beforeAfterResolve(method) {
                if (!recurve.isFunction(method)) {
                    return;
                }

                method(function() {
                    canceled = true;
                    state.redirected.trigger.apply(state.redirected, arguments);
                }, state);
            }

            function resolveData() {
                var promises = [];
                var error;

                recurve.forEach(resolver.resolve, function(factory, key) {
                    if (recurve.isFunction(factory)) {
                        var value;
                        try {
                            value = factory(params, data);
                        }
                        catch (e) {
                            error = e;
                            return false;
                        }

                        if (value && recurve.isFunction(value.then)) {
                            value.then(function(result) {
                                data[key] = result;
                            });

                            promises.push(value);
                        }
                        else {
                            data[key] = value;
                        }
                    }
                    else {
                        data[key] = factory;
                    }
                });

                var promise;
                if (error) {
                    promise = $promise.reject(error);
                }
                else {
                    promise = $promise.all(promises);
                }

                return promise;
            }

            function anyDataToResolve() {
                return !recurve.isUndefined(resolver.resolve)
            }

            function triggerChangeIfNeeded() {
                if (!resolver.shouldTriggerChangeAction || resolver.shouldTriggerChangeAction(state)) {
                    state.changed.trigger();
                }
            }

            function createPathWithParams(path, params) {
                var pathWithParams = path;
                recurve.forEach(params, function(value, key) {
                    pathWithParams = pathWithParams.replace(":" + key, value)
                });

                return pathWithParams;
            }

            var state = {
                name: config.name,
                config: config,
                params: params,
                history: history,
                data: data,
                loading: false,
                resolved: false,
                error: null,
                components: resolver.components,

                changed: $signal(),
                redirected: $signal(),

                resolve: function() {
                    canceled = false;
                    updateDataBeforeResolve();

                    if (state.resolved || !anyDataToResolve()) {
                        state.resolved = true;
                        state.loading = false;
                        return $promise.resolve();
                    }

                    beforeResolve();
                    if (canceled) {
                        return $promise.reject();
                    }
                    else {
                        state.loading = true;
                        triggerChangeIfNeeded();
                    }

                    var deferred = $promise.defer();
                    resolveData().then(successHandler, errorHandler);

                    function successHandler() {
                        $async(function() {
                            if (canceled) {
                                deferred.reject();
                            }
                            else {
                                state.resolved = true;
                                state.loading = false;

                                afterResolve();
                                if (canceled) {
                                    deferred.reject();
                                }
                                else {
                                    triggerChangeIfNeeded();
                                    deferred.resolve();
                                }
                            }
                        }, 0);
                    }

                    function errorHandler(error) {
                        $async(function() {
                            if (!canceled) {
                                state.error = error;
                                state.loading = false;

                                afterResolve();
                                if (!canceled) {
                                    triggerChangeIfNeeded();
                                }
                            }
                            deferred.reject(error);
                        }, 0);
                    }

                    return deferred.promise;
                },

                cancelResolve: function() {
                    canceled = true;
                },

                isSame: function(config, params) {
                    if (config !== this.config) {
                        return false;
                    }

                    var prevPathWithParams = createPathWithParams(this.config.path, this.params);
                    var newPathWithParams = createPathWithParams(config.path, params);

                    return prevPathWithParams === newPathWithParams;
                }
            };

            return state;
        };
    });
}