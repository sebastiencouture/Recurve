/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiResourceHeader", null, function() {

    function renderDependencies(resource) {
        var names = resource.requires ? resource.requires.join(", ") : "none";
        return (
            <div>
                <dt>Dependencies</dt>
                <dd>{names}</dd>
            </div>
        );
    }

    return React.createClass({
        render: function() {
            var PageHeader = ReactBootstrap.PageHeader;
            var resource = this.props.resource;

            return (
                <div className="resource-header">
                    <PageHeader>{resource.name}</PageHeader>
                    <dl className="dl-horizontal">
                        <dt>Module</dt>
                        <dd>{resource.module}</dd>
                        {renderDependencies(resource)}
                    </dl>
                </div>
            );
        }
    });
});