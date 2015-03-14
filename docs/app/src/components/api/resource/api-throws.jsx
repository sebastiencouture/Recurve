/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiThrows", ["utils", "ApiDescription"], function(utils, ApiDescription) {

    return React.createClass({
        displayName: "ApiThrows",

        propTypes: {
            throws: React.PropTypes.object
        },

        render: function() {
            var throws = this.props.throws;
            if (!throws) {
                return null;
            }

            return (
                <div>
                    <h4>Throws</h4>
                    <div className="throws">
                        <strong>{utils.join(throws.types)}</strong>
                        <ApiDescription className="description" description={throws.description} />
                    </div>
                </div>
            );
        }
    });
});