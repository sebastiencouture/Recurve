/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceMethodName", ["ApiResourceName"], function(ApiResourceName) {

    return React.createClass({
        displayName: "ApiResourceMethodName",

        propTypes: {
            method: React.PropTypes.object.isRequired,
            type: React.PropTypes.string.isRequired
        },

        render: function() {
            var method = this.props.method;
            var returns = method.returns ? method.returns.type : null;
            return (
                <ApiResourceName name={method.nameWithParams} type={returns} />
            );
        }
    });
});