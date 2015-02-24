/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceMethod", ["ApiServiceMethodName", "ApiParameters", "ApiReturns", "ApiThrows"],
    function(ApiServiceMethodName, ApiParameters, ApiReturns, ApiThrows) {

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
                    <div className="description-detailed" dangerouslySetInnerHTML={{__html: method.description.full}} />
                    <ApiParameters parameters={method.params} />
                    <ApiReturns returns={method.returns} />
                    <ApiThrows throws={method.throws} />
                </div>
            );
        }
    });
});