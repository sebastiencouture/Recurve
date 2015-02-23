/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResource", ["ApiService", "ApiMethod", "ApiObject"], function(ApiService, ApiMethod, ApiObject) {
    function renderResource(resource) {
        var Component;
        switch (resource.rdoc) {
            case "service":
                Component = ApiService;
                break;
            case "method":
                Component = ApiMethod;
                break;
            case "object":
                Component = ApiObject;
                break;
            default:
                recurve.assert(false, "un-expected resource type", resource.rdoc);
        }

        return <Component resource={resource}/>;
    }

    return React.createClass({
        displayName: "ApiResource",

        propTypes: {
            $state: React.PropTypes.object.isRequired
        },

        render: function() {
            var resource = this.props.$state.data.resource;
            return (
                <div className="resource">
                    {renderResource(resource)}
                </div>
            );
        }
    });
});