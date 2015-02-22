/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResource", ["ApiResourceHeader", "ApiResourcePropertiesShort", "ApiResourceMethodsShort", "ApiResourceDetailedDescription",
    "ApiResourceDetailedMethods", "ApiResourceDetailedProperties", "ApiResourceDetailedConfig", "ApiResourceExamples"],
    function(ApiResourceHeader, ApiResourcePropertiesShort, ApiResourceMethodsShort, ApiResourceDetailedDescription,
        ApiResourceDetailedMethods, ApiResourceDetailedProperties, ApiResourceDetailedConfig, ApiResourceExamples) {

    function renderPropertiesShort(header, id, properties) {
        var renderable = null;
        if (properties) {
            renderable = <ApiResourcePropertiesShort id={id} header={header} properties={properties}/>;
        }

        return renderable;
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
                    <ApiResourceHeader resource={resource}/>
                    <ApiResourceMethodsShort methods={resource.types.methods} />
                    {renderPropertiesShort("Properties", "properties", resource.types.properties)}
                    {renderPropertiesShort("Config", "config", resource.types.config)}
                    <ApiResourceDetailedDescription description={resource.description} />
                    <ApiResourceDetailedMethods methods={resource.types.methods} />
                    <ApiResourceDetailedProperties properties={resource.types.properties} />
                    <ApiResourceDetailedConfig config={resource.types.config} />
                    <ApiResourceExamples examples={resource.examples} />
                </div>
            );
        }
    });
});