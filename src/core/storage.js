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

        // If not supported then just use a cache, this will only occur in private browsing mode
        // for the supported browsers
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
                var value;
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
                if (expires && (isNumber(expires) || isDate(expires))) {
                    if (isNumber(expires)) {
                        expires = addDaysFromNow(expires);
                    }

                    this.set(key, {value: value, expires: expires.getTime()});
                    return;
                }

                if (provider) {
                    var serialized = serialize(value);
                    provider.setItem(key, serialized);
                }

                if (cache) {
                    cache.set(key, value);
                }
            },

            remove: function(key) {
                var exists = this.exists(key);

                if (cache) {
                    cache.remove(key);
                }

                if (provider) {
                    provider.removeItem(key);
                }

                return exists;
            },

            exists: function(key) {
                // we don't call get(..) to avoid infinite loop: get -> remove -> exists

                var value;
                if (cache) {
                    value = cache.get(key);
                }

                if (!value && provider) {
                    value = provider.getItem(key);
                    value = parse(value);
                }

                if (value) {
                    if (withExpiration(value)) {
                        if (value.expires < Date.now()) {
                            value = null;
                        }
                    }
                }

                return !!value;
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
                    // need to handle expiration
                    cache.forEach(callIfExists, this);
                }
                else if (provider) {
                    for (var key in provider) {
                        callIfExists.call(this, key);
                    }
                }
                else {
                    assert(false, "cache or storage provider should exist");
                }

                function callIfExists(key) {
                    if (this.exists(key)) {
                        var value = this.get(key);
                        iterator.call(context, value, key);
                    }
                }
            }
        };
    }

    module.factory("$localStorage", ["$window", "$config", "$cache", "$log"], function($window, config, $cache, $log) {
        config.cacheName = "localStorage";
        return storage($window.localStorage, config, $cache, $log);
    });

    module.config("$localStorage", {
        cache: false,
        cacheName: "$localStorage",
        cacheCountLimit: 0
    });

    module.factory("$sessionStorage", ["$window", "$config", "$cache", "$log"], function($window, config, $cache, $log) {
        config.cacheName = "sessionStorage";
        return storage($window.sessionStorage, config, $cache, $log);
    });

    module.config("$sessionStorage", {
        cache: false,
        cacheName: "$sessionStorage",
        cacheCountLimit: 0
    });
}