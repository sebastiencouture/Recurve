/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiServiceProperty", ["utils", "ApiDescription", "ApiServiceName"],
    function(utils, ApiDescription, ApiServiceName) {

    return React.createClass({
        displayName: "ApiServiceProperty",

        propTypes: {
            property: React.PropTypes.object.isRequired
        },

        render: function() {
            var property = this.props.property;
            return (
                <div className="property">
                    <ApiServiceName name={property.name} type={utils.join(property.type)} />
                    <ApiDescription className="description-detailed" description={property.description.full} />
                </div>
            );
        }
    });
});