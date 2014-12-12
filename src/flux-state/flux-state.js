(function() {
    "use strict";

    recurve.flux.state = {};
    var module = recurve.flux.state.$module = recurve.module();

    module.factory("$state", ["$router", "$action"], function($router, $action) {
        // functionality:
        // - define states to a route
        // - hooks:
        // a. validate(done) => done to continue...parameters: false => go back, route => change route to
        // a. getData(done) => done to continue...parameters: false => go back, route => change route to
        return {
            changeAction: $action(),
            preChangeAction: $action(),

            add: function(name, path, onValidate, onGetData) {
                recurve.assert(name, "state name must be set");
                recurve.assert(path, "state path must be set");

                // child states
                return {
                    add: function(name, path, onValidate, onGetData) {

                    }
                }
            }
        };
    });
})();