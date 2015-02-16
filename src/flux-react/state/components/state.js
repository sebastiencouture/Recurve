"use strict";

function addStateComponentService(module) {
    module.factory("$State", ["$stateStore", "$stateRenderMixin"], function($stateStore, $stateRenderMixin) {

        function getStateFromStore(depth) {
            return $stateStore.getAtDepth(depth) || {};
        }

        return React.createClass({
            displayName: "$State",

            mixins: [$stateRenderMixin],

            contextTypes: {
                $depth: React.PropTypes.number,
                $state: React.PropTypes.object
            },

            childContextTypes: {
                $depth: React.PropTypes.number.isRequired,
                $state: React.PropTypes.object.isRequired
            },

            getChildContext: function() {
                return {
                    $depth: this.context.$depth + 1,
                    $state: getStateFromStore(this.context.$depth + 1)
                };
            },

            render: function() {
                return this.renderComponent(this.context.$state);
            }
        });
    });
}