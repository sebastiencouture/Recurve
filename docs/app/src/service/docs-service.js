"use strict";

docsModule.factory("docsService", ["$http", "$action", "appConfig", "utils"], function($http, $action, appConfig, utils) {

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

    function createActions() {
        return utils.createActions(["success", "error", "cancel"]);
    }

    function createMetadataGetMethod(url, actions) {
        return function() {
            return send(url, actions);
        };
    }

    function createResourceGetMethod(actions) {
        return function(url) {
            return send(url, actions);
        };
    }

    function send(url, actions) {
        var promise = $http.get(url);
        promise.then(function(response) {
            actions.success.trigger(response.data);
        });
        promise.catch(function(response) {
            if (response.canceled) {
                actions.cancel.trigger(response);
            }
            else {
                actions.error.trigger(response);
            }
        });

        return promise;
    }

    return {
        actions: {
            metadata: metadataActions,
            resource: resourceActions
        },

        getApiMetadata: createMetadataGetMethod(appConfig.url.apiMetadata, metadataActions.api),
        getContentMetadata: createMetadataGetMethod(appConfig.url.contentMetadata, metadataActions.content),
        getVersionMetadata: createMetadataGetMethod(appConfig.url.versionMetadata, metadataActions.version),

        getApiResource: createResourceGetMethod(resourceActions.api),
        getGuideResource: createResourceGetMethod(resourceActions.guide),
        getTutorialResource: createResourceGetMethod(resourceActions.tutorial)

    };
});