"use strict";

function addRouterService(module) {
    module.factory("$router", ["$window", "$config"], function($window, $config) {
        // Support for history polyfill
        // https://github.com/devote/HTML5-History-API
        var history = $window.history;
        var location = history.location || $window.location;

        var routes = [];
        var noMatchHandler;
        var currentPath = getPath();
        var currentStateObj;
        var started;
        var root = $config.root ? sanitizePath($config.root) : "/";
        root = ("/" + root + "/").replace(/^\/+|\/+$/g, "/");

        function getPath() {
            var path = decodeURI(location.pathname + location.search);
            path = sanitizePath(path);

            return removeRoot(path);
        }

        function sanitizePath(path) {
            return isString(path) ? path.replace(/^[#\/]|\s+$/g, "") : path;
        }

        var PATH_NAME_MATCHER = /:([\w\d]+)/g;
        var PATH_REPLACER = "([^\/]+)";

        function pathToRegExp(path) {
            if (isRegExp(path)) {
                return path;
            }

            return new RegExp(path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$");
        }

        function pathParamKeys(path) {
            var paramKeys = [];
            if (isRegExp(path)) {
                return paramKeys;
            }

            // reset index...IE :T
            PATH_NAME_MATCHER.lastIndex = 0;

            var match = PATH_NAME_MATCHER.exec(path);

            while(null !== match) {
                paramKeys.push(match[1]);
                match = PATH_NAME_MATCHER.exec(path);
            }

            return paramKeys;
        }

        function removePathQueryParams(path) {
            if (!path) {
                return path;
            }

            return path.split("?")[0];
        }

        function getRoute(pathRegExp) {
            var found = null;
            recurve.forEach(routes, function(route) {
                if(recurve.areEqual(pathRegExp, route.pathRegExp)) {
                    found = route;
                    return false;
                }
            });

            return found;
        }

        function addRoute(path) {
            var pathRegExp = pathToRegExp(path);

            var route = {};
            route.pathRegExp = pathRegExp;
            route.paramKeys = pathParamKeys(path);

            route.handle = function(path) {
                var queryParams = getParametersOfUrl(path);
                path = removePathQueryParams(path);

                var params = this.pathRegExp.exec(path);
                if (!params) {
                    return false;
                }

                // full path
                params.shift();

                var decodedParams = queryParams;
                forEach(params, function(param, index) {
                    var decodedParam = decodeParam(param);
                    if (this.paramKeys && this.paramKeys[index]) {
                        decodedParams[this.paramKeys[index]] = decodedParam;
                    }
                    else {
                        decodedParams.splat = decodedParams.splat || [];
                        decodedParams.splat.push(decodedParam);
                    }
                }, this);

                var args = [decodedParams];
                if (currentStateObj) {
                    args.push(currentStateObj);
                }

                this.callback.apply(null, args);

                return true;
            };

            routes.push(route);
            return route;
        }

        function decodeParam(str) {
            if (!str) {
                return "";
            }

            return decodeURIComponent(str).replace(/\+/g, " ");
        }

        function addRoot(path) {
            if (!root) {
                return path;
            }

            return root + path;
        }

        function removeRoot(path) {
            if (!root || isRegExp(path)) {
                return path;
            }

            if (0 === path.indexOf(root)) {
                path = path.slice(root.length);
            }

            return path;
        }

        function checkCurrentPath() {
            if (!started) {
                return;
            }

            var path = getPath();
            if(currentPath === path) {
                return;
            }

            currentPath = path;

            var handled = false;
            forEach(routes, function(route) {
                handled = route.handle(path);
                return !handled;
            });

            if (!handled && noMatchHandler) {
                noMatchHandler();
            }
        }

        function historyPath(path) {
            if (path) {
                path = sanitizePath(path);
                path = addRoot(path);
            }
            else {
                path = root.slice(0, -1);
            }

            return path;
        }

        return {
            on: function(path, callback) {
                assert(isFunction(callback), "callback must exist");

                path = sanitizePath(path);
                path = removeRoot(path);
                var pathRegExp = pathToRegExp(path);

                var route = getRoute(pathRegExp);
                if (!route) {
                    route = addRoute(path);
                }

                route.callback = callback;
            },

            off: function(path) {
                path = sanitizePath(path);
                path = removeRoot(path);
                var pathRegExp = pathToRegExp(path);

                recurve.forEach(routes, function(route, index) {
                    if(recurve.areEqual(pathRegExp, route.pathRegExp)) {
                        routes.splice(index, 1);
                        return false;
                    }
                });
            },

            otherwise: function(callback) {
                noMatchHandler = callback;
            },

            navigate: function(path, stateObj, trigger) {
                path = historyPath(path);
                currentStateObj = stateObj;
                trigger = isUndefined(trigger) ? true : trigger;

                history.pushState(stateObj, null, path);
                if (trigger) {
                    checkCurrentPath();
                }
            },

            replace: function(path, stateObj, trigger) {
                path = historyPath(path);
                currentStateObj = stateObj;
                trigger = isUndefined(trigger) ? true : trigger;

                history.replaceState(stateObj, null, path);
                if (trigger) {
                    checkCurrentPath();
                }
            },

            back: function() {
                history.back();
            },

            forward: function() {
                history.forward();
            },

            go: function(delta) {
                history.go(delta);
            },

            reload: function() {
                currentPath = null;
                checkCurrentPath();
            },

            start: function() {
                started = true;
                addEvent($window, "popstate", function(event) {
                    currentStateObj = event.state;
                    checkCurrentPath();
                });

                currentStateObj = currentStateObj || history.state;
                this.reload();
            }
        };
    });

    module.config("$router", {
        root: ""
    });
}

