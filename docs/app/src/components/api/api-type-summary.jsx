/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiTypeSummary", null, function() {

    function renderResources(resources) {
        if (!resources) {
            return null;
        }

        return resources.map(function(resource) {
            var href = resource.href;
            return (
                <div key={resource.name}>
                    <dt><a href={href}>{resource.name}</a></dt>
                    <dd dangerouslySetInnerHTML={{__html: resource.description.summary}} />
                </div>
            );
        });
    }

    return React.createClass({
        displayName: "ApiTypeSummary",

        propTypes: {
            metadata: React.PropTypes.object.isRequired
        },

        render: function() {
            return (
                <div>
                    <dl className="dl-horizontal">
                        {renderResources(this.props.metadata.children)}
                    </dl>
                </div>
            );
        }
    });
});