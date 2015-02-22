/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiOverview", null, function() {

    return React.createClass({
        displayName: "ApiOverview",

        render: function() {
            return (
                <div>api overview {this.props.name}</div>
            );
        }
    });
});