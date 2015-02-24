/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiObject", ["utils"], function(utils) {

    return React.createClass({
        displayName: "ApiObject",

        propTypes: {
            resource: React.PropTypes.object.isRequired
        },

        render: function() {
            var resource = this.props.resource;
            return (
                <div className="resource-object">
                    <div id="header" className="header">
                        <h2>{resource.name}</h2>
                        <strong>Module: </strong>{utils.capitalizeFirstCharacter(resource.module)}
                        <div>
                            <strong>Source: </strong><a href="http://www.github.com">GitHub</a>
                        </div>
                    </div>
                    <div className="description-detailed" dangerouslySetInnerHTML={{__html: resource.description.full}} />
                </div>
            );
        }
    });
});