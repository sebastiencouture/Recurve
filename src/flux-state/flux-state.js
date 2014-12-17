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

    module.factory("$state", ["$router", "$action", "$promise", "$config"], function($router, $action, $promise, $config) {
        var states = [];

        $router.setRoot($config.rootUrl);

        recurve.forEach($config.states, function(stateConfig) {
            recurve.assert(stateConfig.name, "state name must be set", stateConfig);
            recurve.assert(stateConfig.path, "state path must be set", stateConfig);

            validateParent(stateConfig.name);

            var path = "";
            var parentState = getParent(stateConfig.name);
            if (parentState) {
                path = parentState.path + stateConfig.path;
            }

            add(stateConfig.name, path);

            $router.on(path, function(params) {
                $state.startChangeAction.trigger(stateConfig.name, params);
                resolve(stateConfig, params);
            });

            // stateConfig.name
            // stateConfig.path
            // stateConfig.data
            // stateConfig.resolve => set of objects, if any promises then wait... this is included with stateConfig.data

            // $router.on(stateConfig.path, handler);
        });

        function resolve(stateConfig, routeParams) {
            var data = recurve.extend({}, stateConfig.data);
            var name = stateConfig.name;

            if (recurve.isArray(stateConfig.resolve)) {
                // TODO TBD
                // stateConfig.resolve = {static: 1, promiseLike: function() {return promise;}, promiseLike2: function() {return promise}};
                $promise.all(stateConfig.resolve).then(function() {
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
            return -1 < childName.indexOf(".")
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
                    states.splice(index, 1);
                    states[index] = newState;
                    updated = true;
                    return false;
                }
            });

            if (!updated) {
                states.push(newState);
            }
        }

        var $state = {
            startChangeAction: $action(),
            changeAction: $action(),
            errorAction: $action(),

            navigate: function(name, params, historyState, options) {
                options = options || {};

                // options:
                // reload => force reload
                // trigger => only updates url but nothing else is done
                // replace

                var state = get(name);
                recurve.assert(name, "'{0}' state does not exist", name);

                // TODO TBD add params to url
                var path = state.path;

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
        rootUrl: "",
        states: []
    });
})();