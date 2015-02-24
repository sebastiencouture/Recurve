/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiType", ["utils", "ApiTypeSummary"], function(utils, ApiTypeSummary) {

    return React.createClass({
        displayName: "ApiType",

        propTypes: {
            $state: React.PropTypes.object.isRequired
        },

        render: function() {
            var moduleName = this.props.$state.params.module;
            var typeName = this.props.$state.params.type;
            var metadata = this.props.$state.data.metadata;

            return (
                <div className="type">
                    <h2>{utils.capitalizeFirstCharacter(typeName)}s</h2>
                    <strong>Module: </strong>{utils.capitalizeFirstCharacter(moduleName)}
                    <p>
                        <dl className="dl-horizontal">
                            <ApiTypeSummary metadata={metadata} />
                        </dl>
                    </p>
                </div>
            );
        }
    });
});