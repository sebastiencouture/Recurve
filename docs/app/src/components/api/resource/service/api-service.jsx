/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiService", ["ApiServiceHeader", "ApiServicePropertiesShort", "ApiServiceMethodsShort", "ApiServiceDetailedDescription",
    "ApiServiceDetailedMethods", "ApiServiceDetailedProperties", "ApiServiceDetailedConfig", "ApiServiceExamples"],
    function(ApiServiceHeader, ApiServicePropertiesShort, ApiServiceMethodsShort, ApiServiceDetailedDescription,
             ApiServiceDetailedMethods, ApiServiceDetailedProperties, ApiServiceDetailedConfig, ApiServiceExamples) {

    function renderPropertiesShort(header, id, properties) {
        var renderable = null;
        if (properties) {
            renderable = <ApiServicePropertiesShort id={id} header={header} properties={properties}/>;
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
                <div className="resource">
                    <ApiServiceHeader resource={resource}/>
                    <ApiServiceMethodsShort methods={resource.types.methods} />
                    {renderPropertiesShort("Properties", "properties", resource.types.properties)}
                    {renderPropertiesShort("Config", "config", resource.types.config)}
                    <ApiServiceDetailedDescription description={resource.description} />
                    <ApiServiceDetailedMethods methods={resource.types.methods} />
                    <ApiServiceDetailedProperties properties={resource.types.properties} />
                    <ApiServiceDetailedConfig config={resource.types.config} />
                    <ApiServiceExamples examples={resource.examples} />
                </div>
            );
        }
    });
});