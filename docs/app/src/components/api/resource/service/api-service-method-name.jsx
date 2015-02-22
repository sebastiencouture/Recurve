/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceMethodName", ["ApiServiceName"], function(ApiServiceName) {

    return React.createClass({
        displayName: "ApiServiceMethodName",

        propTypes: {
            method: React.PropTypes.object.isRequired,
            type: React.PropTypes.string.isRequired
        },

        render: function() {
            var method = this.props.method;
            var returns = method.returns ? method.returns.type : null;
            return (
                <ApiServiceName name={method.nameWithParams} type={returns} />
            );
        }
    });
});