/** @jsx React.DOM */

"use strict";

docsModule.factory("ErrorView", null, function() {

    return React.createClass({
        render: function() {
            return (
                <div className="container">error!</div>
            );
        }
    });
});