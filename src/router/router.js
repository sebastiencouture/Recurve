/* global addRouterHistoryService */

(function() {
    "use strict";

    recurve.router = {};
    var module = recurve.router.$module = recurve.module();

    addRouterHistoryService(module);

    module.factory("$router", ["$window", "$history", "$config"], function($window, $history, $config) {
        // Support for history polyfill
        // https://github.com/devote/HTML5-History-API
        var location = $window.history.location || $window.location;

        var handlers = [];
        var noMatchHandler;
        var currentPath = removeRoot(location.href);

        function decode(str) {
            if (!str) {
                return "";
            }

            return decodeURIComponent(str).replace(/\+/g, " ");
        }

        function checkUrl() {
            var path = removeRoot(location.href);
            if(currentPath === path) {
                return;
            }

            currentPath = path;
            var handled = false;

            recurve.forEach(handlers, function(handler) {
                var params = handler.path.exec(currentPath);
                if (params) {
                    // full path
                    params.shift();

                    var decodedParams = [];
                    recurve.forEach(params, function(param) {
                        decodedParams.push(decode(param));
                    });

                    recurve.forEach(handler.callbacks, function(callback) {
                        callback.apply(null, decodedParams);
                    });

                    handled = true;
                    return false;
                }
            });

            if (!handled && noMatchHandler) {
                noMatchHandler();
            }
        }

        var PATH_NAME_MATCHER = /:([\w\d]+)/g;
        var PATH_REPLACER = "([^\/]+)";

        function pathToRegExp(path) {
            if (recurve.isRegExp(path)) {
                return path;
            }

            // reset index...IE :T
            PATH_NAME_MATCHER.lastIndex = 0;

            var params = [];
            var match = PATH_NAME_MATCHER.exec(path);

            // TODO TBD pass these param names back on object or just provide them as parameters with the callback
            // function?
            while(null !== match) {
                params.push(match[1]);
                match = PATH_NAME_MATCHER.exec(path);
            }

            return new RegExp(path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$");
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

        function getHandler(path) {
            var found;
            recurve.forEach(handlers, function(handler) {
                if(recurve.areEqual(path, handler.path)) {
                    found = handler;
                    return false;
                }
            });

            return found;
        }

        function addHandler(path) {
            path = pathToRegExp(path);
            var handler = getHandler(path);

            if(!handler) {
                handler.path = path;
                handler.callbacks = [];

                handlers.push(handler);
            }

            return handler;
        }

        return {
            match: function(path) {
                var handler = addHandler(path);

                return {
                    to: function(callback) {
                        handler.callbacks.push(callback);
                    }
                };
            },

            noMatch: function(callback) {
                noMatchHandler = callback;
            },

            navigate: function(path, trigger) {
                path = addRoot(path);
                trigger = trigger || true;

                $history.pushState(null, null, path);
                if (trigger) {
                    checkUrl();
                }
            },

            replace: function(path, trigger) {
                path = addRoot(path);
                trigger = trigger || true;

                $history.replaceState(null, null, path);
                if (trigger) {
                    checkUrl();
                }
            },

            reload: function() {
                currentPath = null;
                checkUrl();
            },

            start: function() {
                currentPath = location.href;

                $history.popped.on(checkUrl);
                $history.start();
            }
        };
    });

    module.config("$router", {
        root: ""
    });
})();

