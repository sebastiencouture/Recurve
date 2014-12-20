(function() {
    "use strict";

    recurve.flux.state = {};
    var module = recurve.flux.state.$module = recurve.module();

    // state date store => too app dependent to include but in general:
    // current
    // previous
    // error
    // startChange
    //
    // action startChange => update startChange, clear error
    // action change => clear startChange + error, update current + previous
    // action error => clear startChange, update error

    module.factory("$state", ["$router", "$action", "$promise", "$config"],
        function($router, $action, $promise, $config) {
        var states = [];

        $router.setRoot($config.rootPath);

        recurve.forEach($config.states, function(state) {
            var name = Object.keys(state)[0];
            var config = state[name];

            recurve.assert(name, "state name must be set for path '{0}'", config.path);
            recurve.assert(config.path, "state path must be set for name '{0}'", name);

            validateParent(name);

            var path = removeLeadingTrailingSlashes(config.path);
            var parent = getParent(name);
            if (parent) {
                path = removeLeadingTrailingSlashes(parent.path) + "/" +
                    removeLeadingTrailingSlashes(config.path);
            }

            add(name, path, config);

            $router.on(path, function(routeParams) {
                $state.startChangeAction.trigger(name, routeParams);
                resolve(name, routeParams);
            });
        });

        // TODO TBD duplicate of method in $rest
        function removeLeadingTrailingSlashes(path) {
            if (!path) {
                return path;
            }

            return path.replace(/^\/+|\/+$/g, "");
        }

        function resolve(name, routeParams) {
            var state = get(name);
            var parent = getParent(name);

            var mergedData = {};
            if (parent) {
                recurve.extend(mergedData, parent.data);
            }
            recurve.extend(mergedData, state.data);

            var mergedResolve = {};
            if (parent) {
                recurve.extend(mergedResolve, parent.resolve);
            }
            recurve.extend(mergedResolve, state.resolve);

            var promises = [];
            var errored;

            recurve.forEach(mergedResolve, function(factory, key) {
                if (recurve.isFunction(factory)) {
                    var value;
                    try {
                        value = factory();
                    }
                    catch (error) {
                        errored = true;
                        $state.errorAction.trigger(error, name, routeParams, mergedData);
                        return false;
                    }

                    if (value && recurve.isFunction(value.then)) {
                        value.then(function(result) {
                            mergedData[key] = result;
                        });

                        promises.push(value);
                    }
                    else {
                        mergedData[key] = value;
                    }
                }
                else {
                    mergedData[key] = factory;
                }
            });

            if (!errored) {
                $promise.all(promises).then(function() {
                    $state.changeAction.trigger(name, routeParams, mergedData);
                }, function(error) {
                    $state.errorAction.trigger(error, name, routeParams, mergedData);
                });
            }
        }

        function get(name) {
            var foundState = null;
            recurve.forEach(states, function(state) {
                if (name === state.name) {
                    foundState = state;
                    return false;
                }
            });

            return foundState;
        }

        function getParent(childName) {
            var lastIndex = childName.lastIndexOf(".");
            if (-1 === lastIndex) {
                return null;
            }

            var parentName = childName.slice(0, lastIndex);
            return get(parentName);
        }

        function hasParent(childName) {
            return -1 < childName.indexOf(".");
        }

        function validateParent(childName) {
            if (!hasParent(childName)) {
                return;
            }

            recurve.assert(getParent(childName), "no parent exists for state '{0}'", childName);
        }

        function add(name, path, config) {
            var newState = {path: path, name: name, data: config.data, resolve: config.resolve};
            var updated = false;

            recurve.forEach(states, function(state, index) {
                if (name === state.name) {
                    states[index] = newState;
                    updated = true;
                    return false;
                }
            });

            if (!updated) {
                states.push(newState);
            }
        }

        function updatePathWithParameters(path, parameters) {
            var pathSplit = path.split("/");
            recurve.forEach(pathSplit, function(value, index) {
                if (0 === value.indexOf(":")) {
                    value = value.slice(1);
                    if (!recurve.isUndefined(parameters[value])) {
                        pathSplit[index] = encodeURIComponent(parameters[value]);
                        delete parameters[value];
                    }
                }
            });

            path =  pathSplit.join("/");
            return addQueryParametersToPath(path, parameters);
        }

        // TODO TBD duplicate of common.js method addParametersToUrl
        function addQueryParametersToPath(path, parameters) {
            if (!path || !parameters) {
                return path;
            }

            var seperator = -1 < path.indexOf("?") ? "&" : "?";

            for (var key in parameters) {
                var value = parameters[key];

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

        var $state = {
            startChangeAction: $action(),
            changeAction: $action(),
            errorAction: $action(),

            // options:
            // reload => force reload
            // trigger => only updates url but nothing else is done
            // replace
            navigate: function(name, parameters, historyState, options) {
                options = options || {};

                var state = get(name);
                recurve.assert(state, "state '{0}' does not exist", name);

                var path = $state.nameToPath(name, parameters);

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

            nameToPath: function(name, parameters) {
                var state = get(name);
                var path = null;
                if (state) {
                    path = updatePathWithParameters(state.path, parameters);
                }

                return path;
            },

            // convenience methods
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

        return $state;
    });

    module.config("$state", {
        rootPath: "",
        states: []
    });
})();