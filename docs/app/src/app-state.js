"use strict";

docsModule.factory("config.$state", ["$promise", "$http"], function($promise, $http) {

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

    // TODO TBD this should be pulled from api.json
    // TODO TBD move some of this to docs-service.js as well
    function getParentService(name) {
        var split = name.split(".");
        return 1 < split.length ? split[1] : split[0];
    }
    function getApiUrl(params) {
        var parentService = getParentService(params.name);
        return recurve.format("/data/api/{0}/{1}.json", params.module, parentService);
    }

    function getTutorialUrl(params) {
        return "TODO";
    }

    function getGuideUrl(params) {
        return "TODO";
    }

    return {
        states: {
            api: {
                path: "api/:module/:type/:name",
                resolve: createDescriptionResolver(getApiUrl)
            },

            tutorial: {
                path: "tutorial/:step",
                resolve: createDescriptionResolver(getTutorialUrl)
            },

            guide: {
                path: "guide/:step",
                resolve: createDescriptionResolver(getGuideUrl)
            },

            notFound: {
                path: ".*"
            }
        }
    };
});