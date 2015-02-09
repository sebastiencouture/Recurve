"use strict";

function addStateMixinService(module) {
    module.factory("$stateMixin", null, function() {
        return {
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