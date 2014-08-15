"use strict";

var DateUtils = require("./recurve-date.js");
var ObjectUtils = require("./recurve-object.js");
var Cache = require("./recurve-cache.js");
var assert = require("./recurve-assert.js");

module.exports = Proto.define([
    function ctor(storage, useCache, cache) {
        if (undefined === useCache) {
            useCache = false;
        }

        this._storage = storage;

        if (useCache) {
            if (undefined === cache) {
                cache = new Cache();
            }

            this._cache = cache;
        }
    },

    {
        get: function(key) {
            assert(key, "key must be set");

            var value;

            if (this._cache) {
                value = this._cache.get(key);

                if (value) {
                    return value;
                }
            }

            value = this._storage.getItem(key);
            value = deSerialize(value);

            if (this._cache) {
                this._cache.set(key, value);
            }

            return value;
        },

        set: function(key, value) {
            assert(key, "key must be set");

            if (undefined === value) {
                this.remove(key);
            }

            var serialized = serialize(value);
            this._storage.setItem(serialized);

            if (this._cache) {
                this._cache.set(key, value);
            }
        },

        remove: function(key) {
            assert(key, "key must be set");

            this._storage.removeItem(key);

            if (this._cache) {
                this._cache.remove(key);
            }
        },

        clear: function() {
            this._storage.clear();

            if (this._cache) {
                this._cache.clear();
            }
        },

        getWithExpiration: function(key) {
            var item = this.get(key);
            if (!item) {
                return null;
            }

            var elapsed = DateUtils.now() - item.time;
            if (item.expiry < elapsed) {
                return null;
            }

            return item.value;
        },

        setWithExpiration: function(key, value, expiry) {
            this.set(key, {value: value, expiry: expiry, time: DateUtils.now()});
        },

        forEach: function(iterator) {
            assert(iterator, "iterator must be set");

            for (var key in this._storage) {
                var value = this.get(key);
                iterator(key, value);
            }
        },

        setCache: function(value) {
            this._cache = value;
        }
    }
]);


function serialize(value) {
    return JSON.stringify(value);
}

function deSerialize(value) {
    if (!ObjectUtils.isString(value)) {
        return undefined;
    }

    try {
        return JSON.parse(value);
    }
    catch(e) {
        return value || undefined;
    }
}