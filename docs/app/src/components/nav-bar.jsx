/** @jsx React.DOM */

"use strict";

docsModule.factory("NavBar", ["$stateRouter"], function($stateRouter) {
    return React.createClass({
        displayName: "NavBar",

        render: function() {
            var Navbar = ReactBootstrap.Navbar;
            var Nav = ReactBootstrap.Nav;
            var NavItem = ReactBootstrap.NavItem;

            return (
                <Navbar staticTop={true} brand="Recurve.js">
                    <Nav right={true}>
                        <NavItem eventKey={1} href={$stateRouter.nameToHref("app.api")}>API</NavItem>
                        <NavItem eventKey={2} href={$stateRouter.nameToHref("app.tutorial")}>Tutorials</NavItem>
                        <NavItem eventKey={3} href={$stateRouter.nameToHref("app.guide")}>Guides</NavItem>
                        <NavItem eventKey={4} href="#">GitHub</NavItem>
                    </Nav>
                </Navbar>
            );
        }
    });
});