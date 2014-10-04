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

            if (!contains(url, "?")) {
                url = url.replace("&", "?");
            }

            return url;
        }

        function requestHandler(method, url) {
            method = method.toUpperCase();

            function optionsMatch(expectOptions, options) {
                var match = true;
                recurve.forEach(expectOptions, function(value, key) {
                    if (recurve.isObject(value)) {
                        match = optionsMatch(value, options[key])
                        return false;
                    }
                    else if (!recurve.areEqual(options[key], value)) {
                        match = false;
                        return false;
                    }
                    else {
                        // do nothing
                    }
                });

                return match;
            }

            var lastRequestOptions;

            return {
                callCount: 0,
                expectedOptions: {},

                respond: function(request) {
                    if (!this.isEqual(request.options.method, request.options.url)) {
                        return false;
                    }

                    if (!optionsMatch(this.expectOptions, request.options)) {
                        lastRequestOptions = request.options;
                        return false;
                    }

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
                    this.expectOptions = {};
                },

                isEqual: function(otherMethod, otherUrl) {
                    return method === otherMethod.toUpperCase() && url === otherUrl;
                },

                toString: function() {
                    var str = recurve.format(
                        "method: {0}, url: {1}, expected calls: {2}, actual: {3}",
                        method, url, this.expectCount || 0, this.callCount);

                    if (this.expectOptions) {
                        str += ", expected options: " + recurve.toJson(this.expectOptions);

                        if (lastRequestOptions) {
                            str += ", actual: " + recurve.toJson(lastRequestOptions);
                        }
                    }

                    return str;
                }
            };
        }

        function successful(status) {
            return 200 <= status && 300 > status;
        }

        return {
            send: function(options, httpDeferred) {
                // don't require handlers to match params on the url, instead should check against
                // the params object
                if (options) {
                    recurve.forEach(options.params, function(value, param) {
                        options.url = removeParameterFromUrl(options.url, param);
                    });
                }

                requests.push({options: options, httpDeferred: httpDeferred});
                return httpDeferred.promise;
            },

            on: function(method, url) {
                var handler;
                recurve.forEach(handlers, function(existing) {
                    if (existing.isEqual(method, url)) {
                        handler = existing;
                        return false;
                    }
                });

                if (!handler) {
                    handler = requestHandler(method, url);

                    // doing this to simplify unit testing...
                    handler.interface = {
                        respond: function(response) {
                            if (response) {
                                response.status = response.status || 200;
                            }

                            handler.response = response;
                            return this;
                        },

                        expect: function(options, count) {
                            if (recurve.isUndefined(count)) {
                                count = 1;
                            }

                            if (options && options.method) {
                                options.method = options.method.toLowerCase();
                            }

                            handler.expectCount = count;
                            handler.expectOptions = options;
                            return this;
                        },

                        callCount: function() {
                            return handler.callCount;
                        }
                    };

                    handlers.push(handler);
                }

                return handler.interface;
            },

            flush: function(count) {
                var respondCount = 0;
                var respondedIndex = [];

                recurve.forEach(requests, function(request, index) {
                    var responded = false;
                    recurve.forEach(handlers, function(handler) {
                        if (handler.respond(request)) {
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
        }
    });
}