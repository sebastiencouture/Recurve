"use strict";

module.exports = function(mockModule) {
    mockModule.configurable("$httpProvider", function(){
        var responses = [];
        var baseUrl = "";

        return {
            setBaseUrl: function(value) {
                baseUrl = value;
            },

            when: function(url, response, method, accept) {
                // TODO TBD need to handle possible duplicates
                
                url = baseUrl + url;
                responses.push(new MockResponse(url, response, method, accept));
            },

            whenGet: function(url, response, accept) {
                responses.push(new MockResponse(url, response, "get", accept));
            },

            whenPost: function(url, response, accept) {
                responses.push(new MockResponse(url, response, "post", accept));
            },

            whenJsonp: function(url, response, accept) {
                responses.push(new MockResponse(url, response, "jsonp", accept));
            },

            whenDelete: function(url, response, accept) {
                responses.push(new MockResponse(url, response, "delete", accept));
            },

            whenHead: function(url, response, accept) {
                responses.push(new MockResponse(url, response, "head", accept));
            },

            whenPut: function(url, response, accept) {
                responses.push(new MockResponse(url, response, "put", accept));
            },

            whenPatch: function(url, response, accept) {
                responses.push(new MockResponse(url, response, "patch", accept));
            },

            whenScript: function(url, response, accept) {
                responses.push(new MockResponse(url, response, "script", accept));
            },

            $provider: function() {
                return {
                    send: function(options, deferred) {

                    }
                };
            }
        };
    });
}

function MockResponse(url, response, method, accept) {
    if (undefined === method) {
        method = "get";
    }

    if (undefined === accept) {
        accept = "application/json"
    }

    this.response = response;

    this._url = url;
    this._method = method;
    this._accept = accept;
}

MockResponse.prototype = {
    isMatch: function(url, method, accept) {
        if (undefined === accept) {
            accept = "application/json";
        }

        return this._url = url && this._method === method && this._accept === accept;
    }
};