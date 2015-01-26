"use strict";

docsModule.factory("guideStore", ["contentStore"], function(contentStore) {
    function contentParser(data) {
        return data.guide;
    }

    return contentStore(contentParser);
});