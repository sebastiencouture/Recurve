/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiObject", ["$window", "utils", "ApiDescription"], function($window, utils, ApiDescription) {

    return React.createClass({
        displayName: "ApiObject",

        propTypes: {
            object: React.PropTypes.object.isRequired
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
                    <ApiDescription className="description-detailed" description={object.description.full} />
                </div>
            );
        }
    });
});