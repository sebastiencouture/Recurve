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

    // TODO TBD
    // - jsonp
    // - cache
    // - cross domain, anything need to do?

    Recurve.Http = function(options) {
        var withDefaults = createOptionsWithDefaults(options, Recurve.Http.defaults);

        updateUrl(withDefaults);
        updateHeaders(withDefaults);
        serializeData(withDefaults);

        var deferred = withDefaults.deferredFactory(withDefaults);
        var request = withDefaults.requestFactory(withDefaults, deferred);

        deferred.request = deferred;
        request.send()

        return deferred.promise;
    };

    Recurve.Http = Recurve.ObjectUtils.extend(Recurve.Http, {
        defaults: {
            headers: {
                all: {},

                get: {},
                post: {
                    "Content-Type" : "application/json; charset=UTF-8"
                },
                put: {
                    "Content-Type" : "application/json; charset=UTF-8"
                },
                head: {},
                "delete": {},
                jsonp: {},
                script: {}
            },

            method: "get",
            dataType: "json",

            serializer : [defaultSerializer],
            parser : [defaultParser],

            requestFactory: DefaultRequestFactory,
            deferredFactory: DefaultDeferredFactory,

            errorOnCancel: true
        },

        get: function(url, options) {
            options = Recurve.ObjectUtils.extend(options, {method: "get", url: url});
            return Recurve.Http(options);
        },

        post: function(url, data, options) {
            options = Recurve.ObjectUtils.extend(options, {method: "post", url: url, data: data});
            return Recurve.Http(options);
        },

        jsonp: function(url, options) {
            options = Recurve.ObjectUtils.extend(options, {method: "jsonp", url: url});
            return Recurve.Http(options);
        },

        delete: function(url, options) {
            options = Recurve.ObjectUtils.extend(options, {method: "delete", url: url});
            return Recurve.Http(options);
        },

        head: function(url, options) {
            options = Recurve.ObjectUtils.extend(options, {method: "head", url: url});
            return Recurve.Http(options);
        },

        put: function(url, data, options) {
            options = Recurve.ObjectUtils.extend(options, {method: "put", url: url, data: data});
            return Recurve.Http(options);
        },

        patch: function(url, data, options) {
            options = Recurve.ObjectUtils.extend(options, {method: "patch", url: url, data: data});
            return Recurve.Http(options);
        },

        getScript: function(url, options) {
            options = Recurve.ObjectUtils.extend(options, {method: "script", url: url});
            return Recurve.Http(options);
        }
    });


    function defaultSerializer(data, contentType) {
        var ignoreCase = true;

        if (Recurve.StringUtils.contains(contentType, "application/x-www-form-urlencoded", ignoreCase)) {
            if (Recurve.ObjectUtils.isObject(data) && !Recurve.ObjectUtils.isFile(data)) {
                data = Recurve.ObjectUtils.toFormData(data);
            }
        }
        else if (Recurve.StringUtils.contains(contentType, "application/json", ignoreCase)) {
            if (Recurve.ObjectUtils.isObject(data) && !Recurve.ObjectUtils.isFile(data)) {
                data = Recurve.ObjectUtils.toJson(data);
            }
        }
        else {
            // do nothing - nothing to serialize
        }

        return data;
    }

    Recurve.Http.serializer = defaultSerializer;


    function defaultParser(xhr, accept) {
        var data;
        var ignoreCase = true;

        if (Recurve.StringUtils.contains(accept, "application/xml", ignoreCase) ||
            Recurve.StringUtils.contains(accept, "text/xml", ignoreCase)) {
            data = xhr.responseXML;
        }
        else if (Recurve.StringUtils.contains(accept, "application/json", ignoreCase)) {
            if (data) {
                data = Recurve.ObjectUtils.toJson(xhr.responseText);
            }
        }
        else {
            data = xhr.responseText;
        }

        return data;
    }

    Recurve.Http.parser = defaultParser;


    function DefaultRequestFactory(options, deferred) {
        var request;

        if (Recurve.StringUtils.isEqualIgnoreCase("jsonp", options.method)) {
            request = new JsonpRequest(options, deferred);
        }
        else {
            request = new Xhr(options, deferred);
        }

        return request;
    };

    Recurve.Http.RequestFactory = DefaultRequestFactory;


    function DefaultDeferredFactory() {
        return new HttpDeferred();
    };

    Recurve.Http.DeferredFactory = DefaultDeferredFactory;


    function QDeferredFactory() {
        var deferred = Q.defer();

        deferred.promise.success = function(onSuccess) {
            deferred.promise.then(function(response) {
                onSuccess(
                    response.data, response.status, response.statusText,
                    response.headers, response.options, response.canceled);
            });

            return this._deferred.promise;
        };

        deferred.promise.error = function(onError) {
            deferred.promise.then(null, function(response) {
                onError(
                    response.data, response.status, response.statusText,
                    response.headers, response.options, response.canceled);
            });

            return this._deferred.promise;
        };

        deferred.promise.cancel = function() {
            deferred.request.cancel();
        };

        return deferred;
    };

    Recurve.Http.QDeferredFactory = QDeferredFactory;


    function createOptionsWithDefaults(options, defaults) {
        var withDefaults = Recurve.ObjectUtils.extend({}, defaults);

        withDefaults.headers = {};
        mergeHeaders(options.method, withDefaults, defaults.headers);

        Recurve.ObjectUtils.extend(withDefaults, options);

        return withDefaults;
    }

    function mergeHeaders(method, options, defaultHeaders) {
        method = method.toLowerCase();

        Recurve.ObjectUtils.extend(options, defaultHeaders.all);
        Recurve.ObjectUtils.extend(options, defaultHeaders[method]);
    }

    function updateUrl(options) {
        options.url =
            Recurve.StringUtils.addParametersToUrl(
                options.url, options.params);
    }

    function updateHeaders(options) {
        addAcceptHeader(options);
        addRequestedWithHeader(options);
        removeContentType(options);
    }

    function addAcceptHeader(options) {
        if (options.headers.Accept) {
            return;
        }

        var accept = "*/*";
        var dataType = options.dataType;

        if (dataType) {
            dataType = dataType.toLowerCase();

            if ("text" === dataType) {
                accept = "text/plain,*/*;q=0.01";
            }
            else if ("html" === dataType) {
                accept = "text/html,*/*;q=0.01";
            }
            else if ("xml" === dataType) {
                accept = "application/xml,text/xml,*/*;q=0.01";
            }
            else if ("json" === dataType || "script" === dataType) {
                accept = "application/json,text/javascript,*/*;q=0.01";
            }
            else {
                // do nothing - default to all
            }
        }

        options.headers.Accept = accept;
    }

    function addRequestedWithHeader(options) {
        if (Recurve.StringUtils.isEqualIgnoreCase("script", options.dataType)) {
            options.headers["X-Requested-With"] = "XMLHttpRequest";
        }
    }

    function removeContentType(options) {
        if (!options.data) {
            return;
        }

        Recurve.ObjectUtils.forEach(options.headers, function(value, header) {
            if (Recurve.StringUtils.isEqualIgnoreCase("content-type", header)) {
                delete options.headers[header];
            }
        });
    }

    function serializeData(options) {
        if (!options.data) {
            return;
        }

        var data = options.data;

        if (Recurve.ObjectUtils.isFunction(options.serializer)) {
            data = options.serializer(data, this._options.contentType);
        }
        else {
            Recurve.ObjectUtils.forEach(options.serializer, function(serializer) {
                data = serializer(data, options.contentType);
            });
        }

        options.data = data;
    }


    var HttpDeferred = Recurve.Proto.define([
        function ctor() {
            this._succeeded = new Recurve.Signal();
            this._errored = new Recurve.Signal();
        },

        {
            resolve: function(response) {
                this._succeeded.trigger(response);

                this._succeeded = null;
                this._errored = null;
            },

            reject: function(response) {
                this._errored.trigger(response);

                this._succeeded = null;
                this._errored = null;
            },

            promise: {
                then: function(onSuccess, onError) {
                    this._succeeded.on(onSuccess);
                    this._errored.on(onError);
                },

                success: function(onSuccess) {
                    this._succeeded.on(function(response) {
                        onSuccess(response.data, response.status, response.statusText,
                            response.headers, response.options, response.canceled);
                    });
                },

                error: function(onError) {
                    this._errored.on(function(response) {
                        onError(response.data, response.status, response.statusText,
                            response.headers, response.options, response.canceled);
                    });

                },

                cancel: function() {
                    this.request.cancel();
                }
            }
        }
    ]);


    var Xhr = Recurve.Proto.define([
        function ctor(options, deferred) {
            this._options = options;
            this._deferred = deferred;
        },

        {
            send: function() {
                if (window.XMLHttpRequest) {
                    this._xhr = new XMLHttpRequest();
                }
                else {
                    throw new Error("Recurve only supports IE8+");
                }

                this._config();

                this._xhr.onreadystatechange =
                    Recurve.ObjectUtils.bind(this._stateChangeHandler, this);

                this._xhr.open(this._options.type.toUpperCase(), this._options.url, true);

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

                if (this._options.type) {
                    try {
                        this._xhr.responseType = this._options.responseType;
                    }
                    catch (error) {
                        // https://bugs.webkit.org/show_bug.cgi?id=73648
                        // Safari will throw error for "json" type, ignore this since
                        // we can handle it
                        if (!Recurve.StringUtils.isEqualIgnoreCase("json", this._options.type)) {
                            throw error;
                        }
                    }
                }
            },

            _addHeaders: function() {
                Recurve.ObjectUtils.forEach(this._options.headers, function(value, header) {
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
                    (0 === status && Recurve.WindowUtils.isFileProtocol());
            },

            _handleSuccess: function() {
                if (!this._options.success) {
                    return;
                }

                var data;

                if (Recurve.StringUtils.isEqualIgnoreCase("script", this._options.dataType)) {
                    data = this._request.responseText;
                    Recurve.WindowUtils.globalEval(data);
                }
                else {
                    try {
                        data = this._parseResponse();
                    }
                    catch (error) {
                        this._handleError("unable to parse response");
                        return;
                    }
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

            _parseResponse: function() {
                var accept =  this._options.headers && this._options.headers.Accept;
                if (!accept) {
                    accept = this._xhr.getResponseHeader('content-type');
                }

                var data;

                if (Recurve.ObjectUtils.isFunction(this._options.serializer)) {
                    data = this._options.parser(this._xhr), accept;
                }
                else {
                    Recurve.ObjectUtils.forEach(this._options.parser, function(parser) {
                        data = parser(this._xhr, accept);
                    });
                }

                return data;
            }
        }
    ]);


    // TODO TBD
    var JsonpRequest = Recurve.Proto.define([
        function ctor(options, deferred) {
            this._options = options;
            this._deferred = deferred;
        },

        {
            send: function() {

            },

            cancel: function() {

            }
        }
    ]);
})();