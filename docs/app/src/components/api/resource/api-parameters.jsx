/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiParameters", null, function() {

    function renderParameters(parameters) {
        var key = 0;
        return parameters.map(function(parameter) {
            var types = parameter.types ? parameter.types.join("|") : null;
            return (
                <div key={key} className="parameter">
                    <strong>{parameter.name}</strong> <small className="types">{types}</small>
                    <div className="description" dangerouslySetInnerHTML={{__html: parameter.description}} />
                </div>
            );
        });
    }

    return React.createClass({
        displayName: "ApiParameters",

        propTypes: {
            parameters: React.PropTypes.array.isRequired
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