/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceMethod", ["ApiServiceMethodName", "ApiParameters"],
    function(ApiServiceMethodName, ApiParameters) {

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
                    <ApiParameters parameters={method.params} />
                    <h4>Returns</h4>
                    <h4>Throws</h4>
                </div>
            );
        }
    });
});