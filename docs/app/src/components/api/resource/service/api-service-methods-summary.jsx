/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceMethodsSummary", ["utils"], function(utils) {

    function renderMethods(methods) {
        return methods.map(function(method) {
            var href = "#" + method.name;
            return (
                <div key={method.name}>
                    <dt><small>{utils.join(method.returns.types)}</small></dt>
                    <dd><a href={href}>{utils.methodNameWithParams(method)}</a></dd>
                </div>
            );
        });
    }

    return React.createClass({
        displayName: "ApiServiceMethodsSummary",

        propTypes: {
            methods: React.PropTypes.array
        },

        render: function() {
            var methods = this.props.methods;
            if (!methods || !methods.length) {
                return null;
            }

            return (
                <div className="methods-summary">
                    <h3>Methods</h3>
                    <dl className="dl-horizontal">
                        {renderMethods(methods)}
                    </dl>
                </div>
            );
        }
    });
});