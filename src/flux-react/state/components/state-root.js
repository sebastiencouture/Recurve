"use strict";

function addStateRootComponentService(module) {
    module.factory("$StateRoot", ["$stateStore", "$stateMixin"], function($stateStore, $stateMixin) {

        function getStateFromStore() {
            return $stateStore.getAtDepth(0) || {};
        }

        return React.createClass({
            displayName: "$StateRoot",

            mixins: [$stateMixin],

            getInitialState: function() {
                return getStateFromStore();
            },

            componentWillMount: function() {
                $stateStore.changed.on(this._changeHandler, this);
            },

            componentWillUnmount: function() {
                $stateStore.changed.off(this._changeHandler, this);
            },

            getChildContext: function() {
                return this.createChildContext(0);
            },

            render: function() {
                return this.renderComponent(this.state, 0);
            },

            _changeHandler: function() {
                this.setState(getStateFromStore());
            }
        });
    });
}