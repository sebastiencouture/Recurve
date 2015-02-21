/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceDetailedDescription", null, function() {

    return React.createClass({
        render: function() {
            return (
                <div className="resource-detailed-description">
                    <h3>Detailed Description</h3>
                    <div dangerouslySetInnerHTML={{__html: this.props.description}} />
                </div>
            );
        }
    });
});