"use strict";

function addStateConfigCollectionService(module) {
    module.factory("$stateConfigCollection", ["$stateConfig"], function($stateConfig) {
        function removeLeadingTrailingSlashes(path) {
            if (!path) {
                return path;
            }

            return path.replace(/^\/+|\/+$/g, "");
        }

        return function() {
            var stateConfigs = [];

            function calculatePath(name, options) {
                var path;
                if (options.default) {
                    recurve.assert(!options.path, "path should not be set for default state config '{0}'", name);
                    path = "";
                }
                else if (options.notFound) {
                    recurve.assert(!options.path, "path should not be set for not found state config '{0}'", name);
                    path = ".*";
                }
                else {
                    path = options.path;
                }

                validatePath(path, name);

                var parent = stateConfigCollection.getParent(name);
                if (parent) {
                    path = removeLeadingTrailingSlashes(parent.path) + "/" +
                        removeLeadingTrailingSlashes(path);
                }
                else {
                    path = removeLeadingTrailingSlashes(path);
                }
                path = removeLeadingTrailingSlashes(path);

                recurve.assert(!recurve.isUndefined(path) && null !== path, "no path for state config '{0}'", name);

                return path;
            }

            function validatePath(path, name) {
                // No support for RegExp objects (regex strings fine though) since being specified as object key
                recurve.assert(!recurve.isRegExp(path), "path must be a string for state config '{0}'", name);
                recurve.assert(!recurve.isUndefined(path) && null !== path, "no path for state config '{0}'", name);
            }

            function validateParentExists(name) {
                if (!$stateConfig.hasParentFromName(name)) {
                    return;
                }

                recurve.assert(stateConfigCollection.getParent(name), "no parent exists for state config '{0}'", name);
            }

            var stateConfigCollection = {
                add: function(name, options) {
                    validateParentExists(name);

                    var path = calculatePath(name, options);
                    var parent = this.getParent(name);
                    var newConfig = $stateConfig(name, {path: path, parent: parent, resolver: options.resolver});

                    var updated = false;
                    recurve.forEach(stateConfigs, function(config, index) {
                        if (name === config.name) {
                            stateConfigs[index] = newConfig;
                            updated = true;
                            return false;
                        }
                    });

                    if (!updated) {
                        stateConfigs.push(newConfig);
                    }

                    return newConfig;
                },

                get: function(name) {
                    return recurve.find(stateConfigs, "name", name);
                },

                getParent: function(name) {
                    var parentName = $stateConfig.getParentNameFromName(name);
                    return this.get(parentName);
                },

                getFromPath: function(path) {
                    return recurve.find(stateConfigs, "path", path);
                }
            };

            return stateConfigCollection;
        };
    });
}