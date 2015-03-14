/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceDetailedDescription", ["$window", "ApiDescription"], function($window, ApiDescription) {

    return React.createClass({
        displayName: "ApiServiceDetailedDescription",

        propTypes: {
            description: React.PropTypes.object.isRequired
        },

        render: function() {
            return (
                <div id="detailed-description">
                    <h3>Detailed Description</h3>
                    <ApiDescription description={this.props.description.full} />
                </div>
            );
        }
    });
});