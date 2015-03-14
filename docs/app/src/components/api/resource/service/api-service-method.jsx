/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceMethod", ["ApiDescription", "ApiServiceMethodName", "ApiParameters", "ApiReturns", "ApiThrows"],
    function(ApiDescription, ApiServiceMethodName, ApiParameters, ApiReturns, ApiThrows) {

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
                    <ApiDescription className="description-detailed" description={method.description.full} />
                    <ApiParameters parameters={method.params} />
                    <ApiReturns returns={method.returns} />
                    <ApiThrows throws={method.throws} />
                </div>
            );
        }
    });
});