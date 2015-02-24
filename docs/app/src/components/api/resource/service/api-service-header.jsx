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
            var description = resource.description.summary + "<a class='more' href='#detailed-description'>more...</a>";
            return (
                <div id="header" className="header">
                    <h2>{resource.name}</h2>
                    <strong>Module: </strong>{utils.capitalizeFirstCharacter(resource.module)}
                    {renderDependencies(resource)}
                    <strong>Source: </strong><a href="http://www.github.com">GitHub</a>
                    <div className="description-summary" dangerouslySetInnerHTML={{__html: description}} />
                </div>
            );
        }
    });
});