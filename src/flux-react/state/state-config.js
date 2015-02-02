"use strict";

function addStateConfigService(module) {
    module.factory("$stateConfig", null, function() {

        function getParentNameFromName(value) {
            var lastIndex = value.lastIndexOf(".");
            if (-1 === lastIndex) {
                return null;
            }

            return value.slice(0, lastIndex);
        }

        function hasParentFromName(value) {
            return -1 < value.indexOf(".");
        }

        function $stateConfig(name, options) {
            recurve.assert(name, "expected name to be set for state config");

            var path = options.path;
            var parent = options.parent;
            var resolver = options.resolver;

            recurve.assert(!recurve.isUndefined(path) && null !== path, "expected path to be set for state config '{0}'", name);
            recurve.assert(resolver, "expected resolver to be set for state config '{0}'", name);

            return {
                name: name,
                path: path,
                parent: parent,
                resolver: resolver,

                getAncestors: function() {
                    var ancestors = [];
                    var parent = this.parent;
                    while(parent) {
                        ancestors.push(parent);
                        parent = parent.parent;
                    }

                    return ancestors;
                }
            };
        }

        $stateConfig.getParentNameFromName = getParentNameFromName;
        $stateConfig.hasParentFromName = hasParentFromName;

        return $stateConfig;
    });
}