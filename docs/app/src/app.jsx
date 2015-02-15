/** @jsx React.DOM */

"use strict";

docsModule.factory("App", ["$window", "$document", "$router", "$State", "NavBar"], function($window, $document, $router, State, NavBar) {

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
            setupInternalLinkHandling();
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