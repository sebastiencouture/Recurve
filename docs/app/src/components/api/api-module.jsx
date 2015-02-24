/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiModule", ["utils", "ApiTypeSummary"], function(utils, ApiTypeSummary) {

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
            <div>
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
            var moduleName = this.props.$state.params.module;
            var metadata = this.props.$state.data.metadata;
            var resource = this.props.$state.data.resource;

            return (
                <div>
                    <h2>{utils.capitalizeFirstCharacter(moduleName)}</h2>
                    <p dangerouslySetInnerHTML={{__html: resource.description.full}} />
                    <hr />
                    {renderMetadata(metadata)}
                </div>
            );
        }
    });
});