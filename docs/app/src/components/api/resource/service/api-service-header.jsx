/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceHeader", ["utils"], function(utils) {

    function renderDependencies(resource) {
        var names = resource.requires ? resource.requires.join(", ") : "none";
        return (
            <div>
                <strong>Dependencies: </strong>{names}
            </div>
        );
    }

    return React.createClass({
        displayName: "ApiServiceHeader",

        propTypes: {
            resource: React.PropTypes.object.isRequired
        },

        render: function() {
            var resource = this.props.resource;

            return (
                <div id="header" className="header">
                    <h2>{resource.name}</h2>
                    <p>{resource.description.summary} <a href="#detailed-description">more...</a></p>
                    <strong>Module: </strong>{utils.capitalizeFirstCharacter(resource.module)}
                    {renderDependencies(resource)}
                    <strong>Source: </strong><a href="http://www.github.com">GitHub</a>
                </div>
            );
        }
    });
});