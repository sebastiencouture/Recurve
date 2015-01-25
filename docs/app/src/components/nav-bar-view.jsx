/** @jsx React.DOM */

"use strict";

docsModule.factory("NavBarView", ["$state"], function($state) {
    return React.createClass({
        render: function() {
            var Navbar = ReactBootstrap.Navbar;
            var Nav = ReactBootstrap.Nav;
            var NavItem = ReactBootstrap.NavItem;

            return (
                <Navbar staticTop={true} brand="Recurve">
                    <Nav right={true}>
                        <NavItem eventKey={1} href={$state.nameToHref("api")}>API</NavItem>
                        <NavItem eventKey={2} href={$state.nameToHref("tutorial")}>Tutorials</NavItem>
                        <NavItem eventKey={3} href={$state.nameToHref("guide")}>Guides</NavItem>
                        <NavItem eventKey={4} href="#">GitHub</NavItem>
                    </Nav>
                </Navbar>
            );
        }
    });
});