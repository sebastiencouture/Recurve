/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiService", ["ApiServiceHeader", "ApiServicePropertiesSummary", "ApiServiceMethodsSummary", "ApiServiceDetailedDescription",
    "ApiServiceDetailedMethods", "ApiServiceDetailedProperties", "ApiServiceDetailedConfig", "ApiServiceExamples"],
    function(ApiServiceHeader, ApiServicePropertiesSummary, ApiServiceMethodsSummary, ApiServiceDetailedDescription,
             ApiServiceDetailedMethods, ApiServiceDetailedProperties, ApiServiceDetailedConfig, ApiServiceExamples) {

    function renderPropertiesSummary(header, id, properties) {
        var renderable = null;
        if (properties) {
            renderable = <ApiServicePropertiesSummary id={id} header={header} properties={properties}/>;
        }

        return renderable;
    }

    return React.createClass({
        displayName: "ApiService",

        propTypes: {
            resource: React.PropTypes.object.isRequired
        },

        render: function() {
            var resource = this.props.resource;
            return (
                <div className="resource-service">
                    <ApiServiceHeader resource={resource}/>
                    <ApiServiceMethodsSummary methods={resource.types.method} />
                    {renderPropertiesSummary("Properties", "properties", resource.types.property)}
                    {renderPropertiesSummary("Config", "config", resource.types.config)}
                    <ApiServiceDetailedDescription description={resource.description} />
                    <ApiServiceDetailedMethods methods={resource.types.method} />
                    <ApiServiceDetailedProperties properties={resource.types.property} />
                    <ApiServiceDetailedConfig config={resource.types.config} />
                    <ApiServiceExamples examples={resource.examples} />
                </div>
            );
        }
    });
});