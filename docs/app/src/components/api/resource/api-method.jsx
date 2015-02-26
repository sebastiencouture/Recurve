/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiMethod", ["$window", "utils", "ApiParameters", "ApiReturns", "ApiThrows"],
    function($window, utils, ApiParameters, ApiReturns, ApiThrows) {

    return React.createClass({
        displayName: "ApiMethod",

        propTypes: {
            method: React.PropTypes.object.isRequired
        },

        componentDidMount: function() {
            $window.prettyPrint();
        },

        render: function() {
            var method = this.props.method;
            return (
                <div className="resource-method">
                    <div id="header" className="header">
                        <h2>{utils.methodNameWithParams(method)} <small>{utils.join(method.returns.types)}</small></h2>
                        <strong>Module: </strong>{utils.capitalizeFirstCharacter(method.module)}
                        <div>
                            <strong>Source: </strong><a href="http://www.github.com">GitHub</a>
                        </div>
                    </div>
                    <div className="description-detailed" dangerouslySetInnerHTML={{__html: method.description.full}} />
                    <div className="method">
                        <ApiParameters parameters={method.params} />
                        <ApiReturns returns={method.returns} />
                        <ApiThrows throws={method.throws} />
                    </div>
                </div>
            );
        }
    });
});