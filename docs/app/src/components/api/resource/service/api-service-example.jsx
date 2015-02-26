/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceExample", ["$window"], function($window) {

    return React.createClass({
        displayName: "ApiServiceExamples",

        propTypes: {
            example: React.PropTypes.object
        },

        componentDidMount: function() {
            $window.prettyPrint();
        },

        render: function() {
            var example = this.props.example;
            return (
                <div className="example">
                    <div className="clearfix">
                        <h5 className="pull-left description">{example.description}</h5>
                        <span className="pull-right link">
                            <a href={example.path}>GitHub</a>
                        </span>
                    </div>
                    <pre className="prettyprint linenums">
                        <code>{example.code}</code>
                    </pre>
                </div>
            );
        }
    });
});