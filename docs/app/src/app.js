"use strict";

docsModule.factory("app", ["$promise", "$action", "$state", "docsService", "utils"], function($promise, $action, $state, docsService, utils) {

    var actions = utils.createActions(["loadStart", "loadDone", "loadError"]);

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