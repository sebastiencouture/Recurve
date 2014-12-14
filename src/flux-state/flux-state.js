(function() {
    "use strict";

    recurve.flux.state = {};
    var module = recurve.flux.state.$module = recurve.module();

    // TODO TBD rename to $stateRouter??
    module.factory("$state", ["$router", "$action", "$config"], function($router, $action, $config) {
        $router.setRoot($config.rootUrl);

        recurve.forEach($config.states, function(stateConfig) {
            recurve.assert(stateConfig.name, "state name must be set", stateConfig);
            recurve.assert(stateConfig.path, "state path must be set", stateConfig);

            // stateConfig.name
            // stateConfig.url
            // stateConfig.data
            // stateConfig.resolve => set of objects, if any promises then wait... this is included with stateConfig.data

            // $router.on(stateConfig.path, handler);
        });

        return {
            preChangeAction: $action(),
            changeAction: $action(),
            errorAction: $action(),

            // TODO TBD this or go method?
            navigate: function(name, params, historyState, options) {
                // options:
                // reload => force reload
                // trigger => only updates url but nothing else is done
                // replace
            },

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
    });

    module.config("$state", {
        rootUrl: "",
        states: []
    });
})();