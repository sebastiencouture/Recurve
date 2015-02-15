"use strict";

function addStateComponentService(module) {
    module.factory("$State", ["$container", "$log", "$stateStore"], function($container, $log, $stateStore) {

        function getStateFromStore(depth) {
            return $stateStore.getAtDepth(depth);
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
                depth: React.PropTypes.number
            },

            childContextTypes: {
                depth: React.PropTypes.number.isRequired
            },

            getChildContext: function() {
                return {
                    depth: this._getDepth() + 1
                };
            },

            render: function() {
                if (!this.state) {
                    return null;
                }

                var componentName;
                var components = this.state.components;
                if (this.state.loading) {
                    componentName = components.loading ? components.loading : components.ready;
                }
                else if (this.state.error) {
                    componentName = components.error ? components.error : components.ready;
                }
                else {
                    componentName = components.ready;
                }

                var Component = $container.get(componentName);

                var props = recurve.extend({}, this.props);
                props.state = props.state || {};
                recurve.extend(props.state, {
                    loading: this.state.loading,
                    resolved: this.state.resolved,
                    error: this.state.error,
                    params: this.state.params,
                    data: this.state.data
                });

                return React.createElement(Component, props);
            },

            _changeHandler: function() {
                var depth = this._getDepth();
                var state = getStateFromStore(depth);

                this.setState(state);
            },

            _getDepth: function() {
                return this.context.depth || 0;
            }
        });
    });
}