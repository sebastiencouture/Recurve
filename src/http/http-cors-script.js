"use strict";

var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
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
            var script = document.createElement("script");
            script.src = this._options.url;
            script.async = true;

            var that = this;

            function loadErrorHandler (event) {
                DomUtils.removeEventListener(script, "load", loadErrorHandler);
                DomUtils.removeEventListener(script, "error", loadErrorHandler);

                document.head.removeChild(script);
                script = null;

                if (event && "error" === event.type) {
                    that._deferred.reject({status: 404, canceled: that._canceled});
                }
                else {
                    that._deferred.resolve({status: 200, canceled: that._canceled});
                }
            }

            DomUtils.addEventListener(script, "load", loadErrorHandler);
            DomUtils.addEventListener(script, "error", loadErrorHandler);

            document.head.appendChild(script);
        },

        cancel: function() {
            this._canceled = true;
        }
    }
]);