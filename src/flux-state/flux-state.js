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

    module.factory("$state", ["$router", "$action", "$config"], function($router, $action, $config) {
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

            addState(stateConfig.name, path);

            $router.on(path, function(params) {
                $state.startChangeAction.trigger();

                resolve().then(function() {
                    $state.changeAction.trigger();
                }, function() {
                    $state.errorAction.trigger();
                });
            });

            // stateConfig.name
            // stateConfig.path
            // stateConfig.data
            // stateConfig.resolve => set of objects, if any promises then wait... this is included with stateConfig.data

            // $router.on(stateConfig.path, handler);
        });

        function getParent(childName) {

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

        function addState(name, path) {

        }

        function resolve() {

        }

        var $state = {
            startChangeAction: $action(),
            changeAction: $action(),
            errorAction: $action(),

            navigate: function(name, params, historyState, options) {
                // options:
                // reload => force reload
                // trigger => only updates url but nothing else is done
                // replace
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