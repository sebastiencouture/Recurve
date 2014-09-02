"use strict";

var ObjectUtils = require("../../utils/object.js");
var StringUtils = require("../../utils/string.js");
var WindowUtils = require("../../utils/window.js");
var assert = require("../../utils/assert.js");

module.exports = Xhr;

function Xhr(id, options, deferred, $window) {
    this._id = id;
    this._options = options;
    this._deferred = deferred;
    this.$window = $window;
}

Xhr.Prototype = {
    send: function() {
        if (window.XMLHttpRequest) {
            this._xhr = new XMLHttpRequest();
        }
        else {
            assert(false, "recurve only supports IE8+");
        }

        this._config();

        this._xhr.onreadystatechange =
            this._stateChangeHandler.bind(this)

        this._xhr.open(this._options.method.toUpperCase(), this._options.url, true);

        if (this._options.beforeSend) {
            this._options.beforeSend(this._xhr, this._options);
        }

        this._xhr.send(this._options.data);
    },

    cancel: function() {
        this._canceled = true;

        if (this._xhr) {
            this._xhr.abort();
        }
    },

    _config: function() {
        this._addHeaders();

        if (this._options.withCredentials) {
            this._xhr.withCredentials = true;
        }

        if (this._options.timeout) {
            this._xhr.timeout = this._options.timeout;
        }

        if (this._options.responseType) {
            try {
                this._xhr.responseType = this._options.responseType;
            }
            catch (error) {
                // https://bugs.webkit.org/show_bug.cgi?id=73648
                // Safari will throw error for "json" method, ignore this since
                // we can handle it
                if (!StringUtils.isEqualIgnoreCase("json", this._options.method)) {
                    throw error;
                }
            }
        }
    },

    _addHeaders: function() {
        ObjectUtils.forEach(this._options.headers, function(value, header) {
            if (value) {
                this._xhr.setRequestHeader(header, value);
            }
        })
    },

    _stateChangeHandler: function() {
        if (4 !== this._xhr.readyState) {
            return;
        }

        if (this._isSuccess()) {
            this._handleSuccess();
        }
        else {
            this._handleError();
        }
    },

    _isSuccess: function() {
        if (this._canceled && this._options.errorOnCancel) {
            return false;
        }

        var status = this._xhr.status;

        return (200 <= status && 300 > status) ||
            304 === status ||
            (0 === status && "file:" === this.$window.location.protocol);
    },

    _handleSuccess: function() {
        var data = this._getData();

        if (StringUtils.isEqualIgnoreCase("script", this._options.dataType)) {
            WindowUtils.globalEval(this.$window, data);
        }

        this._complete(true, data);
    },

    _handleError: function(statusText) {
        this._complete(false, null, statusText);
    },

    _complete: function(success, data, statusText) {
        var response = {
            data: data,
            status : this._xhr.status,
            statusText : statusText ? statusText : this._xhr.statusText,
            headers : this._xhr.getAllResponseHeaders(),
            options : this._options,
            canceled : this._canceled
        };

        if (success) {
            this._deferred.resolve(response);
        }
        else {
            this._deferred.reject(response);
        }
    },

    _getData: function() {
        var accept =  this._options.headers && this._options.headers.Accept;
        if (!accept) {
            accept = this._xhr.getResponseHeader('content-type');
        }

        var data;
        var ignoreCase = true;

        if (StringUtils.contains(accept, "application/xml", ignoreCase) ||
            StringUtils.contains(accept, "text/xml", ignoreCase)) {
            data = this._xhr.responseXML;
        }
        else {
            data = this._xhr.responseText;
        }

        return data;
    }
};