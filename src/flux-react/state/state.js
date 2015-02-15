"use strict";

function addStateService(module) {
    module.factory("$state", ["$promise"], function($promise) {
        return function(config, parent, params) {
            var resolver = config.resolver;
            var data = {};

            function beforeAfterResolve(method, onRedirect) {
                if (!recurve.isFunction(method)) {
                    return;
                }

                method(onRedirect);
            }

            return {
                name: config.name,
                config: config,
                params: params,
                data: data,
                loading: false,
                resolved: recurve.isUndefined(resolver.resolve),
                error: null,
                components: resolver.components,

                beforeResolve: function(onRedirect) {
                    beforeAfterResolve(resolver.beforeResolve, onRedirect);
                },

                resolve: function() {
                    var promises = [];
                    var error;

                    if (parent) {
                        recurve.extend(data, parent.data);
                    }
                    recurve.extend(data, resolver.data);

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
                },

                afterResolve: function(onRedirect) {
                    beforeAfterResolve(resolver.afterResolve, onRedirect);
                },

                shouldShowLoading: function() {
                    return !resolver.shouldShowLoading || resolver.shouldShowLoading();
                }
            };
        };
    });
}