"use strict";

docsModule.factory("app", ["$document", "$window", "$promise", "$action", "$router", "$state", "utils", "docsService", "AppViewController"],
    function($document, $window, $promise, $action, $router, $state, utils, docsService, AppViewController) {

    var actions = utils.createActions(["loadStart", "loadDone", "loadError"]);

    setupInternalLinkHandling();
    render();
    getStartupData();

    function render() {
        React.render(React.createElement(AppViewController, null), $document.body);
    }

    function getStartupData() {
        actions.loadStart.trigger();
        getMetadata().then(function() {
            $state.start();
            actions.loadDone.trigger();
        }, function() {
            actions.loadError.trigger();
        });
    }

    function getMetadata() {
        var promises = [];
        promises.push(docsService.getApiMetadata());
        promises.push(docsService.getContentMetadata());
        promises.push(docsService.getVersionMetadata());

        return $promise.all(promises);
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

    return {
        actions: actions
    };
});