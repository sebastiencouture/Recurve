"use strict";

module.exports = function(mockModule) {
    mockModule.configurable("$httpProvider", function(){
        var requestHandlers = [];
        var baseUrl = "";

        return {
            setBaseUrl: function(value) {
                baseUrl = value;
            },

            request: function(method, url) {
                recurve.forEach(requestHandlers, function(requestHandler, index) {
                    if (requestHandler.isMatch(url, method)) {
                        requestHandlers.splice(index, 1);
                        return false;
                    }
                })

                url = baseUrl + url;
                return requestHandlers.push(new RequestHandler(method, url));
            },

            requestGet: function(url) {
                return this.request("get", url);
            },

            requestPost: function(url) {
                return this.request("post", url);
            },

            requestJsonp: function(url) {
                return this.request("jsonp", url);
            },

            requestDelete: function(url) {
                return this.request("delete", url);
            },

            requestHead: function(url) {
                return this.request("head", url);
            },

            requestPut: function(url) {
                return this.request("put", url);
            },

            requestPatch: function(url) {
                return this.request("patch", url);
            },

            requestScript: function(url) {
                return this.request("script", url);
            },

            $provider: function() {
                return {
                    send: function(options, deferred) {
                        var requestHandler = null;
                        recurve.forEach(requestHandlers, function(request) {
                            if (request.isMatch(options.url, options.method)) {
                                requestHandler = request;
                                return false;
                            }
                        });

                        if (!requestHandler) {
                            recurve.assert(false, "no mock request handler exists for {0} {1}", options.url, options.method);
                        }

                        if (!requestHandler.response) {
                            recurve.assert(false, "no mock response exists for {0} {1}", options.url, options.method);
                        }

                        requestHandler.count++;
                        requestHandler.checkExpectations(options);

                        var response = recurve.extend({}, requestHandler.response);
                        recurve.extend(response, {options: options});

                        deferred.resolve(response);
                    },

                    clear: function() {
                        requestHandlers = [];
                    }
                };
            }
        };
    });
};

function RequestHandler(method, url) {
    this._method = method;
    this._url = url;

    this._expectations = [];

    this.count = 0;
}

RequestHandler.prototype = {
    isMatch: function(url, method) {
        return this._url = url && this._method === method;
    },

    respond: function(data, status, statusText, headers, canceled) {
        this.response = {
            data: data,
            status: status,
            statusText: statusText,
            headers: headers,
            canceled: canceled
        };
    },

    expect: function(options, exactMatch) {
        this._expectations.push({options: options, exactMatch: exactMatch});
    },

    expectExact: function(options) {
        this.expect(options, true);
    },

    expectData: function(data, partialMatch) {
        this.expect({data: data}, partialMatch);
    },

    expectDataExact: function(data) {
        this.expectData({data: data}, true);
    },

    expectHeaders: function(headers, partialMatch) {
        this.expect({headers: headers}, partialMatch)
    },

    expectHeadersExact: function(headers) {
        this.expectHeaders(headers, true);
    },

    expectCallCountToBe: function(count) {
        recurve.assert(count === this.count,
            "request handler {0}:{1} call count does not match expected {2} != {3}",
            this._url, this._method, this.count, count);
    },

    checkExpectations: function(options) {
        recurve.forEach(this._expectations, function(expectation) {
            if (expectation.exactMatch) {
                recurve.assert(ObjectUtils.areEqual(expectation.options, options),
                    this._assertDescription(expectation.options, options));
            }
            else {
                this._checkExpectationPartialMatch(expectation.options, options);
            }
        }, this);
    },

    _checkExpectationPartialMatch: function(expectated, actual) {
        recurve.forEach(expectated, function(expectedValue, expectedKey) {
            var actualValue = actual[expectedKey];

            if (recurve.isObject(expectedValue) || recurve.isArray(expectedValue)) {
                recurve.assert(actualValue, this._assertDescription(expectedValue, actualValue));
                this._checkExpectationPartialMatch(expectedValue, actualValue);
            }
            else {
                recurve.assert(expectedValue === actualValue,
                    this._assertDescription(expectedValue, actualValue));
            }
        }, this);
    },

    _assertDescription: function(expectated, actual) {
        return recurve.format(
            "request handler {0} {1} expectation not met, expect: {2}, actual: {3}",
            this._url, this._method, expectated, actual);
    }

};