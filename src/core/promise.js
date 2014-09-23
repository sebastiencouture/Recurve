"use strict";

function addPromiseService(module) {
    module.factory("$promise", ["$window"], function($window) {

        function isPromiseLike(obj) {
            return obj && isFunction(obj.then);
        }

        function async(fn) {
            $window.setTimeout(fn, 0);
        }

        function invokeCallback(callback, value, deferred) {
            async(function() {
                try {
                    var result = callback(value);
                    if (result && isPromiseLike(result)) {
                        result.then(deferred.resolve, deferred.reject);
                    }
                    else {
                        deferred.resolve(result);
                    }
                }
                catch (error) {
                    deferred.reject(error);
                }

            });
        }

        var subscriber = function(onFulfilled, onRejected, deferred) {
            return {
                fulfilled: function(value) {
                    if (onFulfilled) {
                        invokeCallback(onFulfilled, value, deferred);
                    }
                    else {
                        async(function(){
                            deferred.resolve(value);
                        });
                    }
                },

                rejected: function(reason) {
                    if (onRejected) {
                        invokeCallback(onRejected, reason, deferred);
                    }
                    else {
                        async(function(){
                            deferred.reject(reason);
                        });
                    }
                }
            }
        };

        var $promise = function(resolver) {
            assert(isFunction(resolver), "promise resolver {0} is not a function", resolver);

            var fulfilled;
            var rejected;
            var value;
            var subscribers = [];

            function resolve(resolveValue) {
                function resolveHandler(resolvedValue) {
                    fulfilled = true;
                    value = resolvedValue;

                    forEach(subscribers, function(subscriber) {
                        subscriber.fulfilled(resolvedValue);
                    });

                    subscribers = null;
                }

                function rejectHandler(reason) {
                    reject(reason);
                }

                if (isPromiseLike(resolveValue)) {
                    resolveValue.then(resolveHandler, rejectHandler);
                }
                else {
                    resolveHandler(resolveValue);
                }
            }

            function reject(reason) {
                rejected = true;
                value = reason;

                forEach(subscribers, function(subscriber) {
                    subscriber.rejected(reason);
                });

                subscribers = null;
            }

            function resolveHandler(value) {
                if (fulfilled || rejected) {
                    return;
                }

                resolve(value);
            }

            function rejectHandler(reason) {
                if (fulfilled || rejected) {
                    return;
                }

                reject(reason);
            }

            async(function(){
                try {
                    resolver(resolveHandler, rejectHandler);
                }
                catch (error) {
                    rejectHandler(error);
                }
            });

            return {
                then: function(onFulfilled, onRejected) {
                    var deferred = $promise.defer();
                    var subscribed = subscriber(onFulfilled, onRejected, deferred);

                    if (fulfilled) {
                        subscribed.fulfilled(value);
                    }
                    else if (rejected) {
                        subscribed.rejected(value);
                    }
                    else {
                        subscribers.push(subscribed);
                    }

                    return deferred.promise;
                },

                "catch": function(onRejected) {
                    return this.then(null, onRejected);
                }
            }
        };

        return extend($promise, {
            defer: function() {
                var deferred = {};
                var deferredResolve;
                var deferredReject;

                deferred.resolve = function() {
                    if (deferredResolve) {
                        deferredResolve.apply(deferred, arguments);
                    }
                    else {
                        var args = arguments;
                        async(function() {
                            deferredResolve.apply(deferred, args);
                        });
                    }
                };

                deferred.reject = function() {
                    if (deferredReject) {
                        deferredReject.apply(deferred, arguments);
                    }
                    else {
                        var args = arguments;
                        async(function() {
                            deferredReject.apply(deferred, args);
                        });
                    }
                };

                deferred.promise = $promise(function(resolve, reject) {
                    deferredResolve = resolve;
                    deferredReject = reject;

                    deferred.resolve = resolve;
                    deferred.reject = reject;
                });

                return deferred;
            },

            resolve: function(value) {
                //if (isPromiseLike(value)) {
                //    console.log("adas");
                //    return value;
                //}

                return $promise(function(resolve) {
                    resolve(value);
                });
            },

            reject: function(reason) {
                return $promise(function(resolve, reject) {
                    reject(reason);
                });
            },

            all: function(iterable) {
                if (!isArray(iterable)) {
                    return $promise.reject(new TypeError("must pass an array to all"));
                }

                var results = [];
                var countLeft = iterable.length;

                return $promise(function(resolve, reject) {
                    if (0 === iterable.length) {
                        resolve(results);
                    }

                    function resolveWithValueHandler(index, value) {
                        results[index] = value;
                        countLeft--;

                        if (0 === countLeft) {
                            resolve(results);
                        }
                    }

                    function resolveHandler(index) {
                        return function(value) {
                            resolveWithValueHandler(index, value)
                        }
                    }

                    forEach(iterable, function(value, index) {
                        if (isPromiseLike(value)) {
                            value.then(resolveHandler(index), reject);
                        }
                        else {
                            resolveWithValueHandler(index, value);
                        }
                    });
                });
            },

            race: function(iterable) {
                if (!isArray(iterable)) {
                    return $promise.reject(new TypeError("must pass an array to race"));
                }

                return $promise(function(resolve, reject) {
                    forEach(iterable, function(value) {
                        if (isPromiseLike(value)) {
                            value.then(resolve, reject);
                        }
                        else {
                            async(function() {
                                resolve(value);
                            });
                        }
                    });
                });
            }
        });
    });
}