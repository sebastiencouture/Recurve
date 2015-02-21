/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResource", ["ApiResourceHeader", "ApiResourceShortType", "ApiResourceDetailedDescription"],
    function(ApiResourceHeader, ApiResourceShortType, ApiResourceDetailedDescription) {
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

    function renderShortTypes(header, types) {
        var renderable = null;
        if (types) {
            renderable = <ApiResourceShortType header={header} methods={types}/>;
        }

        return renderable;
    }

    return React.createClass({
        render: function() {
            var resource = this.props.$state.data.resource;
            return (
                <div>
                    <ApiResourceHeader resource={resource}/>
                    {renderShortTypes("Methods", resource.types.method)}
                    {renderShortTypes("Properties", resource.types.property)}
                    {renderShortTypes("Config", resource.types.config)}
                    <ApiResourceDetailedDescription description={resource.description} />
                </div>
            );
        }
    });
});