/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResource", ["ApiResourceHeader", "ApiResourceShortType", "ApiResourceDetailedDescription",
    "ApiResourceDetailedMethods", "ApiResourceDetailedProperties", "ApiResourceDetailedConfig", "ApiResourceExamples"],
    function(ApiResourceHeader, ApiResourceShortType, ApiResourceDetailedDescription,
        ApiResourceDetailedMethods, ApiResourceDetailedProperties, ApiResourceDetailedConfig, ApiResourceExamples) {
    // Name
    // ----
    // one liner of purpose with (more...) => link to detailed description
    //
    // info such as: module, dependencies
    // github link
    //
    // Methods
    // --
    // list of all methods and their signatures
    //
    // Properties
    // ---
    // list of all property values
    //
    // Config
    // ---
    //
    // Detailed Description + mixed in examples
    // ---
    // description
    //
    // Detailed Methods
    // ---
    //
    //      Method 1
    //      ---
    //      description
    //
    //      Parameters
    //      ---
    //      params table
    //
    //      Returns
    //      ---
    //      description
    //
    //      Asserts
    //      ---
    //      description
    //
    //      Examples
    //      ---
    //
    // Detailed Properties
    // ---
    //
    // Examples
    // ---
    //
    // User Notes (future version)
    // ---

    function renderShortTypes(header, id, types) {
        var renderable = null;
        if (types) {
            renderable = <ApiResourceShortType id={id} header={header} types={types}/>;
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
                    {renderShortTypes("Methods", "methods", resource.types.method)}
                    {renderShortTypes("Properties", "properties", resource.types.property)}
                    {renderShortTypes("Config", "config", resource.types.config)}
                    <ApiResourceDetailedDescription description={resource.description} />
                    <ApiResourceDetailedMethods methods={resource.types.method} />
                    <ApiResourceDetailedProperties properties={resource.types.property} />
                    <ApiResourceDetailedConfig config={resource.types.config} />
                    <ApiResourceExamples examples={resource.examples} />
                </div>
            );
        }
    });
});