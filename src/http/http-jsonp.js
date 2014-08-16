"use strict";

var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
var UrlUtils = require("../utils/url.js");
var DomUtils = require("../utils/dom.js");
var Proto = require("../proto.js");

var requestId = 0;

module.exports = Proto.define([
    function ctor(options, deferred) {
        this._options = options;
        this._deferred = deferred;
        this._id = requestId++;
    },

    {
        send: function() {
            var callbackId = "Recurve" + StringUtils.generateUUID();
            var url = UrlUtils.removeParameterFromUrl(this._options.url, "callback");
            url = UrlUtils.addParametersToUrl(url, {callback: callbackId});

            var script = document.createElement("script");
            script.src = url;
            script.type = "text/javascript";
            script.async = true;

            var called;
            var that = this;

            function callbackHandler(data) {
                called = true;

                if (that._canceled && that._options.errorOnCancel) {
                    that._complete();
                }
                else {
                    that._complete(true, data, 200);
                }
            }

            function loadErrorHandler (event) {
                DomUtils.removeEventListener(script, "load", loadErrorHandler);
                DomUtils.removeEventListener(script, "error", loadErrorHandler);

                document.head.removeChild(script);
                script = null;

                delete window[callbackId];

                if (event && "load" === event.type && !called) {
                    that._complete(false, null, 404, "jsonp callback not called");
                }
            }

            DomUtils.addEventListener(script, "load", loadErrorHandler);
            DomUtils.addEventListener(script, "error", loadErrorHandler);

            window[callbackId] = callbackHandler;

            document.head.appendChild(script);
        },

        cancel: function() {
            this._canceled = true;
        },

        _complete: function(success, data, status, statusText) {
            var response = {
                data: data,
                status: status,
                statusText: statusText,
                options: this._options,
                canceled: this._canceled
            };

            if (success) {
                this._deferred.resolve(response);
            }
            else {
                this._deferred.reject(response);
            }
        }
    }
]);