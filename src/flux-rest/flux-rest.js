(function() {
    "use strict";

    recurve.flux.rest = {};
    var module = recurve.flux.rest.$module = recurve.module();

    // example:
    // var testService = $rest({url: "www.test.com"});
    // testService.resource("user", "user/:id");
    // testService.user.save({id: 1}, {a: "b", c: "d"});
    // hook up in dataStore testService.user.save.successAction

    module.factory("$rest", ["$http", "$action"], function($http, $action) {
        return function(config) {
            config = config || {};

            var baseUrl = removeLeadingTrailingSlashes(config.url) || "";
            var defaults = config.defaults;

            function removeLeadingTrailingSlashes(url) {
                if (!url) {
                    return url;
                }

                return url.replace(/^\/+|\/+$/g, "");
            }

            function updateUrl(options, url, params) {
                // replace in url if exists
                var urlSplit = url.split("/");
                recurve.forEach(urlSplit, function(value, index) {
                    if (0 === value.indexOf(":")) {
                        value = value.slice(1);
                        if (!recurve.isUndefined(params[value])) {
                            urlSplit[index] = encodeURIComponent(params[value]);
                            delete params[value];
                        }
                    }
                });

                options.url = urlSplit.join("/");

                // add rest as query params
                options.params = options.params || {};
                recurve.extend(options.params, params);
            }

            function resource(url, paramDefaults, endPoints) {
                url = removeLeadingTrailingSlashes(url);
                if (baseUrl) {
                    url = baseUrl + "/" + url;
                }

                function endPoint(options) {
                    var optionsWithDefaults = recurve.extend({}, defaults);
                    recurve.extend(optionsWithDefaults, options);

                    function send(params, data) {
                        var endPointOptions = recurve.extend({}, optionsWithDefaults);
                        if (data) {
                            recurve.extend(endPointOptions, {data: data});
                        }

                        var paramsWithDefaults = recurve.extend({}, paramDefaults);
                        recurve.extend(paramsWithDefaults, params);

                        updateUrl(endPointOptions, url, paramsWithDefaults);

                        var httpPromise = $http(endPointOptions);

                        httpPromise.success(function() {
                            send.successAction.trigger.apply(send.successAction, arguments);
                        });

                        httpPromise.error(function(data, status, statusText, headers, options, canceled) {
                            if (canceled) {
                                send.cancelAction.trigger.apply(send.cancelAction, arguments);
                            }
                            else {
                                send.errorAction.trigger.apply(send.errorAction, arguments);
                            }
                        });

                        return httpPromise;
                    }

                    send.successAction = $action();
                    send.errorAction = $action();
                    send.cancelAction = $action();

                    return send;
                }

                var rest = {
                    get: endPoint({method: "GET"}),
                    save: endPoint({method: "POST"}),
                    query: endPoint({method: "GET"}),
                    "delete": endPoint({method: "DELETE"})
                };

                recurve.forEach(endPoints, function(options, name) {
                    rest[name] = endPoint(options);
                });

                return rest;
            }

            return {
                resource: function(name, url, paramDefaults, endPoints) {
                    recurve.assert(name, "expected name to be set");
                    recurve.assert("resource" !== name, "resource cannot be named 'resource'");
                    recurve.assert(url, "expected url to be set");

                    this[name] = resource(url, paramDefaults, endPoints);
                }
            };
        };
    });
})();