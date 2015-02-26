/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiObject", ["$window", "utils"], function($window, utils) {

    return React.createClass({
        displayName: "ApiObject",

        propTypes: {
            object: React.PropTypes.object.isRequired
        },

        componentDidMount: function() {
            $window.prettyPrint();
        },

        render: function() {
            var object = this.props.object;
            return (
                <div className="resource-object">
                    <div id="header" className="header">
                        <h2>{object.name}</h2>
                        <strong>Module: </strong>{utils.capitalizeFirstCharacter(object.module)}
                        <div>
                            <strong>Source: </strong><a href="http://www.github.com">GitHub</a>
                        </div>
                    </div>
                    <div className="description-detailed" dangerouslySetInnerHTML={{__html: object.description.full}} />
                </div>
            );
        }
    });
});