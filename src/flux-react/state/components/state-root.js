"use strict";

function addStateRootComponentService(module) {
    module.factory("$StateRoot", ["$stateStore", "$stateRenderMixin"], function($stateStore, $stateRenderMixin) {

        function getStateFromStore(depth) {
            return $stateStore.getAtDepth(depth) || {};
        }

        return React.createClass({
            displayName: "$StateRoot",

            mixins: [$stateRenderMixin],

            getInitialState: function() {
                return getStateFromStore(0);
            },

            componentWillMount: function() {
                $stateStore.changed.on(this._changeHandler, this);
            },

            componentWillUnmount: function() {
                $stateStore.changed.off(this._changeHandler, this);
            },

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
                    $depth: 1,
                    $state: getStateFromStore(1)
                };
            },

            render: function() {
                return this.renderComponent(this.state);
            },

            _changeHandler: function() {
                this.setState(getStateFromStore(0));
            }
        });
    });
}