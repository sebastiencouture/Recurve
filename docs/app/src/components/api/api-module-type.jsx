/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiModuleType", null, function() {

    return React.createClass({
        render: function() {
            return (
                <div>api module type {this.props.name}</div>
            );
        }
    });
});