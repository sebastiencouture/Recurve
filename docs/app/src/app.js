"use strict";

docsModule.factory("app", ["$promise", "$action", "$state", "utils", "docsService", "AppViewController"],
    function($promise, $action, $state, utils, docsService, AppViewController) {

    var actions = utils.createActions(["loadStart", "loadDone", "loadError"]);

    React.render(React.createElement(AppViewController, null), document.querySelector(".container"));

    actions.loadStart.trigger();
    getStartupData().then(function() {
        $state.start();
        actions.loadDone.trigger();
    }, function() {
        actions.loadError.trigger();
    });

    function getStartupData() {
        var promises = [];
        promises.push(docsService.getApiMetadata());
        promises.push(docsService.getContentMetadata());
        promises.push(docsService.getVersionMetadata());

        return $promise.all(promises);
    }

    return {
        actions: actions
    };
});