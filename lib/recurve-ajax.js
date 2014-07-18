/**
 *  Created by Sebastien Couture on 2014-7-16.
 *  Copyright (c) 2014 Sebastien Couture. All rights reserved.
 *
 *  Permission is hereby granted, free of charge, to any person
 *  obtaining a copy of this software and associated documentation
 *  files (the "Software"), to deal in the Software without
 *  restriction, including without limitation the rights to use,
 *  copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *  OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    // TODO TBD, add support for:
    // - cache
    // - cross domain
    // - jsonP ( future release )

    // TODO TBD add optional dependency on Q.js to return promise
    Recurve.Ajax = {
        get: function(options) {
            return _ajax(Recurve.HttpRequest.Type.GET, options);
        },

        post: function(options) {
            return _ajax(Recurve.HttpRequest.Type.POST, options);
        },

        beforeSend: null
    };

    var _ajax = function(type, options) {
        if (!options) {
            throw new Error("options must be specified");
        }

        options.type = type;

        var request = new Recurve.HttpRequest(options);
        request.send();

        return request;
    };


    Recurve.HttpRequest = Recurve.Proto.define([
        function ctor(options) {
            this._options = options;
            this._setDefaultOptions();
        },

        {
            send: function() {
                if (window.XMLHttpRequest) {
                    this._request = new XMLHttpRequest();
                }
                else {
                    throw new Error("Recurve only supports IE8+");
                }

                this._request.onreadystatechange =
                    Recurve.ObjectUtils.bind(this._stateChangeHandler, this);

                this._updateUrl();
                this._addHeaders();

                this._request.open(this._options.type, this._options.url, this._options.async);

                if (Recurve.Ajax.beforeSend) {
                    Recurve.Ajax.beforeSend(this._request);
                }

                this._request.send(this._options.data);
            },

            cancel: function() {
                this._cancelled = true;
                this._options = null;

                if (this._request) {
                    this._request.abort();
                }
            },

            _setDefaultOptions: function() {
                if (undefined === this._options.type) {
                    this._options.type = Recurve.HttpRequest.Type.GET;
                }

                if (undefined === this._options.contentType) {
                    this._options.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
                }

                if (undefined === this._options.async) {
                    this._options.async = true;
                }

                if (!this._options.headers) {
                    this._options.headers = {};
                }
            },

            _updateUrl: function() {
                if (Recurve.HttpRequest.Type.GET !== this._options.type || !this._options.data) {
                    return;
                }

                this._options.url =
                    Recurve.StringUtils.addParametersToUrl(
                        this._options.url, this._options.data);
            },

            _addHeaders: function() {
                this._configAcceptHeader();
                this._configContentTypeHeader();
                this._configRequestedWithHeader()

                for (var key in this._options.headers) {
                    this._request.setRequestHeader(key, this._options.headers[key]);
                }
            },

            _configAcceptHeader: function() {
                if (this._options.headers.Accept) {
                    return;
                }

                var all = "*/*";
                var accept = all;
                var ignoreCase = true;
                var dataType = this._options.dataType;

                if (dataType) {
                    if (Recurve.HttpRequest.DataType.TEXT === dataType) {
                        accept = "text/plain,*/*;q=0.01";
                    }
                    else if (Recurve.HttpRequest.DataType.HTML === dataType) {
                        accept = "text/html,*/*;q=0.01";
                    }
                    else if (Recurve.HttpRequest.DataType.XML === dataType) {
                        accept = "application/xml,text/xml,*/*;q=0.01";
                    }
                    else if (Recurve.HttpRequest.DataType.JSON === dataType ||
                        Recurve.HttpRequest.DataType.SCRIPT === dataType) {
                        accept = "application/json,text/javascript,*/*;q=0.01";
                    }
                    else {
                        // do nothing - default to all
                    }

                }

                this._options.headers.Accept = accept;
            },

            _configContentTypeHeader: function() {
                if (this._options.headers["Content-Type"]) {
                    return;
                }

                this._options.headers["Content-Type"] = this.options.contentType;
            },

            _configRequestedWithHeader: function() {
                if (Recurve.HttpRequest.DataType.SCRIPT !== this._options.dataType) {
                    this._options.headers["X-Requested-With"] = "XMLHttpRequest";
                }
            },

            _stateChangeHandler: function() {
                if (this._cancelled) {
                    return;
                }

                if (4 !== this._request.readyState) {
                    return;
                }

                if (this._isSuccess(this._request.status)) {
                    this._handleSuccess();
                }
                else {
                    this._handleError();
                }
            },

            _isSuccess: function(status) {
                return (200 <= status && 300 > status) ||
                    304 === status ||
                    (0 === status && "file:" === window.location.protocol);
            },

            _handleSuccess: function() {
                if (!this._options.success) {
                    return;
                }

                var data = this._parseResponse();

                if (Recurve.HttpRequest.DataType.SCRIPT === this._options.dataType) {
                    eval(data);
                }

                this._options.success(data);
            },

            _handleError: function() {
                if (!this._options.error) {
                    return;
                }

                this._options.error(this._request, status);
            },

            _parseResponse: function() {
                var accept =  this._options.headers && this._options.headers.Accept;
                if (!accept) {
                    accept = this._request.getResponseHeader('content-type');
                }

                var data;
                var ignoreCase = true;

                if (Recurve.StringUtils.contains(accept, "application/xml", ignoreCase) ||
                    Recurve.StringUtils.contains(accept, "text/xml", ignoreCase)) {
                    data = this._request.responseXML;
                }
                else if (Recurve.StringUtils.contains(accept, "application/json", ignoreCase)) {
                    data = JSON.parse(this._request.responseText);
                }
                else {
                    data = this._request.responseText;
                }

                return data;
            }
        },

        {
            Type: {
                GET: "GET",
                POST: "POST"
            },

            DataType: {
                JSON: "json",
                XML: "xml",
                TEXT: "text",
                HTML: "html",
                SCRIPT: "script",
                ALL: "*"
            }
        }

    ]);
}