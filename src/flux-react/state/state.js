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

                    var deferred = $promise.defer();
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        $promise.all(promises).then(deferred.resolve, deferred.reject);
                    }

                    return deferred.promise;
                },

                afterResolve: function(onRedirect) {
                    beforeAfterResolve(resolver.afterResolve, onRedirect);
                }
            };
        };
    });
}