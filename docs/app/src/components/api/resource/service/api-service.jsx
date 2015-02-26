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
            var service = resource.getService();

            return (
                <div className="resource-service">
                    <ApiServiceHeader resource={resource.getService()}/>
                    <ApiServiceMethodsSummary methods={resource.getMethods()} />
                    <ApiServicePropertiesSummary id="properties" header="Properties" properties={resource.getProperties()}/>
                    <ApiServicePropertiesSummary id="config" header="Config" properties={resource.getConfigs()}/>
                    <ApiServiceDetailedDescription description={service.description} />
                    <ApiServiceDetailedMethods methods={resource.getMethods()} />
                    <ApiServiceDetailedProperties properties={resource.getProperties()} />
                    <ApiServiceDetailedConfig config={resource.getConfigs()} />
                    <ApiServiceExamples examples={service.examples} />
                </div>
            );
        }
    });
});