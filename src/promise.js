"use strict";

var Proto = require("./proto.js");
var ObjectUtils = require("./utils/object.js");
var assert = require("./assert.js");

var Promise = Proto.define([
    function ctor(resolver) {
        assert(ObjectUtils.isFunction(resolver), "Promise resolver {0} is not a function", resolver);

    },

    {
        then: function(onFulfilled, onRejected) {

        },

        catch: function(onRejected) {
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
            })

        },

        reject: function(reason) {
            return new Promise(function(resolve, reject) {
                reject(reason);
            })
        },

        all: function(iterable) {
            assert(ObjectUtils.isArray(iterable), "array must be passed to Promise.all");

            var results = [];
            var countLeft = iterable.length;

            return new Promise(function(resolve, reject) {
                if (0 === iterable.length) {
                    resolve(results);
                }

                function resolvedWithValue(index, value) {
                    results[index] = value;
                    countLeft--;

                    if (0 === countLeft) {
                        resolve(results);
                    }
                }

                function resolved(index) {
                    return function(value) {
                        resolvedWithValue(index, value)
                    }
                }

                ObjectUtils.forEach(iterable, function(value, index) {
                    if (isThenable(value)) {
                        value.then(resolved(index), reject);
                    }
                    else {
                        resolvedWithValue(index, value);
                    }
                });
            })
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
    return obj && ObjectUtils.isFunction(obj.then);
}

module.exports = Promise;