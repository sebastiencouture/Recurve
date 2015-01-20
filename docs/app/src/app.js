"use strict";

docsModule.factory("app", [,"$promise", "$action", "$state", "docsService", "utils"], function($promise, $action, $state, docsService, utils) {

    app.actions.loadStart.trigger();
    getStartupData().then(function() {
        $state.start();
        app.actions.loadDone.trigger();
    }, function() {
        app.actions.loadError.trigger();
    });

    function getStartupData() {
        var promises = [];
        promises.push(docsService.getApiMetadata());
        promises.push(docsService.getContentMetadata());
        promises.push(docsService.getVersionMetadata());

        return $promise.all(promises);
    }

    var app = {
        actions: utils.createActions(["loadStart", "loadDone", "loadError"])
    };

    return app;
});