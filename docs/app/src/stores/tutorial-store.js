"use strict";

docsModule.factory("tutorialStore", ["contentStore"], function(contentStore) {
    function contentParser(data) {
        return data.tutorial;
    }

    return contentStore(contentParser);
});