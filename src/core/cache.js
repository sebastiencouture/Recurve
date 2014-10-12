"use strict";

function addCacheService(module) {
    module.factory("$cache", null, function(){
        var caches = {};

        var $cache = function(name, countLimit, totalCostLimit) {
            assert(name, "cache name must be specified");

            if (caches[name]) {
                return caches[name];
            }

            if (isUndefined(countLimit)) {
                countLimit = 0;
            }
            if (isUndefined(totalCostLimit)) {
                totalCostLimit = 0;
            }

            var cache = {};

            caches[name] = {
                get: function(key) {
                    var value = cache[key];
                    return value ? value.value : null;
                },

                set: function(key, value, cost) {
                    if (!key) {
                        return;
                    }

                    if (isUndefined(cost)) {
                        cost = 0;
                    }

                    cache[key] = {value: value, cost: cost};

                    if (countLimit || (totalCostLimit && cost)) {
                        evict();
                    }
                },

                remove: remove,

                exists: function(key) {
                    return !!cache[key];
                },

                clear: function() {
                    cache = {};
                },

                setCountLimit: function(value) {
                    countLimit = value;
                    evict();
                },

                countLimit: function() {
                    return countLimit;
                },

                setTotalCostLimit: function(value) {
                    totalCostLimit = value;
                    evict();
                },

                totalCostLimit: function() {
                    return totalCostLimit;
                },

                forEach: function(iterator, context) {
                    forEach(cache, function(value, key) {
                        iterator.call(context, value.value, key);
                    }, context);
                }
            };

            function currentTotalCost() {
                var totalCost = 0;
                forEach(cache, function(value) {
                    totalCost += value.cost;
                });

                return totalCost;
            }

            function currentCount() {
                return Object.keys(cache).length;
            }

            function evict() {
                if (!shouldEvict()) {
                    return;
                }

                evictMostCostly();
                evict();
            }

            function shouldEvict() {
                return (0 < countLimit && countLimit < currentCount()) ||
                    (0 < totalCostLimit && totalCostLimit < currentTotalCost());
            }

            function evictMostCostly() {
                var maxCost = 0;
                var maxKey = null;

                forEach(cache, function(value, key) {
                    if (!maxKey) {
                        maxKey = key;
                        maxCost = value.cost;
                    }
                    else if (maxCost < value.cost) {
                        maxKey = key;
                        maxCost = value.cost;
                    }
                    else {
                        // do nothing - continue
                    }
                });

                assert(maxKey, "a key must exist");
                remove(maxKey);
            }

            function remove(key) {
                if (!key) {
                    return;
                }

                var exists = cache.hasOwnProperty(key);
                delete cache[key];

                return exists;
            }

            return caches[name];
        };

        return extend($cache, {
            destroy: function(name) {
                if (!caches[name]) {
                    return;
                }

                caches[name].clear();
                delete caches[name];
            },

            destroyAll: function() {
                forEach(caches, function(cache) {
                    cache.clear();
                });

                caches = {};
            }
        });
    });
}