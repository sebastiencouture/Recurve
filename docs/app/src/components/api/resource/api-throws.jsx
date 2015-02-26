/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiThrows", ["utils"], function(utils) {

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
                        <div className="description" dangerouslySetInnerHTML={{__html: throws.description}} />
                    </div>
                </div>
            );
        }
    });
});