/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceMethod", ["ApiResourceName"], function(ApiResourceName) {

    return React.createClass({
        displayName: "ApiResourceMethod",

        propTypes: {
            method: React.PropTypes.object.isRequired
        },

        render: function() {
            var method = this.props.method;
            var returns = method.returns ? method.returns.types[0] : null;
            return (
                <div id="method" className="method">
                    <ApiResourceName name={method.name} type={returns} />
                    <p dangerouslySetInnerHTML={{__html: method.description.full}} />
                    <h4>Parameters</h4>
                    <h4>Returns</h4>
                    <h4>Throws</h4>
                </div>
            );
        }
    });
});