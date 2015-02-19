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

            if( "a" === target.nodeName.toLowerCase()) {
                // Some bootstrap components depend on href="#", so let these pass through
                if (/#$/.test(target.href)) {
                    return;
                }

                var origin = $window.location.origin;
                var index = target.href.indexOf(origin);
                if (-1 === index) {
                    return;
                }

                event.stopPropagation();
                event.preventDefault();

                var path = target.href.substring(origin.length);
                $router.navigate(path);
            }
        };
    }

    return React.createClass({
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