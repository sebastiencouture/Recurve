"use strict";

var Proto = require("./proto.js");
var ObjectUtils = require("./utils/object.js");
var assert = require("./assert.js");

var Promise = Proto.define([
    function ctor(resolver) {
        assert(ObjectUtils.isFunction(resolver), "Promise resolver {0} is not a function", resolver);

        this._subscribers = [];

        function resolveHandler(value) {
            resolve(this, value);
        }

        function rejectHandler(reason) {
            reject(this, reason);
        }

        try {
            resolver(resolveHandler, rejectHandler);
        }
        catch (error) {
            rejectHandler(error);
        }
    },

    {
        // if callback returns:
        // - value then continue down the chain with the value
        // - thenable then wait for it to be fulfilled before continuing down the chain ( need to check if fulfilled/rejected already )
        // -
        then: function(onFulfilled, onRejected) {

            if (this._fulfilled || this._rejected) {

            }
            else {
                this._subscribers.push(new Subscriber(onFulfilled, onRejected));
            }

            return new Promise(function() {});
        },

        "catch": function(onRejected) {
            return this.then(null, onRejected);
        }
    },

    {
        resolve: function(value) {
            if (isThenable(value)) {
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
                    if (isThenable(value)) {
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
                    if (isThenable(value)) {
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

function isThenable(obj) {
    return ObjectUtils.isFunction(obj.then);
}

function resolve(value, promise) {

}

function reject(reason, promise) {

}

var Subscriber = Proto.define([
    function ctor() {

    },

    {

    }
]);

module.exports = Promise;