/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiView", ["apiDataStore", "SideBarView"], function(apiDataStore, SideBarView) {

    return React.createClass({
        render: function() {
            var Grid = ReactBootstrap.Grid;
            var Row = ReactBootstrap.Row;
            var Col = ReactBootstrap.Col;

            return (
                <div className="container">
                    <Grid>
                        <Row>
                            <Col xs={6} md={3}>
                                <SideBarView items={apiDataStore.getMetadata()} />
                            </Col>
                            <Col xs={12} md={9}>
                                <div>main api</div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
    });
});