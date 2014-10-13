"use strict";

function addRouterHistoryService(module) {
    module.factory("$history", ["$window", "$document", "$timeout", "$signal"], function($window, $document, $timeout, $signal) {
        var changed = $signal();
        var history = $window.history;

        return {
            back: function() {
                history.back();
            },

            forward: function() {
                history.forward();
            },

            go: function(count) {
                history.go(count);
            },

            count: function() {
                return history.length;
            },

            currentState: function() {
                return history.state;
            },

            pushState: function() {
                history.pushState();
            },

            replaceState: function() {
                history.replaceState();
            },

            start: function() {
                // "popstate" fired on page load for older WebKit
                // https://code.google.com/p/chromium/issues/detail?id=63040
                // http://stackoverflow.com/a/18126524
                var blockPopstate = "complete" !== $document.readyState;

                function popstateHandler(event) {
                    if (blockPopstate && "complete" === $document.readyState) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        return;
                    }

                    changed.trigger(event);
                }

                function loadCompleteHandler() {
                    recurve.removeEventListener("load", loadCompleteHandler);

                    $timeout(0).then(function() {
                        blockPopstate = false;
                    });
                }

                recurve.addEventListener("load", loadCompleteHandler);
                recurve.addEventListener("popstate", popstateHandler);
            },

            changed: changed
        };
    });
}