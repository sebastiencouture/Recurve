/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceMethodsShort", null, function() {

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
        displayName: "ApiServiceMethodsShort",

        propTypes: {
            methods: React.PropTypes.array.isRequired
        },

        render: function() {
            return (
                <div className="methods-short">
                    <h3>Methods</h3>
                    <dl className="dl-horizontal">
                        {renderMethods(this.props.methods)}
                    </dl>
                </div>
            );
        }
    });
});