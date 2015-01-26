"use strict";

docsModule.factory("versionStore", ["$dataStore", "docsService"], function($dataStore, docsService) {
    var dataStore = $dataStore();
    var metadata;

    var actions = docsService.actions.metadata.version;
    actions.success.on(function(data) {
        metadata = data;
        dataStore.changed();
    }, null, dataStore);
    actions.error.on(function() {
        metadata = null;
        dataStore.changed();
    });

    return recurve.extend(dataStore, {
        getVersion: function() {
            return metadata ? metadata.version : null;
        }
    });
});