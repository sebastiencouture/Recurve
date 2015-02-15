"use strict";

docsModule.factory("config.$stateRouter", ["apiStore", "guideStore", "tutorialStore", "docsService"],
    function(apiStore, guideStore, tutorialStore, docsService) {

        function componentsConfig(readyComponentName) {
            return {
                loading: "Loading",
                ready: readyComponentName,
                error: "Error"
            };
        }

        return {
            states: {
                "app": {
                    path: "",
                    resolver: {
                        resolve: {
                            bootstrap: function() {
                                return docsService.getStartupData();
                            }
                        },
                        components: componentsConfig("App")
                    }
                },

                "app.api": {
                    path: "api",
                    resolver: {
                        resolve: {
                            content: function() {
                                var metadata = apiStore.getIndexContentMetadata();
                                recurve.assert(metadata, "content metadata does not exist");

                                return docsService.getApiContent(metadata);
                            }
                        },
                        components: componentsConfig("Api")
                    }
                },

                "app.api.module": {
                    path: ":module",
                    resolver: {
                        resolve: {
                            resource: function(params) {
                                var metadata = apiStore.getIndexResourceMetadata(params.module);
                                recurve.assert(metadata, "module metadata does not exists", params);

                                return docsService.getApiResource(metadata);
                            }
                        },
                        components: componentsConfig("ApiModule")
                    }
                },

                "app.api.module.type": {
                    path: ":type",
                    resolver: {
                        resolve: {
                            metadata: function(params) {
                                return apiStore.getResourceMetadata(params.module, params.type);
                            }
                        },
                        components: componentsConfig("ApiModuleType")
                    }
                },

                "app.api.module.type.resource": {
                    path: ":type",
                    resolver: {
                        resolve: {
                            resource: function(params) {
                                var metadata = apiStore.getResourceMetadata(params.module, params.type, params.name);
                                recurve.assert("module resource metadata does not exist", params);

                                return docsService.getApiResource(metadata);
                            }
                        },
                        components: componentsConfig("ApiModuleResource")
                    }
                },

                "app.api.overview": {
                    default: true,
                    resolver: {
                        components: componentsConfig("ApiOverview")
                    }
                },

                "app.tutorial": {
                    path: "tutorial",
                    resolver: {
                        resolve: {
                            content: function() {
                                var metadata = tutorialStore.getIndexContentMetadata();
                                recurve.assert(metadata, "tutorial metadata does not exist");

                                return docsService.getTutorialContent(metadata);
                            }
                        },
                        components: componentsConfig("Tutorial")
                    }
                },

                "app.tutorial.step": {
                    path: ":id",
                    resolver: {
                        resolve: {
                            content: function(params) {
                                var metadata = tutorialStore.getContentMetadata(params.id);
                                recurve.assert(metadata, "tutorial step metadata does not exist", params);

                                return docsService.getTutorialContent(metadata);
                            }
                        },
                        components: componentsConfig("Tutorial")
                    }
                },

                "app.guide": {
                    path: "guide",
                    resolver: {
                        resolve: {
                            content: function() {
                                var metadata = guideStore.getIndexContentMetadata();
                                recurve.assert(metadata, "guide metadata does not exist");

                                return docsService.getGuideContent(metadata);
                            }
                        },
                        components: componentsConfig("Guide")
                    }
                },

                "app.guide.step": {
                    path: ":id",
                    resolver: {
                        resolve: {
                            content: function(params) {
                                var metadata = guideStore.getContentMetadata(params.id);
                                recurve.assert("guide step metadata does not exist", params);

                                return docsService.getGuideContent(metadata);
                            }
                        },
                        components: componentsConfig("Guide")
                    }
                },

                /* TODO TBD */
                /*"notFound": {
                    notFound: true,
                    resolver: {
                        components: componentsConfig("Error")
                    }
                }*/
            },

            redirects: [
                {from: "api/.*", to: "app.api.overview"},
                {from: "guide/.*", to: "app.guide"},
                {from: "tutorial/.*", to: "app.tutorial"},
                {from: ".*", to: "app.api.overview"}
            ]
        };
    }
);