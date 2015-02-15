"use strict";

/*

docsModule.factory("config.$state", ["apiStore", "guideStore", "tutorialStore", "docsService"],
    function(apiStore, guideStore, tutorialStore, docsService) {

    return {
        states: {
            apiModuleResource: {
                path: "api/:module/:type/:name",
                resolve: {
                    resource: function(params) {
                        var metadata = apiStore.getResourceMetadata(params.module, params.type, params.name);
                        return docsService.getApiResource(metadata);
                    }
                }
            },

            apiModuleType: {
                path: "api/:module/:type",
                resolve: {
                    metadata: function(params) {
                        return apiStore.getResourceMetadata(params.module, params.type);
                    }
                }
            },

            apiModule: {
                path: "api/:module",
                resolve: {
                    resource: function(params) {
                        var metadata = apiStore.getIndexResourceMetadata(params.module);
                        return docsService.getApiResource(metadata);
                    }
                }
            },

            api: {
                path: "api",
                resolve: {
                    content: function() {
                        var metadata = apiStore.getIndexContentMetadata();
                        return docsService.getApiContent(metadata);
                    }
                }
            },

            tutorialStep: {
                path: "tutorial/:id",
                resolve: {
                    content: function(params) {
                        var metadata = tutorialStore.getContentMetadata(params.id);
                        return docsService.getTutorialContent(metadata);
                    }
                }
            },

            tutorial: {
                path: "tutorial",
                resolve: {
                    content: function() {
                        var metadata = tutorialStore.getIndexContentMetadata();
                        return docsService.getTutorialContent(metadata);
                    }
                }
            },

            guideStep: {
                path: "guide/:id",
                resolve: {
                    content: function(params) {
                        var metadata = guideStore.getContentMetadata(params.id);
                        return docsService.getGuideContent(metadata);
                    }
                }
            },

            guide: {
                path: "guide",
                resolve: {
                    content: function() {
                        var metadata = guideStore.getIndexContentMetadata();
                        return docsService.getGuideContent(metadata);
                    }
                }
            },

            notFound: {
                path: ".*"
            }
        }
    };
});*/