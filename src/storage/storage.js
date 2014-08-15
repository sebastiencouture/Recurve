"use strict";

var DateUtils = require("../utils/date.js");
var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
var Proto = require("../proto.js");
var Cache = require("../cache.js");
var assert = require("../assert.js");

module.exports = Proto.define([
    function ctor(storage, useCache, cache) {
        if (undefined === useCache) {
            useCache = true;
        }

        this._storage = storage;

        if (useCache) {
            if (undefined === cache) {
                cache = new Cache();
            }

            this._cache = cache;
        }

        this.supported = isSupported(this._storage);
    },

    {
        get: function(key) {
            assert(key, "key must be set");

            if (!this.supported) {
                return null;
            }

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

            if (!this.supported) {
                return;
            }

            if (undefined === value) {
                this.remove(key);
            }

            var serialized = serialize(value);
            this._storage.setItem(key, serialized);

            if (this._cache) {
                this._cache.set(key, value);
            }
        },

        remove: function(key) {
            assert(key, "key must be set");

            if (!this.supported) {
                return;
            }

            if (this._cache) {
                this._cache.remove(key);
            }

            return this._storage.removeItem(key);
        },

        clear: function() {
            if (!this.supported) {
                return;
            }

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

            if (!this.supported) {
                return;
            }

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

function isSupported(storage) {
    if (!storage) {
        return false;
    }

    // When Safari is in private browsing mode, storage will still be available
    // but it will throw an error when trying to set an item
    var key = "_recurve" + StringUtils.generateUUID();
    try {
        storage.setItem(key, "");
        storage.removeItem(key);
    }
    catch (e) {
        return false;
    }

    return true;
}