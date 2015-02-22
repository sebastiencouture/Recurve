/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceProperty", ["ApiResourceName"], function(ApiResourceName) {

    return React.createClass({
        displayName: "ApiResourceProperty",

        propTypes: {
            property: React.PropTypes.object.isRequired
        },

        render: function() {
            var property = this.props.property;
            return (
                <div id="property" className="property">
                    <ApiResourceName name={property.name} type={property.type} />
                    <p dangerouslySetInnerHTML={{__html: property.description.full}} />
                </div>
            );
        }
    });
});