"use strict";

docsModule.factory("config.$state", ["apiDataStore", "guideDataStore", "tutorialDataStore", "docsService"],
    function(apiDataStore, guideDataStore, tutorialDataStore, docsService) {

    return {
        states: {
            apiModuleResource: {
                path: "api/:module/:type/:name",
                resolve: {
                    resource: function(params) {
                        var metadata = apiDataStore.getResourceMetadata(params.module, params.type, params.name);
                        return docsService.getApiResource(metadata);
                    }
                }
            },

            apiModuleType: {
                path: "api/:module/:type",
                resolve: {
                    metadata: function(params) {
                        return apiDataStore.getResourceMetadata(params.module, params.type);
                    }
                }
            },

            apiModule: {
                path: "api/:module",
                resolve: {
                    resource: function(params) {
                        var metadata = apiDataStore.getIndexResourceMetadata(params.module);
                        return docsService.getApiResource(metadata);
                    }
                }
            },

            api: {
                path: "api",
                resolve: {
                    content: function() {
                        var metadata = apiDataStore.getIndexContentMetadata();
                        return docsService.getApiContent(metadata);
                    }
                }
            },

            tutorialStep: {
                path: "tutorial/:id",
                resolve: {
                    content: function(params) {
                        var metadata = tutorialDataStore.getContentMetadata(params.id);
                        return docsService.getTutorialContent(metadata);
                    }
                }
            },

            tutorial: {
                path: "tutorial",
                resolve: {
                    content: function() {
                        var metadata = tutorialDataStore.getIndexContentMetadata();
                        return docsService.getTutorialContent(metadata);
                    }
                }
            },

            guideStep: {
                path: "guide/:id",
                resolve: {
                    content: function(params) {
                        var metadata = guideDataStore.getContentMetadata(params.id);
                        return docsService.getGuideContent(metadata);
                    }
                }
            },

            guide: {
                path: "guide",
                resolve: {
                    content: function() {
                        var metadata = guideDataStore.getIndexContentMetadata();
                        return docsService.getGuideContent(metadata);
                    }
                }
            },

            notFound: {
                path: ".*"
            }
        }
    };
});