"use strict";

var Proto = require("../../utils/proto.js");
var ObjectUtils = require("../../utils/object.js");
var assert = require("../../utils/assert.js");

module.exports = function(coreModule) {
    coreModule.register("$cacheFactory", ["$cache"], constructor, {instantiate: true});
};

function constructor($cache) {
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
            },

            destroy: function(name) {
                if (!this._caches[name]) {
                    return;
                }

                this._caches[name].clear();
                delete this._caches[name];
            },

            destroyAll: function(name) {
                ObjectUtils.forEach(this._caches, function(cache) {
                    cache.clear();
                });

                this._caches = {};
            }
        }
    ]);
}
