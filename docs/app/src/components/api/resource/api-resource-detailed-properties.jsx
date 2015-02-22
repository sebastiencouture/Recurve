/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceDetailedProperties", ["ApiResourceProperty"], function(ApiResourceProperty) {

    function renderProperties(properties) {
        var index = 0;
        return properties.map(function(property) {
            index++;
            return <ApiResourceProperty key={index} property={property} />
        });
    }

    return React.createClass({
        displayName: "ApiResourceDetailedProperties",

        propTypes: {
            properties: React.PropTypes.array.isRequired
        },

        render: function() {
            var properties = this.props.properties;
            if (!properties || !properties.length) {
                return null;
            }

            return (
                <div id="detailed-properties" className="detailed-properties">
                    <h3>Detailed Properties</h3>
                    {renderProperties(properties)}
                </div>
            );
        }
    });
});