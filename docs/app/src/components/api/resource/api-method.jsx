/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiMethod", ["utils", "ApiParameters", "ApiReturns", "ApiThrows"],
    function(utils, ApiParameters, ApiReturns, ApiThrows) {

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
                        <div>
                            <strong>Source: </strong><a href="http://www.github.com">GitHub</a>
                        </div>
                    </div>
                    <div className="method">
                        <p dangerouslySetInnerHTML={{__html: resource.description.full}} />
                        <ApiParameters parameters={resource.params} />
                        <ApiReturns returns={resource.returns} />
                        <ApiThrows throws={resource.throws} />
                    </div>
                </div>
            );
        }
    });
});