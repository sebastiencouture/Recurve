"use strict";

docsModule.factory("apiStore", ["contentStore", "docsService"], function(contentStore, docsService) {
    var store = contentStore(contentParser);
    var metadata;
    var resourcesByMetadataUrl = {};

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
        //debugger;
        //var name = getResourceUniqueName(data.module, data.rdoc, data.name);
        resourcesByMetadataUrl[metadata.url] = data;
        store.changed.trigger();
    });

    function getResourceUniqueName(moduleName, typeName, resourceName) {
        return moduleName + typeName + resourceName;
    }

    function getResourceByName(resource, typeName, resourceName) {
        if (resource.rdoc == typeName && resource.name === resourceName) {
            return resource;
        }

        var typeResource = null;
        if (resource.types) {
            recurve.forEach(resource.types, function(type) {
                recurve.forEach(type, function(resource) {
                    if (resource.rdoc == typeName && resource.name === resourceName) {
                        typeResource = resource;
                        return false;
                    }
                });

                if (typeResource) {
                    return false;
                }
            });
        }

        return typeResource;
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

        getResource: function(resourceName, typeName, metadata) {
            var resources = resourcesByMetadataUrl[metadata.url];
            return getResourceByName(resources, typeName, resourceName)
        },

        getModuleResource: function(moduleName, metadata) {
            return this.getResource(moduleName, "module", metadata);
        }
    });
});