"use strict";

docsModule.factory("guideDataStore", ["contentDataStore"], function(contentDataStore) {
    var dataStore = contentDataStore(contentParser);

    function contentParser(data) {
        return data.guide;
    }

    return dataStore;
});