"use strict";

function addHttpDeferredService(module) {
    module.factory("$httpDeferred", ["$promise"], function($promise) {
        return function() {
            var deferred = $promise.defer();

            deferred.promise.success = function(onSuccess) {
                deferred.promise.then(function(response) {
                    onSuccess(
                        response.data, response.status, response.statusText,
                        response.headers, response.options, response.canceled);
                });

                return deferred.promise;
            };

            deferred.promise.error = function(onError) {
                deferred.promise.catch(function(response) {
                    onError(
                        response.data, response.status, response.statusText,
                        response.headers, response.options, response.canceled);
                });

                return deferred.promise;
            };

            deferred.promise.cancel = function() {
                deferred.request.cancel();
            };

            return deferred;
        };
    });
}