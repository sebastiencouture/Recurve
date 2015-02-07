"use strict";

function addStateComponentService(module) {
    module.factory("$State", ["$stateStore"], function($stateStore) {
        function getStateFromStore(depth) {
            var state = $stateStore.getAtDepth(depth);
            return {
                name: $stateStore.getName(),
                loading : state.loading,
                resolved: state.resolved,
                error: state.error,
                data: state.data,
                params: state.params,
                render: state.resolver.render
            };
        }

        function getDepth(value) {
            return value || 0;
        }

        function isRoot(context) {
            return recurve.isUndefined(context.depth);
        }

        return React.createClass({
            getInitialState: function() {
                return getStateFromStore(getDepth(this.context.depth));
            },

            componentWillMount: function() {
                recurve.assert($stateStore.getMaxDepth() >= this.context.depth,
                    "$State component does not exist at {0} depth", this.context.depth);

                if (isRoot(this.context)) {
                    $stateStore.changed.on(this._changeHandler, this);
                }
            },

            componentWillUnmount: function() {
                if (isRoot(this.context)) {
                    $stateStore.changed.off(this._changeHandler, this);
                }
            },

            getChildContext: function() {
                return {
                    depth: getDepth(this.context.depth) + 1
                };
            },

            render: function() {
                var Component;
                var renderResolver = this.state.render;
                if (this.state.loading) {
                    Component = renderResolver.loading ? renderResolver.loading : renderResolver.ready;
                }
                else if (this.state.error) {
                    Component = renderResolver.error ? renderResolver.error : renderResolver.ready;
                }
                else {
                    Component = renderResolver.ready;
                }

                var params = recurve.extend({}, this.params);
                params.state = params.state || {};
                recurve.extend(params.state, {
                    name: this.state.name,
                    loading: this.state.loading,
                    resolved: this.state.resolved,
                    error: this.state.error,
                    params: this.state.params,
                    data: this.state.data
                });

                return React.createElement(Component, params);
            },

            _changeHandler: function() {
                var depth = getDepth(this.context.depth);
                var state = getStateFromStore(depth);

                this.setState(state);
            }
        });
    });
}