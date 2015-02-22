/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceDetailedDescription", null, function() {

    return React.createClass({
        displayName: "ApiResourceDetailedDescription",

        propTypes: {
            description: React.PropTypes.object.isRequired
        },

        render: function() {
            return (
                <div id="detailed-description" className="detailed-description">
                    <h3>Detailed Description</h3>
                    <div dangerouslySetInnerHTML={{__html: this.props.description.full}} />
                </div>
            );
        }
    });
});