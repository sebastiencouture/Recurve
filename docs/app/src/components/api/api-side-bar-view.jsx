/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiSideBarView", null, function() {

    return React.createClass({
        render: function() {
            var Panel = ReactBootstrap.Panel;
            var PanelGroup = ReactBootstrap.PanelGroup;
            var ListGroup = ReactBootstrap.ListGroup;
            var ListGroupItem = ReactBootstrap.ListGroupItem;

            return (
                <div>
                <ListGroup>
                    <ListGroupItem active={true}>header 1</ListGroupItem>
                    <ListGroupItem href="#">test 1</ListGroupItem>
                    <ListGroupItem active={true}>header 2</ListGroupItem>
                    <ListGroupItem href="#">test 2</ListGroupItem>
                </ListGroup>
                    <Panel header={<a href="321312">sadasd</a>} eventKey="1">
                    blah blah
                    </Panel>
                    <Panel header="test2" eventKey="2">
                    blah blah
                    </Panel>
                    <ul>
                        <li>Core
                            <ul>
                                <li>Functions
                                    <ul>
                                        <li>recurve.extend</li>
                                    </ul>
                                </li>
                                <li>Services
                                    <ul>
                                        <li>$async</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>Flux</li>
                    </ul>
                </div>
            );
        }
    });
});