(function() {
    "use strict";

    recurve.flux.state = {};
    var module = recurve.flux.state.$module = recurve.module();

    module.factory("$state", ["$router", "$action"], function($router, $action) {
        // functionality:
        // - define states to a route
        // - define modals to a route with default state (if one doesn't exist)
        // - hooks:
        // a. validate(done) => done to continue...parameters: false => go back, route => change route to
        // a. getData(done) => done to continue...parameters: false => go back, route => change route to
        //
        // TODO TBD support child states??
        return {

        };
    });
})();