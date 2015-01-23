"use strict";

docsModule.factory("tutorialDataStore", ["contentDataStore"], function(contentDataStore) {
    var dataStore = contentDataStore(contentParser);

    function contentParser(data) {
        return data.tutorial;
    }

    return dataStore;
});