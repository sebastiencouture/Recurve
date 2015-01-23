"use strict";

docsModule.factory("contentDataStore", ["$dataStore", "docsService"], function($dataStore, docsService) {
    return function(parser) {
        var dataStore = $dataStore();
        var metadata;

        var actions = docsService.actions.metadata.content;
        actions.success.on(function(data) {
            metadata = parser(data);
            dataStore.changed();
        }, null, dataStore);

        actions.error.on(function() {
            metadata = null;
            dataStore.changed();
        });

        return recurve.extend(dataStore, {
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