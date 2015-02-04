"use strict";

function addStateRouterService(module) {
    module.factory("$stateRouter", ["$config", "$router", "$action", "$promise", "$state", "$stateConfigCollection", "$stateTransition"],
        function($config, $router, $action, $promise, $state, $stateConfigCollection, $stateTransition) {
            var collection = $stateConfigCollection();
            var currentTransition;

            $router.setRoot($config.root);
            $router.notFound(function(path) {
                // TODO TBD with redirects
            });

            recurve.forEach($config.states, function(config, name) {
                recurve.assert(name, "state name must be set for path '{0}'", config.path);
                recurve.assert(config.path, "state path must be set for name '{0}'", name);
                // No support for RegExp objects (regex strings fine though)
                recurve.assert(recurve.isString(config.path), "state path must be a string for name '{0}'", name);

                var stateConfig = collection.add(name, config);

                $router.on(stateConfig.path, function(params) {
                    cancelCurrentTransition();

                    var prevStates = currentTransition.getStates();
                    var activeStateConfigs = stateConfig.getAncestors().concat(stateConfig);
                    currentTransition = $stateTransition(activeStateConfigs, prevStates, params);

                    currentTransition.changed.on(function(states) {
                        $stateRouter.changeAction.trigger(states);
                    });
                    currentTransition.redirected.on(function(name, params, historyState, options) {
                        cancelCurrentTransition();
                        $stateRouter.navigate(name, params, historyState, options);
                    });

                    currentTransition.start();
                });
            });

            function cancelCurrentTransition() {
                if (!currentTransition) {
                    return;
                }

                currentTransition.cancel();
                currentTransition.changed.off();
                currentTransition.redirected.off();
            }

            function updatePathWithParams(path, params) {
                var pathSplit = path.split("/");
                recurve.forEach(pathSplit, function(value, index) {
                    if (0 === value.indexOf(":")) {
                        value = value.slice(1);
                        if (!recurve.isUndefined(params[value])) {
                            pathSplit[index] = encodeURIComponent(params[value]);
                            delete params[value];
                        }
                    }
                });

                path =  pathSplit.join("/");
                return addQueryParamsToPath(path, params);
            }

            // TODO TBD duplicate of common.js method addParamsToUrl... don't want to expose this method publicly
            // on recurve core
            function addQueryParamsToPath(path, params) {
                if (!path || !params) {
                    return path;
                }

                var seperator = -1 < path.indexOf("?") ? "&" : "?";

                for (var key in params) {
                    var value = params[key];

                    if (recurve.isObject(value)) {
                        if (recurve.isDate(value)) {
                            value = value.toISOString();
                        }
                        else {
                            value = recurve.toJson(value);
                        }
                    }

                    path += seperator +  encodeURIComponent(key) + "=" + encodeURIComponent(value);
                    seperator = "&";
                }

                return path;
            }

            var $stateRouter = {
                changeAction: $action(),

                // options:
                // reload => force reload
                // trigger => only updates url but nothing else is done
                // replace
                navigate: function(name, params, historyState, options) {
                    options = options || {};

                    var state = collection.get(name);
                    recurve.assert(state, "state '{0}' does not exist", name);

                    var path = this.nameToPath(name, params);

                    var reload;
                    if (options.reload) {
                        if ($router.currentPath() === path) {
                            reload = true;
                        }
                    }

                    $router.navigate(path, historyState, options);
                    if (reload) {
                        $router.reload();
                    }
                },

                nameToPath: function(name, params) {
                    var state = collection.get(name);
                    recurve.assert(state, "state '{0}' does not exist", name);

                    return updatePathWithParams(state.path, params);
                },

                nameToHref: function(name, params) {
                    return "/" + this.nameToPath(name, params);
                },

                // convenience methods so don't need to deal with $router directly
                back: function() {
                    $router.back();
                },

                forward: function() {
                    $router.forward();
                },

                reload: function() {
                    $router.reload();
                },

                start: function() {
                    $router.start();
                }
            };

            return $stateRouter;
        });

    module.config("$stateRouter", {
        root: "",
        states: {},
        redirects: []
    });
}