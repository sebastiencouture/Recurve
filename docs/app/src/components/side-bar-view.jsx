/** @jsx React.DOM */

"use strict";

docsModule.factory("SideBarView", ["utils"], function(utils) {
    var Glyphicon = ReactBootstrap.Glyphicon;

    function renderItems(items, parentId) {
        var list = null;
        if (recurve.isArray(items)) {
            list = items.map(function(item) {
                return (
                    <li>{item.name}</li>
                );
            });
        }
        else if (items) {
            list = [];
            recurve.forEach(items, function(item, name) {
                name = utils.capitalizeFirstCharacter(name);
                var id = "list-collapse-" + name;
                var children;

                if (recurve.isArray(item)) {
                    children = (
                        <ul id={id} className="list-unstyled collapse in">
                            {renderItems(item)}
                        </ul>
                    );
                }
                else {
                    children = renderItems(item, id);
                }

                list.push(
                    <ul id={parentId} className="list-unstyled collapse in">
                        <li>{name}<Glyphicon className="pull-left" data-toggle="collapse" data-target={"#" + id}></Glyphicon>
                            {children}
                        </li>
                    </ul>
                );
            });
        }
        else {
            // do nothing - nothing to render
        }

        return list;
    }

    return React.createClass({
        render: function() {
            var Panel = ReactBootstrap.Panel;

            return (
                <div className="side-bar">
                    <Panel>
                        {renderItems(this.props.items)}
                    </Panel>
                </div>
            );
        }
    });
});