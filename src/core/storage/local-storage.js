"use strict";

var Storage = require("./storage.js");

module.exports = function(coreModule) {
    coreModule.configurable("$localStorage", function() {
        var useCache = true;
        var cacheCountLimit;

        return {
            setUseCache: function(value) {
                useCache = value;
            },

            setCacheCountLimit: function(value) {
                cacheCountLimit = value;
            },

            $get: {
                dependencies: ["$window", "$cacheFactory"],
                provider: function($window, $cacheFactory) {
                    var cache = useCache ? $cacheFactory.get("localStorage", cacheCountLimit) : null;
                    return new Storage($window.localStorage, cache);
                }
            }
       }
    });
};