/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceExamples", null, function() {

    function renderExamples(config) {

    }

    return React.createClass({
        displayName: "ApiResourceExamples",

        propTypes: {
            examples: React.PropTypes.array.isRequired
        },

        render: function() {
            var examples = this.props.examples;
            if (!examples || !examples.length) {
                return null;
            }

            return (
                <div id="examples" className="examples">
                    <h3>Examples</h3>
                    {renderExamples(examples)}
                </div>
            );
        }
    });
});