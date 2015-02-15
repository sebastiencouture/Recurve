"use strict";

function addStateMixinService(module) {
    module.factory("$stateMixin", ["$stateStore"], function($stateStore) {
        function getStateFromStore(depth) {
            return $stateStore.getAtDepth(depth) || {};
        }

        return {
            contextTypes: {
                depth: React.PropTypes.number,
                state: React.PropTypes.object
            },

            childContextTypes: {
                depth: React.PropTypes.number.isRequired,
                state: React.PropTypes.object.isRequired
            },

            getChildContext: function() {
                return {
                    depth: this.context.depth,
                    state: getStateFromStore(this.context.depth)
                };
            }
        };
    });
}