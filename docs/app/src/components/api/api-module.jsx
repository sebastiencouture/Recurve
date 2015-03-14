/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiModule", ["utils", "ApiDescription", "ApiTypeSummary"], function(utils, ApiDescription, ApiTypeSummary) {

    function renderMetadata(metadata) {
        if (!metadata || !metadata.children) {
            return null;
        }

        var types = [];
        recurve.forEach(metadata.children, function(typeMetadata, name) {
            types.push(renderTypeMetadata(name, typeMetadata));
        });

        return (<div>{types}</div>);
    }

    function renderTypeMetadata(name, typeMetadata) {
        if (!typeMetadata || !typeMetadata.children) {
        return null;
        }

        return (
            <div key={name}>
                <h3>{utils.capitalizeFirstCharacter(name)}s</h3>
                <ApiTypeSummary metadata={typeMetadata} />
            </div>
        );
    }

    return React.createClass({
        displayName: "ApiModule",

        propTypes: {
            $state: React.PropTypes.object.isRequired
        },

        render: function() {
            var metadata = this.props.$state.data.metadata;
            var resource = this.props.$state.data.resource;
            var module = resource.getModule();

            return (
                <div className="module">
                    <h2>{utils.capitalizeFirstCharacter(module.name)}</h2>
                    <ApiDescription description={module.description.full} />
                    <hr />
                    {renderMetadata(metadata)}
                </div>
            );
        }
    });
});