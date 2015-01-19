"use strict";

docsModule.factory("config.$state", ["$promise"], function($promise) {
    return {
        states: {
            api: {
                path: "api/:module/:type/:name",
                resolve: function(params) {
                    var deferred = $promise.defer();

                    deferred.resolve(1);

                    return deferred.promise;
                }
            },

            tutorial: {
                path: "tutorial/:step"
            },

            guide: {
                path: "guide/:step"
            },

            notFound: {
                path: ".*"
            }
        }
    };
});