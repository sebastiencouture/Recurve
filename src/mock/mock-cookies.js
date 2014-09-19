"use strict";

function addMockCookiesService(module) {
    module.factory("$cookies", null, function() {
        var cookies = {};

        return {
            get: function(key) {
                return cookies[key];
            },

            set: function(key, value) {
                if (recurve.isUndefined(value)) {
                    value = "undefined";
                }

                cookies[key] = value;
            },

            remove: function(key) {
                if (!this.exists(key)) {
                    return false;
                }

                delete cookies[key];
                return true;
            },

            exists: function(key) {
                return cookies.hasOwnProperty(key);
            },

            forEach: function(iterator) {
                recurve.assert(iterator, "iterator must be set");
                recurve.forEach(cookies, iterator);
            },

            clear: function() {
                cookies = [];
            }
       }
    });
}