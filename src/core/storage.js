"use strict";

function addStorageServices(module) {
    function storage(provider, $config, $cache) {
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

            // When Safari is in private browsing mode, storage will still be available
            // but it will throw an error when trying to set an item
            var key = "_recurve" + generateUUID();
            try {
                provider.setItem(key, "");
                provider.removeItem(key);
            }
            catch (e) {
                return false;
            }

            return true;
        }

        var supported = isSupported();
        var cache = $config.useCache ? $cache($config.cacheName, $config.cacheCountLimit) : null;

        return {
            get: function(key) {
                if (!supported) {
                    return undefined;
                }

                var value;
                if (cache) {
                    value = cache.get(key);

                    if (value) {
                        return value;
                    }
                }

                value = provider.getItem(key);
                value = parse(value);

                if (cache) {
                    cache.set(key, value);
                }

                return value;
            },

            set: function(key, value) {
                if (!supported) {
                    return;
                }

                if (undefined === value) {
                    this.remove(key);
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

                return provider.removeItem(key);
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

            getWithExpiration: function(key) {
                var item = this.get(key);
                if (!item) {
                    return item;
                }

                var elapsed = Date.now() - item.time;
                if (item.expiry < elapsed) {
                    return undefined;
                }

                return item.value;
            },

            setWithExpiration: function(key, value, expiry) {
                this.set(key, {value: value, expiry: expiry, time: Date.now()});
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
            }
        };
    }

    module.factory("$localStorage", ["$window", "$config", "$cache"], function($window, $config, $cache) {
        $config.cacheName = "localStorage";
        return storage($window.localStorage, $config, $cache);
    });

    module.config("$localStorage", {
        useCache: false,
        cacheCountLimit: 0
    });

    module.factory("$sessionStorage", ["$window", "$config", "$cache"], function($window, $config, $cache) {
        $config.cacheName = "sessionStorage";
        return storage($window.sessionStorage, $config, $cache);
    });

    module.config("$sessionStorage", {
        useCache: false,
        cacheCountLimit: 0
    });
}