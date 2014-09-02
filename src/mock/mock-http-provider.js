"use strict";

module.exports = function(mockModule) {
    mockModule.configurable("$httpProvider", function(){
        var requests = [];
        var baseUrl = "";

        return {
            setBaseUrl: function(value) {
                baseUrl = value;
            },

            when: function(method, url, accept) {
                // TODO TBD need to handle possible duplicates

                url = baseUrl + url;
                return requests.push(new MockRequest(method, url, accept));
            },

            whenGet: function(url, accept) {
                return this.when("get", url, accept);
            },

            whenPost: function(url, accept) {
                return this.when("post", url, accept);
            },

            whenJsonp: function(url, accept) {
                return this.when("jsonp", url, accept);
            },

            whenDelete: function(url, accept) {
                return this.when("delete", url, accept);
            },

            whenHead: function(url,  accept) {
                return this.when("head", url, accept);
            },

            whenPut: function(url, accept) {
                return this.when("put", url, accept);
            },

            whenPatch: function(url, accept) {
                return this.when("patch", url, accept);
            },

            whenScript: function(url, accept) {
                return this.when("script", url, accept);
            },

            $provider: function() {
                return {
                    send: function(options, deferred) {
                        var response;
                        recurve.forEach(requests, function(request) {
                            if (response.isMatch(options.url, options.method, options.Accept)) {
                                response = request.response;
                                return false;
                            }
                        });

                        if (!response) {
                            recurve.assert("no mock response is configured for {0} {1} {2}", options.url, options.method, options.Accept);
                        }

                        recurve.mixin(response, {options: options});
                        deferred.resolve(response);
                    },

                    clear: function() {
                        requests = null;
                    }
                };
            }
        };
    });
}

function MockRequest(method, url, accept) {
    if (undefined === accept) {
        accept = "application/json"
    }

    this._url = url;
    this._method = method;
    this._accept = accept;
}

MockRequest.prototype = {
    isMatch: function(url, method, accept) {
        if (undefined === accept) {
            accept = "application/json";
        }

        return this._url = url && this._method === method && this._accept === accept;
    },

    respond: function(data, status, statusText, headers, canceled) {
        this.response = {
            data: data,
            status: status,
            statusText: statusText,
            headers: headers,
            canceled: canceled
        };
    }
};