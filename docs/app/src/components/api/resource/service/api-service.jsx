/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiService", ["ApiServiceHeader", "ApiServicePropertiesSummary", "ApiServiceMethodsSummary", "ApiServiceDetailedDescription",
    "ApiServiceDetailedMethods", "ApiServiceDetailedProperties", "ApiServiceDetailedConfig", "ApiServiceExamples"],
    function(ApiServiceHeader, ApiServicePropertiesSummary, ApiServiceMethodsSummary, ApiServiceDetailedDescription,
             ApiServiceDetailedMethods, ApiServiceDetailedProperties, ApiServiceDetailedConfig, ApiServiceExamples) {

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
                    <ApiServicePropertiesSummary id="properties" header="Properties" properties={resource.types.property}/>
                    <ApiServicePropertiesSummary id="config" header="Config" properties={resource.types.config}/>
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