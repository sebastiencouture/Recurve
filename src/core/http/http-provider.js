"use strict";

function addHttpProviderService(module) {
    module.factory("$httpProvider", ["$httpXhr", "$httpJsonp"], function($httpXhr, $httpJsonp) {
        return {
            send: function(options, httpDeferred) {
                var request;

                if (isEqualIgnoreCase("jsonp", options.method)) {
                    request = $httpJsonp(options);
                }
                else {
                    request = $httpXhr(options);
                }

                httpDeferred.request = request;

                return request.send();
            }
        };
    });
}