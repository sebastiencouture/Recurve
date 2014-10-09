"use strict";

function addMockStorageServices(module) {
    function storage(config, $cache) {
        function parse(value) {
            try {
                return fromJson(value);
            }
            catch(e) {
                return value;
            }
        }

        var cache = $cache(config.cacheName);

        return {
            get: function(key) {
                var value = cache.get(key);
                value = parse(value);

                return value;
            },

            set: function(key, value) {
                cache.set(key, value);
            },

            remove: function(key) {
                var existed = this.exists(key);
                cache.remove(key);

                return existed;
            },

            exists: function(key) {
                return cache.exists(key);
            },

            clear: function() {
                cache.clear();
            },

            forEach: function(iterator, context) {
                cache.forEach(iterator, context);
            }
        };
    }

    module.factory("$localStorage", ["$window", "$config", "$cache"], function($window, config, $cache) {
        config.cacheName = "$localStorage";
        return storage(config, $cache);
    });

    module.factory("$sessionStorage", ["$window", "$config", "$cache"], function($window, config, $cache) {
        config.cacheName = "$sessionStorage";
        return storage(config, $cache);
    });
}