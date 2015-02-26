/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiReturns", ["utils"], function(utils) {

    return React.createClass({
        displayName: "ApiReturns",

        propTypes: {
            returns: React.PropTypes.object
        },

        render: function() {
            var returns = this.props.returns;
            if (!returns) {
                return null;
            }

            return (
                <div>
                    <h4>Returns</h4>
                    <div className="returns">
                        <strong>{utils.join(returns.types)}</strong>
                        <div className="description" dangerouslySetInnerHTML={{__html: returns.description}} />
                    </div>
                </div>
             );
        }
    });
});