"use strict";

var StringUtils = require("../../utils/string.js");
var Xhr = require("./http-xhr.js");
var JsonpRequest = require("./http-jsonp.js");
var CrossDomainScriptRequest = require("./http-cors-script.js");

module.exports = function(recurveModule) {
    recurveModule.constructor("$httpProvider", ["$window", "$promise"], provider);
};

var requestId = 0;

function provider($window, $promise) {
    return {
        // TODO TBD don't pass in the deferred instead just create here and return the promise
        send: function(options, deferred) {
            var request;

            if (StringUtils.isEqualIgnoreCase("jsonp", options.method)) {
                request = new JsonpRequest(requestId, options, deferred, $window);
            }
            else if (options.crossDomain &&
                StringUtils.isEqualIgnoreCase("script", options.method)) {
                request = new CrossDomainScriptRequest(requestId, options, deferred);
            }
            else {
                request = new Xhr(requestId, options, deferred, $window);
            }

            requestId++;

            deferred.request = request;
            request.send();
        }
    };
}
