"use strict";

docsModule.factory("apiStore", ["contentStore", "docsService"], function(contentStore, docsService) {
    var store = contentStore(contentParser);
    var metadata;

    var apiActions = docsService.actions.metadata.api;
    store.onAction(apiActions.success, function(data) {
        metadata = data;
        store.changed();
    });

    store.onAction(apiActions.error, function() {
        metadata = null;
        store.changed();
    });

    function contentParser(data) {
        return data.api;
    }

    return recurve.extend(store, {
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

        getIndexResourceMetadata: function(moduleName) {
            if (!metadata) {
                return null;
            }

            var metadataModule = metadata[moduleName];
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
        }
    });
});