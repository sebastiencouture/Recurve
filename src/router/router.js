
(function() {
    "use strict";

    recurve.router = {};
    var module = recurve.router.$module = recurve.module();

    // window "hashchange"
    // window "popstate"

    // if want to support IE8/9... require polyfill?
    // https://github.com/devote/HTML5-History-API

    module.factory("$router", null, function() {
        return {
            match: function(path) {
                return {
                    to: function(callback) {

                    },

                    before: function(callback) {

                    },

                    after: function(callback) {

                    }
                };
            },

            navigate: function(path) {

            },

            replace: function(path) {

            },

            reload: function() {

            },

            start: function() {

            }
        };
    });

    module.config("$router", {
        mode: "history",
        root: ""
    });
})();

