"use strict";

docsModule.factory("versionStore", ["$store", "docsService"], function($store, docsService) {
    var store = $store();
    var metadata;

    var actions = docsService.actions.metadata.version;
    store.onAction(actions.success, function(data) {
        metadata = data;
        store.changed.trigger();
    }, null, store);

    store.onAction(actions.error, function() {
        metadata = null;
        store.changed.trigger();
    });

    return recurve.extend(store, {
        getVersion: function() {
            return metadata ? metadata.version : null;
        }
    });
});