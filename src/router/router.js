
(function() {
    "use strict";

    recurve.router = {};
    var module = recurve.router.$module = recurve.module();

    module.factory("$router", ["$history", "$config"], function($history, $config) {
        // Support for history polyfill
        // https://github.com/devote/HTML5-History-API
        var location = window.history.location || window.location;

        function checkUrl() {

        }

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
                $history.changed.on(checkUrl);
                $history.start();
            }
        };
    });

    module.config("$router", {
        root: ""
    });
})();

