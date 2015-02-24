/** @jsx React.DOM */

"use strict";

docsModule.factory("App", ["$window", "$document", "$log", "$router", "$stateStore", "$State", "NavBar"],
    function($window, $document, $log, $router, $stateStore, State, NavBar) {

    function setup() {
        setupStateRouterLogging();
        setupInternalLinkHandling();
    }

    function setupStateRouterLogging() {
        var lastLoggedError;
        $stateStore.changed.on(function() {
            var errorState = $stateStore.getErrorState();
            if (errorState) {
                if (errorState.error === lastLoggedError) {
                    return;
                }

                lastLoggedError = errorState.error;
                $log.error("state router error", errorState.error, errorState);
            }
        })
    }

    // TODO TBD find better spot for this
    function setupInternalLinkHandling() {
        $document.body.onclick = function(event) {
            var target = event ? event.target : $window.event.srcElement;
            var anchor = getAnchorNode(target);

            if (!anchor) {
                return;
            }

            // scrolling to section on the current page, let the browser take care of these
            if (recurve.contains(anchor.href, "#")) {
                return;
            }

            var origin = $window.location.origin;
            var index = anchor.href.indexOf(origin);
            // different site, let the browser take care of these
            if (-1 === index) {
                return;
            }

            event.stopPropagation();
            event.preventDefault();

            var path = anchor.href.substring(origin.length);
            $router.navigate(path);
        };
    }

    function getAnchorNode(target) {
        if (!target) {
            return null;
        }

        if ("a" === target.nodeName.toLowerCase()){
            return target;
        }

        return getAnchorNode(target.parentNode);
    }

    return React.createClass({
        displayName: "App",

        componentWillMount: function() {
            setup();
        },

        render: function() {
            return (
                <div>
                    <NavBar />
                    <State />
                </div>
            );
        }
    })
});