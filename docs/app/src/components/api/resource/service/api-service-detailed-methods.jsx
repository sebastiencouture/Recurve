/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceDetailedMethods", ["ApiServiceMethod"], function(ApiServiceMethod) {

    function renderMethods(methods) {
        var index = 0;
        return methods.map(function(method) {
            index++;
            return <ApiServiceMethod key={index} method={method} />
        });
    }

    return React.createClass({
        displayName: "ApiServiceDetailedMethods",

        propTypes: {
            methods: React.PropTypes.array
        },

        render: function() {
            var methods = this.props.methods;
            if (!methods || !methods.length) {
                return null;
            }

            return (
                <div id="detailed-methods" className="detailed-methods">
                    <h3>Detailed Methods</h3>
                    {renderMethods(methods)}
                </div>
            );
        }
    });
});