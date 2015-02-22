/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceDetailedConfig", ["ApiResourceProperty"], function(ApiResourceProperty) {

    function renderConfig(config) {
        var index = 0;
        return config.map(function(property) {
            index++;
            return <ApiResourceProperty key={index} property={property} />
        });
    }

    return React.createClass({
        displayName: "ApiResourceDetailedConfig",

        propTypes: {
            config: React.PropTypes.array.isRequired
        },

        render: function() {
            var config = this.props.config;
            if (!config || !config.length) {
                return null;
            }

            return (
                <div id="detailed-config" className="detailed-config">
                    <h3>Detailed Config</h3>
                    {renderConfig(config)}
                </div>
            );
        }
    });
});