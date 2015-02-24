/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceMethodsSummary", null, function() {

    function renderMethods(methods) {
        return methods.map(function(method) {
            var href = "#" + method.name;
            var returns = method.returns ? method.returns.type : null;
            return (
                <div key={method.name}>
                    <dt><small>{returns}</small></dt>
                    <dd><a href={href}>{method.nameWithParams}</a></dd>
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
                <div className="summary-methods">
                    <h3>Methods</h3>
                    <dl className="dl-horizontal">
                        {renderMethods(methods)}
                    </dl>
                </div>
            );
        }
    });
});