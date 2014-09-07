"use strict";

var Proto = require("../../utils/proto.js");
var ObjectUtils = require("../../utils/object.js");
var assert = require("../../utils/assert.js");

module.exports = function(recurveModule) {
    recurveModule.value("$cache", Cache);
};

var Cache = Proto.define([
    function ctor(countLimit, totalCostLimit) {
        if (undefined === countLimit) {
            countLimit = 0;
        }
        if (undefined === totalCostLimit) {
            totalCostLimit = 0;
        }

        this._countLimit = countLimit;
        this._totalCostLimit = totalCostLimit;

        this._cache = {};
    },

    {
        get: function(key) {
            assert(key, "key must be set");

            var value = this._cache[key];

            return value ? value.value : null;
        },

        set: function(key, value, cost) {
            assert(key, "key must be set");

            if (undefined === cost) {
                cost = 0;
            }

            this._cache[key] = {value: value, cost: cost};

            if (this._countLimit || (this._totalCostLimit && cost)) {
                this._evict();
            }
        },

        remove: function(key) {
            assert(key, "key must be set");

            delete this._cache[key];
        },

        exists: function(key) {
            assert(key, "key must be set");

            return this._cache[key] ? true : false;
        },

        clear: function() {
            this._cache = {};
        },

        setCountLimit: function(value) {
            this._countLimit = value;
            this._evict();
        },

        countLimit: function() {
            return this._countLimit;
        },

        setTotalCostLimit: function(value) {
            this._totalCostLimit = value;
            this._evict();
        },

        totalCostLimit: function() {
            return this._totalCostLimit;
        },

        forEach: function(iterator) {
            assert(iterator, "iterator must be set");

            ObjectUtils.forEach(this._cache, iterator);
        },

        _currentTotalCost: function() {
            // TODO TBD should we cache total cost and current count?
            // ... any performance worries for potentially huge caches??
            var totalCost = 0;

            ObjectUtils.forEach(this._cache, function(value, key) {
                totalCost += value.cost;
            });

            return totalCost;
        },

        _currentCount: function() {
            return Object.keys(this._cache).length;
        },

        _evict: function() {
            if (!this._shouldEvict()) {
                return;
            }

            this._evictMostCostly();
            this._evict();
        },

        _shouldEvict: function() {
            return this._countLimit < this._currentCount() ||
                this._totalCostLimit < this._currentTotalCost();
        },

        _evictMostCostly: function() {
            var maxCost = 0;
            var maxKey;

            ObjectUtils.forEach(this._cache, function(value, key) {
                if (!maxKey) {
                    maxKey = key;
                }
                else if (maxCost < value.cost) {
                    maxKey = key;
                }
                else {
                    // do nothing - continue
                }
            });

            this.remove(maxKey);
        }
    },

    {
        // Smaller the cost for newer
        inverseCurrentTimeCost: function() {
            return 1 / Date.now();
        },

        // Smaller the cost for older
        currentTimeCost: function() {
            return Date.now();
        }
    }
]);
