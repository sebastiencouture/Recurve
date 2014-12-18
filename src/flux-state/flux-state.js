(function() {
    "use strict";

    recurve.flux.state = {};
    var module = recurve.flux.state.$module = recurve.module();

    // TODO TBD state date store => might be too app dependent?
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

        recurve.forEach($config.states, function(stateConfig) {
            recurve.assert(stateConfig.name, "state name must be set", stateConfig);
            recurve.assert(stateConfig.path, "state path must be set", stateConfig);

            validateParent(stateConfig.name);

            var path = sanitizePath(stateConfig.path);
            var parentState = getParent(stateConfig.name);
            if (parentState) {
                path = sanitizePath(parentState.path) + "/" + sanitizePath(stateConfig.path);
            }

            add(stateConfig.name, path);

            $router.on(path, function(params) {
                $state.startChangeAction.trigger(stateConfig.name, params);
                resolve(stateConfig, params);
            });
        });

        // TODO TBD duplicate of method in $router
        function sanitizePath(path) {
            return recurve.isString(path) ? path.replace(/^[#\/]|\s+$/g, "") : path;
        }

        function resolve(stateConfig, routeParams) {
            var data = recurve.extend({}, stateConfig.data);
            var name = stateConfig.name;

            if (recurve.isObject(stateConfig.resolve)) {
                var promises = [];

                recurve.forEach(stateConfig.resolve, function(factory, key) {
                    if (recurve.isFunction(factory)) {
                        var value;
                        try {
                            value = factory();
                        }
                        catch (error) {
                            $state.errorAction.trigger(name, error, routeParams, data);
                            return false;
                        }

                        if (value && recurve.isFunction(value.then)) {
                            value.then(function(result) {
                                data[key] = result;
                            });

                            promises.push(value);
                        }
                        else {
                            data[key] = value;
                        }
                    }
                    else {
                        data[key] = factory;
                    }
                });

                $promise.all(promises).then(function() {
                    $state.changeAction.trigger(name, routeParams, data);
                }, function(error) {
                    $state.errorAction.trigger(name, error, routeParams, data);
                });
            }
            else {
                $state.changeAction.trigger(name, routeParams, data);
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
            var lastIndex = childName.indexOf(".");
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

        function add(name, path) {
            var newState = {name: name, path: path};
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
            var urlSplit = path.split("/");
            recurve.forEach(urlSplit, function(value, index) {
                if (0 === value.indexOf(":")) {
                    value = value.slice(1);
                    if (!recurve.isUndefined(parameters[value])) {
                        urlSplit[index] = encodeURIComponent(parameters[value]);
                    }
                }
            });

            return urlSplit.join("/");
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
                recurve.assert(name, "'{0}' state does not exist", name);

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