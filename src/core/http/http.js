"use strict";

function addHttpService(module) {
    module.factory("$http", ["$httpProvider", "$httpDeferred", "$promise", "$config"], function($httpProvider, $httpDeferred, $promise, config) {
        var defaults = config;

        function createOptionsWithDefaults(options) {
            var withDefaults = extend({}, defaults);
            withDefaults.headers = {};

            withDefaults.methpd = withDefaults.method || "get";
            withDefaults.method = withDefaults.method.toLowerCase();

            extend(withDefaults, options);
            mergeHeaders(withDefaults);

            return withDefaults;
        }

        function mergeHeaders(options) {
            options.headers = options.headers || {};
            forEach(options.headers, function(value, header) {
                options.headers[upperCaseHeader(header)] = value;
            });

            var defaultHeaders = getDefaultHeaders(options.method);
            forEach(defaultHeaders, function(value, header) {
                header = upperCaseHeader(header);

                if (!options.headers.hasOwnProperty(header)) {
                    options.headers[header] = value;
                }
            });
        }

        function getDefaultHeaders(method) {
            var headers = {};

            extend(headers, defaults.headers.all);
            extend(headers, defaults.headers[method]);

            return headers;
        }

        function upperCaseHeader(header) {
            var splits = header.split("-");

            forEach(splits, function(split, index) {
                splits[index] = split.charAt(0).toUpperCase() + split.slice(1);
            });

            return splits.join("-");
        }

        function updateUrl(options) {
            if (!options.cache) {
                options.params = options.params || {};
                options.params.cache = Date.now();
            }

            var paramsOnUrl = getParametersOfUrl(options.url);
            var params = extend({}, options.params);
            extend(params, paramsOnUrl);

            options.url = addParametersToUrl(options.url, params);
        }

        function updateHeaders(options) {
            addAcceptHeader(options);
            addRequestedWithHeader(options);
            removeContentType(options);
        }

        function addAcceptHeader(options) {
            if (options.headers.Accept) {
                return;
            }

            var accept = "*/*";
            var dataType = options.dataType;

            if (dataType) {
                dataType = dataType.toLowerCase();

                if ("text" === dataType) {
                    accept = "text/plain,*/*;q=0.01";
                }
                else if ("html" === dataType) {
                    accept = "text/html,*/*;q=0.01";
                }
                else if ("xml" === dataType) {
                    accept = "application/xml,text/xml,*/*;q=0.01";
                }
                else if ("json" === dataType) {
                    accept = "application/json,text/javascript,*/*;q=0.01";
                }
                else {
                    // do nothing - default to all
                }
            }

            options.headers.Accept = accept;
        }

        function addRequestedWithHeader(options) {
            if (!options.crossDomain &&
                !options.headers["X-Requested-With"]) {
                options.headers["X-Requested-With"] = "XMLHttpRequest";
            }
        }

        function removeContentType(options) {
            if (options.data) {
                return;
            }

            forEach(options.headers, function(value, header) {
                if ("Content-Type" === header) {
                    delete options.headers[header];
                }
            });
        }

        function updateData(options) {
            if (!options.emulateHttp) {
                return;
            }

            if (!isEqualIgnoreCase("put", options.method) &&
                !isEqualIgnoreCase("patch", options.method) &&
                !isEqualIgnoreCase("delete", options.method)) {
                return;
            }

            options.data = options.data || {};
            options.data._method = options.method.toLowerCase();
        }

        var http = function(options) {
            var withDefaults = createOptionsWithDefaults(options);

            updateUrl(withDefaults);
            updateHeaders(withDefaults);
            updateData(withDefaults);

            if (withDefaults.hasOwnProperty("data")) {
                withDefaults.data = withDefaults.serialize(
                    withDefaults.data, withDefaults.headers["Content-Type"]);
            }

            var httpDeferred = $httpDeferred();

            function parseResponseSuccess(response) {
                response.data = withDefaults.parse(response.data);
                httpDeferred.resolve(response);
            }

            function parseResponseError(response) {
                response.data = withDefaults.parse(response.data);
                httpDeferred.reject(response);
            }

            $httpProvider.send(withDefaults, httpDeferred).then(parseResponseSuccess, parseResponseError);
            return httpDeferred.promise;
        };

        return extend(http, {
            defaults : defaults,

            get: function(url, options) {
                options = extend(options, {method: "get", url: url});
                return http(options);
            },

            post: function(url, data, options) {
                options = extend(options, {method: "post", url: url, data: data});
                return http(options);
            },

            jsonp: function(url, options) {
                options = extend(options, {method: "jsonp", url: url});
                return http(options);
            },

            "delete": function(url, options) {
                options = extend(options, {method: "delete", url: url});
                return http(options);
            },

            head: function(url, options) {
                options = extend(options, {method: "head", url: url});
                return http(options);
            },

            put: function(url, data, options) {
                options = extend(options, {method: "put", url: url, data: data});
                return http(options);
            },

            patch: function(url, data, options) {
                options = extend(options, {method: "patch", url: url, data: data});
                return http(options);
            }
        });
    });

    module.config("$http", {
        headers: {
            all: {},

            get: {},
            post: {
                "Content-Type" : "application/json; charset=UTF-8"
            },
            put: {
                "Content-Type" : "application/json; charset=UTF-8"
            },
            head: {},
            "delete": {},
            jsonp: {}
        },

        method: "get",
        dataType: "json",

        cache: true,
        emulateHttp: false,
        crossDomain: false,

        serialize: function(data, contentType) {
            var ignoreCase = true;
            if (contains(contentType, "application/x-www-form-urlencoded", ignoreCase)) {
                if (isObject(data) && !isFile(data)) {
                    data = toFormData(data);
                }
            }
            else if (contains(contentType, "application/json", ignoreCase)) {
                if (isObject(data) && !isFile(data)) {
                    data = toJson(data);
                }
            }
            else {
                // do nothing - nothing to serialize
            }

            return data;
        },

        parse: function(data) {
            if (data) {
                try {
                    data = toJson(data);
                }
                catch (error) {
                    // do nothing - not json, or invalid json
                }
            }

            return data;
        }
    });
}