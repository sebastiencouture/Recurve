/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiView", ["ApiSideBarView"], function(ApiSideBarView) {

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
                                <ApiSideBarView />
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