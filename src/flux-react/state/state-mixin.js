"use strict";

function addStateMixinService(module) {
    module.factory("$stateMixin", ["$container", "$stateStore"], function($container, $stateStore) {
        function getStateFromStore(depth) {
            return $stateStore.getAtDepth(depth) || {};
        }

        return {
            contextTypes: {
                $depth: React.PropTypes.number,
                $state: React.PropTypes.object
            },

            childContextTypes: {
                $depth: React.PropTypes.number.isRequired,
                $state: React.PropTypes.object.isRequired
            },

            createChildContext: function(depth) {
                return {
                    $depth: depth + 1,
                    $state: getStateFromStore(depth + 1)
                };
            },

            renderComponent: function(state, depth) {
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

                var childState = getStateFromStore(depth + 1);
                var props = recurve.extend({}, this.props);
                props.$state = {
                    name: state.name,
                    childName: childState ? childState.name : null,
                    loading: state.loading,
                    error: state.error,
                    params: state.params,
                    history: state.history,
                    data: state.data
                };

                return React.createElement(Component, props);
            }
        };
    });
}