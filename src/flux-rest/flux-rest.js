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

            var baseUrl = removeLeadingSlashes(config.url) || "";
            var defaults = config.defaults;

            function removeLeadingSlashes(url) {
                if (!url) {
                    return url;
                }

                return url.replace(/^\/+$/, "");
            }

            function removeTrailingSlashes(url) {
                if (!url) {
                    return url;
                }

                return url.replace(/\/+$/, "");
            }

            function updateUrl(options, url, params) {
                // TODO TBD replace in url
                options.url = url;

                // TODO TBD add rest as query params
                options.params = options.params || {};
                options.params.todo = "dasdas";
            }

            function resource(url, paramDefaults, endPoints) {
                if (baseUrl) {
                    url = baseUrl + "/" + removeTrailingSlashes(url);
                }

                function endPoint(options) {
                    var optionsWithDefaults = recurve.extend({}, defaults);
                    recurve.extend(optionsWithDefaults, options);

                    function send(params, data) {
                        var endPointOptions = recurve.extend({}, optionsWithDefaults);
                        if (data) {
                            recurve.extend(endPointOptions, {data: data});
                        }

                        var paramsWithDefaults = recurve.extend({}, paramDefaults)
                        recurve.extend(paramsWithDefaults, params);

                        updateUrl(endPointOptions, url, paramsWithDefaults);

                        var that = this;
                        var httpPromise = $http(endPointOptions);

                        httpPromise.success(function(response) {
                            that.successAction.trigger(response);
                        });

                        httpPromise.error(function(response) {
                            if (response.canceled) {
                                that.cancelAction.trigger(response);
                            }
                            else {
                                that.errorAction.trigger(response);
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
                    // TODO TBD should flux layer and below be as strict with parameter checking?
                    recurve.assert(name, "expected name to be set");
                    recurve.assert("resource" !== name, "resource cannot be named 'resource'");
                    recurve.assert(url, "expected url to be set");

                    this[name] = resource(url, paramDefaults, endPoints);
                }
            };
        };
    });
})();