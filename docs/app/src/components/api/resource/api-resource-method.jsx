/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceMethod", ["ApiResourceMethodName"], function(ApiResourceMethodName) {

    return React.createClass({
        displayName: "ApiResourceMethod",

        propTypes: {
            method: React.PropTypes.object.isRequired
        },

        render: function() {
            var method = this.props.method;
            return (
                <div id="method" className="method">
                    <ApiResourceMethodName method={method} />
                    <p dangerouslySetInnerHTML={{__html: method.description.full}} />
                    <h4>Parameters</h4>
                    <h4>Returns</h4>
                    <h4>Throws</h4>
                </div>
            );
        }
    });
});