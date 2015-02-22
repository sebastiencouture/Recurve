/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServicePropertiesShort", null, function() {

    function renderProperties(properties) {
        return properties.map(function(property) {
            var href = "#" + property.name;
            return (
                <div key={property.name}>
                    <dt><small>{property.type}</small></dt>
                    <dd><a href={href}>{property.name}</a></dd>
                </div>
            );
        });
    }

    return React.createClass({
        displayName: "ApiServicePropertiesShort",

        propTypes: {
            header: React.PropTypes.string.isRequired,
            properties: React.PropTypes.array.isRequired
        },

        render: function() {
            return (
                <div className="properties-short">
                    <h3>{this.props.header}</h3>
                    <dl className="dl-horizontal">
                        {renderProperties(this.props.properties)}
                    </dl>
                </div>
            );
        }
    });
});