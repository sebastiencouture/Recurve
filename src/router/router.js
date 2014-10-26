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
        var currentPath = getPath();
        var currentStateObj;
        var started;
        var root = sanitizePath($config.root || "");

        function getPath() {
            var path = decodeURI(location.pathname + location.search);
            path = sanitizePath(path);

            return removeRoot(path);
        }

        function sanitizePath(path) {
            return path.replace(/^[#\/]|\s+$/g, "");
        }

        var PATH_NAME_MATCHER = /:([\w\d]+)/g;
        var PATH_REPLACER = "([^\/]+)";

        function pathToRegExp(path) {
            if (recurve.isRegExp(path)) {
                return path;
            }

            return new RegExp(path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$");
        }

        function pathParamKeys(path) {
            var paramKeys = [];
            if (recurve.isRegExp(path)) {
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

        function pathQueryParams(path) {
            var params = {};
            if (!path) {
                return params;
            }

            var startIndex = path.indexOf("?") + 1;
            if (startIndex === path.length) {
                return params;
            }

            while (0 < startIndex) {
                var endIndex = path.indexOf("&", startIndex);
                if (-1 === endIndex) {
                    endIndex = undefined;
                }

                var keyValue = path.slice(startIndex, endIndex);

                var split = keyValue.split("=");
                var key = decodeParam(split[0]);
                // No support for decoding value, too difficult. No need yet for this either
                var value = 1 < split.length ? split[1] : null;

                params[key] = value;

                startIndex = endIndex + 1;
            }

            return params;
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
            var route = getRoute(pathRegExp);

            if(!route) {
                route = {};
                route.pathRegExp = pathRegExp;
                route.callbacks = [];
                route.paramKeys = pathParamKeys(path);
                route.handle = routeHandler;

                routes.push(route);
            }

            return route;
        }

        function routeHandler(path) {
            var queryParams = pathQueryParams(path);
            path = removePathQueryParams(path);

            var params = this.pathRegExp.exec(path);
            if (!params) {
                return false;
            }

            // full path
            params.shift();

            var decodedParams = queryParams;
            recurve.forEach(params, function(param, index) {
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

            recurve.forEach(this.callbacks, function(callback) {
                callback.apply(null, args);
            });

            return true;
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

            return root + "/" + path;
        }

        function removeRoot(path) {
            if (!root) {
                return path;
            }

            return path.replace(root + "/", "");
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

            navigate: function(path, stateObj, trigger) {
                path = sanitizePath(path);
                path = addRoot(path);
                currentStateObj = stateObj;
                trigger = recurve.isUndefined(trigger) ? true : trigger;

                history.pushState(stateObj, null, path);
                if (trigger) {
                    checkCurrentPath();
                }
            },

            replace: function(path, stateObj, trigger) {
                path = sanitizePath(path);
                path = addRoot(path);
                currentStateObj = stateObj;
                trigger = recurve.isUndefined(trigger) ? true : trigger;

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
                recurve.addEvent($window, "popstate", function(event) {
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
})();

