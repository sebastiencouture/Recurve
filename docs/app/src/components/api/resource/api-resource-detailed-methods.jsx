/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceDetailedMethods", ["ApiResourceMethod"], function(ApiResourceMethod) {

    function renderMethods(methods) {
        var index = 0;
        return methods.map(function(method) {
            index++;
            return <ApiResourceMethod key={index} method={method} />
        });
    }

    return React.createClass({
        displayName: "ApiResourceDetailedMethods",

        propTypes: {
            methods: React.PropTypes.array.isRequired
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