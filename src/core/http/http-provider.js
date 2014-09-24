"use strict";

function addHttpProviderService(module) {
    module.factory("$httpProvider", ["$window", "$document"], function($window, $document) {
        return {
            send: function(options, deferred) {
                var request;

                if (isEqualIgnoreCase("jsonp", options.method)) {
                    request = httpJsonp(options, deferred, $window, $document);
                }
                else {
                    request = httpXhr(options, deferred, $window);
                }

                deferred.request = request;
                request.send();
            }
        };
    });
}