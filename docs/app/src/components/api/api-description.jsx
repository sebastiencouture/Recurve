/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiDescription", ["$window"], function($window) {

    return React.createClass({
        displayName: "ApiDescription",

        propTypes: {
            description: React.PropTypes.string.isRequired
        },

        componentDidMount: function() {
            $window.prettyPrint();
        },

        render: function() {
            return (<div className="description-detailed" dangerouslySetInnerHTML={{ __html: this.props.description }} />);
        }
    });
});