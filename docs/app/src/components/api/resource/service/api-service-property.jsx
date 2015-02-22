/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceProperty", ["ApiServiceName"], function(ApiServiceName) {

    return React.createClass({
        displayName: "ApiServiceProperty",

        propTypes: {
            property: React.PropTypes.object.isRequired
        },

        render: function() {
            var property = this.props.property;
            return (
                <div id="property" className="property">
                    <ApiServiceName name={property.name} type={property.type} />
                    <p dangerouslySetInnerHTML={{__html: property.description.full}} />
                </div>
            );
        }
    });
});