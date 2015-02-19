"use strict";

docsModule.factory("apiStore", ["contentStore", "docsService"], function(contentStore, docsService) {
    var store = contentStore(contentParser);
    var metadata;

    var apiActions = docsService.actions.metadata.api;
    store.onAction(apiActions.success, function(data) {
        metadata = data;
        store.changed.trigger();
    });

    store.onAction(apiActions.error, function() {
        metadata = null;
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
        }
    });
});