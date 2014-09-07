"use strict";

module.exports = function(mockModule) {
    mockModule.constructor("$localStorage", null, Storage);
    mockModule.constructor("$sessionStorage", null, Storage);
};

var Storage = recurve.define([
    function ctor() {
        this.supported = true;
        this._cached = {};
    },

    {
        get: function(key) {
            recurve.assert(key, "key must be set");
            return this._cached[key];
        },

        set: function(key, value) {
            recurve.assert(key, "key must be set");
            this._cached[key];
        },

        remove: function(key) {
            recurve.assert(key, "key must be set");
            delete this._cached[key];
        },

        exists: function(key) {
            recurve.assert(key, "key must be set");
            return this._cached.hasOwnProperty(key);
        },

        clear: function() {
            this._cached = {};
        },

        getWithExpiration: function(key) {
            var item = this.get(key);
            if (!item) {
                return null;
            }

            var elapsed = Date.now() - item.time;
            if (item.expiry < elapsed) {
                return null;
            }

            return item.value;
        },

        setWithExpiration: function(key, value, expiry) {
            this.set(key, {value: value, expiry: expiry, time: Date.now()});
        },

        forEach: function(iterator) {
            recurve.assert(iterator, "iterator must be set");
            recurve.forEach(this._cached, iterator);
        }
    }
]);