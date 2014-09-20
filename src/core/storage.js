"use strict";

function addStorageServices(module) {
    function storage(provider, config, $cache, $log) {
        function serialize(value) {
            return JSON.stringify(value);
        }

        function parse(value) {
            try {
                return JSON.parse(value);
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
                $log.warn("storage is not supported")
                return false;
            }

            return true;
        }

        function withExpiration(item) {
            return item && item.hasOwnProperty("expires") && item.hasOwnProperty("value");
        }

        var supported = isSupported();
        var cache = config.useCache ? $cache(config.cacheName, config.cacheCountLimit) : null;

        return {
            get: function(key) {
                if (!supported) {
                    return null;
                }

                var value;
                if (cache) {
                    value = cache.get(key);
                }

                if (!value) {
                    value = provider.getItem(key);
                    value = parse(value);

                    if (cache) {
                        cache.set(key, value);
                    }
                }

                if (withExpiration(value)) {
                    if (value.expires < Date.now()) {
                        this.remove(key);
                        value = null;
                    }
                    else {
                        value = value.value;
                    }
                }

                return value;
            },

            set: function(key, value, expires) {
                if (!supported) {
                    return;
                }

                if (expires && (isNumber(expires) || isDate(expires))) {
                    if (isNumber(expires)) {
                        expires = addDaysFromNow(expires);
                    }

                    this.set(key, {value: value, expires: expires.getTime()});
                    return;
                }

                var serialized = serialize(value);
                provider.setItem(key, serialized);

                if (cache) {
                    cache.set(key, value);
                }
            },

            remove: function(key) {
                if (!supported) {
                    return false;
                }

                if (cache) {
                    cache.remove(key);
                }

                var exists = this.exists(key);
                provider.removeItem(key);

                return exists;
            },

            exists: function(key) {
                if (!supported) {
                    return false;
                }

                return provider.getItem(key) ? true : false;
            },

            clear: function() {
                if (!supported) {
                    return;
                }

                provider.clear();

                if (cache) {
                    cache.clear();
                }
            },

            forEach: function(iterator) {
                assert(iterator, "iterator must be set");

                if (!supported) {
                    return;
                }

                for (var key in provider) {
                    var value = this.get(key);
                    iterator(value, key);
                }
            },

            isSupported: function() {
                return supported;
            }
        };
    }

    module.factory("$localStorage", ["$window", "$config", "$cache", "$log"], function($window, config, $cache, $log) {
        config.cacheName = "localStorage";
        return storage($window.localStorage, config, $cache, $log);
    });

    module.config("$localStorage", {
        useCache: false,
        cacheCountLimit: 0
    });

    module.factory("$sessionStorage", ["$window", "$config", "$cache", "$log"], function($window, config, $cache, $log) {
        config.cacheName = "sessionStorage";
        return storage($window.sessionStorage, config, $cache, $log);
    });

    module.config("$sessionStorage", {
        useCache: false,
        cacheCountLimit: 0
    });
}