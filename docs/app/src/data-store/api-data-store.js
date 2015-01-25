"use strict";

docsModule.factory("apiDataStore", ["contentDataStore", "docsService"], function(contentDataStore, docsService) {
    var dataStore = contentDataStore(contentParser);
    var metadata;

    var apiActions = docsService.actions.metadata.api;
    apiActions.success.on(function(data) {
        metadata = data;
        dataStore.changed();
    }, null, dataStore);
    apiActions.error.on(function() {
        metadata = null;
        dataStore.changed();
    });

    function contentParser(data) {
        return data.api;
    }

    return recurve.extend(dataStore, {
        getMetadata: function() {
            return metadata;
        },

        getResourceMetadata: function(module, type, name) {
            if (!metadata) {
                return null;
            }

            var metadataModule = metadata[module];
            if (!metadataModule || !type) {
                return metadataModule;
            }

            var metadataType = metadataModule[type];
            if (!name) {
                return metadataType;
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

        getIndexResourceMetadata: function(module) {
            if (!metadata) {
                return null;
            }

            var metadataModule = metadata[module];
            if (!metadataModule) {
                return null;
            }

            var found = null;
            recurve.forEach(metadataModule, function(resource) {
                if (resource.isIndex) {
                    found = resource;
                    return false;
                }
            });

            return found;
        },
    });
});