/** @jsx React.DOM */

"use strict";

docsModule.factory("SideBar", ["utils"], function(utils) {

    function renderItems(items) {
        var Glyphicon = ReactBootstrap.Glyphicon;
        var renderables = null;

        if (recurve.isArray(items)) {
            renderables = items.map(function(item) {
                return (
                    <li>{item.name}</li>
                );
            });
        }
        else if (items) {
            renderables = [];
            recurve.forEach(items, function(item, name) {
                name = utils.capitalizeFirstCharacter(name);
                var id = "list-section-" + name;

                renderables.push(
                    <li>
                        {name}
                        <Glyphicon className="pull-left" data-toggle="collapse" data-target={"#" + id}></Glyphicon>
                        <ul id={id} className="list-unstyled collapse in">
                            {renderItems(item)}
                        </ul>
                    </li>
                );
            });
        }
        else {
            // do nothing - nothing to render
        }

        return renderables;
    }

    return React.createClass({
        render: function() {
            var Panel = ReactBootstrap.Panel;

            return (
                <div className="side-bar">
                    <Panel>
                        <ul className="list-unstyled collapse in">
                            {renderItems(this.props.items)}
                        </ul>
                    </Panel>
                </div>
            );
        }
    });
});