"use strict";

docsModule.factory("config.$stateRouter", ["apiStore", "guideStore", "tutorialStore", "docsService"],
    function(apiStore, guideStore, tutorialStore, docsService) {

        function componentsConfig(readyName) {
            return {
                loading: "Loading",
                ready: readyName,
                error: "Error"
            };
        }

        function componentsConfigNoLoading(readyName) {
            return {
                ready: readyName,
                error: "Error"
            };
        }

        return {
            states: {
                "app": {
                    path: "",
                    resolver: {
                        resolve: {
                            bootstrapApiMetadata: function() {
                                return docsService.getApiMetadata();
                            },

                            bootstrapContentMetadata: function() {
                                return docsService.getContentMetadata();
                            },

                            bootstrapVersionMetadata: function() {
                                return docsService.getVersionMetadata();
                            }
                        },
                        components: componentsConfig("App")
                    }
                },

                "app.api": {
                    path: "api",
                    resolver: {
                        components: componentsConfigNoLoading("Api")
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
                        components: componentsConfigNoLoading("ApiModuleType")
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
                    "default": true,
                    resolver: {
                        resolve: {
                            content: function() {
                                var metadata = apiStore.getIndexContentMetadata();
                                recurve.assert(metadata, "content metadata does not exist");

                                return docsService.getApiContent(metadata).then(function() {
                                    return apiStore.getMetadata();
                                });
                            }
                        },
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
                }
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