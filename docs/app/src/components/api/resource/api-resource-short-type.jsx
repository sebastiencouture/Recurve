/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceShortType", null, function() {

    function renderMethods(methods) {
        return methods.map(function(method) {
            var href = "#" + method.name;
            return (
                <div key={method.name}>
                    <dt><a href={href}>{method.name}</a></dt>
                    <dd dangerouslySetInnerHTML={{__html: method.shortDescription}} />
                </div>
            );
        });
    }

    return React.createClass({
        render: function() {
            var methods = this.props.methods;

            return (
                <div className="resource-methods">
                    <h3>{this.props.header}</h3>
                    <dl className="dl-horizontal">
                        {renderMethods(methods)}
                    </dl>
                </div>
            );
        }
    });
});