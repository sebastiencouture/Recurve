"use strict";

var Proto = require("./proto.js");
var ObjectUtils = require("./utils/object.js");
var assert = require("./assert.js");

module.exports = function(coreModule) {
    coreModule.register("$promise", ["$window"], provider);
};

function provider($window){
    var Promise = Proto.define([
        function ctor(resolver) {
            assert(ObjectUtils.isFunction(resolver), "Promise resolver {0} is not a function", resolver);

            this._subscribers = [];
            var that = this;

            function resolveHandler(value) {
                if (that._resolved || that._rejected) {
                    return;
                }

                resolve(that, value);
            }

            function rejectHandler(reason) {
                if (that._resolved || that._rejected) {
                    return;
                }

                reject(that, reason);
            }

            async(function(){
                try {
                    resolver(resolveHandler, rejectHandler);
                }
                catch (error) {
                    rejectHandler(error);
                }
            });
        },

        {
            then: function(onFulfilled, onRejected) {
                var deferred = {};
                deferred.promise = new Promise(function(resolve, reject) {
                    deferred.resolve = resolve;
                    deferred.reject = reject;
                });

                var subscriber = new Subscriber(onFulfilled, onRejected, deferred);

                if (this._fulfilled) {
                    subscriber.fulfilled(this._value);
                }
                else if (this._rejected) {
                    subscriber.rejected(this._value);
                }
                else {
                    this._subscribers.push(subscriber);
                }

                return deferred.promise;
            },

            "catch": function(onRejected) {
                return this.then(null, onRejected);
            }
        },

        {
            resolve: function(value) {
                if (isPromiseLike(value)) {
                    return value;
                }

                return new Promise(function(resolve) {
                    resolve(value);
                });
            },

            reject: function(reason) {
                return new Promise(function(resolve, reject) {
                    reject(reason);
                });
            },

            all: function(iterable) {
                assert(ObjectUtils.isArray(iterable), "array must be passed to Promise.all");

                var results = [];
                var countLeft = iterable.length;

                return new Promise(function(resolve, reject) {
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

                    ObjectUtils.forEach(iterable, function(value, index) {
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
                assert(ObjectUtils.isArray(iterable), "array must be passed to Promise.race");

                return new Promise(function(resolve, reject) {
                    ObjectUtils.forEach(iterable, function(value) {
                        if (isPromiseLike(value)) {
                            value.then(resolve, reject);
                        }
                        else {
                            resolve(value);
                        }
                    });
                });
            }
        }
    ]);

    function isPromiseLike(obj) {
        return obj && ObjectUtils.isFunction(obj.then);
    }

    function resolve(promise, value) {
        function resolveHandler(resolvedValue) {
            promise._fulfilled = true;
            promise._value = resolvedValue;

            ObjectUtils.forEach(promise._subscribers, function(subscriber) {
                subscriber.fulfilled(resolvedValue);
            });

            promise._subscribers = null;
        }

        function rejectHandler(reason) {
            reject(promise, reason);
        }

        if (isPromiseLike(value)) {
            value.then(resolveHandler, rejectHandler);
        }
        else {
            resolveHandler(value);
        }
    }

    function reject(promise, reason) {
        promise._rejected = true;
        promise._value = reason;

        ObjectUtils.forEach(promise._subscribers, function(subscriber) {
            subscriber.rejected(reason);
        });

        promise._subscribers = null;
    }

    function async(method, context) {
        $window.setTimeout(method.bind(context || this), 0);
    }

    var Subscriber = Proto.define([
        function ctor(onFulfilled, onRejected, deferred) {
            this._onFulfilled = onFulfilled;
            this._onRejected = onRejected;
            this._deferred = deferred;
        },

        {
            fulfilled: function(value) {
                if (this._onFulfilled) {
                    invokeCallback(this._onFulfilled, value, this._deferred);
                }
                else {
                    async(function(){
                        this._deferred.resolve(value);
                    }, this);
                }
            },

            rejected: function(reason) {
                if (this._onRejected) {
                    invokeCallback(this._onRejected, reason, this._deferred);
                }
                else {
                    async(function(){
                        this._deferred.reject(reason);
                    }, this);
                }
            }
        }
    ]);

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

    return Promise;
}