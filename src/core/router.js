"use strict";

function addRouterService(module) {
    module.factory("$router", ["$window", "$config"], function($window, $config) {
        // Support for history polyfill
        // https://github.com/devote/HTML5-History-API
        var history = $window.history;
        var location = history.location || $window.location;

        var routes = [];
        var noMatchHandler = $config.otherwise;
        var currentPath = getPath();
        var currentHistoryState;
        var started;
        var root;

        var PATH_NAME_MATCHER = /:([\w\d]+)/g;
        var PATH_REPLACER = "([^\/]+)";

        function getPath() {
            var path = decodeURI(location.pathname + location.search);
            path = sanitizePath(path);

            return removeRoot(path);
        }

        function sanitizePath(path) {
            return isString(path) ? path.replace(/^[#\/]|\s+$/g, "") : path;
        }

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
                if (currentHistoryState) {
                    args.push(currentHistoryState);
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

        var $router = {
            navigate: function(path, historyState, options) {
                options = options || {};

                path = historyPath(path);
                currentHistoryState = historyState;
                var trigger = isUndefined(options.trigger) ? true : options.trigger;

                if (options.replace) {
                    history.replaceState(historyState, null, path);
                }
                else {
                    history.pushState(historyState, null, path);
                }

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

            reload: function() {
                currentPath = null;
                checkCurrentPath();
            },

            currentPath: function() {
                return currentPath;
            },

            start: function() {
                started = true;
                addEvent($window, "popstate", function(event) {
                    currentHistoryState = event.state;
                    checkCurrentPath();
                });

                currentHistoryState = currentHistoryState || history.state;
                this.reload();
            },

            // Convenience method if not possible to use config (building on top of $router => $state)
            setRoot: function(value) {
                root = value ? sanitizePath(value) : "/";
                root = ("/" + root + "/").replace(/^\/+|\/+$/g, "/");
            },

            on: function(path, callback) {
                assert(isFunction(callback), "callback must exist for route '{0}'", path);

                path = sanitizePath(path);
                path = removeRoot(path);
                var pathRegExp = pathToRegExp(path);

                var route = getRoute(pathRegExp);
                if (!route) {
                    route = addRoute(path);
                }

                route.callback = callback;
            },

            otherwise: function(callback) {
                noMatchHandler = callback;
            }
        };

        $router.setRoot($config.root);
        forEach($config.routes, function(routeConfig) {
            $router.on(routeConfig.path, routeConfig.callback);
        });

        return $router;
    });

    // TODO TBD update routes structure to be:
    // routes: {
    //  a: callback,
    //  b: callback,
    //  c: callback
    //}
    module.config("$router", {
        root: "",
        routes: [],
        otherwise: null
    });
}