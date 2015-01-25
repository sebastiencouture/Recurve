/** @jsx React.DOM */

"use strict";

docsModule.factory("ApiSideBarView", ["SideBarView", "apiDataStore"], function(SideBarView, apiDataStore) {

    return React.createClass({
        render: function() {
            return (
                <SideBarView items={apiDataStore.getMetadata()} />
            );
        }
    });
});