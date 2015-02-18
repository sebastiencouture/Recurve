"use strict";

function addStateRouterService(module) {
    module.factory("$stateRouter", ["$config", "$router", "$action", "$stateConfigCollection", "$stateTransition"],
        function($config, $router, $action, $stateConfigCollection, $stateTransition) {
            var collection = $stateConfigCollection();
            var currentTransition;

            $router.setRoot($config.root);
            $router.notFound(function(path) {
                $stateRouter.notFoundAction.trigger(path);
            });

            setupStates();
            setupRedirects();

            function setupStates() {
                recurve.forEach($config.states, function(config, name) {
                    validateStateConfig(name, config);

                    var stateConfig = collection.add(name, config);
                    $router.on(stateConfig.path, function(params, history) {
                        transitionToState(stateConfig, params, history);
                    });
                });
            }

            function validateStateConfig(name, config) {
                recurve.assert(config, "state config must be set for name '{0}'", name);
                recurve.assert(name, "state name must be set for path '{0}'", config.path);
                recurve.assert(config.resolver, "state resolver must be set for path '{0}'", config.path);
                recurve.assert(config.resolver.components, "state resolver components must be set for path '{0}'", config.path);
            }

            function transitionToState(stateConfig, params, history) {
                cancelCurrentTransition();
                currentTransition = createTransition(stateConfig, params, history);

                currentTransition.changed.on(function(states) {
                    $stateRouter.changeAction.trigger(states);
                });
                currentTransition.redirected.on(function(name, params, historyState, options) {
                    $stateRouter.navigate(name, params, historyState, options);
                });

                currentTransition.start();
            }

            function cancelCurrentTransition() {
                if (!currentTransition) {
                    return;
                }

                currentTransition.cancel();
                currentTransition.changed.off();
                currentTransition.redirected.off();
            }

            function createTransition(stateConfig, params, history) {
                var prevStates = [];
                if (currentTransition) {
                    prevStates = currentTransition.getStates();
                }

                var activeStateConfigs = stateConfig.getAncestors().reverse().concat(stateConfig);
                return $stateTransition(activeStateConfigs, prevStates, params, history);
            }

            function setupRedirects() {
                recurve.forEach($config.redirects, function(redirect) {
                    var path = updateRedirectFromPath(redirect.from);

                    validateRedirectFrom(path);
                    validateRedirectTo(redirect.to, path);

                    $router.on(path, function(params) {
                        transitionToRedirect(redirect, params);
                    });
                });
            }

            function updateRedirectFromPath(from) {
                if (!from) {
                    from = ".*";
                }

                return from;
            }

            function validateRedirectFrom(path) {
                var state = collection.getFromPath(path);
                var stateName = state ? state.name : null;
                recurve.assert(!stateName, "state '{0}' is defined for redirect path '{1}'", stateName, path);
            }

            function validateRedirectTo(stateName, path) {
                recurve.assert(stateName, "'to' must be set for redirect path '{0}'", path);
                recurve.assert(collection.get(stateName), "state '{0}' does not exist for redirect path '{1}'",
                    stateName, path);
            }

            function transitionToRedirect(redirect, params) {
                var redirectParams = redirect.params || {};
                recurve.extend(redirectParams, params);

                $stateRouter.navigate(redirect.to, redirectParams, {replace: true});
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

                // remove any empty paths to avoid appending multiple forward slashes
                pathSplit = pathSplit.filter(function(value) {
                    return !!value;
                });
                path = pathSplit.join("/");

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
                notFoundAction: $action(),

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
        }
    );

    module.config("$stateRouter", {
        root: "",
        states: {},
        redirects: []
    });
}