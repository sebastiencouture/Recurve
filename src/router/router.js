/* global addRouterHistoryService */

(function() {
    "use strict";

    recurve.router = {};
    var module = recurve.router.$module = recurve.module();

    module.factory("$router", ["$window", "$config"], function($window, $config) {
        // Support for history polyfill
        // https://github.com/devote/HTML5-History-API
        var history = $window.history;
        var location = history.location || $window.location;

        var routes = [];
        var noMatchRoute;
        var currentPath = removeRoot(location.href);
        var started;

        function decode(str) {
            if (!str) {
                return "";
            }

            return decodeURIComponent(str).replace(/\+/g, " ");
        }

        var PATH_NAME_MATCHER = /:([\w\d]+)/g;
        var PATH_REPLACER = "([^\/]+)";

        function pathToRegExp(path) {
            if (recurve.isRegExp(path)) {
                return path;
            }

            return new RegExp(path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$");
        }

        function pathParams(path) {
            if (recurve.isRegExp(path)) {
                return null;
            }

            // reset index...IE :T
            PATH_NAME_MATCHER.lastIndex = 0;

            var params = [];
            var match = PATH_NAME_MATCHER.exec(path);

            while(null !== match) {
                params.push(match[1]);
                match = PATH_NAME_MATCHER.exec(path);
            }

            return params;
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
            var route = getRoute(pathRegExp);

            if(!route) {
                route.pathRegExp = pathRegExp;
                route.params = pathParams(path);
                route.callbacks = [];

                route.handle = function(path) {
                    var params = this.pathRegExp.exec(path);
                    if (!params) {
                        return false;
                    }

                    // full path
                    params.shift();

                    var decodedParams = {};
                    recurve.forEach(params, function(param, index) {
                        var decodedParam = decode(param);
                        if (this.params[index]) {
                            decodedParams[this.params[index]] = decodedParam;
                        }
                        else {
                            decodedParams.splat = decodedParams.splat || [];
                            decodedParams.splat.push(decodedParam);
                        }
                    });

                    recurve.forEach(this.callbacks, function(callback) {
                        callback.apply(null, decodedParams);
                    });

                    return true;
                }

                routes.push(route);
            }

            return routes;
        }

        function addRoot(path) {
            if (!$config.root) {
                return path;
            }

            return path;
        }

        function removeRoot(path) {
            if (!$config.root) {
                return path;
            }

            return path;
        }

        function checkCurrentPath() {
            var path = removeRoot(location.href);
            if(currentPath === path) {
                return;
            }

            currentPath = path;

            var handled = false;
            recurve.forEach(routes, function(route) {
                handled = route.handle(path);
                return !handled;
            });

            if (!handled && noMatchRoute) {
                noMatchRoute();
            }
        }

        return {
            match: function(path) {
                var route = addRoute(path);

                return {
                    to: function(callback) {
                        route.callbacks.push(callback);
                    }
                };
            },

            noMatch: function(callback) {
                noMatchRoute = callback;
            },

            navigate: function(path, obj, trigger) {
                path = addRoot(path);
                trigger = trigger || true;

                history.pushState(obj, null, path);
                if (trigger && started) {
                    checkCurrentPath();
                }
            },

            replace: function(path, obj, trigger) {
                path = addRoot(path);
                trigger = trigger || true;

                history.replaceState(obj, null, path);
                if (trigger && started) {
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
                if (started) {
                    checkCurrentPath();
                }
            },

            start: function() {
                started = true;
                recurve.addEvent($window, "popstate", checkCurrentPath);
            }
        };
    });

    module.config("$router", {
        root: ""
    });
})();

