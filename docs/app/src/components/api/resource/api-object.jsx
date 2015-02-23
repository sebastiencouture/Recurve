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
                <div>
                    <div id="header" className="header">
                        <h2>{resource.name}</h2>
                        <strong>Module: </strong>{utils.capitalizeFirstCharacter(resource.module)}
                    </div>
                    <div className="object">
                        <p dangerouslySetInnerHTML={{__html: resource.description.full}} />
                    </div>
                </div>
            );
        }
    });
});