/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceDetailedProperties", ["ApiServiceProperty"], function(ApiServiceProperty) {

    function renderProperties(properties) {
        var index = 0;
        return properties.map(function(property) {
            index++;
            return <ApiServiceProperty key={index} property={property} />
        });
    }

    return React.createClass({
        displayName: "ApiServiceDetailedProperties",

        propTypes: {
            properties: React.PropTypes.array
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