"use strict";

var Storage = require("./storage.js");

// TODO TBD maybe just move this all to storage.js ?
// can then re-use the configurable definition

module.exports = function(recurveModule) {
    recurveModule.configurable("$localStorage", function() {
        var useCache = true;
        var cacheCountLimit;

        return {
            setUseCache: function(value) {
                useCache = value;
            },

            setCacheCountLimit: function(value) {
                cacheCountLimit = value;
            },

            $dependencies: ["$window", "$cacheFactory"],

            $provider: function($window, $cacheFactory) {
                var cache = useCache ? $cacheFactory.get("sessionStorage", cacheCountLimit) : null;
                return new Storage($window.sessionStorage, cache);
            }
        }
    });
};