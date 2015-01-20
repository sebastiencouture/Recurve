"use strict";

docsModule.factory("apiDataStore", ["$dataStore", "docsService"], function($dataStore, docsService) {
    var dataStore = $dataStore();
    var metadata;
    var contentMetadata;

    var apiActions = docsService.actions.metadata.api;
    apiActions.success.on(function(data) {
        metadata = data;
        dataStore.changed();
    }, null, dataStore);
    apiActions.error.on(function() {
        metadata = null;
        dataStore.changed();
    });

    var contentActions = docsService.actions.metadata.content;
    contentActions.success.on(function(data) {
        contentMetadata = data.api;
        dataStore.changed();
    }, null, dataStore);
    contentActions.error.on(function() {
        contentMetadata = null;
        dataStore.changed();
    });

    return recurve.extend(dataStore, {
        getResource: function(module, type, name) {
            if (!metadata) {
                return null;
            }

            var metadataModule = metadata[module];
            if (!metadataModule) {
                return null;
            }

            var metadataType = metadataModule[type];
            if (!metadataType) {
                return null;
            }

            var found = null;
            recurve.forEach(metadataType, function(resource) {
                if (resource.name === name) {
                    found = resource;
                    return false;
                }
            });

            return found;
        },

        // TODO TBD duplicate, implement content-data-store that this, guide-data-store, and tutorial-data-store extends
        getContentResource: function(id) {
            if (!contentMetadata) {
                return null;
            }

            var found = null;
            recurve.forEach(contentMetadata, function(content) {
                if (content.id === id) {
                    found = content;
                    return false;
                }
            });

            return found;
        }
    });
});