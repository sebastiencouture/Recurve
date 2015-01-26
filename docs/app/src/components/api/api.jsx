/** @jsx React.DOM */

"use strict";

docsModule.factory("Api", ["apiStore", "SideBar", "ApiOverview", "ApiModule", "ApiModuleType", "ApiModuleResource"],
    function(apiStore, SideBar, ApiOverview, ApiModule, ApiModuleType, ApiModuleResource) {

    function renderSection(appState) {
        var section;
        switch (appState.name) {
            case "api":
                section = <ApiOverview />;
                break;
            case "apiModule":
                section = <ApiModule />;
                break;
            case "apiModuleType":
                section = <ApiModuleType />;
                break;
            case "apiModuleResource":
                section = <ApiModuleResource />;
                break;
            default:
                recurve.assert(false, "un-expected api state {0}", this.props.appState);
        }

        return section;
    }

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
                                <SideBar items={apiStore.getMetadata()} />
                            </Col>
                            <Col xs={12} md={9}>
                                {renderSection(this.props.appState)}
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
    });
});