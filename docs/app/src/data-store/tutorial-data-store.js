"use strict";

docsModule.factory("tutorialDataStore", ["$dataStore", "docsService"], function($dataStore, docsService) {
    var dataStore = $dataStore();
    var metadata;

    var actions = docsService.actions.metadata.content;
    actions.success.on(function(data) {
        metadata = data.tutorial;
        dataStore.changed();
    }, null, dataStore);
    actions.error.on(function() {
        metadata = null;
        dataStore.changed();
    });

    return recurve.extend(dataStore, {
        getContentResource: function(id) {
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
        }
    });
});