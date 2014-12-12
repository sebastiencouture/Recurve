"use strict";

function addMockHttpProviderService(module) {
    module.factory("$httpProvider", ["$async"], function($async) {
        var requests = [];
        var handlers = [];

        function removeParameterFromUrl(url, parameter) {
            if (!url || !parameter) {
                return url;
            }

            var search = encodeURIComponent(parameter) + "=";
            var startIndex = url.indexOf(search);

            if (-1 === startIndex) {
                return url;
            }

            var endIndex = url.indexOf("&", startIndex);

            if (-1 < endIndex) {
                url = url.substr(0, Math.max(startIndex - 1, 0)) + url.substr(endIndex);
            }
            else {
                url = url.substr(0, Math.max(startIndex - 1, 0));
            }

            if (!recurve.contains(url, "?")) {
                url = url.replace("&", "?");
            }

            return url;
        }

        // TODO TBD pulled from core common.js
        function toFormData(obj) {
            if (!recurve.isObject(obj) || recurve.isArray(obj)) {
                return null;
            }

            var values = [];
            recurve.forEach(obj, function(value, key) {
                values.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            });

            return values.join("&");
        }

        function expectationsMatch(expect, actual) {
            if (!actual) {
                return false;
            }

            var match = true;
            recurve.forEach(expect, function(value, key) {
                if (recurve.isRegExp(value)) {
                    match = recurve.toJson(actual[key]).match(value);
                }
                else if (recurve.isObject(value)) {
                    // check for serialized data to json and form data by $http
                    if (recurve.isString(actual[key])) {
                        try {
                            var json = recurve.toJson(value);
                            if (json === actual[key]) {
                                return;
                            }
                        }
                        catch (e) {}
                        try {
                            var formData = toFormData(value);
                            if (formData === actual[key]) {
                                return;
                            }
                        }
                        catch (e) {}
                    }

                    match = expectationsMatch(value, actual[key]);
                    return false;
                }
                else if (!recurve.areEqual(actual[key], value)) {
                    match = false;
                    return false;
                }
                else {
                    // do nothing
                }
            });

            return match;
        }

        function requestHandler(method, url) {
            method = method.toUpperCase();

            var lastRequestOptions;

            return {
                callCount: 0,
                expectedOptions: {},

                match: function(request) {
                    if (!this.urlMatch(request.options.method, request.options.url)) {
                        return false;
                    }

                    if (!expectationsMatch(this.expect, request.options)) {
                        lastRequestOptions = request.options;
                        return false;
                    }

                    return true;
                },

                respond: function(request) {
                    this.callCount++;

                    if (this.response) {
                        if (successful(this.response.status)) {
                            request.httpDeferred.resolve(this.response);
                        }
                        else {
                            request.httpDeferred.reject(this.response);
                        }
                    }
                    else {
                        // tolerate no responses for expectations since might just
                        // care that it was called
                        if (recurve.isUndefined(this.expectCount)) {
                            throw new Error("expected response data for: " + this.toString());
                        }
                    }

                    return true;
                },

                metExpectations: function() {
                    return recurve.isUndefined(this.expectCount) || this.expectCount === this.callCount;
                },

                clearExpectations: function() {
                    this.expectCount = undefined;
                    this.expect = {};
                },

                urlMatch: function(otherMethod, otherUrl) {
                    return method === otherMethod && url === otherUrl;
                },

                toString: function() {
                    var str = recurve.format(
                        "method: {0}, url: {1}, expected calls: {2}, actual: {3}",
                        method, url, this.expectCount || 0, this.callCount);

                    if (this.expect) {
                        str += ", expected: " + prettyPrint(this.expect);

                        if (lastRequestOptions) {
                            str += ", actual: " + prettyPrint(lastRequestOptions);
                        }
                    }

                    return str;
                }
            };
        }

        function prettyPrint(data) {
            return recurve.toJson(data);
        }

        function successful(status) {
            return 200 <= status && 300 > status;
        }

        function createHandler(method, url) {
            var handler = requestHandler(method, url);

            // doing this to simplify unit testing...
            handler.interface = {
                respond: function(response) {
                    if (response && recurve.isUndefined(response.status)) {
                        response.status = 200;
                    }

                    handler.response = response;
                    return this;
                },

                // NOTE, don't need to expect any options, or count (even method)
                expect: function(options, count) {
                    if (recurve.isUndefined(count)) {
                        count = 1;
                    }

                    if (options && options.method) {
                        options.method = options.method.toUpperCase();
                    }

                    handler.expectCount = count;
                    handler.expect = options;

                    return this;
                },

                callCount: function() {
                    return handler.callCount;
                }
            };

            return handler;
        }

        function createShortMethod(method) {
            return function(url) {
                this.on(method, url);
            };
        }

        return {
            send: function(options, httpDeferred) {
                // don't require handlers to match params on the url, instead should check against
                // the params object
                recurve.forEach(options.params, function(value, param) {
                    options.url = removeParameterFromUrl(options.url, param);
                });

                options.method = options.method.toUpperCase();

                var that = this;
                httpDeferred.promise.cancel = function() {
                    var handler = that.on(options.method, options.url);
                    handler.respond({status: 0, canceled: true});
                };

                requests.push({options: options, httpDeferred: httpDeferred});
                return httpDeferred.promise;
            },

            on: function(method, url) {
                method = method.toUpperCase();

                var handler;
                recurve.forEach(handlers, function(existing) {
                    if (existing.urlMatch(method, url)) {
                        handler = existing;
                        return false;
                    }
                });

                if (!handler) {
                    handler = createHandler(method, url);
                    handlers.push(handler);
                }

                return handler.interface;
            },

            onGET: createShortMethod("GET"),
            onPOST: createShortMethod("POST"),
            onJSONP: createShortMethod("JSONP"),
            onDELETE: createShortMethod("DELETE"),
            onHEAD: createShortMethod("HEAD"),
            onPUT: createShortMethod("PUT"),
            onPATCH: createShortMethod("PATCH"),

            flush: function(count) {
                var respondCount = 0;
                var respondedIndex = [];

                recurve.forEach(requests, function(request, index) {
                    var responded = false;
                    recurve.forEach(handlers, function(handler) {
                        if (handler.match(request)) {
                            handler.respond(request);
                            responded = true;
                            return false;
                        }
                    });

                    if (responded) {
                        respondCount++;
                        respondedIndex.push(index);
                    }

                    if (respondCount === count) {
                        return false;
                    }
                });

                for (var index = respondedIndex.length-1; 0 <= index; index--) {
                    requests.splice(index, 1);
                }

                $async.flush();
            },

            clearExpectations: function() {
                recurve.forEach(handlers, function(handler) {
                    handler.clearExpectations();
                });
            },

            clearHandlers: function() {
                handlers = [];
            },

            clearPending: function() {
                requests = [];
            },

            verifyExpectations: function() {
                var outstanding = [];
                recurve.forEach(handlers, function(handler) {
                    if (!handler.metExpectations()) {
                        outstanding.push(handler);
                    }
                });

                if (0 === outstanding.length) {
                    return;
                }

                var description = "outstanding expectations:\n";
                recurve.forEach(outstanding, function(handler) {
                    description += handler.toString() + ",\n";
                });

                throw new Error(description);
            },

            verifyPending: function() {
                if (0 === requests.length) {
                    return;
                }

                var description = "pending requests:\n";
                recurve.forEach(requests, function(request) {
                    description += recurve.format("method: {0}, url: {1},\n", request.options.method, request.options.url);
                });

                throw new Error(description);
            }
        };
    });
}