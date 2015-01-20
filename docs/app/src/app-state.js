"use strict";

docsModule.factory("config.$state", ["$promise", "$http", "apiDataStore", "guideDataStore", "tutorialDataStore"],
    function($promise, $http, apiDataStore, guideDataStore, tutorialDataStore) {

    function createDescriptionResolver(urlCreator) {
        return {
            description: function(params) {
                var url = urlCreator(params);
                return getDescription(url, params);
            }
        };
    }

    function getDescription(url, params) {
        if (!url) {
            return $promise.reject(params);
        }

        return $http.get(url).success(function(response) {
                return response.data;
            }).error(function(response) {
                return response.data;
            });
    }

    function getApiUrl(params) {
        var resource = apiDataStore.getResource(params.module, params.type, params.name);
        return resource ? resource.url : null;
    }

    function getTutorialUrl(params) {
        var resource = tutorialDataStore.getContentResource(params.id);
        return resource ? resource.url : null;
    }

    function getGuideUrl(params) {
        var resource = guideDataStore.getResource(params.id);
        return resource ? resource.url : null;
    }

    return {
        states: {
            api: {
                path: "api/:module/:type/:name",
                resolve: createDescriptionResolver(getApiUrl)
            },

            tutorial: {
                path: "tutorial/:id",
                resolve: createDescriptionResolver(getTutorialUrl)
            },

            guide: {
                path: "guide/:id",
                resolve: createDescriptionResolver(getGuideUrl)
            },

            notFound: {
                path: ".*"
            }
        }
    };
});