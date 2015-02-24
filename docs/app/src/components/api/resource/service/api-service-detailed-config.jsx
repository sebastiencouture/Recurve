/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceDetailedConfig", ["ApiServiceProperty"], function(ApiServiceProperty) {

    function renderConfig(config) {
        var index = 0;
        return config.map(function(property) {
            index++;
            return <ApiServiceProperty key={index} property={property} />
        });
    }

    return React.createClass({
        displayName: "ApiServiceDetailedConfig",

        propTypes: {
            config: React.PropTypes.array.isRequired
        },

        render: function() {
            var config = this.props.config;
            if (!config || !config.length) {
                return null;
            }

            return (
                <div id="detailed-config">
                    <h3>Detailed Config</h3>
                    {renderConfig(config)}
                </div>
            );
        }
    });
});