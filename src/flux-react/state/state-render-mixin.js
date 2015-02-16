"use strict";

function addStateRenderMixinService(module) {
    module.factory("$stateRenderMixin", ["$container"], function($container) {
        return {
            renderComponent: function(state) {
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
                props.$state = {
                    loading: state.loading,
                    error: state.error,
                    params: state.params,
                    data: state.data
                };

                return React.createElement(Component, props);
            }
        };
    });
}