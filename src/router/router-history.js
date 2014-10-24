"use strict";

function addRouterHistoryService(module) {
    module.factory("$history", ["$window", "$document", "$timeout", "$signal"], function($window, $document, $timeout, $signal) {
        var popped = $signal();
        var history = $window.history;

        return {
            back: function() {
                history.back();
            },

            forward: function() {
                history.forward();
            },

            go: function(delta) {
                history.go(delta);
            },

            pushState: function() {
                history.pushState.apply(history, arguments);
            },

            replaceState: function() {
                history.replaceState.apply(history, arguments);
            },

            // TODO TBD implement
            // http://stackoverflow.com/questions/8439145/reading-window-history-state-object-in-webkit
            getState: function() {
                return history.state;
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

                    popped.trigger(event);
                }

                function loadCompleteHandler() {
                    recurve.removeEvent($window, "load", loadCompleteHandler);

                    $timeout(0).then(function() {
                        blockPopstate = false;
                    });
                }

                recurve.addEvent($window, "load", loadCompleteHandler);
                recurve.addEvent($window, "popstate", popstateHandler);
            },

            popped: popped
        };
    });
}