/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceDetailedDescription", ["$window"], function($window) {

    return React.createClass({
        displayName: "ApiServiceDetailedDescription",

        propTypes: {
            description: React.PropTypes.object.isRequired
        },

        componentDidMount: function() {
            $window.prettyPrint();
        },

        render: function() {
            return (
                <div id="detailed-description">
                    <h3>Detailed Description</h3>
                    <div dangerouslySetInnerHTML={{__html: this.props.description.full}} />
                </div>
            );
        }
    });
});