/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceMethodName", ["utils", "ApiServiceName"], function(utils, ApiServiceName) {

    return React.createClass({
        displayName: "ApiServiceMethodName",

        propTypes: {
            method: React.PropTypes.object.isRequired
        },

        render: function() {
            var method = this.props.method;
            return (
                <ApiServiceName name={utils.methodNameWithParams(method)} type={utils.join(method.returns.types)} />
            );
        }
    });
});