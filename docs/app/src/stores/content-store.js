"use strict";

docsModule.factory("contentStore", ["$store", "docsService"], function($store, docsService) {
    return function(parser) {
        var store = $store();
        var metadata;

        var actions = docsService.actions.metadata.content;
        store.onAction(actions.success, function(data) {
            metadata = parser(data);
            store.changed();
        });

        store.onAction(actions.error, function() {
            metadata = null;
            store.changed();
        });

        return recurve.extend(store, {
            getContentMetadata: function(id) {
                if (!metadata) {
                    return null;
                }

                var found = null;
                recurve.forEach(metadata, function(content) {
                    if (content.id === id) {
                        found = content;
                        return false;
                    }
                });

                return found;
            },

            getIndexContentMetadata: function() {
                if (!metadata) {
                    return null;
                }

                var found = null;
                recurve.forEach(metadata, function(content) {
                    if (content.isIndex) {
                        found = content;
                        return false;
                    }
                });

                return found;
            }
        });
    };
});