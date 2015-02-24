/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceDetailedDescription", null, function() {

    return React.createClass({
        displayName: "ApiServiceDetailedDescription",

        propTypes: {
            description: React.PropTypes.object.isRequired
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