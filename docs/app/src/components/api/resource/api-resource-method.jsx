/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceMethod", null, function() {

    return React.createClass({
        displayName: "ApiResourceMethod",

        propTypes: {
            method: React.PropTypes.object.isRequired
        },

        render: function() {
            var method = this.props.method;

            return (
                <div id="method" className="method">
                    <h3>{method.name}</h3>
                    <p>{method.description.summary}</p>
                    <h4>Parameters</h4>
                    <h4>Returns</h4>
                    <h4>Throws</h4>
                    <h4>Detailed Description</h4>
                    <h4>Examples</h4>
                </div>
            );
        }
    });
});