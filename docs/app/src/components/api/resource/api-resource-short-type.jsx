/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceShortType", null, function() {

    function renderTypes(types) {
        return types.map(function(type) {
            var href = "#" + type.name;
            return (
                <div key={type.name}>
                    <dt><a href={href}>{type.name}</a></dt>
                    <dd dangerouslySetInnerHTML={{__html: type.description.summary}} />
                </div>
            );
        });
    }

    return React.createClass({
        displayName: "ApiResourceShortType",

        propTypes: {
            header: React.PropTypes.string.isRequired,
            types: React.PropTypes.array.isRequired
        },

        render: function() {
            return (
                <div className="types">
                    <h3>{this.props.header}</h3>
                    <dl className="dl-horizontal">
                        {renderTypes(this.props.types)}
                    </dl>
                </div>
            );
        }
    });
});