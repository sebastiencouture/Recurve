/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiModuleResource", null, function() {

    return React.createClass({
        render: function() {
            return (
                <div>api module resource {this.props.name}</div>
            );
        }
    });
});