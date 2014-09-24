"use strict";

function addDocumentService(module) {
    module.factory("$document", ["$window"], function($window) {
        return $window.document;
    });
}