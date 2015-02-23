/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiMethod", ["utils", "ApiParameters"], function(utils, ApiParameters) {

    return React.createClass({
        displayName: "ApiMethod",

        propTypes: {
            resource: React.PropTypes.object.isRequired
        },

        render: function() {
            var resource = this.props.resource;
            var returns = resource.returns ? resource.returns.type : null;
            return (
                <div>
                    <div id="header" className="header">
                        <h2>{resource.nameWithParams} <small>{returns}</small></h2>
                        <strong>Module: </strong>{utils.capitalizeFirstCharacter(resource.module)}
                    </div>
                    <div className="method">
                        <p dangerouslySetInnerHTML={{__html: resource.description.full}} />
                        <ApiParameters parameters={resource.params} />
                        <h4>Returns</h4>
                        <h4>Throws</h4>
                    </div>
                </div>
            );
        }
    });
});