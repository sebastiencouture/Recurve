"use strict";

function addStateNavigationMixinService(module) {
    module.factory("$stateNavigationMixin", ["$stateRouter"], function($stateRouter) {
        return {
            navigate: function() {
                $stateRouter.navigate.apply($stateRouter, arguments);
            },

            back: function() {
                $stateRouter.back();
            },

            forward: function() {
                $stateRouter.forward();
            },

            reload: function() {
                $stateRouter.reload();
            }
        };
    });
}