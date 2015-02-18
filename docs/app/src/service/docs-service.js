"use strict";

docsModule.factory("docsService", ["$promise", "$http", "$action", "appConfig", "utils"],
    function($promise, $http, $action, appConfig, utils) {

    var metadataActions = {
        api: createActions(),
        content: createActions(),
        version: createActions()
    };

    var resourceActions = {
        api: createActions(),
        guide: createActions(),
        tutorial: createActions
    };

    var contentActions = {
        api: createActions(),
        guide: createActions(),
        tutorial: createActions()
    };

    function createActions() {
        return utils.createActions(["success", "error", "cancel"]);
    }

    function createMetadataGetMethod(url, actions) {
        return function() {
            return send(url, actions);
        };
    }

    function createResourceGetMethod(actions) {
        return function(metadata) {
            var url = metadata ? metadata.url : null;
            return send(url, actions);
        };
    }

    function createContentGetMethod(actions) {
        return function(metadata) {
            var url = metadata ? metadata.url : null;
            send(url, actions, {dataType: "html"});
        };
    }

    function send(url, actions, options) {
        if (!url) {
            return $promise.reject("url does not exist");
        }

        var promise = $http.get(url, options);
        return promise.then(function(response) {
            actions.success.trigger(response.data);
        }, function(response) {
            if (response.canceled) {
                actions.cancel.trigger(response);
            }
            else {
                actions.error.trigger(response);
            }
        });
    }

    return {
        actions: {
            metadata: metadataActions,
            resource: resourceActions,
            content: contentActions
        },

        getApiMetadata: createMetadataGetMethod(appConfig.metadataUrl.api, metadataActions.api),
        getContentMetadata: createMetadataGetMethod(appConfig.metadataUrl.content, metadataActions.content),
        getVersionMetadata: createMetadataGetMethod(appConfig.metadataUrl.version, metadataActions.version),

        getApiResource: createResourceGetMethod(resourceActions.api),

        getApiContent: createContentGetMethod(contentActions.api),
        getGuideContent: createContentGetMethod(contentActions.guide),
        getTutorialContent: createContentGetMethod(contentActions.tutorial)
    };
});