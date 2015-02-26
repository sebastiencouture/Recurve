/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResource", ["ApiService", "ApiMethod", "ApiObject"], function(ApiService, ApiMethod, ApiObject) {
    function renderResource(resource, name, type) {
        var Component;
        switch (type) {
            case "service":
                Component = <ApiService resource={resource} />;
                break;
            case "method":
                Component = <ApiMethod method={resource.getMethodByName(name)} />;
                break;
            case "object":
                Component = <ApiObject object={resource.getObjectByName(name)} />;
                break;
            default:
                recurve.assert(false, "un-expected resource type", resource.rdoc);
        }

        return Component;
    }

    return React.createClass({
        displayName: "ApiResource",

        propTypes: {
            $state: React.PropTypes.object.isRequired
        },

        render: function() {
            var resource = this.props.$state.data.resource;
            var name = this.props.$state.params.resource;
            var type = this.props.$state.params.type;
            return (
                <div className="resource">
                    {renderResource(resource, name, type)}
                </div>
            );
        }
    });
});