"use strict";

function addTimeoutService(module) {
    module.factory("$timeout", ["$async", "$promise"], function($async, $promise) {
        var deferreds = {};

        var $timeout = function(timeMs) {
            var deferred = $promise.defer();

            var id = $async(function() {
                delete deferreds[id];
                deferred.resolve();
            }, timeMs);

            deferred.promise._$timeoutId = id;
            deferreds[id] = deferred;

            return deferred.promise;
        };

        return extend($timeout, {
            cancel: function(promise) {
                if (!promise || !deferreds.hasOwnProperty(promise._$timeoutId)) {
                    return;
                }

                var id = promise._$timeoutId;

                $async.cancel(id);

                deferreds[id].reject("canceled");
                delete deferreds[id];
            }
        });
    });
}