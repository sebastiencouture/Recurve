"use strict";

var Storage = require("./storage.js");

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
                var cache = useCache ? $cacheFactory.get("localStorage", cacheCountLimit) : null;
                return new Storage($window.localStorage, cache);
            }
       }
    });
};