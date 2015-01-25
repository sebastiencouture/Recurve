/** @jsx React.DOM */

"use strict";

docsModule.factory("SideBarView", ["utils"], function(utils) {

    function renderListItems(items) {
        var Glyphicon = ReactBootstrap.Glyphicon;
        var listItems = null;

        if (recurve.isArray(items)) {
            listItems = items.map(function(item) {
                return (
                    <li>{item.name}</li>
                );
            });
        }
        else if (items) {
            listItems = [];
            recurve.forEach(items, function(item, name) {
                name = utils.capitalizeFirstCharacter(name);
                var id = "list-section-" + name;

                listItems.push(
                    <li>
                        {name}
                        <Glyphicon className="pull-left" data-toggle="collapse" data-target={"#" + id}></Glyphicon>
                        <ul id={id} className="list-unstyled collapse in">
                            {renderListItems(item)}
                        </ul>
                    </li>
                );
            });
        }
        else {
            // do nothing - nothing to render
        }

        return listItems;
    }

    return React.createClass({
        render: function() {
            var Panel = ReactBootstrap.Panel;

            return (
                <div className="side-bar">
                    <Panel>
                        <ul className="list-unstyled collapse in">
                            {renderListItems(this.props.items)}
                        </ul>
                    </Panel>
                </div>
            );
        }
    });
});