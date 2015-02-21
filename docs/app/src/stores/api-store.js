"use strict";

docsModule.factory("apiStore", ["contentStore", "docsService"], function(contentStore, docsService) {
    var store = contentStore(contentParser);
    var metadata;
    var resources = {};

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
    store.onAction(resourceActions.success, function(data) {
        var name = getResourceUniqueName(data.module, data.rdoc, data.name);
        resources[name] = data;
        store.changed.trigger();
    });

    function getResourceUniqueName(moduleName, typeName, resourceName) {
        return moduleName + typeName + resourceName;
    }

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

        getTypeMetadata: function(moduleName, typeName) {
            var moduleMetadata = this.getModuleMetadata(moduleName);
            if (!moduleMetadata) {
                return null;
            }

            var typeMetadata = moduleMetadata.children[typeName];
            return typeMetadata ? typeMetadata : null;
        },

        getResourceMetadata: function(moduleName, typeName, resourceName) {
            var typeMetadata = this.getTypeMetadata(moduleName, typeName);
            if (!typeMetadata) {
                return null;
            }

            return recurve.find(typeMetadata.children, "name", resourceName);
        },

        getResource: function(moduleName, typeName, resourceName) {
            var name = getResourceUniqueName(moduleName, typeName, resourceName);
            var resource = resources[name];
            return resource ? resource : null;
        }
    });
});