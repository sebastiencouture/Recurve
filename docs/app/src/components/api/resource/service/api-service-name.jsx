/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceName", ["utils"], function(utils) {

    return React.createClass({
        displayName: "ApiServiceName",

        propTypes: {
            name: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired
        },

        render: function() {
            return (
                <div className="name">
                    <h3>{this.props.name} <small>{this.props.type}</small></h3>
                </div>
            );
        }
    });
});