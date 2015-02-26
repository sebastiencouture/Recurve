"use strict";

docsModule.factory("apiStore", ["contentStore", "docsService", "resource"], function(contentStore, docsService, resource) {
    var store = contentStore(contentParser);
    var metadata;
    var resourceByMetadataUrl = {};

    var metadataActions = docsService.actions.metadata.api;
    store.onAction(metadataActions.success, function(data) {
        metadata = data;
        store.changed.trigger();
    });

    store.onAction(metadataActions.error, function() {
        metadata = null;
        store.changed.trigger();
    });

    var resourceActions = docsService.actions.resource.api;
    store.onAction(resourceActions.success, function(data, metadata) {
        resourceByMetadataUrl[metadata.url] = resource(data);
        store.changed.trigger();
    });

    function contentParser(data) {
        return data.api;
    }

    return recurve.extend(store, {
        getMetadata: function() {
            return metadata;
        },

        getModuleMetadata: function(moduleName) {
            if (!metadata) {
                return null;
            }

            var moduleMetadata = metadata[moduleName];
            return moduleMetadata ? moduleMetadata : null;
        },

        getTypeMetadata: function(typeName, moduleName) {
            var moduleMetadata = this.getModuleMetadata(moduleName);
            if (!moduleMetadata) {
                return null;
            }

            var typeMetadata = moduleMetadata.children[typeName];
            return typeMetadata ? typeMetadata : null;
        },

        getResourceMetadata: function(resourceName, typeName, moduleName) {
            var typeMetadata = this.getTypeMetadata(typeName, moduleName);
            if (!typeMetadata) {
                return null;
            }

            return recurve.find(typeMetadata.children, "name", resourceName);
        },

        getResource: function(metadata) {
            var resource = resourceByMetadataUrl[metadata.url];
            return resource ? resource : null;
        }
    });
});