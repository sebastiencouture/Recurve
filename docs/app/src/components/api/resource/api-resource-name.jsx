/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceName", ["utils"], function(utils) {

    return React.createClass({
        displayName: "ApiResourceName",

        propTypes: {
            name: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired
        },

        render: function() {
            var type = utils.capitalizeFirstCharacter(this.props.type);
            return (
                <div className="name">
                    <h3>{this.props.name} <small>{type}</small></h3>
                </div>
            );
        }
    });
});