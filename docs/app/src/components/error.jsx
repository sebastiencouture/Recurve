/** @jsx React.DOM */

"use strict";

docsModule.factory("Error", null, function() {

    return React.createClass({
        displayName: "Error",

        render: function() {
            return (
                <div className="container">error!</div>
            );
        }
    });
});