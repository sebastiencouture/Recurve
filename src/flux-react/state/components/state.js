"use strict";

function addStateComponentService(module) {
    module.factory("$State", ["$container", "$stateStore"], function($container, $stateStore) {

        function getStateFromStore(depth) {
            return $stateStore.getAtDepth(depth) || {};
        }

        function isRoot(depth) {
            return 0 === depth;
        }

        return React.createClass({
            displayName: "$State",

            getInitialState: function() {
                return getStateFromStore(this._getDepth());
            },

            componentWillMount: function() {
                if (isRoot(this._getDepth())) {
                    $stateStore.changed.on(this._changeHandler, this);
                }
            },

            componentWillUnmount: function() {
                if (isRoot(this.context)) {
                    $stateStore.changed.off(this._changeHandler, this);
                }
            },

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
                    depth: this._getDepth() + 1,
                    state: getStateFromStore(this._getDepth() + 1)
                };
            },

            render: function() {
                var state = this.context.state ? this.context.state : this.state;
                if (!state.components) {
                    return null;
                }

                var componentName;
                var components = state.components;
                if (state.loading) {
                    componentName = components.loading ? components.loading : components.ready;
                }
                else if (state.error) {
                    componentName = components.error ? components.error : components.ready;
                }
                else {
                    componentName = components.ready;
                }

                var Component = $container.get(componentName);

                var props = recurve.extend({}, this.props);
                props.state = props.state || {};
                recurve.extend(props.state, {
                    loading: state.loading,
                    error: state.error,
                    params: state.params,
                    data: state.data
                });

                return React.createElement(Component, props);
            },

            _changeHandler: function() {
                this.setState(getStateFromStore(0));
            },

            _getDepth: function() {
                return this.context.depth || 0;
            }
        });
    });
}