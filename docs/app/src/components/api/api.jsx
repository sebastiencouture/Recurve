/** @jsx React.DOM */

"use strict";

docsModule.factory("Api", ["apiStore", "$State", "SideBar"], function(apiStore, State, SideBar) {

    return React.createClass({
        displayName: "Api",

        render: function() {
            var Grid = ReactBootstrap.Grid;
            var Row = ReactBootstrap.Row;
            var Col = ReactBootstrap.Col;

            return (
                <div className="container api">
                    <Grid>
                        <Row>
                            <Col xs={6} md={3}>
                                <SideBar items={apiStore.getMetadata()} />
                            </Col>
                            <Col xs={12} md={9}>
                                <State />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
    });
});