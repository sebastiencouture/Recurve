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
    // trigger action startChange => update startChange, clear error
    // trigger action change => clear startChange + error, update current + previous
    // trigger action error => clear startChange, update error

    module.factory("$state", ["$router", "$action", "$promise", "$config"],
        function($router, $action, $promise, $config) {
        var states = [];
        var statePrototype = {
            init: function(name, path, config) {
                this.name = name;
                this.path = path;
                this.config = config;

                return this;
            },

            resolve: function(routeParams, mergedData) {
                var parent = getParent(this.name);
                var self = this;

                if (parent) {
                    return parent.resolve(routeParams, mergedData).then(parentMergedHandler);
                }
                else {
                    return parentMergedHandler();
                }

                function parentMergedHandler() {
                    recurve.extend(mergedData, self.config.data);

                    var promises = [];
                    var error;

                    recurve.forEach(self.config.resolve, function(factory, key) {
                        if (recurve.isFunction(factory)) {
                            var value;
                            try {
                                value = factory(routeParams, mergedData);
                            }
                            catch (e) {
                                error = e;
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

                    var deferred = $promise.defer();
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        $promise.all(promises).then(deferred.resolve, deferred.reject);
                    }

                    return deferred.promise;
                }
            }
        };

        $router.setRoot($config.root);
        $router.notFound($config.notFound);

        recurve.forEach($config.states, function(config, name) {
            recurve.assert(name, "state name must be set for path '{0}'", config.path);
            recurve.assert(config.path, "state path must be set for name '{0}'", name);
            // No support for RegExp objects (regex strings fine though)
            recurve.assert(recurve.isString(config.path), "state path must be a string for name '{0}'", name);

            validateParent(name);

            var path = removeLeadingTrailingSlashes(config.path);
            var parent = getParent(name);
            if (parent) {
                path = removeLeadingTrailingSlashes(parent.path) + "/" +
                    removeLeadingTrailingSlashes(config.path);
            }

            var state = add(name, path, config);

            $router.on(path, function(routeParams) {
                $state.startChangeAction.trigger(name, routeParams);

                var mergedData = {};
                state.resolve(routeParams, mergedData).then(function() {
                    $state.changeAction.trigger(name, routeParams, mergedData);
                }, function(error) {
                    $state.errorAction.trigger(error, name, routeParams, mergedData);
                });
            });
        });

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
            var newState = Object.create(statePrototype).init(name, path, config);
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

            return newState;
        }

        function removeLeadingTrailingSlashes(path) {
            if (!path) {
                return path;
            }

            return path.replace(/^\/+|\/+$/g, "");
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

        // TODO TBD duplicate of common.js method addParamsToUrl
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

        var $state = {
            startChangeAction: $action(),
            changeAction: $action(),
            errorAction: $action(),

            // options:
            // reload => force reload
            // trigger => only updates url but nothing else is done
            // replace
            navigate: function(name, params, historyState, options) {
                options = options || {};

                var state = get(name);
                recurve.assert(state, "state '{0}' does not exist", name);

                var path = $state.nameToPath(name, params);

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
                var state = get(name);
                recurve.assert(state, "state '{0}' does not exist", name);

                return updatePathWithParams(state.path, params);
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
        root: "",
        states: {},
        notFound: null
    });
})();