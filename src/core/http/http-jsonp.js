"use strict";

function addHttpJsonpService(module) {
    module.factory("$httpJsonp", ["$window", "$document", "$promise"], function($window, $document, $promise) {
        return function (options) {
            var canceled = false;
            var deferred;

            function complete(success, data, status, statusText) {
                var response = {
                    data: data,
                    status: status,
                    statusText: statusText,
                    options: options,
                    canceled: canceled
                };

                if (success) {
                    deferred.resolve(response);
                }
                else {
                    deferred.reject(response);
                }
            }

            return {
                send: function() {
                    var callbackId = "_recurve_" + generateUUID();
                    var url = removeParameterFromUrl(options.url, "callback");
                    url = addParametersToUrl(url, {callback: callbackId});

                    var script = $document.createElement("script");
                    script.src = url;
                    script.type = "text/javascript";
                    script.async = true;

                    var called;

                    function callbackHandler(data) {
                        called = true;

                        if (canceled) {
                            complete();
                        }
                        else {
                            complete(true, data, 200);
                        }
                    }

                    function loadErrorHandler (event) {
                        removeEventListener(script, "load", loadErrorHandler);
                        removeEventListener(script, "error", loadErrorHandler);

                        $document.head.removeChild(script);
                        script = null;

                        delete $window[callbackId];

                        if (event && "load" === event.type && !called) {
                            complete(false, null, 404, "jsonp callback not called");
                        }
                    }

                    addEventListener(script, "load", loadErrorHandler);
                    addEventListener(script, "error", loadErrorHandler);

                    $window[callbackId] = callbackHandler;

                    $document.head.appendChild(script);

                    deferred = $promise.defer();
                    return deferred.promise;
                },

                cancel: function() {
                    canceled = true;
                }
            };
        };
    });
}