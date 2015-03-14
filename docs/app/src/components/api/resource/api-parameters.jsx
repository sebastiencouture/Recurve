/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiParameters", ["utils", "ApiDescription"], function(utils, ApiDescription) {

    function renderParameters(parameters) {
        var key = 0;
        return parameters.map(function(parameter) {
            key++;
            return (
                <div key={key} className="parameter">
                    <strong>{parameter.name}</strong> <small className="types">{utils.join(parameter.types)}</small>
                    <ApiDescription className="description" description={parameter.description} />
                </div>
            );
        });
    }

    return React.createClass({
        displayName: "ApiParameters",

        propTypes: {
            parameters: React.PropTypes.array
        },

        render: function() {
            var parameters = this.props.parameters;
            if (!parameters || !parameters.length) {
                return null;
            }

            return (
                <div className="parameters">
                    <h4>Parameters</h4>
                    {renderParameters(this.props.parameters)}
                </div>
            );
        }
    });
});