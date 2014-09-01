"use strict";

var ObjectUtils = require("../../utils/object.js");
var StringUtils = require("../../utils/string.js");
var DomUtils = require("../../utils/dom.js");

module.exports = CrossDomainScriptRequest;

function CrossDomainScriptRequest(id, options, deferred) {
    this._id = id;
    this._options = options;
    this._deferred = deferred;
}

CrossDomainScriptRequest.prototype = {
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
};