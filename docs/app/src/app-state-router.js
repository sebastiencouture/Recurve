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
                    // TODO TBD not working if set to "", maybe have root: true? or just have it based on path = ""
                    path: "",
                    resolver: {
                        resolve: {
                            bootstrap: function() {
                                docsService.getStartupData();
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
                                return docsService.getGuideContent(metadata);
                            }
                        },
                        components: componentsConfig("Guide")
                    }
                },

                /* TODO TBD */
                "notFound": {
                    notFound: true,
                    resolver: {
                        components: componentsConfig("Error")
                    }
                }
            }
        };
    }
);