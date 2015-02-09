"use strict";

docsModule.factory("config.$stateRouter", ["apiStore", "guideStore", "tutorialStore", "docsService",
        "Loading", "Error", "App",
        "Api", "ApiOverview", "ApiModule", "ApiModuleType", "ApiModuleResource".
        "Tutorial",
        "Guide"],
    function(apiStore, guideStore, tutorialStore, docsService,
        Loading, Error, App,
        Api, ApiOverview, ApiModule, ApiModuleType, ApiModuleResource,
        Tutorial,
        Guide) {

        function render(ready) {
            return {
                loading: Loading,
                ready: ready,
                error: Error
            }
        }

        return {
            states: {
                "app": {
                    path: "",
                    resolver: {
                        resolve: {
                            startUp: docsService.getStartupData()
                        },
                        render: render(App)
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
                        render: render(Api)
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
                        render: render(ApiModule)
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
                        render: render(ApiModuleType)
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
                        render: render(ApiModuleResource)
                    }
                },

                "app.api.overview": {
                    default: true,
                    resolver: {
                        render: render(ApiOverview)
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
                        render: render(Tutorial)
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
                        render: render(Guide)
                    }
                },

                /* TODO TBD */
                "notFound": {
                    notFound: true,
                    resolver: {
                        render: render(Error)
                    }
                }
            }
        }

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
    });