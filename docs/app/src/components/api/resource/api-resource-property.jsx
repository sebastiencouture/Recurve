/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceProperty", ["utils"], function(utils) {

    return React.createClass({
        displayName: "ApiResourceProperty",

        propTypes: {
            property: React.PropTypes.object.isRequired
        },

        render: function() {
            var property = this.props.property;
            var header = property.name;
            if (property.type) {
                header += " : " + utils.capitalizeFirstCharacter(property.type[0]);
            }

            return (
                <div id="property" className="property">
                    <h3>{header}</h3>
                    <p dangerouslySetInnerHTML={{__html: property.description.full}} />
                </div>
            );
        }
    });
});