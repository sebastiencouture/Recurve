"use strict";

function addStateMixinService(module) {
    module.factory("$stateMixin", ["$stateRouter"], function($stateRouter) {
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
            },

            contextTypes: {
                depth: React.PropTypes.number
            },

            childContextTypes: {
                depth: React.PropTypes.number.isRequired
            },

            getChildContext: function() {
                return {
                    depth: this.context.depth
                };
            }
        };
    });
}