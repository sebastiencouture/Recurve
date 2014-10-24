"use strict";

function addHttpJsonpService(module) {
    module.factory("$httpJsonp", ["$window", "$document", "$promise"], function($window, $document, $promise) {

        function addEventForElement(element, event, callback) {
            // http://pieisgood.org/test/script-link-events/
            // TODO TBD link tags don't support any type of load callback on old WebKit (Safari 5)
            function readyStateHandler() {
                if (isEqualIgnoreCase("loaded", element.readyState) ||
                    isEqualIgnoreCase("complete", element.readyState)) {
                    callback({type: "load"});
                }
            }

            // IE8 :T
            if ("load" === event &&
                supportsEvent(element, "onreadystatechange")) {
                element.onreadystatechange = readyStateHandler;
            }
            else {
                addEvent(element, event, callback);
            }
        }

        function removeEventForElement(element, event, callback) {
            if ("load" === event &&
                supportsEvent(element, "onreadystatechange")) {
                element.onreadystatechange = null;
            }
            else {
                removeEvent(element, event, callback);
            }
        }

        return function (options) {
            var canceled = false;
            var deferred;

            function complete(success, data, status, statusText) {
                if (isUndefined(status)) {
                    status = 0;
                }

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
                        removeEventForElement(script, "load", loadErrorHandler);
                        removeEventForElement(script, "error", loadErrorHandler);

                        $document.head.removeChild(script);
                        script = null;

                        delete $window[callbackId];

                        if (event && "load" === event.type && !called) {
                            complete(false, null, 404, "jsonp callback not called");
                        }
                    }

                    addEventForElement(script, "load", loadErrorHandler);
                    addEventForElement(script, "error", loadErrorHandler);

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