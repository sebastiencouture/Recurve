/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceMethod", ["ApiServiceMethodName"], function(ApiServiceMethodName) {

    return React.createClass({
        displayName: "ApiServiceMethod",

        propTypes: {
            method: React.PropTypes.object.isRequired
        },

        render: function() {
            var method = this.props.method;
            return (
                <div id="method" className="method">
                    <ApiServiceMethodName method={method} />
                    <p dangerouslySetInnerHTML={{__html: method.description.full}} />
                    <h4>Parameters</h4>
                    <h4>Returns</h4>
                    <h4>Throws</h4>
                </div>
            );
        }
    });
});