/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServicePropertiesSummary", ["utils"], function(utils) {

    function renderProperties(properties) {
        return properties.map(function(property) {
            var href = "#" + property.name;
            return (
                <div key={property.name}>
                    <dt><small>{utils.join(property.type)}</small></dt>
                    <dd><a href={href}>{property.name}</a></dd>
                </div>
            );
        });
    }

    return React.createClass({
        displayName: "ApiServicePropertiesSummary",

        propTypes: {
            header: React.PropTypes.string.isRequired,
            properties: React.PropTypes.array
        },

        render: function() {
            var properties = this.props.properties;
            if (!properties || !properties.length) {
                return null;
            }

            return (
                <div className="properties-summary">
                    <h3>{this.props.header}</h3>
                    <dl className="dl-horizontal">
                        {renderProperties(properties)}
                    </dl>
                </div>
            );
        }
    });
});