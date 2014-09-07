"use strict";

module.exports = function(mockModule) {
    mockModule.value("$cookies", cookies);
};

var cached = {};

var cookies = {
    get: function(key) {
        recurve.assert(key, "key must be set");
        return cached[key];
    },

    set: function(key, value, options) {
        recurve.assert(key, "key must be set");
        cached[key] = value;
    },

    remove: function(key, options) {
        recurve.assert(key, "key must be set");

        if (!this.exists(key)) {
            return false;
        }

        delete cached[key];
        return true;
    },

    exists: function(key) {
        return cached.hasOwnProperty(key);
    },

    forEach: function(iterator) {
        recurve.assert(iterator, "iterator must be set");
        recurve.forEach(cached, iterator);
    }
};