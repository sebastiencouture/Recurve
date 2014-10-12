"use strict";

function addStorageServices(module) {
    function storage(provider, config, $cache, $log) {
        function serialize(value) {
            return toJson(value);
        }

        function parse(value) {
            try {
                return fromJson(value);
            }
            catch(e) {
                return value;
            }
        }

        function isSupported() {
            if (!provider) {
                return false;
            }

            // When Safari is in private browsing mode, storage will appear to still be available
            // but it will throw an error when trying to set an item
            var key = "_recurve" + generateUUID();
            try {
                provider.setItem(key, "");
                provider.removeItem(key);
            }
            catch (e) {
                $log.warn("storage is not supported");
                return false;
            }

            return true;
        }

        // If not supported then just use a cache, this will only occur in private browsing mode
        // for supported browsers
        var cache;
        if (!isSupported()) {
            provider = null;
            cache = $cache(config.cacheName);
        }
        else {
            cache = config.cache ? $cache(config.cacheName, config.cacheCountLimit) : null;
        }

        return {
            get: function(key) {
                var value = null;
                if (cache) {
                    value = cache.get(key);
                    value = parse(value);
                }
                if (!value && provider) {
                    value = provider.getItem(key);
                    value = parse(value);

                    if (cache) {
                        cache.set(key, value);
                    }
                }

                return value;
            },

            set: function(key, value) {
                if (provider) {
                    var serialized = serialize(value);
                    provider.setItem(key, serialized);
                }
                if (cache) {
                    cache.set(key, value);
                }
            },

            remove: function(key) {
                var existed = this.exists(key);
                if (cache) {
                    cache.remove(key);
                }
                if (provider) {
                    provider.removeItem(key);
                }

                return existed;
            },

            exists: function(key) {
                var found = false;
                if (cache) {
                    found = cache.exists(key);
                }
                else if (provider) {
                    found = !!provider.getItem(key);
                }
                else {
                    assert(false, "either cache or storage provider should exist");
                }

                return found;
            },

            clear: function() {
                if (cache) {
                    cache.clear();
                }
                if (provider) {
                    provider.clear();
                }
            },

            forEach: function(iterator, context) {
                if (cache) {
                    cache.forEach(iterator, context);
                }
                else if (provider) {
                    for (var key in provider) {
                        var value = this.get(key);
                        iterator.call(context, value, key);
                    }
                }
                else {
                    assert(false, "either cache or storage provider should exist");
                }
            }
        };
    }

    module.factory("$localStorage", ["$window", "$config", "$cache", "$log"], function($window, config, $cache, $log) {
        config.cacheName = "$localStorage";
        return storage($window.localStorage, config, $cache, $log);
    });

    module.config("$localStorage", {
        cache: false,
        cacheCountLimit: 0
    });

    module.factory("$sessionStorage", ["$window", "$config", "$cache", "$log"], function($window, config, $cache, $log) {
        config.cacheName = "$sessionStorage";
        return storage($window.sessionStorage, config, $cache, $log);
    });

    module.config("$sessionStorage", {
        cache: false,
        cacheCountLimit: 0
    });
}