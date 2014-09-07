"use strict";

var Proto = require("../../utils/proto.js");
var ObjectUtils = require("../../utils/object.js");
var assert = require("../../utils/assert.js");

module.exports = function(recurveModule) {
    recurveModule.constructor("$cacheFactory", ["$cache"], provider);
};

function provider($cache) {
    return Proto.define([
        function ctor() {
            this._caches = {};
        },

        {
            get: function(name, countLimit, totalCostLimit) {
                if (this._caches[name]) {
                    return this._caches[name];
                }

                this._caches[name] = new $cache(countLimit, totalCostLimit);
                return this._caches[name];
            },

            destroy: function(name) {
                if (!this._caches[name]) {
                    return;
                }

                this._caches[name].clear();
                delete this._caches[name];
            },

            destroyAll: function() {
                ObjectUtils.forEach(this._caches, function(cache) {
                    cache.clear();
                });

                this._caches = {};
            }
        }
    ]);
}
