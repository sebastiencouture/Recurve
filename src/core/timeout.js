"use strict";

function addTimeoutService(module) {
    module.factory("$timeout", ["$window"], function($window) {
        var $timeout = function(fn, time) {
           return $window.setTimeout(fn, time);
        };

        return extend($timeout, {
            cancel: function(id) {
                $window.clearTimeout(id);
            }
        })
    });
}