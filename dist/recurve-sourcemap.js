(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    "use strict";

    var Recurve = window.Recurve || {};

    Recurve.StringUtils = require("./recurve-string.js");
    Recurve.WindowUtils = require("./recurve-window.js");
    Recurve.ArrayUtils = require("./recurve-array.js");
    Recurve.DateUtils = require("./recurve-date.js");
    Recurve.ObjectUtils = require("./recurve-object.js");

    Recurve.assert = require("./recurve-assert.js");

    Recurve.Proto = require("./recurve-proto.js");
    Recurve.Log = require("./recurve-log.js");
    Recurve.LogConsoleTarget = require("./recurve-log-console.js");
    Recurve.Signal = require("./recurve-signal.js");
    Recurve.Http = require("./recurve-http.js");
    Recurve.GlobalErrorHandler = require("./recurve-global-error-handler.js");

    window.Recurve = Recurve;
})();
},{"./recurve-array.js":2,"./recurve-assert.js":3,"./recurve-date.js":4,"./recurve-global-error-handler.js":5,"./recurve-http.js":6,"./recurve-log-console.js":7,"./recurve-log.js":8,"./recurve-object.js":9,"./recurve-proto.js":10,"./recurve-signal.js":11,"./recurve-string.js":12,"./recurve-window.js":13}],2:[function(require,module,exports){
"use strict";

module.exports = {
    removeItem: function(array, item) {
        if (!array) {
            return;
        }

        var index = array.indexOf(item);

        if (-1 < index) {
            array.splice(index, 1);
        }
    },

    removeAt: function(array, index) {
        if (!array) {
            return;
        }

        if (0 <= index && array.length > index) {
            array.splice(index, 1);
        }
    },

    replaceItem: function(array, item) {
        if (!array) {
            return;
        }

        var index = array.indexOf(item);

        if (-1 < index) {
            array[index] = item;
        }
    },

    isEmpty: function(value) {
        return !value || 0 === value.length;
    },

    argumentsToArray: function(args, sliceCount) {
        return sliceCount < args.length ? Array.prototype.slice.call(args, sliceCount) : [];
    }
};
},{}],3:[function(require,module,exports){
/*
(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.assert = function(condition, message) {
        if (condition) {
            return;
        }

        Array.prototype.shift.apply(arguments);
        message = Recurve.StringUtils.format.apply(this, arguments);

        throw new Error(message);
    };
})();
*/

"use strict";

var StringUtils = require("./recurve-string.js");

// TODO TBD add methods such as: ok, equal, equalStrict, etc.
module.exports = function(condition, message) {
    if (condition) {
        return;
    }

    Array.prototype.shift.apply(arguments);
    message = StringUtils.format.apply(this, arguments);

    throw new Error(message);
};
},{"./recurve-string.js":12}],4:[function(require,module,exports){
/*(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.DateUtils =
    {
        now: function() {
            return new Date();
        },

        startYearFromRange: function(range) {
            if (!range) {
                return "";
            }

            var split = range.split("-");
            return 0 < split.length ? split[0] : "";
        },

        endYearFromRange: function(range) {
            if (!range) {
                return "";
            }

            var split = range.split("-");
            return 2 < split.length ? split[2] : "";
        }
    };
})();*/

"use strict";

module.exports = {
    now: function() {
        return new Date();
    },

    startYearFromRange: function(range) {
        if (!range) {
            return "";
        }

        var split = range.split("-");
        return 0 < split.length ? split[0] : "";
    },

    endYearFromRange: function(range) {
        if (!range) {
            return "";
        }

        var split = range.split("-");
        return 2 < split.length ? split[2] : "";
    }
};
},{}],5:[function(require,module,exports){
//(function() {
//    "use strict";
//
//    var Recurve = window.Recurve = window.Recurve || {};
//
//    Recurve.GlobalErrorHandler = Recurve.Proto.define([
//
//        /**
//         * NOTE, If your JS is hosted on a CDN then the browser will sanitize and exclude all error output
//         * unless explicitly enabled. See TODO TBD tutorial link
//         *
//         * @param onError, callback declaration: onError(description, error), error will be undefined if not supported by browser
//         * @param enabled, default true
//         * @param preventBrowserHandle, default true
//         */
//        function ctor(onError, enabled, preventBrowserHandle) {
//            if (undefined === enabled) {
//                enabled = true;
//            }
//
//            if (undefined === preventBrowserHandle) {
//                preventBrowserHandle = true;
//            }
//
//            this._enabled = enabled;
//            this._preventBrowserHandle = preventBrowserHandle;
//            this._onError = onError;
//
//            window.onerror = this._errorHandler.bind(this);
//        },
//
//        {
//            /**
//             * Wrap method in try..catch and handle error without raising uncaught error
//             *
//             * @param method
//             * @param [, arg2, ..., argN], list of arguments for method
//             */
//            protectedInvoke: function(method) {
//                try {
//                    var args = Recurve.ArrayUtils.argumentsToArray(arguments, 1);
//                    method.apply(null, args);
//                }
//                catch (error) {
//                    var description = this.describeError(error);
//                    this.handleError(error, description);
//                }
//            },
//
//            /**
//             * Handle error as would be done for uncaught global error
//             *
//             * @param error, any type of error (string, object, Error)
//             * @param description
//             */
//            handleError: function(error, description) {
//                if (this._onError)
//                {
//                    this._onError(error, description);
//                }
//
//                return this._preventBrowserHandle;
//            },
//
//
//            describeError: function(error) {
//                if (!error) {
//                    return null;
//                }
//
//                var description;
//
//                if (Recurve.ObjectUtils.isString(error)) {
//                    description = error;
//                }
//                else if (Recurve.ObjectUtils.isError(error)) {
//                    description = error.message + "\n" + error.stack;
//                }
//                else if (Recurve.ObjectUtils.isObject(error)) {
//                    description = JSON.stringify(error);
//                }
//                else
//                {
//                    description = error.toString();
//                }
//
//                return description;
//            },
//
//            _errorHandler: function(message, filename, line, column, error) {
//                if (!this._enabled) {
//                    return;
//                }
//
//                var description = Recurve.StringUtils.format(
//                    "message: {0}, file: {1}, line: {2}", message, filename, line);
//
//                if (error)
//                {
//                    description += Recurve.StringUtils.format(", stack: {0}", error.stack);
//                }
//
//                if (this._onError)
//                {
//                    this._onError(error, description);
//                }
//
//                return this._preventBrowserHandle;
//            }
//        }
//    ]);
//})();

"use strict";

var Proto = require("./recurve-proto.js");
var StringUtils = require("./recurve-string.js");
var ObjectUtils = require("./recurve-object.js");
var ArrayUtils = require("./recurve-array.js");

module.exports = Proto.define([

    /**
     * NOTE, If your JS is hosted on a CDN then the browser will sanitize and exclude all error output
     * unless explicitly enabled. See TODO TBD tutorial link
     *
     * @param onError, callback declaration: onError(description, error), error will be undefined if not supported by browser
     * @param enabled, default true
     * @param preventBrowserHandle, default true
     */
        function ctor(onError, enabled, preventBrowserHandle) {
        if (undefined === enabled) {
            enabled = true;
        }

        if (undefined === preventBrowserHandle) {
            preventBrowserHandle = true;
        }

        this._enabled = enabled;
        this._preventBrowserHandle = preventBrowserHandle;
        this._onError = onError;

        window.onerror = this._errorHandler.bind(this);
    },

    {
        /**
         * Wrap method in try..catch and handle error without raising uncaught error
         *
         * @param method
         * @param [, arg2, ..., argN], list of arguments for method
         */
        protectedInvoke: function(method) {
            try {
                var args = ArrayUtils.argumentsToArray(arguments, 1);
                method.apply(null, args);
            }
            catch (error) {
                var description = this.describeError(error);
                this.handleError(error, description);
            }
        },

        /**
         * Handle error as would be done for uncaught global error
         *
         * @param error, any type of error (string, object, Error)
         * @param description
         */
        handleError: function(error, description) {
            if (this._onError)
            {
                this._onError(error, description);
            }

            return this._preventBrowserHandle;
        },


        describeError: function(error) {
            if (!error) {
                return null;
            }

            var description;

            if (ObjectUtils.isString(error)) {
                description = error;
            }
            else if (ObjectUtils.isError(error)) {
                description = error.message + "\n" + error.stack;
            }
            else if (ObjectUtils.isObject(error)) {
                description = JSON.stringify(error);
            }
            else
            {
                description = error.toString();
            }

            return description;
        },

        _errorHandler: function(message, filename, line, column, error) {
            if (!this._enabled) {
                return;
            }

            var description = StringUtils.format(
                "message: {0}, file: {1}, line: {2}", message, filename, line);

            if (error)
            {
                description += StringUtils.format(", stack: {0}", error.stack);
            }

            if (this._onError)
            {
                this._onError(error, description);
            }

            return this._preventBrowserHandle;
        }
    }
]);
},{"./recurve-array.js":2,"./recurve-object.js":9,"./recurve-proto.js":10,"./recurve-string.js":12}],6:[function(require,module,exports){
//(function() {
//    "use strict";
//
//    var Recurve = window.Recurve = window.Recurve || {};
//
//    Recurve.Http = function(options) {
//        var withDefaults = createOptionsWithDefaults(options, Recurve.Http.defaults);
//
//        updateUrl(withDefaults);
//        updateHeaders(withDefaults);
//        serializeData(withDefaults);
//
//        var deferred = withDefaults.deferredFactory(withDefaults);
//        var request = withDefaults.requestFactory(withDefaults, deferred);
//
//        deferred.request = deferred;
//        request.send()
//
//        return deferred.promise;
//    };
//
//    Recurve.Http = Recurve.ObjectUtils.extend(Recurve.Http, {
//        defaults: {
//            headers: {
//                all: {},
//
//                get: {},
//                post: {
//                    "Content-Type" : "application/json; charset=UTF-8"
//                },
//                put: {
//                    "Content-Type" : "application/json; charset=UTF-8"
//                },
//                head: {},
//                "delete": {},
//                jsonp: {},
//                script: {}
//            },
//
//            method: "get",
//            dataType: "json",
//
//            cache: true,
//
//            serializer : [defaultSerializer],
//            parser : [defaultParser],
//
//            requestFactory: DefaultRequestFactory,
//            deferredFactory: DefaultDeferredFactory,
//
//            errorOnCancel: true
//        },
//
//        get: function(url, options) {
//            options = Recurve.ObjectUtils.extend(options, {method: "get", url: url});
//            return Recurve.Http(options);
//        },
//
//        post: function(url, data, options) {
//            options = Recurve.ObjectUtils.extend(options, {method: "post", url: url, data: data});
//            return Recurve.Http(options);
//        },
//
//        jsonp: function(url, options) {
//            options = Recurve.ObjectUtils.extend(options, {method: "jsonp", url: url});
//            return Recurve.Http(options);
//        },
//
//        delete: function(url, options) {
//            options = Recurve.ObjectUtils.extend(options, {method: "delete", url: url});
//            return Recurve.Http(options);
//        },
//
//        head: function(url, options) {
//            options = Recurve.ObjectUtils.extend(options, {method: "head", url: url});
//            return Recurve.Http(options);
//        },
//
//        put: function(url, data, options) {
//            options = Recurve.ObjectUtils.extend(options, {method: "put", url: url, data: data});
//            return Recurve.Http(options);
//        },
//
//        patch: function(url, data, options) {
//            options = Recurve.ObjectUtils.extend(options, {method: "patch", url: url, data: data});
//            return Recurve.Http(options);
//        },
//
//        getScript: function(url, options) {
//            options = Recurve.ObjectUtils.extend(options, {method: "script", url: url});
//            return Recurve.Http(options);
//        }
//    });
//
//
//    function defaultSerializer(data, contentType) {
//        var ignoreCase = true;
//
//        if (Recurve.StringUtils.contains(contentType, "application/x-www-form-urlencoded", ignoreCase)) {
//            if (Recurve.ObjectUtils.isObject(data) && !Recurve.ObjectUtils.isFile(data)) {
//                data = Recurve.ObjectUtils.toFormData(data);
//            }
//        }
//        else if (Recurve.StringUtils.contains(contentType, "application/json", ignoreCase)) {
//            if (Recurve.ObjectUtils.isObject(data) && !Recurve.ObjectUtils.isFile(data)) {
//                data = Recurve.ObjectUtils.toJson(data);
//            }
//        }
//        else {
//            // do nothing - nothing to serialize
//        }
//
//        return data;
//    }
//
//    Recurve.Http.serializer = defaultSerializer;
//
//
//    function defaultParser(xhr, accept) {
//        var data;
//        var ignoreCase = true;
//
//        if (Recurve.StringUtils.contains(accept, "application/xml", ignoreCase) ||
//            Recurve.StringUtils.contains(accept, "text/xml", ignoreCase)) {
//            data = xhr.responseXML;
//        }
//        else if (Recurve.StringUtils.contains(accept, "application/json", ignoreCase)) {
//            if (data) {
//                data = Recurve.ObjectUtils.toJson(xhr.responseText);
//            }
//        }
//        else {
//            data = xhr.responseText;
//        }
//
//        return data;
//    }
//
//    Recurve.Http.parser = defaultParser;
//
//
//    function DefaultRequestFactory(options, deferred) {
//        var request;
//
//        if (Recurve.StringUtils.isEqualIgnoreCase("jsonp", options.method)) {
//            request = new JsonpRequest(options, deferred);
//        }
//        else if (options.crossDomain &&
//            Recurve.StringUtils.isEqualIgnoreCase("script", options.method)) {
//            request = new CrossDomainScriptRequest(options, deferred);
//        }
//        else {
//            request = new Xhr(options, deferred);
//        }
//
//        return request;
//    };
//
//    Recurve.Http.RequestFactory = DefaultRequestFactory;
//
//
//    function DefaultDeferredFactory() {
//        return new HttpDeferred();
//    };
//
//    Recurve.Http.DeferredFactory = DefaultDeferredFactory;
//
//
//    function QDeferredFactory() {
//        var deferred = Q.defer();
//
//        deferred.promise.success = function(onSuccess) {
//            deferred.promise.then(function(response) {
//                onSuccess(
//                    response.data, response.status, response.statusText,
//                    response.headers, response.options, response.canceled);
//            });
//
//            return this._deferred.promise;
//        };
//
//        deferred.promise.error = function(onError) {
//            deferred.promise.then(null, function(response) {
//                onError(
//                    response.data, response.status, response.statusText,
//                    response.headers, response.options, response.canceled);
//            });
//
//            return this._deferred.promise;
//        };
//
//        deferred.promise.cancel = function() {
//            deferred.request.cancel();
//        };
//
//        return deferred;
//    };
//
//    Recurve.Http.QDeferredFactory = QDeferredFactory;
//
//
//    function createOptionsWithDefaults(options, defaults) {
//        var withDefaults = Recurve.ObjectUtils.extend({}, defaults);
//
//        withDefaults.headers = {};
//        mergeHeaders(options.method, withDefaults, defaults.headers);
//
//        Recurve.ObjectUtils.extend(withDefaults, options);
//
//        return withDefaults;
//    }
//
//    function mergeHeaders(method, options, defaultHeaders) {
//        method = method.toLowerCase();
//
//        Recurve.ObjectUtils.extend(options, defaultHeaders.all);
//        Recurve.ObjectUtils.extend(options, defaultHeaders[method]);
//    }
//
//    function updateUrl(options) {
//        if (!options.cache) {
//            options.params.cache = Recurve.DateUtils.now().getTime();
//        }
//
//        options.url =
//            Recurve.StringUtils.addParametersToUrl(
//                options.url, options.params);
//    }
//
//    function updateHeaders(options) {
//        addAcceptHeader(options);
//        addRequestedWithHeader(options);
//        removeContentType(options);
//    }
//
//    function addAcceptHeader(options) {
//        if (options.headers.Accept) {
//            return;
//        }
//
//        var accept = "*/*";
//        var dataType = options.dataType;
//
//        if (dataType) {
//            dataType = dataType.toLowerCase();
//
//            if ("text" === dataType) {
//                accept = "text/plain,*/*;q=0.01";
//            }
//            else if ("html" === dataType) {
//                accept = "text/html,*/*;q=0.01";
//            }
//            else if ("xml" === dataType) {
//                accept = "application/xml,text/xml,*/*;q=0.01";
//            }
//            else if ("json" === dataType || "script" === dataType) {
//                accept = "application/json,text/javascript,*/*;q=0.01";
//            }
//            else {
//                // do nothing - default to all
//            }
//        }
//
//        options.headers.Accept = accept;
//    }
//
//    function addRequestedWithHeader(options) {
//        if (!options.crossDomain &&
//            !options.headers["X-Requested-With"] &&
//            !Recurve.StringUtils.isEqualIgnoreCase("script", options.dataType)) {
//            options.headers["X-Requested-With"] = "XMLHttpRequest";
//        }
//    }
//
//    function removeContentType(options) {
//        if (!options.data) {
//            return;
//        }
//
//        Recurve.ObjectUtils.forEach(options.headers, function(value, header) {
//            if (Recurve.StringUtils.isEqualIgnoreCase("content-type", header)) {
//                delete options.headers[header];
//            }
//        });
//    }
//
//    function serializeData(options) {
//        if (!options.data) {
//            return;
//        }
//
//        var data = options.data;
//
//        if (Recurve.ObjectUtils.isFunction(options.serializer)) {
//            data = options.serializer(data, this._options.contentType);
//        }
//        else {
//            Recurve.ObjectUtils.forEach(options.serializer, function(serializer) {
//                data = serializer(data, options.contentType);
//            });
//        }
//
//        options.data = data;
//    }
//
//
//    var HttpDeferred = Recurve.Proto.define([
//        function ctor() {
//            this._succeeded = new Recurve.Signal();
//            this._errored = new Recurve.Signal();
//        },
//
//        {
//            resolve: function(response) {
//                this._succeeded.trigger(response);
//                this._cleanUp();
//            },
//
//            reject: function(response) {
//                this._errored.trigger(response);
//                this._cleanUp();
//            },
//
//            promise: {
//                then: function(onSuccess, onError) {
//                    this._succeeded.addOnce(onSuccess);
//                    this._errored.addOnce(onError);
//                },
//
//                success: function(onSuccess) {
//                    this._succeeded.addOnce(function(response) {
//                        onSuccess(response.data, response.status, response.statusText,
//                            response.headers, response.options, response.canceled);
//                    });
//                },
//
//                error: function(onError) {
//                    this._errored.addOnce(function(response) {
//                        onError(response.data, response.status, response.statusText,
//                            response.headers, response.options, response.canceled);
//                    });
//
//                },
//
//                cancel: function() {
//                    this.request && this.request.cancel();
//                }
//            },
//
//            _cleanUp: function() {
//                this._succeeded.removeAll();
//                this._succeeded = null;
//
//                this._errored.removeAll();
//                this._errored = null;
//            }
//        }
//    ]);
//
//
//    var requestId = 0;
//
//    var Xhr = Recurve.Proto.define([
//        function ctor(options, deferred) {
//            this._options = options;
//            this._deferred = deferred;
//            this._id = requestId++;
//        },
//
//        {
//            send: function() {
//                if (window.XMLHttpRequest) {
//                    this._xhr = new XMLHttpRequest();
//                }
//                else {
//                    throw new Error("Recurve only supports IE8+");
//                }
//
//                this._config();
//
//                this._xhr.onreadystatechange =
//                    Recurve.ObjectUtils.bind(this._stateChangeHandler, this);
//
//                this._xhr.open(this._options.method.toUpperCase(), this._options.url, true);
//
//                if (this._options.beforeSend) {
//                    this._options.beforeSend(this._xhr, this._options);
//                }
//
//                this._xhr.send(this._options.data);
//            },
//
//            cancel: function() {
//                this._canceled = true;
//
//                if (this._xhr) {
//                    this._xhr.abort();
//                }
//            },
//
//            _config: function() {
//                this._addHeaders();
//
//                if (this._options.withCredentials) {
//                    this._xhr.withCredentials = true;
//                }
//
//                if (this._options.timeout) {
//                    this._xhr.timeout = this._options.timeout;
//                }
//
//                if (this._options.responseType) {
//                    try {
//                        this._xhr.responseType = this._options.responseType;
//                    }
//                    catch (error) {
//                        // https://bugs.webkit.org/show_bug.cgi?id=73648
//                        // Safari will throw error for "json" method, ignore this since
//                        // we can handle it
//                        if (!Recurve.StringUtils.isEqualIgnoreCase("json", this._options.method)) {
//                            throw error;
//                        }
//                    }
//                }
//            },
//
//            _addHeaders: function() {
//                Recurve.ObjectUtils.forEach(this._options.headers, function(value, header) {
//                    if (value) {
//                        this._xhr.setRequestHeader(header, value);
//                    }
//                })
//            },
//
//            _stateChangeHandler: function() {
//                if (4 !== this._xhr.readyState) {
//                    return;
//                }
//
//                if (this._isSuccess()) {
//                    this._handleSuccess();
//                }
//                else {
//                    this._handleError();
//                }
//            },
//
//            _isSuccess: function() {
//                if (this._canceled && this._options.errorOnCancel) {
//                    return false;
//                }
//
//                var status = this._xhr.status;
//
//                return (200 <= status && 300 > status) ||
//                    304 === status ||
//                    (0 === status && Recurve.WindowUtils.isFileProtocol());
//            },
//
//            _handleSuccess: function() {
//                if (!this._options.success) {
//                    return;
//                }
//
//                var data;
//
//                if (Recurve.StringUtils.isEqualIgnoreCase("script", this._options.dataType)) {
//                    data = this._request.responseText;
//                    Recurve.WindowUtils.globalEval(data);
//                }
//                else {
//                    try {
//                        data = this._parseResponse();
//                    }
//                    catch (error) {
//                        this._handleError("unable to parse response");
//                        return;
//                    }
//                }
//
//                this._complete(true, data);
//            },
//
//            _handleError: function(statusText) {
//                this._complete(false, null, statusText);
//            },
//
//            _complete: function(success, data, statusText) {
//                var response = {
//                    data: data,
//                    status : this._xhr.status,
//                    statusText : statusText ? statusText : this._xhr.statusText,
//                    headers : this._xhr.getAllResponseHeaders(),
//                    options : this._options,
//                    canceled : this._canceled
//                };
//
//                if (success) {
//                    this._deferred.resolve(response);
//                }
//                else {
//                    this._deferred.reject(response);
//                }
//            },
//
//            _parseResponse: function() {
//                var accept =  this._options.headers && this._options.headers.Accept;
//                if (!accept) {
//                    accept = this._xhr.getResponseHeader('content-type');
//                }
//
//                var data;
//
//                if (Recurve.ObjectUtils.isFunction(this._options.serializer)) {
//                    data = this._options.parser(this._xhr), accept;
//                }
//                else {
//                    Recurve.ObjectUtils.forEach(this._options.parser, function(parser) {
//                        data = parser(this._xhr, accept);
//                    });
//                }
//
//                return data;
//            }
//        }
//    ]);
//
//
//    var JsonpRequest = Recurve.Proto.define([
//        function ctor(options, deferred) {
//            this._options = options;
//            this._deferred = deferred;
//            this._id = requestId++;
//        },
//
//        {
//            send: function() {
//                var callbackId = "RecurveJsonPCallback" + this._id;
//                var url = Recurve.StringUtils.removeParameterFromUrl(this._options.url, "callback");
//                url = Recurve.StringUtils.addParametersToUrl(url, {callback: callbackId});
//
//                var script = document.createElement("script");
//                script.src = url;
//                script.type = "text/javascript";
//                script.async = true;
//
//                var called;
//                var that = this;
//
//                function callbackHandler(data) {
//                    called = true;
//
//                    if (that._canceled && that._options.errorOnCancel) {
//                        that._complete();
//                    }
//                    else {
//                        that._complete(true, data, 200);
//                    }
//                }
//
//                function loadErrorHandler (event) {
//                    script.removeEventListener("load", loadErrorHandler);
//                    script.removeEventListener("error", loadErrorHandler);
//
//                    document.head.removeChild(script);
//                    script = null;
//
//                    delete window[callbackId];
//
//                    if (event && "load" === event.type && !called) {
//                        that._complete(false, null, 404, "jsonp callback not called");
//                    }
//                }
//
//                script.addEventListener("load", loadErrorHandler);
//                script.addEventListener("error", loadErrorHandler);
//
//                window[callbackId] = callbackHandler;
//
//                document.head.appendChild(script);
//            },
//
//            cancel: function() {
//                this._canceled = true;
//            },
//
//            _complete: function(success, data, status, statusText) {
//                var response = {
//                    data: data,
//                    status: status,
//                    statusText: statusText,
//                    options: this._options,
//                    canceled: this._canceled
//                };
//
//                if (success) {
//                    this._deferred.resolve(response);
//                }
//                else {
//                    this._deferred.reject(response);
//                }
//            }
//        }
//    ]);
//
//    var CrossDomainScriptRequest = Recurve.Proto.define([
//        function ctor(options, deferred) {
//            this._options = options;
//            this._deferred = deferred;
//            this._id = requestId++;
//        },
//
//        {
//            send: function() {
//                var script = document.createElement("script");
//                script.src = this._options.url;
//                script.async = true;
//
//                var that = this;
//
//                function loadErrorHandler (event) {
//                    script.removeEventListener("load", loadErrorHandler);
//                    script.removeEventListener("error", loadErrorHandler);
//
//                    document.head.removeChild(script);
//                    script = null;
//
//                    if (event && "error" === event.type) {
//                        that._deferred.reject({status: 404, canceled: that._canceled});
//                    }
//                    else {
//                        that._deferred.resolve({status: 200, canceled: that._canceled});
//                    }
//                }
//
//                script.addEventListener("load", loadErrorHandler);
//                script.addEventListener("error", loadErrorHandler);
//
//                document.head.appendChild(script);
//            },
//
//            cancel: function() {
//                this._canceled = true;
//            }
//        }
//    ]);
//
//})();


"use strict";

var ObjectUtils = require("./recurve-object.js");
var StringUtils = require("./recurve-string.js");
var DateUtils = require("./recurve-window.js");
var WindowUtils = require("./recurve-window.js");
var Signal = require("./recurve-signal.js");
var Proto = require("./recurve-proto.js");

// TODO TBD switch over to Http.request(..) instead of directly on Http object
var Http = function(options) {
    var withDefaults = createOptionsWithDefaults(options, Http.defaults);

    updateUrl(withDefaults);
    updateHeaders(withDefaults);
    serializeData(withDefaults);

    var deferred = withDefaults.deferredFactory(withDefaults);
    var request = withDefaults.requestFactory(withDefaults, deferred);

    deferred.request = deferred;
    request.send()

    return deferred.promise;
};

Http = ObjectUtils.extend(Http, {
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

        cache: true,

        serializer : [defaultSerializer],
        parser : [defaultParser],

        requestFactory: DefaultRequestFactory,
        deferredFactory: DefaultDeferredFactory,

        errorOnCancel: true
    },

    get: function(url, options) {
        options = ObjectUtils.extend(options, {method: "get", url: url});
        return Http(options);
    },

    post: function(url, data, options) {
        options = ObjectUtils.extend(options, {method: "post", url: url, data: data});
        return Http(options);
    },

    jsonp: function(url, options) {
        options = ObjectUtils.extend(options, {method: "jsonp", url: url});
        return Http(options);
    },

    delete: function(url, options) {
        options = ObjectUtils.extend(options, {method: "delete", url: url});
        return Http(options);
    },

    head: function(url, options) {
        options = ObjectUtils.extend(options, {method: "head", url: url});
        return Http(options);
    },

    put: function(url, data, options) {
        options = ObjectUtils.extend(options, {method: "put", url: url, data: data});
        return Http(options);
    },

    patch: function(url, data, options) {
        options = ObjectUtils.extend(options, {method: "patch", url: url, data: data});
        return Http(options);
    },

    getScript: function(url, options) {
        options = ObjectUtils.extend(options, {method: "script", url: url});
        return Http(options);
    }
});


function defaultSerializer(data, contentType) {
    var ignoreCase = true;

    if (StringUtils.contains(contentType, "application/x-www-form-urlencoded", ignoreCase)) {
        if (ObjectUtils.isObject(data) && !ObjectUtils.isFile(data)) {
            data = ObjectUtils.toFormData(data);
        }
    }
    else if (StringUtils.contains(contentType, "application/json", ignoreCase)) {
        if (ObjectUtils.isObject(data) && !ObjectUtils.isFile(data)) {
            data = ObjectUtils.toJson(data);
        }
    }
    else {
        // do nothing - nothing to serialize
    }

    return data;
}

Http.serializer = defaultSerializer;


function defaultParser(xhr, accept) {
    var data;
    var ignoreCase = true;

    if (StringUtils.contains(accept, "application/xml", ignoreCase) ||
        StringUtils.contains(accept, "text/xml", ignoreCase)) {
        data = xhr.responseXML;
    }
    else if (StringUtils.contains(accept, "application/json", ignoreCase)) {
        if (data) {
            data = ObjectUtils.toJson(xhr.responseText);
        }
    }
    else {
        data = xhr.responseText;
    }

    return data;
}

Http.parser = defaultParser;


function DefaultRequestFactory(options, deferred) {
    var request;

    if (StringUtils.isEqualIgnoreCase("jsonp", options.method)) {
        request = new JsonpRequest(options, deferred);
    }
    else if (options.crossDomain &&
        StringUtils.isEqualIgnoreCase("script", options.method)) {
        request = new CrossDomainScriptRequest(options, deferred);
    }
    else {
        request = new Xhr(options, deferred);
    }

    return request;
};

Http.RequestFactory = DefaultRequestFactory;


function DefaultDeferredFactory() {
    return new HttpDeferred();
};

Http.DeferredFactory = DefaultDeferredFactory;


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

Http.QDeferredFactory = QDeferredFactory;


function createOptionsWithDefaults(options, defaults) {
    var withDefaults = ObjectUtils.extend({}, defaults);

    withDefaults.headers = {};
    mergeHeaders(options.method, withDefaults, defaults.headers);

    ObjectUtils.extend(withDefaults, options);

    return withDefaults;
}

function mergeHeaders(method, options, defaultHeaders) {
    method = method.toLowerCase();

    ObjectUtils.extend(options, defaultHeaders.all);
    ObjectUtils.extend(options, defaultHeaders[method]);
}

function updateUrl(options) {
    if (!options.cache) {
        options.params.cache = DateUtils.now().getTime();
    }

    options.url =
        StringUtils.addParametersToUrl(
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
    if (!options.crossDomain &&
        !options.headers["X-Requested-With"] &&
        !StringUtils.isEqualIgnoreCase("script", options.dataType)) {
        options.headers["X-Requested-With"] = "XMLHttpRequest";
    }
}

function removeContentType(options) {
    if (!options.data) {
        return;
    }

    ObjectUtils.forEach(options.headers, function(value, header) {
        if (StringUtils.isEqualIgnoreCase("content-type", header)) {
            delete options.headers[header];
        }
    });
}

function serializeData(options) {
    if (!options.data) {
        return;
    }

    var data = options.data;

    if (ObjectUtils.isFunction(options.serializer)) {
        data = options.serializer(data, this._options.contentType);
    }
    else {
        ObjectUtils.forEach(options.serializer, function(serializer) {
            data = serializer(data, options.contentType);
        });
    }

    options.data = data;
}


var HttpDeferred = Proto.define([
    function ctor() {
        this._succeeded = new Signal();
        this._errored = new Signal();
    },

    {
        resolve: function(response) {
            this._succeeded.trigger(response);
            this._cleanUp();
        },

        reject: function(response) {
            this._errored.trigger(response);
            this._cleanUp();
        },

        promise: {
            then: function(onSuccess, onError) {
                this._succeeded.addOnce(onSuccess);
                this._errored.addOnce(onError);
            },

            success: function(onSuccess) {
                this._succeeded.addOnce(function(response) {
                    onSuccess(response.data, response.status, response.statusText,
                        response.headers, response.options, response.canceled);
                });
            },

            error: function(onError) {
                this._errored.addOnce(function(response) {
                    onError(response.data, response.status, response.statusText,
                        response.headers, response.options, response.canceled);
                });

            },

            cancel: function() {
                this.request && this.request.cancel();
            }
        },

        _cleanUp: function() {
            this._succeeded.removeAll();
            this._succeeded = null;

            this._errored.removeAll();
            this._errored = null;
        }
    }
]);


var requestId = 0;

var Xhr = Proto.define([
    function ctor(options, deferred) {
        this._options = options;
        this._deferred = deferred;
        this._id = requestId++;
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
                ObjectUtils.bind(this._stateChangeHandler, this);

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
                (0 === status && WindowUtils.isFileProtocol());
        },

        _handleSuccess: function() {
            if (!this._options.success) {
                return;
            }

            var data;

            if (StringUtils.isEqualIgnoreCase("script", this._options.dataType)) {
                data = this._request.responseText;
                WindowUtils.globalEval(data);
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

            if (ObjectUtils.isFunction(this._options.serializer)) {
                data = this._options.parser(this._xhr), accept;
            }
            else {
                ObjectUtils.forEach(this._options.parser, function(parser) {
                    data = parser(this._xhr, accept);
                });
            }

            return data;
        }
    }
]);


var JsonpRequest = Proto.define([
    function ctor(options, deferred) {
        this._options = options;
        this._deferred = deferred;
        this._id = requestId++;
    },

    {
        send: function() {
            var callbackId = "RecurveJsonPCallback" + this._id;
            var url = StringUtils.removeParameterFromUrl(this._options.url, "callback");
            url = StringUtils.addParametersToUrl(url, {callback: callbackId});

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
                script.removeEventListener("load", loadErrorHandler);
                script.removeEventListener("error", loadErrorHandler);

                document.head.removeChild(script);
                script = null;

                delete window[callbackId];

                if (event && "load" === event.type && !called) {
                    that._complete(false, null, 404, "jsonp callback not called");
                }
            }

            script.addEventListener("load", loadErrorHandler);
            script.addEventListener("error", loadErrorHandler);

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

var CrossDomainScriptRequest = Proto.define([
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
                script.removeEventListener("load", loadErrorHandler);
                script.removeEventListener("error", loadErrorHandler);

                document.head.removeChild(script);
                script = null;

                if (event && "error" === event.type) {
                    that._deferred.reject({status: 404, canceled: that._canceled});
                }
                else {
                    that._deferred.resolve({status: 200, canceled: that._canceled});
                }
            }

            script.addEventListener("load", loadErrorHandler);
            script.addEventListener("error", loadErrorHandler);

            document.head.appendChild(script);
        },

        cancel: function() {
            this._canceled = true;
        }
    }
]);
},{"./recurve-object.js":9,"./recurve-proto.js":10,"./recurve-signal.js":11,"./recurve-string.js":12,"./recurve-window.js":13}],7:[function(require,module,exports){
"use strict";

var Proto = require("./recurve-proto.js");

module.exports = Proto.define([
    {
        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        info: function() {
            console && console.log.apply(console, arguments);
        },

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        debug: function() {
            if (!console || !console.debug) {
                this.info.apply(this, arguments);
                return;
            }

            console.debug.apply(console, arguments);
        },

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        warn: function() {
            if (!console || !console.warn) {
                this.info.apply(this, arguments);
                return;
            }

            console.warn.apply(console, arguments);
        },

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        error: function() {
            if (!console || !console.error) {
                this.info.apply(this, arguments);
                return;
            }

            console.error.apply(console, arguments);
        },

        clear: function() {
            console && console.clear();
        }
    }
]);

},{"./recurve-proto.js":10}],8:[function(require,module,exports){
//(function() {
//    "use strict";
//
//    var Recurve = window.Recurve = window.Recurve || {};
//
//    Recurve.Log = Recurve.Proto.define([
//
//        /**
//         *
//         * @param targets, array of targets to log to (see Recurve.LogConsoleTarget as example).
//         * Defaults to Recurve.LogConsoleTarget
//         * @param enabled, default true
//         */
//        function ctor(enabled, targets) {
//            if (undefined === enabled) {
//                enabled = true;
//            }
//
//            if (undefined === targets) {
//                targets = [new Recurve.LogConsoleTarget()];
//            }
//
//            this.targets = targets;
//            this.disable(!enabled);
//        },
//
//        {
//            /**
//             * Log info to all targets
//             *
//             * @param message
//             * @param [, obj2, ..., objN], list of objects to output. The string representations of
//             * each of these objects are appended together in the order listed and output (same as console.log)
//             */
//            info: function(message) {
//                if (this._infoDisabled) {
//                    return;
//                }
//
//                this._log("info", message, arguments);
//            },
//
//            /**
//             * Log debug to all targets
//             *
//             * @param message
//             * @param [, obj2, ..., objN], list of objects to output. The string representations of
//             * each of these objects are appended together in the order listed and output (same as console.log)
//             */
//            debug: function(message) {
//                if (this._debugDisabled) {
//                    return;
//                }
//
//                this._log("debug", message, arguments);
//            },
//
//            /**
//             * Log warning to all targets
//             *
//             * @param message
//             * @param [, obj2, ..., objN], list of objects to output. The string representations of
//             * each of these objects are appended together in the order listed and output (same as console.log)
//             */
//            warn: function(message) {
//                if (this._warnDisabled) {
//                    return;
//                }
//
//                this._log("warn", message, arguments);
//            },
//
//            /**
//             * Log error to all targets
//             *
//             * @param message
//             * @param [, obj2, ..., objN], list of objects to output. The string representations of
//             * each of these objects are appended together in the order listed and output (same as console.log)
//             */
//            error: function(message) {
//                if (this._errorDisabled) {
//                    return;
//                }
//
//                this._log("error", message, arguments);
//            },
//
//            /**
//             * Clear log for all targets
//             */
//            clear: function() {
//                for (var index = 0; index < this.targets.length; index++) {
//                    this.targets[index].clear();
//                }
//            },
//
//            /**
//             *
//             * @param value, defaults to true
//             */
//            disable: function(value) {
//                if (undefined === value) {
//                    value = true;
//                }
//
//                this._debugDisabled = value;
//                this._infoDisabled = value;
//                this._warnDisabled = value;
//                this._errorDisabled = value;
//            },
//
//            /**
//             *
//             * @param value, defaults to true
//             */
//            debugDisable: function(value) {
//                if (undefined === value) {
//                    value = true;
//                }
//
//                this._debugDisabled = value;
//            },
//
//            /**
//             *
//             * @param value, defaults to true
//             */
//            infoDisable: function(value) {
//                if (undefined === value) {
//                    value = true;
//                }
//
//                this._infoDisabled = value;
//            },
//
//            /**
//             *
//             * @param value, defaults to true
//             */
//            warnDisable: function(value) {
//                if (undefined === value) {
//                    value = true;
//                }
//
//                this._warnDisabled = value;
//            },
//
//            /**
//             *
//             * @param value, defaults to true
//             */
//            errorDisable: function(value) {
//                if (undefined === value) {
//                    value = true;
//                }
//
//                this._errorDisabled = value;
//            },
//
//            _log: function(type, message, args) {
//                args = Recurve.ArrayUtils.argumentsToArray(args, 1);
//                var description = this._description(type.toUpperCase());
//
//                for (var index = 0; index < this.targets.length; index++) {
//                    this.targets[index][type].apply(this.targets[index], [description, message].concat(args));
//                }
//            },
//
//            _description: function(type) {
//                var time = Recurve.StringUtils.formatTime(new Date());
//                return "[" + type + "] " + time;
//            }
//        }
//
//    ]);
//
//    /**
//     * Log target for Recurve.Log
//     * Handles browsers that do not support console or have limited console support (i.e. only support console.log)
//     *
//     */
//    Recurve.LogConsoleTarget = Recurve.Proto.define([
//        {
//            /**
//             *
//             * @param message
//             * @param [, obj2, ..., objN], list of objects to output. The string representations of
//             * each of these objects are appended together in the order listed and output (same as console.log)
//             */
//            info: function() {
//                console && console.log.apply(console, arguments);
//            },
//
//            /**
//             *
//             * @param message
//             * @param [, obj2, ..., objN], list of objects to output. The string representations of
//             * each of these objects are appended together in the order listed and output (same as console.log)
//             */
//            debug: function() {
//                if (!console || !console.debug) {
//                    this.info.apply(this, arguments);
//                    return;
//                }
//
//                console.debug.apply(console, arguments);
//            },
//
//            /**
//             *
//             * @param message
//             * @param [, obj2, ..., objN], list of objects to output. The string representations of
//             * each of these objects are appended together in the order listed and output (same as console.log)
//             */
//            warn: function() {
//                if (!console || !console.warn) {
//                    this.info.apply(this, arguments);
//                    return;
//                }
//
//                console.warn.apply(console, arguments);
//            },
//
//            /**
//             *
//             * @param message
//             * @param [, obj2, ..., objN], list of objects to output. The string representations of
//             * each of these objects are appended together in the order listed and output (same as console.log)
//             */
//            error: function() {
//                if (!console || !console.error) {
//                    this.info.apply(this, arguments);
//                    return;
//                }
//
//                console.error.apply(console, arguments);
//            },
//
//            clear: function() {
//                console && console.clear();
//            }
//        }
//    ]);
//
//})();

"use strict";

var Proto = require("./recurve-proto.js");
var ArrayUtils = require("./recurve-array.js");
var StringUtils = require("./recurve-string.js");
var LogTarget = require("./recurve-log-console.js");

module.exports = Proto.define([

    /**
     *
     * @param targets, array of targets to log to (see Recurve.LogConsoleTarget as example).
     * Defaults to Recurve.LogConsoleTarget
     * @param enabled, default true
     */
        function ctor(enabled, targets) {
        if (undefined === enabled) {
            enabled = true;
        }

        if (undefined === targets) {
            targets = [new LogTarget()];
        }

        this.targets = targets;
        this.disable(!enabled);
    },

    {
        /**
         * Log info to all targets
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        info: function(message) {
            if (this._infoDisabled) {
                return;
            }

            this._log("info", message, arguments);
        },

        /**
         * Log debug to all targets
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        debug: function(message) {
            if (this._debugDisabled) {
                return;
            }

            this._log("debug", message, arguments);
        },

        /**
         * Log warning to all targets
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        warn: function(message) {
            if (this._warnDisabled) {
                return;
            }

            this._log("warn", message, arguments);
        },

        /**
         * Log error to all targets
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        error: function(message) {
            if (this._errorDisabled) {
                return;
            }

            this._log("error", message, arguments);
        },

        /**
         * Clear log for all targets
         */
        clear: function() {
            for (var index = 0; index < this.targets.length; index++) {
                this.targets[index].clear();
            }
        },

        /**
         *
         * @param value, defaults to true
         */
        disable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._debugDisabled = value;
            this._infoDisabled = value;
            this._warnDisabled = value;
            this._errorDisabled = value;
        },

        /**
         *
         * @param value, defaults to true
         */
        debugDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._debugDisabled = value;
        },

        /**
         *
         * @param value, defaults to true
         */
        infoDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._infoDisabled = value;
        },

        /**
         *
         * @param value, defaults to true
         */
        warnDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._warnDisabled = value;
        },

        /**
         *
         * @param value, defaults to true
         */
        errorDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._errorDisabled = value;
        },

        _log: function(type, message, args) {
            args = ArrayUtils.argumentsToArray(args, 1);
            var description = this._description(type.toUpperCase());

            for (var index = 0; index < this.targets.length; index++) {
                this.targets[index][type].apply(this.targets[index], [description, message].concat(args));
            }
        },

        _description: function(type) {
            var time = StringUtils.formatTime(new Date());
            return "[" + type + "] " + time;
        }
    }
]);
},{"./recurve-array.js":2,"./recurve-log-console.js":7,"./recurve-proto.js":10,"./recurve-string.js":12}],9:[function(require,module,exports){
/*
(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    var bindCtor = function() {};

    Recurve.ObjectUtils =
    {
        forEach: function(obj, iterator, context) {
            if (!obj) {
                return;
            }

            if (obj.forEach && obj.forEach === Object.forEach) {
                obj.forEach(iterator, context);
            }
            else if (Recurve.ObjectUtils.isArray(obj) && obj.length) {
                for (var index = 0; index < obj.length; index++) {
                    if (false === iterator.call(context, obj[index], index, obj)) {
                        return;
                    }
                }
            }
            else {
                var keys = Recurve.ObjectUtils.keys(obj);
                for (var index = 0; index < keys.length; index++) {
                    if (false === iterator.call(context, obj[keys[index]], keys[index], obj)) {
                        return;
                    }
                }
            }

            return keys;
        },

        keys: function(obj) {
            if (!Recurve.ObjectUtils.isObject(obj)) {
                return [];
            }

            if (Object.keys) {
                return Object.keys(obj);
            }

            var keys = [];

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            return keys;
        }

        isString: function(value) {
            return (value instanceof String || "string" == typeof value);
        },

        isError: function(value) {
            return value instanceof Error;
        },

        isObject: function(value) {
            return value === Object(value);
        },

        isArray: function(value) {
            return value instanceof Array;
        },

        isFunction: function(value) {
            return "function" == typeof value;
        },

        isDate: function(value) {
            return value instanceof Date;
        },

        isFile: function(value) {
            return "[object File]" === String(data);
        },

        bind: function(func, context) {
            // Based heavily on underscore/firefox implementation. TODO TBD make underscore.js dependency of
            // this library instead?

            if (!Recurve.ObjectUtils.isFunction(func)) {
                throw new TypeError("not a function");
            }

            if (Function.prototype.bind) {
                return Function.prototype.bind.apply(func, Array.prototype.slice.call(arguments, 1));
            }

            var args = Array.prototype.slice.call(arguments, 2);

            var bound = function() {
                if (!(this instanceof bound)) {
                    return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
                }

                bindCtor.prototype = func.prototype;
                var that = new bindCtor();
                bindCtor.prototype = null;

                var result = func.apply(that, args.concat(Array.prototype.slice.call(arguments)));
                if (Object(result) === result) {
                    return result;
                }

                return that;
            };

            return bound;
        },

        extend: function(dest, src) {
            if (!src) {
                return;
            }

            for (key in src) {
                dest[key] = src[key];
            }

            return dest;
        },

        toJson: function(obj) {
            if (!Recurve.ObjectUtils.isObject(obj)) {
                throw new Error("not an object to convert to JSON");
            }

            return JSON.stringify(obj);
        },

        fromJson: function(str) {
            if (!str) {
                return null;
            }

            return JSON.parse(str);
        },

        toFormData: function(obj) {
            if (!obj) {
                return null;
            }

            var values = [];

            Recurve.ObjectUtils.forEach(obj, function(value, key) {
                values.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            });

            return values.join("&");
        }
    };


})();
*/

"use strict";

module.exports = {
    forEach: function(obj, iterator, context) {
        if (!obj) {
            return;
        }

        if (obj.forEach && obj.forEach === Object.forEach) {
            obj.forEach(iterator, context);
        }
        else if (this.isArray(obj) && obj.length) {
            for (var index = 0; index < obj.length; index++) {
                if (false === iterator.call(context, obj[index], index, obj)) {
                    return;
                }
            }
        }
        else {
            var keys = this.keys(obj);
            for (var index = 0; index < keys.length; index++) {
                if (false === iterator.call(context, obj[keys[index]], keys[index], obj)) {
                    return;
                }
            }
        }

        return keys;
    },

    keys: function(obj) {
        if (!this.isObject(obj)) {
            return [];
        }

        if (Object.keys) {
            return Object.keys(obj);
        }

        var keys = [];

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        return keys;
    },

    isString: function(value) {
        return (value instanceof String || "string" == typeof value);
    },

    isError: function(value) {
        return value instanceof Error;
    },

    isObject: function(value) {
        return value === Object(value);
    },

    isArray: function(value) {
        return value instanceof Array;
    },

    isFunction: function(value) {
        return "function" == typeof value;
    },

    isDate: function(value) {
        return value instanceof Date;
    },

    isFile: function(value) {
        return "[object File]" === String(data);
    },

    bind: function(func, context) {
        // Based heavily on underscore/firefox implementation.

        if (!this.isFunction(func)) {
            throw new TypeError("not a function");
        }

        if (Function.prototype.bind) {
            return Function.prototype.bind.apply(func, Array.prototype.slice.call(arguments, 1));
        }

        var args = Array.prototype.slice.call(arguments, 2);

        var bound = function() {
            if (!(this instanceof bound)) {
                return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
            }

            bindCtor.prototype = func.prototype;
            var that = new bindCtor();
            bindCtor.prototype = null;

            var result = func.apply(that, args.concat(Array.prototype.slice.call(arguments)));
            if (Object(result) === result) {
                return result;
            }

            return that;
        };

        return bound;
    },

    extend: function(dest, src) {
        if (!src) {
            return;
        }

        for (key in src) {
            dest[key] = src[key];
        }

        return dest;
    },

    toJson: function(obj) {
        if (!this.isObject(obj)) {
            throw new Error("not an object to convert to JSON");
        }

        return JSON.stringify(obj);
    },

    fromJson: function(str) {
        if (!str) {
            return null;
        }

        return JSON.parse(str);
    },

    toFormData: function(obj) {
        if (!obj) {
            return null;
        }

        var values = [];

        this.forEach(obj, function(value, key) {
            values.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        });

        return values.join("&");
    }
};


},{}],10:[function(require,module,exports){
//(function() {
//    var Recurve = window.Recurve = window.Recurve || {};
//
//    var dontInvokeConstructor = {};
//
//    function isFunction(value) {
//        return value && "function" == typeof value;
//    }
//
//    Recurve.Proto = function() {
//        // do nothing
//    };
//
//    /**
//     * Create object that inherits from this object
//     *
//     * @param options   array consisting of constructor, prototype/"member" variables/functions,
//     *                  and namespace/"static" variables/function
//     */
//    Recurve.Proto.define = function(options) {
//        if (!options || 0 === options.length) {
//            return this;
//        }
//
//        var possibleConstructor = options[0];
//
//        var properties;
//        var staticProperties;
//
//        if (isFunction(possibleConstructor)) {
//            properties = 1 < options.length ? options[1] : {};
//            properties[ "$ctor" ] = possibleConstructor;
//
//            staticProperties = options[2];
//        }
//        else {
//            properties = options[0];
//            staticProperties = options[1];
//        }
//
//        function ProtoObj(param)
//        {
//            if (dontInvokeConstructor != param &&
//                isFunction(this.$ctor)) {
//                this.$ctor.apply( this, arguments );
//            }
//        };
//
//        ProtoObj.prototype = new this(dontInvokeConstructor);
//
//        // Prototype/"member" properties
//        for (key in properties) {
//            addProtoProperty(key, properties[key], ProtoObj.prototype[key]);
//        }
//
//        function addProtoProperty(key, property, superProperty)
//        {
//            if (!isFunction(property) ||
//                !isFunction(superProperty)) {
//                ProtoObj.prototype[key] = property;
//            }
//            else
//            {
//                // Create function with ref to base method
//                ProtoObj.prototype[key] = function()
//                {
//                    this._super = superProperty;
//                    return property.apply(this, arguments);
//                };
//            }
//        }
//
//        ProtoObj.prototype.constructor = ProtoObj;
//
//        // Namespaced/"Static" properties
//        ProtoObj.extend = this.extend || this.define;
//        ProtoObj.mixin = this.mixin;
//
//        for (key in staticProperties)
//        {
//            ProtoObj[key] = staticProperties[key];
//        }
//
//        return ProtoObj;
//    };
//
//    /**
//     * Mixin a set of variables/functions as prototypes for this object. Any variables/functions
//     * that already exist with the same name will be overridden.
//     *
//     * @param properties    variables/functions to mixin with this object
//     */
//    Recurve.Proto.mixin = function(properties) {
//        Recurve.Proto.mixinWith(this, properties);
//    };
//
//    /**
//     * Mixin a set of variables/functions as prototypes for the object. Any variables/functions
//     * that already exist with the same name will be overridden.
//     *
//     * @param properties    variables/functions to mixin with this object
//     */
//    Recurve.Proto.mixinWith = function(obj, properties) {
//        for (key in properties) {
//            obj.prototype[key] = properties[key];
//        }
//    };
//})();

var dontInvokeConstructor = {};

function isFunction(value) {
    return value && "function" == typeof value;
}

var Proto = function() {
    // do nothing
};

/**
 * Create object that inherits from this object
 *
 * @param options   array consisting of constructor, prototype/"member" variables/functions,
 *                  and namespace/"static" variables/function
 */
Proto.define = function(options) {
    if (!options || 0 === options.length) {
        return this;
    }

    var possibleConstructor = options[0];

    var properties;
    var staticProperties;

    if (isFunction(possibleConstructor)) {
        properties = 1 < options.length ? options[1] : {};
        properties[ "$ctor" ] = possibleConstructor;

        staticProperties = options[2];
    }
    else {
        properties = options[0];
        staticProperties = options[1];
    }

    function ProtoObj(param)
    {
        if (dontInvokeConstructor != param &&
            isFunction(this.$ctor)) {
            this.$ctor.apply( this, arguments );
        }
    }

    ProtoObj.prototype = new this(dontInvokeConstructor);

    // Prototype/"member" properties
    for (key in properties) {
        addProtoProperty(key, properties[key], ProtoObj.prototype[key]);
    }

    function addProtoProperty(key, property, superProperty)
    {
        if (!isFunction(property) ||
            !isFunction(superProperty)) {
            ProtoObj.prototype[key] = property;
        }
        else
        {
            // Create function with ref to base method
            ProtoObj.prototype[key] = function()
            {
                this._super = superProperty;
                return property.apply(this, arguments);
            };
        }
    }

    ProtoObj.prototype.constructor = ProtoObj;

    // Namespaced/"Static" properties
    ProtoObj.extend = this.extend || this.define;
    ProtoObj.mixin = this.mixin;

    for (key in staticProperties)
    {
        ProtoObj[key] = staticProperties[key];
    }

    return ProtoObj;
};

/**
 * Mixin a set of variables/functions as prototypes for this object. Any variables/functions
 * that already exist with the same name will be overridden.
 *
 * @param properties    variables/functions to mixin with this object
 */
Proto.mixin = function(properties) {
    Proto.mixinWith(this, properties);
};

/**
 * Mixin a set of variables/functions as prototypes for the object. Any variables/functions
 * that already exist with the same name will be overridden.
 *
 * @param properties    variables/functions to mixin with this object
 */
Proto.mixinWith = function(obj, properties) {
    for (key in properties) {
        obj.prototype[key] = properties[key];
    }
};

module.exports = Proto;
},{}],11:[function(require,module,exports){
/*
(function() {

    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.Signal = Recurve.Proto.define([
        function ctor() {
            this._listeners = [];
        },

        {
            add: function(callback, context) {
                if (!callback) {
                    return;
                }

                if (this._listenerExists(callback, context)) {
                    return;
                }

                this._listeners.push(new SignalListener(callback, context));
            },

            addOnce: function(callback, context) {
                if (!callback) {
                    return;
                }

                if (this._listenerExists(callback, context)) {
                    return;
                }

                this._listeners.push(new SignalListener(callback, context, true));
            },

            remove: function(callback, context) {
                for (var index = 0; index < this._listeners.length; index++) {
                    var possibleListener = this._listeners[index];
                    var match;

                    if (!callback) {
                        if (possibleListener.isSameContext(context)) {
                            match = true;
                        }
                    }
                    else if (possibleListener.isSame(callback, context)) {
                        match = true;
                    }
                    else {
                        // do nothing - no match
                    }

                    if (match) {
                        Recurve.ArrayUtils.removeAt(this._listeners, index);

                        // can only be one match if callback specified
                        if (callback) {
                            return;
                        }
                    }
                }
            },

            removeAll: function() {
                this._listeners = [];
            },

            trigger: function() {
                if (this._disabled) {
                    return;
                }

                for (var index = this._listeners.length - 1; 0 <= index; index--) {
                    var listener = this._listeners[index];

                    listener.trigger(arguments);

                    if (listener.onlyOnce) {
                        Recurve.ArrayUtils.removeAt(this._listeners, index);
                    }
                }

            },

            disable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                this._disabled = value;
            },

            _listenerExists: function(callback, context) {
                for (var index = this._listeners.length - 1; 0 <= index; index--) {
                    var listener = this._listeners[index];

                    if (listener.isSame(callback, context)) {
                        return true;
                    }
                }

                return false;
            }
        }
    ]);

    var SignalListener = Recurve.Proto.define([
        function ctor(callback, context, onlyOnce) {
           this._callback = callback;
           this._context = context;
           this.onlyOnce = onlyOnce;
        },

        {
            isSame: function(callback, context) {
                if (!context) {
                    return this._callback === callback;
                }

                return this._callback === callback && this._context === context;
            },

            isSameContext: function(context) {
                return this._context === context;
            },

            trigger: function(args) {
                this._callback.apply(this._context, args);
            }
        }
    ]);

})();
*/

"use strict";

var Proto = require("./recurve-proto.js");
var ArrayUtils = require("./recurve-array.js");

module.exports = Proto.define([
    function ctor() {
        this._listeners = [];
    },

    {
        add: function(callback, context) {
            if (!callback) {
                return;
            }

            if (this._listenerExists(callback, context)) {
                return;
            }

            this._listeners.push(new SignalListener(callback, context));
        },

        addOnce: function(callback, context) {
            if (!callback) {
                return;
            }

            if (this._listenerExists(callback, context)) {
                return;
            }

            this._listeners.push(new SignalListener(callback, context, true));
        },

        remove: function(callback, context) {
            for (var index = 0; index < this._listeners.length; index++) {
                var possibleListener = this._listeners[index];
                var match;

                if (!callback) {
                    if (possibleListener.isSameContext(context)) {
                        match = true;
                    }
                }
                else if (possibleListener.isSame(callback, context)) {
                    match = true;
                }
                else {
                    // do nothing - no match
                }

                if (match) {
                    ArrayUtils.removeAt(this._listeners, index);

                    // can only be one match if callback specified
                    if (callback) {
                        return;
                    }
                }
            }
        },

        removeAll: function() {
            this._listeners = [];
        },

        trigger: function() {
            if (this._disabled) {
                return;
            }

            for (var index = this._listeners.length - 1; 0 <= index; index--) {
                var listener = this._listeners[index];

                listener.trigger(arguments);

                if (listener.onlyOnce) {
                    ArrayUtils.removeAt(this._listeners, index);
                }
            }

        },

        disable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._disabled = value;
        },

        _listenerExists: function(callback, context) {
            for (var index = this._listeners.length - 1; 0 <= index; index--) {
                var listener = this._listeners[index];

                if (listener.isSame(callback, context)) {
                    return true;
                }
            }

            return false;
        }
    }
]);

var SignalListener = Proto.define([
    function ctor(callback, context, onlyOnce) {
        this._callback = callback;
        this._context = context;
        this.onlyOnce = onlyOnce;
    },

    {
        isSame: function(callback, context) {
            if (!context) {
                return this._callback === callback;
            }

            return this._callback === callback && this._context === context;
        },

        isSameContext: function(context) {
            return this._context === context;
        },

        trigger: function(args) {
            this._callback.apply(this._context, args);
        }
    }
]);
},{"./recurve-array.js":2,"./recurve-proto.js":10}],12:[function(require,module,exports){
/*(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.StringUtils =
    {
        format: function(value) {
            if (!value) {
                return null;
            }

            Array.prototype.shift.apply(arguments);

            for (var index = 0; index < arguments.length; index++) {
                var search = "{" + index + "}";
                value = value.replace(search, arguments[index]);
            }

            return value;
        },

        formatWithProperties: function(value, formatProperties) {
            if (!value) {
                return null;
            }

            for (var property in formatProperties) {
                if (formatProperties.hasOwnProperty(property)) {
                    var search = "{" + property + "}";
                    value = value.replace(search, formatProperties[property]);
                }
            }

            return value;
        },

        pad: function( value, padCount, padValue ) {
            if (undefined === padValue) {
                padValue = "0";
            }

            value = String( value );

            while (value.length < padCount) {
                value = padValue + value;
            }

            return value;
        },

        formatTime: function(date) {
            if (undefined === date) {
                date = new Date();
            }

            var hours = this.pad(date.getHours(), 2);
            var minutes = this.pad(date.getMinutes(), 2);
            var seconds = this.pad(date.getSeconds(), 2);
            var milliseconds = this.pad(date.getMilliseconds(), 2);

            return this.format(
                "{0}:{1}:{2}:{3}", hours, minutes, seconds, milliseconds);
        },

        formatMonthDayYear: function(date) {
            if (!date) {
                return "";
            }

            var pad = Recurve.StringUtils.pad;

            var month = pad(date.getMonth() + 1);
            var day = pad(date.getDate());
            var year = date.getFullYear();

            return this.format(
                "{0}/{1}/{2}", month, day, year);
        },

        formatYearRange: function(start, end) {
            var value = "";

            if (start && end) {
                value = start + " - " + end;
            }
            else if (start) {
                value = start;
            }
            else {
                value = end;
            }

            return value;
        },

        capitalizeFirstCharacter: function(value) {
            if (!value) {
                return null;
            }

            return value.charAt(0).toUpperCase()  + value.slice(1);
        },

        urlLastPath: function(value) {
            if (!value) {
                return;
            }

            var split = value.split("/");
            return 0 < split.length ? split[split.length-1] : null;
        },

        hasValue: function(value) {
            return value && 0 < value.length;
        },

        linesOf: function(value) {
            var lines;

            if (value) {
                lines = value.split("\n");
            }

            return lines;
        },

        isEqual: function(str, value, ignoreCase) {
            if (!str || !value) {
                return str == value;
            }

            if (ignoreCase) {
                str = str.toLowerCase();
                value = value.toLowerCase();
            }

            return str == value;
        },

        isEqualIgnoreCase: function(str, value) {
            return Recurve.StringUtils.isEqual(str, value, true);
        },

        contains: function(str, value, ignoreCase) {
            if (!str || !value) {
                return str == value;
            }

            if (ignoreCase) {
                str = str.toLowerCase();
                value = value.toLowerCase();
            }

            return 0 <= str.indexOf(value);
        },

        addParametersToUrl: function(url, parameters) {
            if (!url || !parameters) {
                return;
            }

            var seperator = Recurve.StringUtils.contains(url, "?") ? "&" : "?";

            for (var key in parameters) {
                var value = parameters[key];

                if (Recurve.ObjectUtils.isObject(value)) {
                    if (Recurve.ObjectUtils.isDate(value)) {
                        value = value.toISOString();
                    }
                    else {
                        value = Recurve.ObjectUtils.toJson(value);
                    }
                }

                url += seperator +  encodeURIComponent(key) + encodeURIComponent(parameters[key]);
                seperator = "?";
            }

            return url;
        },

        removeParameterFromUrl: function(url, parameter) {
            if (!url || !parameter) {
                return;
            }

            var search = parameter + "=";
            var startIndex = url.indexOf(search);

            if (-1 === index) {
                return;
            }

            var endIndex = url.indexOf("&", startIndex);

            if (-1 < endIndex) {
                url = url.substr(0, Math.max(startIndex - 1, 0)) + url.substr(endIndex);
            }
            else {
                url = url.substr(0, Math.max(startIndex - 1, 0));
            }

            return url;
        }
    };
})();

*/

"use strict";

var ObjectUtils = require("./recurve-object.js");

module.exports = {
    format: function(value) {
        if (!value) {
            return null;
        }

        Array.prototype.shift.apply(arguments);

        for (var index = 0; index < arguments.length; index++) {
            var search = "{" + index + "}";
            value = value.replace(search, arguments[index]);
        }

        return value;
    },

    formatWithProperties: function(value, formatProperties) {
        if (!value) {
            return null;
        }

        for (var property in formatProperties) {
            if (formatProperties.hasOwnProperty(property)) {
                var search = "{" + property + "}";
                value = value.replace(search, formatProperties[property]);
            }
        }

        return value;
    },

    pad: function( value, padCount, padValue ) {
        if (undefined === padValue) {
            padValue = "0";
        }

        value = String( value );

        while (value.length < padCount) {
            value = padValue + value;
        }

        return value;
    },

    formatTime: function(date) {
        if (undefined === date) {
            date = new Date();
        }

        var hours = this.pad(date.getHours(), 2);
        var minutes = this.pad(date.getMinutes(), 2);
        var seconds = this.pad(date.getSeconds(), 2);
        var milliseconds = this.pad(date.getMilliseconds(), 2);

        return this.format(
            "{0}:{1}:{2}:{3}", hours, minutes, seconds, milliseconds);
    },

    formatMonthDayYear: function(date) {
        if (!date) {
            return "";
        }

        var month = this.pad(date.getMonth() + 1);
        var day = this.pad(date.getDate());
        var year = date.getFullYear();

        return this.format(
            "{0}/{1}/{2}", month, day, year);
    },

    formatYearRange: function(start, end) {
        var value = "";

        if (start && end) {
            value = start + " - " + end;
        }
        else if (start) {
            value = start;
        }
        else {
            value = end;
        }

        return value;
    },

    capitalizeFirstCharacter: function(value) {
        if (!value) {
            return null;
        }

        return value.charAt(0).toUpperCase()  + value.slice(1);
    },

    urlLastPath: function(value) {
        if (!value) {
            return;
        }

        var split = value.split("/");
        return 0 < split.length ? split[split.length-1] : null;
    },

    hasValue: function(value) {
        return value && 0 < value.length;
    },

    linesOf: function(value) {
        var lines;

        if (value) {
            lines = value.split("\n");
        }

        return lines;
    },

    isEqual: function(str, value, ignoreCase) {
        if (!str || !value) {
            return str == value;
        }

        if (ignoreCase) {
            str = str.toLowerCase();
            value = value.toLowerCase();
        }

        return str == value;
    },

    isEqualIgnoreCase: function(str, value) {
        return this.isEqual(str, value, true);
    },

    contains: function(str, value, ignoreCase) {
        if (!str || !value) {
            return str == value;
        }

        if (ignoreCase) {
            str = str.toLowerCase();
            value = value.toLowerCase();
        }

        return 0 <= str.indexOf(value);
    },

    addParametersToUrl: function(url, parameters) {
        if (!url || !parameters) {
            return;
        }

        var seperator = this.contains(url, "?") ? "&" : "?";

        for (var key in parameters) {
            var value = parameters[key];

            if (ObjectUtils.isObject(value)) {
                if (ObjectUtils.isDate(value)) {
                    value = value.toISOString();
                }
                else {
                    value = ObjectUtils.toJson(value);
                }
            }

            url += seperator +  encodeURIComponent(key) + encodeURIComponent(parameters[key]);
            seperator = "?";
        }

        return url;
    },

    removeParameterFromUrl: function(url, parameter) {
        if (!url || !parameter) {
            return;
        }

        var search = parameter + "=";
        var startIndex = url.indexOf(search);

        if (-1 === index) {
            return;
        }

        var endIndex = url.indexOf("&", startIndex);

        if (-1 < endIndex) {
            url = url.substr(0, Math.max(startIndex - 1, 0)) + url.substr(endIndex);
        }
        else {
            url = url.substr(0, Math.max(startIndex - 1, 0));
        }

        return url;
    }
};


},{"./recurve-object.js":9}],13:[function(require,module,exports){
/*(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.WindowUtils =
    {
        isFileProtocol: function() {
            return "file:" === window.location.protocol;
        },

        globalEval: function(src) {
            if (!src) {
                return;
            }

            // https://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
            if (window.execScript) {
                window.execScript(src);
            }

            var func = function() {
                window.eval.call(window.src);
            };

            func();
        }
    };
})(); */

"use strict";

module.exports  = {
    isFileProtocol: function() {
        return "file:" === window.location.protocol;
    },

    globalEval: function(src) {
        if (!src) {
            return;
        }

        // https://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        if (window.execScript) {
            window.execScript(src);
        }

        var func = function() {
            window.eval.call(window.src);
        };

        func();
    }
}
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2V4cG9ydHMuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLWFycmF5LmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1hc3NlcnQuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLWRhdGUuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLWdsb2JhbC1lcnJvci1oYW5kbGVyLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1odHRwLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1sb2ctY29uc29sZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3JlY3VydmUtbG9nLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1vYmplY3QuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLXByb3RvLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1zaWduYWwuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLXN0cmluZy5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3JlY3VydmUtd2luZG93LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBSZWN1cnZlID0gd2luZG93LlJlY3VydmUgfHwge307XG5cbiAgICBSZWN1cnZlLlN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1zdHJpbmcuanNcIik7XG4gICAgUmVjdXJ2ZS5XaW5kb3dVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtd2luZG93LmpzXCIpO1xuICAgIFJlY3VydmUuQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtYXJyYXkuanNcIik7XG4gICAgUmVjdXJ2ZS5EYXRlVXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLWRhdGUuanNcIik7XG4gICAgUmVjdXJ2ZS5PYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtb2JqZWN0LmpzXCIpO1xuXG4gICAgUmVjdXJ2ZS5hc3NlcnQgPSByZXF1aXJlKFwiLi9yZWN1cnZlLWFzc2VydC5qc1wiKTtcblxuICAgIFJlY3VydmUuUHJvdG8gPSByZXF1aXJlKFwiLi9yZWN1cnZlLXByb3RvLmpzXCIpO1xuICAgIFJlY3VydmUuTG9nID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1sb2cuanNcIik7XG4gICAgUmVjdXJ2ZS5Mb2dDb25zb2xlVGFyZ2V0ID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1sb2ctY29uc29sZS5qc1wiKTtcbiAgICBSZWN1cnZlLlNpZ25hbCA9IHJlcXVpcmUoXCIuL3JlY3VydmUtc2lnbmFsLmpzXCIpO1xuICAgIFJlY3VydmUuSHR0cCA9IHJlcXVpcmUoXCIuL3JlY3VydmUtaHR0cC5qc1wiKTtcbiAgICBSZWN1cnZlLkdsb2JhbEVycm9ySGFuZGxlciA9IHJlcXVpcmUoXCIuL3JlY3VydmUtZ2xvYmFsLWVycm9yLWhhbmRsZXIuanNcIik7XG5cbiAgICB3aW5kb3cuUmVjdXJ2ZSA9IFJlY3VydmU7XG59KSgpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW1vdmVJdGVtOiBmdW5jdGlvbihhcnJheSwgaXRlbSkge1xuICAgICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuXG4gICAgICAgIGlmICgtMSA8IGluZGV4KSB7XG4gICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbW92ZUF0OiBmdW5jdGlvbihhcnJheSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKDAgPD0gaW5kZXggJiYgYXJyYXkubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVwbGFjZUl0ZW06IGZ1bmN0aW9uKGFycmF5LCBpdGVtKSB7XG4gICAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG5cbiAgICAgICAgaWYgKC0xIDwgaW5kZXgpIHtcbiAgICAgICAgICAgIGFycmF5W2luZGV4XSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNFbXB0eTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICF2YWx1ZSB8fCAwID09PSB2YWx1ZS5sZW5ndGg7XG4gICAgfSxcblxuICAgIGFyZ3VtZW50c1RvQXJyYXk6IGZ1bmN0aW9uKGFyZ3MsIHNsaWNlQ291bnQpIHtcbiAgICAgICAgcmV0dXJuIHNsaWNlQ291bnQgPCBhcmdzLmxlbmd0aCA/IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIHNsaWNlQ291bnQpIDogW107XG4gICAgfVxufTsiLCIvKlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuXG4gICAgUmVjdXJ2ZS5hc3NlcnQgPSBmdW5jdGlvbihjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNoaWZ0LmFwcGx5KGFyZ3VtZW50cyk7XG4gICAgICAgIG1lc3NhZ2UgPSBSZWN1cnZlLlN0cmluZ1V0aWxzLmZvcm1hdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9O1xufSkoKTtcbiovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLXN0cmluZy5qc1wiKTtcblxuLy8gVE9ETyBUQkQgYWRkIG1ldGhvZHMgc3VjaCBhczogb2ssIGVxdWFsLCBlcXVhbFN0cmljdCwgZXRjLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJndW1lbnRzKTtcbiAgICBtZXNzYWdlID0gU3RyaW5nVXRpbHMuZm9ybWF0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG59OyIsIi8qKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuXG4gICAgUmVjdXJ2ZS5EYXRlVXRpbHMgPVxuICAgIHtcbiAgICAgICAgbm93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXJ0WWVhckZyb21SYW5nZTogZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNwbGl0ID0gcmFuZ2Uuc3BsaXQoXCItXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDAgPCBzcGxpdC5sZW5ndGggPyBzcGxpdFswXSA6IFwiXCI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW5kWWVhckZyb21SYW5nZTogZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgICAgICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNwbGl0ID0gcmFuZ2Uuc3BsaXQoXCItXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDIgPCBzcGxpdC5sZW5ndGggPyBzcGxpdFsyXSA6IFwiXCI7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTsqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbm93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gICAgfSxcblxuICAgIHN0YXJ0WWVhckZyb21SYW5nZTogZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgICAgaWYgKCFyYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3BsaXQgPSByYW5nZS5zcGxpdChcIi1cIik7XG4gICAgICAgIHJldHVybiAwIDwgc3BsaXQubGVuZ3RoID8gc3BsaXRbMF0gOiBcIlwiO1xuICAgIH0sXG5cbiAgICBlbmRZZWFyRnJvbVJhbmdlOiBmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICBpZiAoIXJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzcGxpdCA9IHJhbmdlLnNwbGl0KFwiLVwiKTtcbiAgICAgICAgcmV0dXJuIDIgPCBzcGxpdC5sZW5ndGggPyBzcGxpdFsyXSA6IFwiXCI7XG4gICAgfVxufTsiLCIvLyhmdW5jdGlvbigpIHtcbi8vICAgIFwidXNlIHN0cmljdFwiO1xuLy9cbi8vICAgIHZhciBSZWN1cnZlID0gd2luZG93LlJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSB8fCB7fTtcbi8vXG4vLyAgICBSZWN1cnZlLkdsb2JhbEVycm9ySGFuZGxlciA9IFJlY3VydmUuUHJvdG8uZGVmaW5lKFtcbi8vXG4vLyAgICAgICAgLyoqXG4vLyAgICAgICAgICogTk9URSwgSWYgeW91ciBKUyBpcyBob3N0ZWQgb24gYSBDRE4gdGhlbiB0aGUgYnJvd3NlciB3aWxsIHNhbml0aXplIGFuZCBleGNsdWRlIGFsbCBlcnJvciBvdXRwdXRcbi8vICAgICAgICAgKiB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLiBTZWUgVE9ETyBUQkQgdHV0b3JpYWwgbGlua1xuLy8gICAgICAgICAqXG4vLyAgICAgICAgICogQHBhcmFtIG9uRXJyb3IsIGNhbGxiYWNrIGRlY2xhcmF0aW9uOiBvbkVycm9yKGRlc2NyaXB0aW9uLCBlcnJvciksIGVycm9yIHdpbGwgYmUgdW5kZWZpbmVkIGlmIG5vdCBzdXBwb3J0ZWQgYnkgYnJvd3NlclxuLy8gICAgICAgICAqIEBwYXJhbSBlbmFibGVkLCBkZWZhdWx0IHRydWVcbi8vICAgICAgICAgKiBAcGFyYW0gcHJldmVudEJyb3dzZXJIYW5kbGUsIGRlZmF1bHQgdHJ1ZVxuLy8gICAgICAgICAqL1xuLy8gICAgICAgIGZ1bmN0aW9uIGN0b3Iob25FcnJvciwgZW5hYmxlZCwgcHJldmVudEJyb3dzZXJIYW5kbGUpIHtcbi8vICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gZW5hYmxlZCkge1xuLy8gICAgICAgICAgICAgICAgZW5hYmxlZCA9IHRydWU7XG4vLyAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHByZXZlbnRCcm93c2VySGFuZGxlKSB7XG4vLyAgICAgICAgICAgICAgICBwcmV2ZW50QnJvd3NlckhhbmRsZSA9IHRydWU7XG4vLyAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSBlbmFibGVkO1xuLy8gICAgICAgICAgICB0aGlzLl9wcmV2ZW50QnJvd3NlckhhbmRsZSA9IHByZXZlbnRCcm93c2VySGFuZGxlO1xuLy8gICAgICAgICAgICB0aGlzLl9vbkVycm9yID0gb25FcnJvcjtcbi8vXG4vLyAgICAgICAgICAgIHdpbmRvdy5vbmVycm9yID0gdGhpcy5fZXJyb3JIYW5kbGVyLmJpbmQodGhpcyk7XG4vLyAgICAgICAgfSxcbi8vXG4vLyAgICAgICAge1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogV3JhcCBtZXRob2QgaW4gdHJ5Li5jYXRjaCBhbmQgaGFuZGxlIGVycm9yIHdpdGhvdXQgcmFpc2luZyB1bmNhdWdodCBlcnJvclxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gbWV0aG9kXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBbLCBhcmcyLCAuLi4sIGFyZ05dLCBsaXN0IG9mIGFyZ3VtZW50cyBmb3IgbWV0aG9kXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBwcm90ZWN0ZWRJbnZva2U6IGZ1bmN0aW9uKG1ldGhvZCkge1xuLy8gICAgICAgICAgICAgICAgdHJ5IHtcbi8vICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFJlY3VydmUuQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMSk7XG4vLyAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmFwcGx5KG51bGwsIGFyZ3MpO1xuLy8gICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmliZUVycm9yKGVycm9yKTtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCBkZXNjcmlwdGlvbik7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogSGFuZGxlIGVycm9yIGFzIHdvdWxkIGJlIGRvbmUgZm9yIHVuY2F1Z2h0IGdsb2JhbCBlcnJvclxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gZXJyb3IsIGFueSB0eXBlIG9mIGVycm9yIChzdHJpbmcsIG9iamVjdCwgRXJyb3IpXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBkZXNjcmlwdGlvblxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKGVycm9yLCBkZXNjcmlwdGlvbikge1xuLy8gICAgICAgICAgICAgICAgaWYgKHRoaXMuX29uRXJyb3IpXG4vLyAgICAgICAgICAgICAgICB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25FcnJvcihlcnJvciwgZGVzY3JpcHRpb24pO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcmV2ZW50QnJvd3NlckhhbmRsZTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vL1xuLy8gICAgICAgICAgICBkZXNjcmliZUVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuLy8gICAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuLy8gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbjtcbi8vXG4vLyAgICAgICAgICAgICAgICBpZiAoUmVjdXJ2ZS5PYmplY3RVdGlscy5pc1N0cmluZyhlcnJvcikpIHtcbi8vICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yO1xuLy8gICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgZWxzZSBpZiAoUmVjdXJ2ZS5PYmplY3RVdGlscy5pc0Vycm9yKGVycm9yKSkge1xuLy8gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gZXJyb3IubWVzc2FnZSArIFwiXFxuXCIgKyBlcnJvci5zdGFjaztcbi8vICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgIGVsc2UgaWYgKFJlY3VydmUuT2JqZWN0VXRpbHMuaXNPYmplY3QoZXJyb3IpKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICBlbHNlXG4vLyAgICAgICAgICAgICAgICB7XG4vLyAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBlcnJvci50b1N0cmluZygpO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIF9lcnJvckhhbmRsZXI6IGZ1bmN0aW9uKG1lc3NhZ2UsIGZpbGVuYW1lLCBsaW5lLCBjb2x1bW4sIGVycm9yKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2VuYWJsZWQpIHtcbi8vICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gUmVjdXJ2ZS5TdHJpbmdVdGlscy5mb3JtYXQoXG4vLyAgICAgICAgICAgICAgICAgICAgXCJtZXNzYWdlOiB7MH0sIGZpbGU6IHsxfSwgbGluZTogezJ9XCIsIG1lc3NhZ2UsIGZpbGVuYW1lLCBsaW5lKTtcbi8vXG4vLyAgICAgICAgICAgICAgICBpZiAoZXJyb3IpXG4vLyAgICAgICAgICAgICAgICB7XG4vLyAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gKz0gUmVjdXJ2ZS5TdHJpbmdVdGlscy5mb3JtYXQoXCIsIHN0YWNrOiB7MH1cIiwgZXJyb3Iuc3RhY2spO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vbkVycm9yKVxuLy8gICAgICAgICAgICAgICAge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJldmVudEJyb3dzZXJIYW5kbGU7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vLyAgICBdKTtcbi8vfSkoKTtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3JlY3VydmUtcHJvdG8uanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLXN0cmluZy5qc1wiKTtcbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtb2JqZWN0LmpzXCIpO1xudmFyIEFycmF5VXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLWFycmF5LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG5cbiAgICAvKipcbiAgICAgKiBOT1RFLCBJZiB5b3VyIEpTIGlzIGhvc3RlZCBvbiBhIENETiB0aGVuIHRoZSBicm93c2VyIHdpbGwgc2FuaXRpemUgYW5kIGV4Y2x1ZGUgYWxsIGVycm9yIG91dHB1dFxuICAgICAqIHVubGVzcyBleHBsaWNpdGx5IGVuYWJsZWQuIFNlZSBUT0RPIFRCRCB0dXRvcmlhbCBsaW5rXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb25FcnJvciwgY2FsbGJhY2sgZGVjbGFyYXRpb246IG9uRXJyb3IoZGVzY3JpcHRpb24sIGVycm9yKSwgZXJyb3Igd2lsbCBiZSB1bmRlZmluZWQgaWYgbm90IHN1cHBvcnRlZCBieSBicm93c2VyXG4gICAgICogQHBhcmFtIGVuYWJsZWQsIGRlZmF1bHQgdHJ1ZVxuICAgICAqIEBwYXJhbSBwcmV2ZW50QnJvd3NlckhhbmRsZSwgZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGN0b3Iob25FcnJvciwgZW5hYmxlZCwgcHJldmVudEJyb3dzZXJIYW5kbGUpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gZW5hYmxlZCkge1xuICAgICAgICAgICAgZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBwcmV2ZW50QnJvd3NlckhhbmRsZSkge1xuICAgICAgICAgICAgcHJldmVudEJyb3dzZXJIYW5kbGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlID0gcHJldmVudEJyb3dzZXJIYW5kbGU7XG4gICAgICAgIHRoaXMuX29uRXJyb3IgPSBvbkVycm9yO1xuXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gdGhpcy5fZXJyb3JIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXAgbWV0aG9kIGluIHRyeS4uY2F0Y2ggYW5kIGhhbmRsZSBlcnJvciB3aXRob3V0IHJhaXNpbmcgdW5jYXVnaHQgZXJyb3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZFxuICAgICAgICAgKiBAcGFyYW0gWywgYXJnMiwgLi4uLCBhcmdOXSwgbGlzdCBvZiBhcmd1bWVudHMgZm9yIG1ldGhvZFxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkSW52b2tlOiBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICBtZXRob2QuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaWJlRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlIGVycm9yIGFzIHdvdWxkIGJlIGRvbmUgZm9yIHVuY2F1Z2h0IGdsb2JhbCBlcnJvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXJyb3IsIGFueSB0eXBlIG9mIGVycm9yIChzdHJpbmcsIG9iamVjdCwgRXJyb3IpXG4gICAgICAgICAqIEBwYXJhbSBkZXNjcmlwdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKGVycm9yLCBkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX29uRXJyb3IpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25FcnJvcihlcnJvciwgZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJldmVudEJyb3dzZXJIYW5kbGU7XG4gICAgICAgIH0sXG5cblxuICAgICAgICBkZXNjcmliZUVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb247XG5cbiAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc1N0cmluZyhlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoT2JqZWN0VXRpbHMuaXNFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yLm1lc3NhZ2UgKyBcIlxcblwiICsgZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChPYmplY3RVdGlscy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXJyb3JIYW5kbGVyOiBmdW5jdGlvbihtZXNzYWdlLCBmaWxlbmFtZSwgbGluZSwgY29sdW1uLCBlcnJvcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBTdHJpbmdVdGlscy5mb3JtYXQoXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlOiB7MH0sIGZpbGU6IHsxfSwgbGluZTogezJ9XCIsIG1lc3NhZ2UsIGZpbGVuYW1lLCBsaW5lKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9IFN0cmluZ1V0aWxzLmZvcm1hdChcIiwgc3RhY2s6IHswfVwiLCBlcnJvci5zdGFjayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vbkVycm9yKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiLy8oZnVuY3Rpb24oKSB7XG4vLyAgICBcInVzZSBzdHJpY3RcIjtcbi8vXG4vLyAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlID0gd2luZG93LlJlY3VydmUgfHwge307XG4vL1xuLy8gICAgUmVjdXJ2ZS5IdHRwID0gZnVuY3Rpb24ob3B0aW9ucykge1xuLy8gICAgICAgIHZhciB3aXRoRGVmYXVsdHMgPSBjcmVhdGVPcHRpb25zV2l0aERlZmF1bHRzKG9wdGlvbnMsIFJlY3VydmUuSHR0cC5kZWZhdWx0cyk7XG4vL1xuLy8gICAgICAgIHVwZGF0ZVVybCh3aXRoRGVmYXVsdHMpO1xuLy8gICAgICAgIHVwZGF0ZUhlYWRlcnMod2l0aERlZmF1bHRzKTtcbi8vICAgICAgICBzZXJpYWxpemVEYXRhKHdpdGhEZWZhdWx0cyk7XG4vL1xuLy8gICAgICAgIHZhciBkZWZlcnJlZCA9IHdpdGhEZWZhdWx0cy5kZWZlcnJlZEZhY3Rvcnkod2l0aERlZmF1bHRzKTtcbi8vICAgICAgICB2YXIgcmVxdWVzdCA9IHdpdGhEZWZhdWx0cy5yZXF1ZXN0RmFjdG9yeSh3aXRoRGVmYXVsdHMsIGRlZmVycmVkKTtcbi8vXG4vLyAgICAgICAgZGVmZXJyZWQucmVxdWVzdCA9IGRlZmVycmVkO1xuLy8gICAgICAgIHJlcXVlc3Quc2VuZCgpXG4vL1xuLy8gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuLy8gICAgfTtcbi8vXG4vLyAgICBSZWN1cnZlLkh0dHAgPSBSZWN1cnZlLk9iamVjdFV0aWxzLmV4dGVuZChSZWN1cnZlLkh0dHAsIHtcbi8vICAgICAgICBkZWZhdWx0czoge1xuLy8gICAgICAgICAgICBoZWFkZXJzOiB7XG4vLyAgICAgICAgICAgICAgICBhbGw6IHt9LFxuLy9cbi8vICAgICAgICAgICAgICAgIGdldDoge30sXG4vLyAgICAgICAgICAgICAgICBwb3N0OiB7XG4vLyAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIiA6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXG4vLyAgICAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgICAgcHV0OiB7XG4vLyAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIiA6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXG4vLyAgICAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgICAgaGVhZDoge30sXG4vLyAgICAgICAgICAgICAgICBcImRlbGV0ZVwiOiB7fSxcbi8vICAgICAgICAgICAgICAgIGpzb25wOiB7fSxcbi8vICAgICAgICAgICAgICAgIHNjcmlwdDoge31cbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIG1ldGhvZDogXCJnZXRcIixcbi8vICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuLy9cbi8vICAgICAgICAgICAgY2FjaGU6IHRydWUsXG4vL1xuLy8gICAgICAgICAgICBzZXJpYWxpemVyIDogW2RlZmF1bHRTZXJpYWxpemVyXSxcbi8vICAgICAgICAgICAgcGFyc2VyIDogW2RlZmF1bHRQYXJzZXJdLFxuLy9cbi8vICAgICAgICAgICAgcmVxdWVzdEZhY3Rvcnk6IERlZmF1bHRSZXF1ZXN0RmFjdG9yeSxcbi8vICAgICAgICAgICAgZGVmZXJyZWRGYWN0b3J5OiBEZWZhdWx0RGVmZXJyZWRGYWN0b3J5LFxuLy9cbi8vICAgICAgICAgICAgZXJyb3JPbkNhbmNlbDogdHJ1ZVxuLy8gICAgICAgIH0sXG4vL1xuLy8gICAgICAgIGdldDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4vLyAgICAgICAgICAgIG9wdGlvbnMgPSBSZWN1cnZlLk9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImdldFwiLCB1cmw6IHVybH0pO1xuLy8gICAgICAgICAgICByZXR1cm4gUmVjdXJ2ZS5IdHRwKG9wdGlvbnMpO1xuLy8gICAgICAgIH0sXG4vL1xuLy8gICAgICAgIHBvc3Q6IGZ1bmN0aW9uKHVybCwgZGF0YSwgb3B0aW9ucykge1xuLy8gICAgICAgICAgICBvcHRpb25zID0gUmVjdXJ2ZS5PYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJwb3N0XCIsIHVybDogdXJsLCBkYXRhOiBkYXRhfSk7XG4vLyAgICAgICAgICAgIHJldHVybiBSZWN1cnZlLkh0dHAob3B0aW9ucyk7XG4vLyAgICAgICAgfSxcbi8vXG4vLyAgICAgICAganNvbnA6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuLy8gICAgICAgICAgICBvcHRpb25zID0gUmVjdXJ2ZS5PYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJqc29ucFwiLCB1cmw6IHVybH0pO1xuLy8gICAgICAgICAgICByZXR1cm4gUmVjdXJ2ZS5IdHRwKG9wdGlvbnMpO1xuLy8gICAgICAgIH0sXG4vL1xuLy8gICAgICAgIGRlbGV0ZTogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4vLyAgICAgICAgICAgIG9wdGlvbnMgPSBSZWN1cnZlLk9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImRlbGV0ZVwiLCB1cmw6IHVybH0pO1xuLy8gICAgICAgICAgICByZXR1cm4gUmVjdXJ2ZS5IdHRwKG9wdGlvbnMpO1xuLy8gICAgICAgIH0sXG4vL1xuLy8gICAgICAgIGhlYWQ6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuLy8gICAgICAgICAgICBvcHRpb25zID0gUmVjdXJ2ZS5PYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJoZWFkXCIsIHVybDogdXJsfSk7XG4vLyAgICAgICAgICAgIHJldHVybiBSZWN1cnZlLkh0dHAob3B0aW9ucyk7XG4vLyAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgcHV0OiBmdW5jdGlvbih1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbi8vICAgICAgICAgICAgb3B0aW9ucyA9IFJlY3VydmUuT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwicHV0XCIsIHVybDogdXJsLCBkYXRhOiBkYXRhfSk7XG4vLyAgICAgICAgICAgIHJldHVybiBSZWN1cnZlLkh0dHAob3B0aW9ucyk7XG4vLyAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgcGF0Y2g6IGZ1bmN0aW9uKHVybCwgZGF0YSwgb3B0aW9ucykge1xuLy8gICAgICAgICAgICBvcHRpb25zID0gUmVjdXJ2ZS5PYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJwYXRjaFwiLCB1cmw6IHVybCwgZGF0YTogZGF0YX0pO1xuLy8gICAgICAgICAgICByZXR1cm4gUmVjdXJ2ZS5IdHRwKG9wdGlvbnMpO1xuLy8gICAgICAgIH0sXG4vL1xuLy8gICAgICAgIGdldFNjcmlwdDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4vLyAgICAgICAgICAgIG9wdGlvbnMgPSBSZWN1cnZlLk9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcInNjcmlwdFwiLCB1cmw6IHVybH0pO1xuLy8gICAgICAgICAgICByZXR1cm4gUmVjdXJ2ZS5IdHRwKG9wdGlvbnMpO1xuLy8gICAgICAgIH1cbi8vICAgIH0pO1xuLy9cbi8vXG4vLyAgICBmdW5jdGlvbiBkZWZhdWx0U2VyaWFsaXplcihkYXRhLCBjb250ZW50VHlwZSkge1xuLy8gICAgICAgIHZhciBpZ25vcmVDYXNlID0gdHJ1ZTtcbi8vXG4vLyAgICAgICAgaWYgKFJlY3VydmUuU3RyaW5nVXRpbHMuY29udGFpbnMoY29udGVudFR5cGUsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsIGlnbm9yZUNhc2UpKSB7XG4vLyAgICAgICAgICAgIGlmIChSZWN1cnZlLk9iamVjdFV0aWxzLmlzT2JqZWN0KGRhdGEpICYmICFSZWN1cnZlLk9iamVjdFV0aWxzLmlzRmlsZShkYXRhKSkge1xuLy8gICAgICAgICAgICAgICAgZGF0YSA9IFJlY3VydmUuT2JqZWN0VXRpbHMudG9Gb3JtRGF0YShkYXRhKTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vICAgICAgICBlbHNlIGlmIChSZWN1cnZlLlN0cmluZ1V0aWxzLmNvbnRhaW5zKGNvbnRlbnRUeXBlLCBcImFwcGxpY2F0aW9uL2pzb25cIiwgaWdub3JlQ2FzZSkpIHtcbi8vICAgICAgICAgICAgaWYgKFJlY3VydmUuT2JqZWN0VXRpbHMuaXNPYmplY3QoZGF0YSkgJiYgIVJlY3VydmUuT2JqZWN0VXRpbHMuaXNGaWxlKGRhdGEpKSB7XG4vLyAgICAgICAgICAgICAgICBkYXRhID0gUmVjdXJ2ZS5PYmplY3RVdGlscy50b0pzb24oZGF0YSk7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vLyAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBub3RoaW5nIHRvIHNlcmlhbGl6ZVxuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgcmV0dXJuIGRhdGE7XG4vLyAgICB9XG4vL1xuLy8gICAgUmVjdXJ2ZS5IdHRwLnNlcmlhbGl6ZXIgPSBkZWZhdWx0U2VyaWFsaXplcjtcbi8vXG4vL1xuLy8gICAgZnVuY3Rpb24gZGVmYXVsdFBhcnNlcih4aHIsIGFjY2VwdCkge1xuLy8gICAgICAgIHZhciBkYXRhO1xuLy8gICAgICAgIHZhciBpZ25vcmVDYXNlID0gdHJ1ZTtcbi8vXG4vLyAgICAgICAgaWYgKFJlY3VydmUuU3RyaW5nVXRpbHMuY29udGFpbnMoYWNjZXB0LCBcImFwcGxpY2F0aW9uL3htbFwiLCBpZ25vcmVDYXNlKSB8fFxuLy8gICAgICAgICAgICBSZWN1cnZlLlN0cmluZ1V0aWxzLmNvbnRhaW5zKGFjY2VwdCwgXCJ0ZXh0L3htbFwiLCBpZ25vcmVDYXNlKSkge1xuLy8gICAgICAgICAgICBkYXRhID0geGhyLnJlc3BvbnNlWE1MO1xuLy8gICAgICAgIH1cbi8vICAgICAgICBlbHNlIGlmIChSZWN1cnZlLlN0cmluZ1V0aWxzLmNvbnRhaW5zKGFjY2VwdCwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIGlnbm9yZUNhc2UpKSB7XG4vLyAgICAgICAgICAgIGlmIChkYXRhKSB7XG4vLyAgICAgICAgICAgICAgICBkYXRhID0gUmVjdXJ2ZS5PYmplY3RVdGlscy50b0pzb24oeGhyLnJlc3BvbnNlVGV4dCk7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vLyAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgIGRhdGEgPSB4aHIucmVzcG9uc2VUZXh0O1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgcmV0dXJuIGRhdGE7XG4vLyAgICB9XG4vL1xuLy8gICAgUmVjdXJ2ZS5IdHRwLnBhcnNlciA9IGRlZmF1bHRQYXJzZXI7XG4vL1xuLy9cbi8vICAgIGZ1bmN0aW9uIERlZmF1bHRSZXF1ZXN0RmFjdG9yeShvcHRpb25zLCBkZWZlcnJlZCkge1xuLy8gICAgICAgIHZhciByZXF1ZXN0O1xuLy9cbi8vICAgICAgICBpZiAoUmVjdXJ2ZS5TdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcImpzb25wXCIsIG9wdGlvbnMubWV0aG9kKSkge1xuLy8gICAgICAgICAgICByZXF1ZXN0ID0gbmV3IEpzb25wUmVxdWVzdChvcHRpb25zLCBkZWZlcnJlZCk7XG4vLyAgICAgICAgfVxuLy8gICAgICAgIGVsc2UgaWYgKG9wdGlvbnMuY3Jvc3NEb21haW4gJiZcbi8vICAgICAgICAgICAgUmVjdXJ2ZS5TdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCBvcHRpb25zLm1ldGhvZCkpIHtcbi8vICAgICAgICAgICAgcmVxdWVzdCA9IG5ldyBDcm9zc0RvbWFpblNjcmlwdFJlcXVlc3Qob3B0aW9ucywgZGVmZXJyZWQpO1xuLy8gICAgICAgIH1cbi8vICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgcmVxdWVzdCA9IG5ldyBYaHIob3B0aW9ucywgZGVmZXJyZWQpO1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4vLyAgICB9O1xuLy9cbi8vICAgIFJlY3VydmUuSHR0cC5SZXF1ZXN0RmFjdG9yeSA9IERlZmF1bHRSZXF1ZXN0RmFjdG9yeTtcbi8vXG4vL1xuLy8gICAgZnVuY3Rpb24gRGVmYXVsdERlZmVycmVkRmFjdG9yeSgpIHtcbi8vICAgICAgICByZXR1cm4gbmV3IEh0dHBEZWZlcnJlZCgpO1xuLy8gICAgfTtcbi8vXG4vLyAgICBSZWN1cnZlLkh0dHAuRGVmZXJyZWRGYWN0b3J5ID0gRGVmYXVsdERlZmVycmVkRmFjdG9yeTtcbi8vXG4vL1xuLy8gICAgZnVuY3Rpb24gUURlZmVycmVkRmFjdG9yeSgpIHtcbi8vICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4vL1xuLy8gICAgICAgIGRlZmVycmVkLnByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uKG9uU3VjY2Vzcykge1xuLy8gICAgICAgICAgICBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbi8vICAgICAgICAgICAgICAgIG9uU3VjY2Vzcyhcbi8vICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4vLyAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuLy8gICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWZlcnJlZC5wcm9taXNlO1xuLy8gICAgICAgIH07XG4vL1xuLy8gICAgICAgIGRlZmVycmVkLnByb21pc2UuZXJyb3IgPSBmdW5jdGlvbihvbkVycm9yKSB7XG4vLyAgICAgICAgICAgIGRlZmVycmVkLnByb21pc2UudGhlbihudWxsLCBmdW5jdGlvbihyZXNwb25zZSkge1xuLy8gICAgICAgICAgICAgICAgb25FcnJvcihcbi8vICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4vLyAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuLy8gICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWZlcnJlZC5wcm9taXNlO1xuLy8gICAgICAgIH07XG4vL1xuLy8gICAgICAgIGRlZmVycmVkLnByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgIGRlZmVycmVkLnJlcXVlc3QuY2FuY2VsKCk7XG4vLyAgICAgICAgfTtcbi8vXG4vLyAgICAgICAgcmV0dXJuIGRlZmVycmVkO1xuLy8gICAgfTtcbi8vXG4vLyAgICBSZWN1cnZlLkh0dHAuUURlZmVycmVkRmFjdG9yeSA9IFFEZWZlcnJlZEZhY3Rvcnk7XG4vL1xuLy9cbi8vICAgIGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbnNXaXRoRGVmYXVsdHMob3B0aW9ucywgZGVmYXVsdHMpIHtcbi8vICAgICAgICB2YXIgd2l0aERlZmF1bHRzID0gUmVjdXJ2ZS5PYmplY3RVdGlscy5leHRlbmQoe30sIGRlZmF1bHRzKTtcbi8vXG4vLyAgICAgICAgd2l0aERlZmF1bHRzLmhlYWRlcnMgPSB7fTtcbi8vICAgICAgICBtZXJnZUhlYWRlcnMob3B0aW9ucy5tZXRob2QsIHdpdGhEZWZhdWx0cywgZGVmYXVsdHMuaGVhZGVycyk7XG4vL1xuLy8gICAgICAgIFJlY3VydmUuT2JqZWN0VXRpbHMuZXh0ZW5kKHdpdGhEZWZhdWx0cywgb3B0aW9ucyk7XG4vL1xuLy8gICAgICAgIHJldHVybiB3aXRoRGVmYXVsdHM7XG4vLyAgICB9XG4vL1xuLy8gICAgZnVuY3Rpb24gbWVyZ2VIZWFkZXJzKG1ldGhvZCwgb3B0aW9ucywgZGVmYXVsdEhlYWRlcnMpIHtcbi8vICAgICAgICBtZXRob2QgPSBtZXRob2QudG9Mb3dlckNhc2UoKTtcbi8vXG4vLyAgICAgICAgUmVjdXJ2ZS5PYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywgZGVmYXVsdEhlYWRlcnMuYWxsKTtcbi8vICAgICAgICBSZWN1cnZlLk9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCBkZWZhdWx0SGVhZGVyc1ttZXRob2RdKTtcbi8vICAgIH1cbi8vXG4vLyAgICBmdW5jdGlvbiB1cGRhdGVVcmwob3B0aW9ucykge1xuLy8gICAgICAgIGlmICghb3B0aW9ucy5jYWNoZSkge1xuLy8gICAgICAgICAgICBvcHRpb25zLnBhcmFtcy5jYWNoZSA9IFJlY3VydmUuRGF0ZVV0aWxzLm5vdygpLmdldFRpbWUoKTtcbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIG9wdGlvbnMudXJsID1cbi8vICAgICAgICAgICAgUmVjdXJ2ZS5TdHJpbmdVdGlscy5hZGRQYXJhbWV0ZXJzVG9VcmwoXG4vLyAgICAgICAgICAgICAgICBvcHRpb25zLnVybCwgb3B0aW9ucy5wYXJhbXMpO1xuLy8gICAgfVxuLy9cbi8vICAgIGZ1bmN0aW9uIHVwZGF0ZUhlYWRlcnMob3B0aW9ucykge1xuLy8gICAgICAgIGFkZEFjY2VwdEhlYWRlcihvcHRpb25zKTtcbi8vICAgICAgICBhZGRSZXF1ZXN0ZWRXaXRoSGVhZGVyKG9wdGlvbnMpO1xuLy8gICAgICAgIHJlbW92ZUNvbnRlbnRUeXBlKG9wdGlvbnMpO1xuLy8gICAgfVxuLy9cbi8vICAgIGZ1bmN0aW9uIGFkZEFjY2VwdEhlYWRlcihvcHRpb25zKSB7XG4vLyAgICAgICAgaWYgKG9wdGlvbnMuaGVhZGVycy5BY2NlcHQpIHtcbi8vICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgdmFyIGFjY2VwdCA9IFwiKi8qXCI7XG4vLyAgICAgICAgdmFyIGRhdGFUeXBlID0gb3B0aW9ucy5kYXRhVHlwZTtcbi8vXG4vLyAgICAgICAgaWYgKGRhdGFUeXBlKSB7XG4vLyAgICAgICAgICAgIGRhdGFUeXBlID0gZGF0YVR5cGUudG9Mb3dlckNhc2UoKTtcbi8vXG4vLyAgICAgICAgICAgIGlmIChcInRleHRcIiA9PT0gZGF0YVR5cGUpIHtcbi8vICAgICAgICAgICAgICAgIGFjY2VwdCA9IFwidGV4dC9wbGFpbiwqLyo7cT0wLjAxXCI7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgZWxzZSBpZiAoXCJodG1sXCIgPT09IGRhdGFUeXBlKSB7XG4vLyAgICAgICAgICAgICAgICBhY2NlcHQgPSBcInRleHQvaHRtbCwqLyo7cT0wLjAxXCI7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgZWxzZSBpZiAoXCJ4bWxcIiA9PT0gZGF0YVR5cGUpIHtcbi8vICAgICAgICAgICAgICAgIGFjY2VwdCA9IFwiYXBwbGljYXRpb24veG1sLHRleHQveG1sLCovKjtxPTAuMDFcIjtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICBlbHNlIGlmIChcImpzb25cIiA9PT0gZGF0YVR5cGUgfHwgXCJzY3JpcHRcIiA9PT0gZGF0YVR5cGUpIHtcbi8vICAgICAgICAgICAgICAgIGFjY2VwdCA9IFwiYXBwbGljYXRpb24vanNvbix0ZXh0L2phdmFzY3JpcHQsKi8qO3E9MC4wMVwiO1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAtIGRlZmF1bHQgdG8gYWxsXG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIG9wdGlvbnMuaGVhZGVycy5BY2NlcHQgPSBhY2NlcHQ7XG4vLyAgICB9XG4vL1xuLy8gICAgZnVuY3Rpb24gYWRkUmVxdWVzdGVkV2l0aEhlYWRlcihvcHRpb25zKSB7XG4vLyAgICAgICAgaWYgKCFvcHRpb25zLmNyb3NzRG9tYWluICYmXG4vLyAgICAgICAgICAgICFvcHRpb25zLmhlYWRlcnNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdICYmXG4vLyAgICAgICAgICAgICFSZWN1cnZlLlN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwic2NyaXB0XCIsIG9wdGlvbnMuZGF0YVR5cGUpKSB7XG4vLyAgICAgICAgICAgIG9wdGlvbnMuaGVhZGVyc1tcIlgtUmVxdWVzdGVkLVdpdGhcIl0gPSBcIlhNTEh0dHBSZXF1ZXN0XCI7XG4vLyAgICAgICAgfVxuLy8gICAgfVxuLy9cbi8vICAgIGZ1bmN0aW9uIHJlbW92ZUNvbnRlbnRUeXBlKG9wdGlvbnMpIHtcbi8vICAgICAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuLy8gICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgfVxuLy9cbi8vICAgICAgICBSZWN1cnZlLk9iamVjdFV0aWxzLmZvckVhY2gob3B0aW9ucy5oZWFkZXJzLCBmdW5jdGlvbih2YWx1ZSwgaGVhZGVyKSB7XG4vLyAgICAgICAgICAgIGlmIChSZWN1cnZlLlN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwiY29udGVudC10eXBlXCIsIGhlYWRlcikpIHtcbi8vICAgICAgICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLmhlYWRlcnNbaGVhZGVyXTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH0pO1xuLy8gICAgfVxuLy9cbi8vICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEob3B0aW9ucykge1xuLy8gICAgICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4vLyAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIHZhciBkYXRhID0gb3B0aW9ucy5kYXRhO1xuLy9cbi8vICAgICAgICBpZiAoUmVjdXJ2ZS5PYmplY3RVdGlscy5pc0Z1bmN0aW9uKG9wdGlvbnMuc2VyaWFsaXplcikpIHtcbi8vICAgICAgICAgICAgZGF0YSA9IG9wdGlvbnMuc2VyaWFsaXplcihkYXRhLCB0aGlzLl9vcHRpb25zLmNvbnRlbnRUeXBlKTtcbi8vICAgICAgICB9XG4vLyAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgIFJlY3VydmUuT2JqZWN0VXRpbHMuZm9yRWFjaChvcHRpb25zLnNlcmlhbGl6ZXIsIGZ1bmN0aW9uKHNlcmlhbGl6ZXIpIHtcbi8vICAgICAgICAgICAgICAgIGRhdGEgPSBzZXJpYWxpemVyKGRhdGEsIG9wdGlvbnMuY29udGVudFR5cGUpO1xuLy8gICAgICAgICAgICB9KTtcbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG4vLyAgICB9XG4vL1xuLy9cbi8vICAgIHZhciBIdHRwRGVmZXJyZWQgPSBSZWN1cnZlLlByb3RvLmRlZmluZShbXG4vLyAgICAgICAgZnVuY3Rpb24gY3RvcigpIHtcbi8vICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkID0gbmV3IFJlY3VydmUuU2lnbmFsKCk7XG4vLyAgICAgICAgICAgIHRoaXMuX2Vycm9yZWQgPSBuZXcgUmVjdXJ2ZS5TaWduYWwoKTtcbi8vICAgICAgICB9LFxuLy9cbi8vICAgICAgICB7XG4vLyAgICAgICAgICAgIHJlc29sdmU6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4vLyAgICAgICAgICAgICAgICB0aGlzLl9zdWNjZWVkZWQudHJpZ2dlcihyZXNwb25zZSk7XG4vLyAgICAgICAgICAgICAgICB0aGlzLl9jbGVhblVwKCk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICByZWplY3Q6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4vLyAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcmVkLnRyaWdnZXIocmVzcG9uc2UpO1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fY2xlYW5VcCgpO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgcHJvbWlzZToge1xuLy8gICAgICAgICAgICAgICAgdGhlbjogZnVuY3Rpb24ob25TdWNjZXNzLCBvbkVycm9yKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLmFkZE9uY2Uob25TdWNjZXNzKTtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcmVkLmFkZE9uY2Uob25FcnJvcik7XG4vLyAgICAgICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG9uU3VjY2Vzcykge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC5hZGRPbmNlKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzcyhyZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzLCByZXNwb25zZS5vcHRpb25zLCByZXNwb25zZS5jYW5jZWxlZCk7XG4vLyAgICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihvbkVycm9yKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5hZGRPbmNlKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3IocmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuLy8gICAgICAgICAgICAgICAgICAgIH0pO1xuLy9cbi8vICAgICAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAgICAgY2FuY2VsOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3QgJiYgdGhpcy5yZXF1ZXN0LmNhbmNlbCgpO1xuLy8gICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgX2NsZWFuVXA6IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLnJlbW92ZUFsbCgpO1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkID0gbnVsbDtcbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcmVkLnJlbW92ZUFsbCgpO1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZCA9IG51bGw7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vLyAgICBdKTtcbi8vXG4vL1xuLy8gICAgdmFyIHJlcXVlc3RJZCA9IDA7XG4vL1xuLy8gICAgdmFyIFhociA9IFJlY3VydmUuUHJvdG8uZGVmaW5lKFtcbi8vICAgICAgICBmdW5jdGlvbiBjdG9yKG9wdGlvbnMsIGRlZmVycmVkKSB7XG4vLyAgICAgICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuLy8gICAgICAgICAgICB0aGlzLl9kZWZlcnJlZCA9IGRlZmVycmVkO1xuLy8gICAgICAgICAgICB0aGlzLl9pZCA9IHJlcXVlc3RJZCsrO1xuLy8gICAgICAgIH0sXG4vL1xuLy8gICAgICAgIHtcbi8vICAgICAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy5feGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWN1cnZlIG9ubHkgc3VwcG9ydHMgSUU4K1wiKTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9jb25maWcoKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl94aHIub25yZWFkeXN0YXRlY2hhbmdlID1cbi8vICAgICAgICAgICAgICAgICAgICBSZWN1cnZlLk9iamVjdFV0aWxzLmJpbmQodGhpcy5fc3RhdGVDaGFuZ2VIYW5kbGVyLCB0aGlzKTtcbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl94aHIub3Blbih0aGlzLl9vcHRpb25zLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCB0aGlzLl9vcHRpb25zLnVybCwgdHJ1ZSk7XG4vL1xuLy8gICAgICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuYmVmb3JlU2VuZCkge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuX29wdGlvbnMuYmVmb3JlU2VuZCh0aGlzLl94aHIsIHRoaXMuX29wdGlvbnMpO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHRoaXMuX3hoci5zZW5kKHRoaXMuX29wdGlvbnMuZGF0YSk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuLy9cbi8vICAgICAgICAgICAgICAgIGlmICh0aGlzLl94aHIpIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLl94aHIuYWJvcnQoKTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIF9jb25maWc6IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fYWRkSGVhZGVycygpO1xuLy9cbi8vICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLndpdGhDcmVkZW50aWFscykge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuX3hoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVvdXQpIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLl94aHIudGltZW91dCA9IHRoaXMuX29wdGlvbnMudGltZW91dDtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5yZXNwb25zZVR5cGUpIHtcbi8vICAgICAgICAgICAgICAgICAgICB0cnkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fb3B0aW9ucy5yZXNwb25zZVR5cGU7XG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NzM2NDhcbi8vICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIHdpbGwgdGhyb3cgZXJyb3IgZm9yIFwianNvblwiIG1ldGhvZCwgaWdub3JlIHRoaXMgc2luY2Vcbi8vICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgY2FuIGhhbmRsZSBpdFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVJlY3VydmUuU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJqc29uXCIsIHRoaXMuX29wdGlvbnMubWV0aG9kKSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBfYWRkSGVhZGVyczogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICBSZWN1cnZlLk9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fb3B0aW9ucy5oZWFkZXJzLCBmdW5jdGlvbih2YWx1ZSwgaGVhZGVyKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuLy8gICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBfc3RhdGVDaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgIGlmICg0ICE9PSB0aGlzLl94aHIucmVhZHlTdGF0ZSkge1xuLy8gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNTdWNjZXNzKCkpIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVTdWNjZXNzKCk7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcigpO1xuLy8gICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgX2lzU3VjY2VzczogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FuY2VsZWQgJiYgdGhpcy5fb3B0aW9ucy5lcnJvck9uQ2FuY2VsKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHZhciBzdGF0dXMgPSB0aGlzLl94aHIuc3RhdHVzO1xuLy9cbi8vICAgICAgICAgICAgICAgIHJldHVybiAoMjAwIDw9IHN0YXR1cyAmJiAzMDAgPiBzdGF0dXMpIHx8XG4vLyAgICAgICAgICAgICAgICAgICAgMzA0ID09PSBzdGF0dXMgfHxcbi8vICAgICAgICAgICAgICAgICAgICAoMCA9PT0gc3RhdHVzICYmIFJlY3VydmUuV2luZG93VXRpbHMuaXNGaWxlUHJvdG9jb2woKSk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBfaGFuZGxlU3VjY2VzczogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnMuc3VjY2Vzcykge1xuLy8gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB2YXIgZGF0YTtcbi8vXG4vLyAgICAgICAgICAgICAgICBpZiAoUmVjdXJ2ZS5TdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCB0aGlzLl9vcHRpb25zLmRhdGFUeXBlKSkge1xuLy8gICAgICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9yZXF1ZXN0LnJlc3BvbnNlVGV4dDtcbi8vICAgICAgICAgICAgICAgICAgICBSZWN1cnZlLldpbmRvd1V0aWxzLmdsb2JhbEV2YWwoZGF0YSk7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICAgICB0cnkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fcGFyc2VSZXNwb25zZSgpO1xuLy8gICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoXCJ1bmFibGUgdG8gcGFyc2UgcmVzcG9uc2VcIik7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fY29tcGxldGUodHJ1ZSwgZGF0YSk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBfaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKHN0YXR1c1RleHQpIHtcbi8vICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlKGZhbHNlLCBudWxsLCBzdGF0dXNUZXh0KTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIF9jb21wbGV0ZTogZnVuY3Rpb24oc3VjY2VzcywgZGF0YSwgc3RhdHVzVGV4dCkge1xuLy8gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0ge1xuLy8gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4vLyAgICAgICAgICAgICAgICAgICAgc3RhdHVzIDogdGhpcy5feGhyLnN0YXR1cyxcbi8vICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0IDogc3RhdHVzVGV4dCA/IHN0YXR1c1RleHQgOiB0aGlzLl94aHIuc3RhdHVzVGV4dCxcbi8vICAgICAgICAgICAgICAgICAgICBoZWFkZXJzIDogdGhpcy5feGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpLFxuLy8gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgOiB0aGlzLl9vcHRpb25zLFxuLy8gICAgICAgICAgICAgICAgICAgIGNhbmNlbGVkIDogdGhpcy5fY2FuY2VsZWRcbi8vICAgICAgICAgICAgICAgIH07XG4vL1xuLy8gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlamVjdChyZXNwb25zZSk7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBfcGFyc2VSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICB2YXIgYWNjZXB0ID0gIHRoaXMuX29wdGlvbnMuaGVhZGVycyAmJiB0aGlzLl9vcHRpb25zLmhlYWRlcnMuQWNjZXB0O1xuLy8gICAgICAgICAgICAgICAgaWYgKCFhY2NlcHQpIHtcbi8vICAgICAgICAgICAgICAgICAgICBhY2NlcHQgPSB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHZhciBkYXRhO1xuLy9cbi8vICAgICAgICAgICAgICAgIGlmIChSZWN1cnZlLk9iamVjdFV0aWxzLmlzRnVuY3Rpb24odGhpcy5fb3B0aW9ucy5zZXJpYWxpemVyKSkge1xuLy8gICAgICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9vcHRpb25zLnBhcnNlcih0aGlzLl94aHIpLCBhY2NlcHQ7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICAgICBSZWN1cnZlLk9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fb3B0aW9ucy5wYXJzZXIsIGZ1bmN0aW9uKHBhcnNlcikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gcGFyc2VyKHRoaXMuX3hociwgYWNjZXB0KTtcbi8vICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vICAgIF0pO1xuLy9cbi8vXG4vLyAgICB2YXIgSnNvbnBSZXF1ZXN0ID0gUmVjdXJ2ZS5Qcm90by5kZWZpbmUoW1xuLy8gICAgICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbi8vICAgICAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4vLyAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4vLyAgICAgICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4vLyAgICAgICAgfSxcbi8vXG4vLyAgICAgICAge1xuLy8gICAgICAgICAgICBzZW5kOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgIHZhciBjYWxsYmFja0lkID0gXCJSZWN1cnZlSnNvblBDYWxsYmFja1wiICsgdGhpcy5faWQ7XG4vLyAgICAgICAgICAgICAgICB2YXIgdXJsID0gUmVjdXJ2ZS5TdHJpbmdVdGlscy5yZW1vdmVQYXJhbWV0ZXJGcm9tVXJsKHRoaXMuX29wdGlvbnMudXJsLCBcImNhbGxiYWNrXCIpO1xuLy8gICAgICAgICAgICAgICAgdXJsID0gUmVjdXJ2ZS5TdHJpbmdVdGlscy5hZGRQYXJhbWV0ZXJzVG9VcmwodXJsLCB7Y2FsbGJhY2s6IGNhbGxiYWNrSWR9KTtcbi8vXG4vLyAgICAgICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbi8vICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4vLyAgICAgICAgICAgICAgICBzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4vLyAgICAgICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuLy9cbi8vICAgICAgICAgICAgICAgIHZhciBjYWxsZWQ7XG4vLyAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4vL1xuLy8gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2FsbGJhY2tIYW5kbGVyKGRhdGEpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5fY2FuY2VsZWQgJiYgdGhhdC5fb3B0aW9ucy5lcnJvck9uQ2FuY2VsKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX2NvbXBsZXRlKCk7XG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jb21wbGV0ZSh0cnVlLCBkYXRhLCAyMDApO1xuLy8gICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICBmdW5jdGlvbiBsb2FkRXJyb3JIYW5kbGVyIChldmVudCkge1xuLy8gICAgICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbi8vICAgICAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4vLyAgICAgICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHdpbmRvd1tjYWxsYmFja0lkXTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIFwibG9hZFwiID09PSBldmVudC50eXBlICYmICFjYWxsZWQpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fY29tcGxldGUoZmFsc2UsIG51bGwsIDQwNCwgXCJqc29ucCBjYWxsYmFjayBub3QgY2FsbGVkXCIpO1xuLy8gICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4vLyAgICAgICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuLy9cbi8vICAgICAgICAgICAgICAgIHdpbmRvd1tjYWxsYmFja0lkXSA9IGNhbGxiYWNrSGFuZGxlcjtcbi8vXG4vLyAgICAgICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgX2NvbXBsZXRlOiBmdW5jdGlvbihzdWNjZXNzLCBkYXRhLCBzdGF0dXMsIHN0YXR1c1RleHQpIHtcbi8vICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHtcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuLy8gICAgICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuLy8gICAgICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHN0YXR1c1RleHQsXG4vLyAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogdGhpcy5fb3B0aW9ucyxcbi8vICAgICAgICAgICAgICAgICAgICBjYW5jZWxlZDogdGhpcy5fY2FuY2VsZWRcbi8vICAgICAgICAgICAgICAgIH07XG4vL1xuLy8gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlamVjdChyZXNwb25zZSk7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vLyAgICBdKTtcbi8vXG4vLyAgICB2YXIgQ3Jvc3NEb21haW5TY3JpcHRSZXF1ZXN0ID0gUmVjdXJ2ZS5Qcm90by5kZWZpbmUoW1xuLy8gICAgICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbi8vICAgICAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4vLyAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4vLyAgICAgICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4vLyAgICAgICAgfSxcbi8vXG4vLyAgICAgICAge1xuLy8gICAgICAgICAgICBzZW5kOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuLy8gICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHRoaXMuX29wdGlvbnMudXJsO1xuLy8gICAgICAgICAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbi8vXG4vLyAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4vL1xuLy8gICAgICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEVycm9ySGFuZGxlciAoZXZlbnQpIHtcbi8vICAgICAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4vLyAgICAgICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuLy8gICAgICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgIGlmIChldmVudCAmJiBcImVycm9yXCIgPT09IGV2ZW50LnR5cGUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fZGVmZXJyZWQucmVqZWN0KHtzdGF0dXM6IDQwNCwgY2FuY2VsZWQ6IHRoYXQuX2NhbmNlbGVkfSk7XG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9kZWZlcnJlZC5yZXNvbHZlKHtzdGF0dXM6IDIwMCwgY2FuY2VsZWQ6IHRoYXQuX2NhbmNlbGVkfSk7XG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbi8vICAgICAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4vL1xuLy8gICAgICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgY2FuY2VsOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgIHRoaXMuX2NhbmNlbGVkID0gdHJ1ZTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vICAgIF0pO1xuLy9cbi8vfSkoKTtcblxuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLXN0cmluZy5qc1wiKTtcbnZhciBEYXRlVXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLXdpbmRvdy5qc1wiKTtcbnZhciBXaW5kb3dVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtd2luZG93LmpzXCIpO1xudmFyIFNpZ25hbCA9IHJlcXVpcmUoXCIuL3JlY3VydmUtc2lnbmFsLmpzXCIpO1xudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1wcm90by5qc1wiKTtcblxuLy8gVE9ETyBUQkQgc3dpdGNoIG92ZXIgdG8gSHR0cC5yZXF1ZXN0KC4uKSBpbnN0ZWFkIG9mIGRpcmVjdGx5IG9uIEh0dHAgb2JqZWN0XG52YXIgSHR0cCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgd2l0aERlZmF1bHRzID0gY3JlYXRlT3B0aW9uc1dpdGhEZWZhdWx0cyhvcHRpb25zLCBIdHRwLmRlZmF1bHRzKTtcblxuICAgIHVwZGF0ZVVybCh3aXRoRGVmYXVsdHMpO1xuICAgIHVwZGF0ZUhlYWRlcnMod2l0aERlZmF1bHRzKTtcbiAgICBzZXJpYWxpemVEYXRhKHdpdGhEZWZhdWx0cyk7XG5cbiAgICB2YXIgZGVmZXJyZWQgPSB3aXRoRGVmYXVsdHMuZGVmZXJyZWRGYWN0b3J5KHdpdGhEZWZhdWx0cyk7XG4gICAgdmFyIHJlcXVlc3QgPSB3aXRoRGVmYXVsdHMucmVxdWVzdEZhY3Rvcnkod2l0aERlZmF1bHRzLCBkZWZlcnJlZCk7XG5cbiAgICBkZWZlcnJlZC5yZXF1ZXN0ID0gZGVmZXJyZWQ7XG4gICAgcmVxdWVzdC5zZW5kKClcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuSHR0cCA9IE9iamVjdFV0aWxzLmV4dGVuZChIdHRwLCB7XG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgYWxsOiB7fSxcblxuICAgICAgICAgICAgZ2V0OiB7fSxcbiAgICAgICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwdXQ6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkOiB7fSxcbiAgICAgICAgICAgIFwiZGVsZXRlXCI6IHt9LFxuICAgICAgICAgICAganNvbnA6IHt9LFxuICAgICAgICAgICAgc2NyaXB0OiB7fVxuICAgICAgICB9LFxuXG4gICAgICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuXG4gICAgICAgIGNhY2hlOiB0cnVlLFxuXG4gICAgICAgIHNlcmlhbGl6ZXIgOiBbZGVmYXVsdFNlcmlhbGl6ZXJdLFxuICAgICAgICBwYXJzZXIgOiBbZGVmYXVsdFBhcnNlcl0sXG5cbiAgICAgICAgcmVxdWVzdEZhY3Rvcnk6IERlZmF1bHRSZXF1ZXN0RmFjdG9yeSxcbiAgICAgICAgZGVmZXJyZWRGYWN0b3J5OiBEZWZhdWx0RGVmZXJyZWRGYWN0b3J5LFxuXG4gICAgICAgIGVycm9yT25DYW5jZWw6IHRydWVcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImdldFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gSHR0cChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgcG9zdDogZnVuY3Rpb24odXJsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJwb3N0XCIsIHVybDogdXJsLCBkYXRhOiBkYXRhfSk7XG4gICAgICAgIHJldHVybiBIdHRwKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBqc29ucDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJqc29ucFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gSHR0cChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZGVsZXRlOiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImRlbGV0ZVwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gSHR0cChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgaGVhZDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJoZWFkXCIsIHVybDogdXJsfSk7XG4gICAgICAgIHJldHVybiBIdHRwKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBwdXQ6IGZ1bmN0aW9uKHVybCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwicHV0XCIsIHVybDogdXJsLCBkYXRhOiBkYXRhfSk7XG4gICAgICAgIHJldHVybiBIdHRwKG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBwYXRjaDogZnVuY3Rpb24odXJsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJwYXRjaFwiLCB1cmw6IHVybCwgZGF0YTogZGF0YX0pO1xuICAgICAgICByZXR1cm4gSHR0cChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZ2V0U2NyaXB0OiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcInNjcmlwdFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gSHR0cChvcHRpb25zKTtcbiAgICB9XG59KTtcblxuXG5mdW5jdGlvbiBkZWZhdWx0U2VyaWFsaXplcihkYXRhLCBjb250ZW50VHlwZSkge1xuICAgIHZhciBpZ25vcmVDYXNlID0gdHJ1ZTtcblxuICAgIGlmIChTdHJpbmdVdGlscy5jb250YWlucyhjb250ZW50VHlwZSwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzT2JqZWN0KGRhdGEpICYmICFPYmplY3RVdGlscy5pc0ZpbGUoZGF0YSkpIHtcbiAgICAgICAgICAgIGRhdGEgPSBPYmplY3RVdGlscy50b0Zvcm1EYXRhKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGNvbnRlbnRUeXBlLCBcImFwcGxpY2F0aW9uL2pzb25cIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzT2JqZWN0KGRhdGEpICYmICFPYmplY3RVdGlscy5pc0ZpbGUoZGF0YSkpIHtcbiAgICAgICAgICAgIGRhdGEgPSBPYmplY3RVdGlscy50b0pzb24oZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcgLSBub3RoaW5nIHRvIHNlcmlhbGl6ZVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5IdHRwLnNlcmlhbGl6ZXIgPSBkZWZhdWx0U2VyaWFsaXplcjtcblxuXG5mdW5jdGlvbiBkZWZhdWx0UGFyc2VyKHhociwgYWNjZXB0KSB7XG4gICAgdmFyIGRhdGE7XG4gICAgdmFyIGlnbm9yZUNhc2UgPSB0cnVlO1xuXG4gICAgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGFjY2VwdCwgXCJhcHBsaWNhdGlvbi94bWxcIiwgaWdub3JlQ2FzZSkgfHxcbiAgICAgICAgU3RyaW5nVXRpbHMuY29udGFpbnMoYWNjZXB0LCBcInRleHQveG1sXCIsIGlnbm9yZUNhc2UpKSB7XG4gICAgICAgIGRhdGEgPSB4aHIucmVzcG9uc2VYTUw7XG4gICAgfVxuICAgIGVsc2UgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGFjY2VwdCwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIGlnbm9yZUNhc2UpKSB7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0gT2JqZWN0VXRpbHMudG9Kc29uKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkYXRhID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuSHR0cC5wYXJzZXIgPSBkZWZhdWx0UGFyc2VyO1xuXG5cbmZ1bmN0aW9uIERlZmF1bHRSZXF1ZXN0RmFjdG9yeShvcHRpb25zLCBkZWZlcnJlZCkge1xuICAgIHZhciByZXF1ZXN0O1xuXG4gICAgaWYgKFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwianNvbnBcIiwgb3B0aW9ucy5tZXRob2QpKSB7XG4gICAgICAgIHJlcXVlc3QgPSBuZXcgSnNvbnBSZXF1ZXN0KG9wdGlvbnMsIGRlZmVycmVkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAob3B0aW9ucy5jcm9zc0RvbWFpbiAmJlxuICAgICAgICBTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCBvcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgICAgcmVxdWVzdCA9IG5ldyBDcm9zc0RvbWFpblNjcmlwdFJlcXVlc3Qob3B0aW9ucywgZGVmZXJyZWQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVxdWVzdCA9IG5ldyBYaHIob3B0aW9ucywgZGVmZXJyZWQpO1xuICAgIH1cblxuICAgIHJldHVybiByZXF1ZXN0O1xufTtcblxuSHR0cC5SZXF1ZXN0RmFjdG9yeSA9IERlZmF1bHRSZXF1ZXN0RmFjdG9yeTtcblxuXG5mdW5jdGlvbiBEZWZhdWx0RGVmZXJyZWRGYWN0b3J5KCkge1xuICAgIHJldHVybiBuZXcgSHR0cERlZmVycmVkKCk7XG59O1xuXG5IdHRwLkRlZmVycmVkRmFjdG9yeSA9IERlZmF1bHREZWZlcnJlZEZhY3Rvcnk7XG5cblxuZnVuY3Rpb24gUURlZmVycmVkRmFjdG9yeSgpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICBkZWZlcnJlZC5wcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbihvblN1Y2Nlc3MpIHtcbiAgICAgICAgZGVmZXJyZWQucHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBvblN1Y2Nlc3MoXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsIHJlc3BvbnNlLm9wdGlvbnMsIHJlc3BvbnNlLmNhbmNlbGVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmVycmVkLnByb21pc2U7XG4gICAgfTtcblxuICAgIGRlZmVycmVkLnByb21pc2UuZXJyb3IgPSBmdW5jdGlvbihvbkVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnByb21pc2UudGhlbihudWxsLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgb25FcnJvcihcbiAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZGVmZXJyZWQucmVxdWVzdC5jYW5jZWwoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmVycmVkO1xufTtcblxuSHR0cC5RRGVmZXJyZWRGYWN0b3J5ID0gUURlZmVycmVkRmFjdG9yeTtcblxuXG5mdW5jdGlvbiBjcmVhdGVPcHRpb25zV2l0aERlZmF1bHRzKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gICAgdmFyIHdpdGhEZWZhdWx0cyA9IE9iamVjdFV0aWxzLmV4dGVuZCh7fSwgZGVmYXVsdHMpO1xuXG4gICAgd2l0aERlZmF1bHRzLmhlYWRlcnMgPSB7fTtcbiAgICBtZXJnZUhlYWRlcnMob3B0aW9ucy5tZXRob2QsIHdpdGhEZWZhdWx0cywgZGVmYXVsdHMuaGVhZGVycyk7XG5cbiAgICBPYmplY3RVdGlscy5leHRlbmQod2l0aERlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB3aXRoRGVmYXVsdHM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSGVhZGVycyhtZXRob2QsIG9wdGlvbnMsIGRlZmF1bHRIZWFkZXJzKSB7XG4gICAgbWV0aG9kID0gbWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywgZGVmYXVsdEhlYWRlcnMuYWxsKTtcbiAgICBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywgZGVmYXVsdEhlYWRlcnNbbWV0aG9kXSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVVybChvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmNhY2hlKSB7XG4gICAgICAgIG9wdGlvbnMucGFyYW1zLmNhY2hlID0gRGF0ZVV0aWxzLm5vdygpLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICBvcHRpb25zLnVybCA9XG4gICAgICAgIFN0cmluZ1V0aWxzLmFkZFBhcmFtZXRlcnNUb1VybChcbiAgICAgICAgICAgIG9wdGlvbnMudXJsLCBvcHRpb25zLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhlYWRlcnMob3B0aW9ucykge1xuICAgIGFkZEFjY2VwdEhlYWRlcihvcHRpb25zKTtcbiAgICBhZGRSZXF1ZXN0ZWRXaXRoSGVhZGVyKG9wdGlvbnMpO1xuICAgIHJlbW92ZUNvbnRlbnRUeXBlKG9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBhZGRBY2NlcHRIZWFkZXIob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMuQWNjZXB0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWNjZXB0ID0gXCIqLypcIjtcbiAgICB2YXIgZGF0YVR5cGUgPSBvcHRpb25zLmRhdGFUeXBlO1xuXG4gICAgaWYgKGRhdGFUeXBlKSB7XG4gICAgICAgIGRhdGFUeXBlID0gZGF0YVR5cGUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoXCJ0ZXh0XCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcInRleHQvcGxhaW4sKi8qO3E9MC4wMVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwiaHRtbFwiID09PSBkYXRhVHlwZSkge1xuICAgICAgICAgICAgYWNjZXB0ID0gXCJ0ZXh0L2h0bWwsKi8qO3E9MC4wMVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwieG1sXCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcImFwcGxpY2F0aW9uL3htbCx0ZXh0L3htbCwqLyo7cT0wLjAxXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXCJqc29uXCIgPT09IGRhdGFUeXBlIHx8IFwic2NyaXB0XCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcImFwcGxpY2F0aW9uL2pzb24sdGV4dC9qYXZhc2NyaXB0LCovKjtxPTAuMDFcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBkZWZhdWx0IHRvIGFsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucy5oZWFkZXJzLkFjY2VwdCA9IGFjY2VwdDtcbn1cblxuZnVuY3Rpb24gYWRkUmVxdWVzdGVkV2l0aEhlYWRlcihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmNyb3NzRG9tYWluICYmXG4gICAgICAgICFvcHRpb25zLmhlYWRlcnNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdICYmXG4gICAgICAgICFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCBvcHRpb25zLmRhdGFUeXBlKSkge1xuICAgICAgICBvcHRpb25zLmhlYWRlcnNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdID0gXCJYTUxIdHRwUmVxdWVzdFwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29udGVudFR5cGUob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBPYmplY3RVdGlscy5mb3JFYWNoKG9wdGlvbnMuaGVhZGVycywgZnVuY3Rpb24odmFsdWUsIGhlYWRlcikge1xuICAgICAgICBpZiAoU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJjb250ZW50LXR5cGVcIiwgaGVhZGVyKSkge1xuICAgICAgICAgICAgZGVsZXRlIG9wdGlvbnMuaGVhZGVyc1toZWFkZXJdO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuICAgIGlmIChPYmplY3RVdGlscy5pc0Z1bmN0aW9uKG9wdGlvbnMuc2VyaWFsaXplcikpIHtcbiAgICAgICAgZGF0YSA9IG9wdGlvbnMuc2VyaWFsaXplcihkYXRhLCB0aGlzLl9vcHRpb25zLmNvbnRlbnRUeXBlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2gob3B0aW9ucy5zZXJpYWxpemVyLCBmdW5jdGlvbihzZXJpYWxpemVyKSB7XG4gICAgICAgICAgICBkYXRhID0gc2VyaWFsaXplcihkYXRhLCBvcHRpb25zLmNvbnRlbnRUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5kYXRhID0gZGF0YTtcbn1cblxuXG52YXIgSHR0cERlZmVycmVkID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9zdWNjZWVkZWQgPSBuZXcgU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuX2Vycm9yZWQgPSBuZXcgU2lnbmFsKCk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcmVzb2x2ZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC50cmlnZ2VyKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuVXAoKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWplY3Q6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9lcnJvcmVkLnRyaWdnZXIocmVzcG9uc2UpO1xuICAgICAgICAgICAgdGhpcy5fY2xlYW5VcCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByb21pc2U6IHtcbiAgICAgICAgICAgIHRoZW46IGZ1bmN0aW9uKG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC5hZGRPbmNlKG9uU3VjY2Vzcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5hZGRPbmNlKG9uRXJyb3IpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ob25TdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLmFkZE9uY2UoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsIHJlc3BvbnNlLm9wdGlvbnMsIHJlc3BvbnNlLmNhbmNlbGVkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5hZGRPbmNlKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IocmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdCAmJiB0aGlzLnJlcXVlc3QuY2FuY2VsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NsZWFuVXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLnJlbW92ZUFsbCgpO1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG5cblxudmFyIHJlcXVlc3RJZCA9IDA7XG5cbnZhciBYaHIgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWN1cnZlIG9ubHkgc3VwcG9ydHMgSUU4K1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY29uZmlnKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3hoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPVxuICAgICAgICAgICAgICAgIE9iamVjdFV0aWxzLmJpbmQodGhpcy5fc3RhdGVDaGFuZ2VIYW5kbGVyLCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5feGhyLm9wZW4odGhpcy5fb3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKSwgdGhpcy5fb3B0aW9ucy51cmwsIHRydWUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5iZWZvcmVTZW5kKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3B0aW9ucy5iZWZvcmVTZW5kKHRoaXMuX3hociwgdGhpcy5fb3B0aW9ucyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3hoci5zZW5kKHRoaXMuX29wdGlvbnMuZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FuY2VsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX3hocikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3hoci5hYm9ydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9jb25maWc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fYWRkSGVhZGVycygpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl94aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZW91dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3hoci50aW1lb3V0ID0gdGhpcy5fb3B0aW9ucy50aW1lb3V0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5yZXNwb25zZVR5cGUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fb3B0aW9ucy5yZXNwb25zZVR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NzM2NDhcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIHdpbGwgdGhyb3cgZXJyb3IgZm9yIFwianNvblwiIG1ldGhvZCwgaWdub3JlIHRoaXMgc2luY2VcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgY2FuIGhhbmRsZSBpdFxuICAgICAgICAgICAgICAgICAgICBpZiAoIVN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwianNvblwiLCB0aGlzLl9vcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9hZGRIZWFkZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fb3B0aW9ucy5oZWFkZXJzLCBmdW5jdGlvbih2YWx1ZSwgaGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3N0YXRlQ2hhbmdlSGFuZGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoNCAhPT0gdGhpcy5feGhyLnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1N1Y2Nlc3MoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZVN1Y2Nlc3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2lzU3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FuY2VsZWQgJiYgdGhpcy5fb3B0aW9ucy5lcnJvck9uQ2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3RhdHVzID0gdGhpcy5feGhyLnN0YXR1cztcblxuICAgICAgICAgICAgcmV0dXJuICgyMDAgPD0gc3RhdHVzICYmIDMwMCA+IHN0YXR1cykgfHxcbiAgICAgICAgICAgICAgICAzMDQgPT09IHN0YXR1cyB8fFxuICAgICAgICAgICAgICAgICgwID09PSBzdGF0dXMgJiYgV2luZG93VXRpbHMuaXNGaWxlUHJvdG9jb2woKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2hhbmRsZVN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkYXRhO1xuXG4gICAgICAgICAgICBpZiAoU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJzY3JpcHRcIiwgdGhpcy5fb3B0aW9ucy5kYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fcmVxdWVzdC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgV2luZG93VXRpbHMuZ2xvYmFsRXZhbChkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9wYXJzZVJlc3BvbnNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihcInVuYWJsZSB0byBwYXJzZSByZXNwb25zZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUodHJ1ZSwgZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2hhbmRsZUVycm9yOiBmdW5jdGlvbihzdGF0dXNUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZShmYWxzZSwgbnVsbCwgc3RhdHVzVGV4dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbXBsZXRlOiBmdW5jdGlvbihzdWNjZXNzLCBkYXRhLCBzdGF0dXNUZXh0KSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXMgOiB0aGlzLl94aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQgOiBzdGF0dXNUZXh0ID8gc3RhdHVzVGV4dCA6IHRoaXMuX3hoci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgIGhlYWRlcnMgOiB0aGlzLl94aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCksXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA6IHRoaXMuX29wdGlvbnMsXG4gICAgICAgICAgICAgICAgY2FuY2VsZWQgOiB0aGlzLl9jYW5jZWxlZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3BhcnNlUmVzcG9uc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFjY2VwdCA9ICB0aGlzLl9vcHRpb25zLmhlYWRlcnMgJiYgdGhpcy5fb3B0aW9ucy5oZWFkZXJzLkFjY2VwdDtcbiAgICAgICAgICAgIGlmICghYWNjZXB0KSB7XG4gICAgICAgICAgICAgICAgYWNjZXB0ID0gdGhpcy5feGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGE7XG5cbiAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc0Z1bmN0aW9uKHRoaXMuX29wdGlvbnMuc2VyaWFsaXplcikpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fb3B0aW9ucy5wYXJzZXIodGhpcy5feGhyKSwgYWNjZXB0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaCh0aGlzLl9vcHRpb25zLnBhcnNlciwgZnVuY3Rpb24ocGFyc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBwYXJzZXIodGhpcy5feGhyLCBhY2NlcHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuXG5cbnZhciBKc29ucFJlcXVlc3QgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJZCA9IFwiUmVjdXJ2ZUpzb25QQ2FsbGJhY2tcIiArIHRoaXMuX2lkO1xuICAgICAgICAgICAgdmFyIHVybCA9IFN0cmluZ1V0aWxzLnJlbW92ZVBhcmFtZXRlckZyb21VcmwodGhpcy5fb3B0aW9ucy51cmwsIFwiY2FsbGJhY2tcIik7XG4gICAgICAgICAgICB1cmwgPSBTdHJpbmdVdGlscy5hZGRQYXJhbWV0ZXJzVG9VcmwodXJsLCB7Y2FsbGJhY2s6IGNhbGxiYWNrSWR9KTtcblxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gdXJsO1xuICAgICAgICAgICAgc2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgICAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcblxuICAgICAgICAgICAgdmFyIGNhbGxlZDtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbGJhY2tIYW5kbGVyKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuX2NhbmNlbGVkICYmIHRoYXQuX29wdGlvbnMuZXJyb3JPbkNhbmNlbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY29tcGxldGUodHJ1ZSwgZGF0YSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRFcnJvckhhbmRsZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB3aW5kb3dbY2FsbGJhY2tJZF07XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQgJiYgXCJsb2FkXCIgPT09IGV2ZW50LnR5cGUgJiYgIWNhbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jb21wbGV0ZShmYWxzZSwgbnVsbCwgNDA0LCBcImpzb25wIGNhbGxiYWNrIG5vdCBjYWxsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuXG4gICAgICAgICAgICB3aW5kb3dbY2FsbGJhY2tJZF0gPSBjYWxsYmFja0hhbmRsZXI7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jb21wbGV0ZTogZnVuY3Rpb24oc3VjY2VzcywgZGF0YSwgc3RhdHVzLCBzdGF0dXNUZXh0KSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiBzdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMuX29wdGlvbnMsXG4gICAgICAgICAgICAgICAgY2FuY2VsZWQ6IHRoaXMuX2NhbmNlbGVkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbl0pO1xuXG52YXIgQ3Jvc3NEb21haW5TY3JpcHRSZXF1ZXN0ID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKG9wdGlvbnMsIGRlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLl9kZWZlcnJlZCA9IGRlZmVycmVkO1xuICAgICAgICB0aGlzLl9pZCA9IHJlcXVlc3RJZCsrO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gdGhpcy5fb3B0aW9ucy51cmw7XG4gICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRFcnJvckhhbmRsZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmIChldmVudCAmJiBcImVycm9yXCIgPT09IGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fZGVmZXJyZWQucmVqZWN0KHtzdGF0dXM6IDQwNCwgY2FuY2VsZWQ6IHRoYXQuX2NhbmNlbGVkfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9kZWZlcnJlZC5yZXNvbHZlKHtzdGF0dXM6IDIwMCwgY2FuY2VsZWQ6IHRoYXQuX2NhbmNlbGVkfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FuY2VsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi9yZWN1cnZlLXByb3RvLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGRlYnVnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS5kZWJ1Zykge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5kZWJ1Zy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICB3YXJuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZSAmJiBjb25zb2xlLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9XG5dKTtcbiIsIi8vKGZ1bmN0aW9uKCkge1xuLy8gICAgXCJ1c2Ugc3RyaWN0XCI7XG4vL1xuLy8gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuLy9cbi8vICAgIFJlY3VydmUuTG9nID0gUmVjdXJ2ZS5Qcm90by5kZWZpbmUoW1xuLy9cbi8vICAgICAgICAvKipcbi8vICAgICAgICAgKlxuLy8gICAgICAgICAqIEBwYXJhbSB0YXJnZXRzLCBhcnJheSBvZiB0YXJnZXRzIHRvIGxvZyB0byAoc2VlIFJlY3VydmUuTG9nQ29uc29sZVRhcmdldCBhcyBleGFtcGxlKS5cbi8vICAgICAgICAgKiBEZWZhdWx0cyB0byBSZWN1cnZlLkxvZ0NvbnNvbGVUYXJnZXRcbi8vICAgICAgICAgKiBAcGFyYW0gZW5hYmxlZCwgZGVmYXVsdCB0cnVlXG4vLyAgICAgICAgICovXG4vLyAgICAgICAgZnVuY3Rpb24gY3RvcihlbmFibGVkLCB0YXJnZXRzKSB7XG4vLyAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IGVuYWJsZWQpIHtcbi8vICAgICAgICAgICAgICAgIGVuYWJsZWQgPSB0cnVlO1xuLy8gICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB0YXJnZXRzKSB7XG4vLyAgICAgICAgICAgICAgICB0YXJnZXRzID0gW25ldyBSZWN1cnZlLkxvZ0NvbnNvbGVUYXJnZXQoKV07XG4vLyAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgIHRoaXMudGFyZ2V0cyA9IHRhcmdldHM7XG4vLyAgICAgICAgICAgIHRoaXMuZGlzYWJsZSghZW5hYmxlZCk7XG4vLyAgICAgICAgfSxcbi8vXG4vLyAgICAgICAge1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogTG9nIGluZm8gdG8gYWxsIHRhcmdldHNcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICogQHBhcmFtIG1lc3NhZ2Vcbi8vICAgICAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4vLyAgICAgICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgaW5mbzogZnVuY3Rpb24obWVzc2FnZSkge1xuLy8gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2luZm9EaXNhYmxlZCkge1xuLy8gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9sb2coXCJpbmZvXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogTG9nIGRlYnVnIHRvIGFsbCB0YXJnZXRzXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuLy8gICAgICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIGRlYnVnOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVidWdEaXNhYmxlZCkge1xuLy8gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9sb2coXCJkZWJ1Z1wiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIExvZyB3YXJuaW5nIHRvIGFsbCB0YXJnZXRzXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuLy8gICAgICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIHdhcm46IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbi8vICAgICAgICAgICAgICAgIGlmICh0aGlzLl93YXJuRGlzYWJsZWQpIHtcbi8vICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fbG9nKFwid2FyblwiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIExvZyBlcnJvciB0byBhbGwgdGFyZ2V0c1xuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2Zcbi8vICAgICAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24obWVzc2FnZSkge1xuLy8gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Vycm9yRGlzYWJsZWQpIHtcbi8vICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fbG9nKFwiZXJyb3JcIiwgbWVzc2FnZSwgYXJndW1lbnRzKTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBDbGVhciBsb2cgZm9yIGFsbCB0YXJnZXRzXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy50YXJnZXRzLmxlbmd0aDsgaW5kZXgrKykge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpbmRleF0uY2xlYXIoKTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1Z0Rpc2FibGVkID0gdmFsdWU7XG4vLyAgICAgICAgICAgICAgICB0aGlzLl9pbmZvRGlzYWJsZWQgPSB2YWx1ZTtcbi8vICAgICAgICAgICAgICAgIHRoaXMuX3dhcm5EaXNhYmxlZCA9IHZhbHVlO1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JEaXNhYmxlZCA9IHZhbHVlO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgZGVidWdEaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuLy8gICAgICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fZGVidWdEaXNhYmxlZCA9IHZhbHVlO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgaW5mb0Rpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9pbmZvRGlzYWJsZWQgPSB2YWx1ZTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIHdhcm5EaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuLy8gICAgICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fd2FybkRpc2FibGVkID0gdmFsdWU7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBlcnJvckRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9lcnJvckRpc2FibGVkID0gdmFsdWU7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBfbG9nOiBmdW5jdGlvbih0eXBlLCBtZXNzYWdlLCBhcmdzKSB7XG4vLyAgICAgICAgICAgICAgICBhcmdzID0gUmVjdXJ2ZS5BcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJncywgMSk7XG4vLyAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLl9kZXNjcmlwdGlvbih0eXBlLnRvVXBwZXJDYXNlKCkpO1xuLy9cbi8vICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnRhcmdldHMubGVuZ3RoOyBpbmRleCsrKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzW2luZGV4XVt0eXBlXS5hcHBseSh0aGlzLnRhcmdldHNbaW5kZXhdLCBbZGVzY3JpcHRpb24sIG1lc3NhZ2VdLmNvbmNhdChhcmdzKSk7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBfZGVzY3JpcHRpb246IGZ1bmN0aW9uKHR5cGUpIHtcbi8vICAgICAgICAgICAgICAgIHZhciB0aW1lID0gUmVjdXJ2ZS5TdHJpbmdVdGlscy5mb3JtYXRUaW1lKG5ldyBEYXRlKCkpO1xuLy8gICAgICAgICAgICAgICAgcmV0dXJuIFwiW1wiICsgdHlwZSArIFwiXSBcIiArIHRpbWU7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vL1xuLy8gICAgXSk7XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBMb2cgdGFyZ2V0IGZvciBSZWN1cnZlLkxvZ1xuLy8gICAgICogSGFuZGxlcyBicm93c2VycyB0aGF0IGRvIG5vdCBzdXBwb3J0IGNvbnNvbGUgb3IgaGF2ZSBsaW1pdGVkIGNvbnNvbGUgc3VwcG9ydCAoaS5lLiBvbmx5IHN1cHBvcnQgY29uc29sZS5sb2cpXG4vLyAgICAgKlxuLy8gICAgICovXG4vLyAgICBSZWN1cnZlLkxvZ0NvbnNvbGVUYXJnZXQgPSBSZWN1cnZlLlByb3RvLmRlZmluZShbXG4vLyAgICAgICAge1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICogQHBhcmFtIG1lc3NhZ2Vcbi8vICAgICAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4vLyAgICAgICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgaW5mbzogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICogQHBhcmFtIG1lc3NhZ2Vcbi8vICAgICAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4vLyAgICAgICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgZGVidWc6IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLmRlYnVnKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2Zcbi8vICAgICAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICB3YXJuOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS53YXJuKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuLy8gICAgICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS5lcnJvcikge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5mby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuLy8gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUuY2xlYXIoKTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vICAgIF0pO1xuLy9cbi8vfSkoKTtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3JlY3VydmUtcHJvdG8uanNcIik7XG52YXIgQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtYXJyYXkuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLXN0cmluZy5qc1wiKTtcbnZhciBMb2dUYXJnZXQgPSByZXF1aXJlKFwiLi9yZWN1cnZlLWxvZy1jb25zb2xlLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0YXJnZXRzLCBhcnJheSBvZiB0YXJnZXRzIHRvIGxvZyB0byAoc2VlIFJlY3VydmUuTG9nQ29uc29sZVRhcmdldCBhcyBleGFtcGxlKS5cbiAgICAgKiBEZWZhdWx0cyB0byBSZWN1cnZlLkxvZ0NvbnNvbGVUYXJnZXRcbiAgICAgKiBAcGFyYW0gZW5hYmxlZCwgZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGN0b3IoZW5hYmxlZCwgdGFyZ2V0cykge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBlbmFibGVkKSB7XG4gICAgICAgICAgICBlbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHRhcmdldHMpIHtcbiAgICAgICAgICAgIHRhcmdldHMgPSBbbmV3IExvZ1RhcmdldCgpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IHRhcmdldHM7XG4gICAgICAgIHRoaXMuZGlzYWJsZSghZW5hYmxlZCk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZyBpbmZvIHRvIGFsbCB0YXJnZXRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGluZm86IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbmZvRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcImluZm9cIiwgbWVzc2FnZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9nIGRlYnVnIHRvIGFsbCB0YXJnZXRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGRlYnVnOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGVidWdEaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiZGVidWdcIiwgbWVzc2FnZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9nIHdhcm5pbmcgdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgd2FybjogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3dhcm5EaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwid2FyblwiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2cgZXJyb3IgdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9lcnJvckRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJlcnJvclwiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGVhciBsb2cgZm9yIGFsbCB0YXJnZXRzXG4gICAgICAgICAqL1xuICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy50YXJnZXRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpbmRleF0uY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2RlYnVnRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2luZm9EaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fd2FybkRpc2FibGVkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9lcnJvckRpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWdEaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2RlYnVnRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBpbmZvRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9pbmZvRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICB3YXJuRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl93YXJuRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBlcnJvckRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZXJyb3JEaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9sb2c6IGZ1bmN0aW9uKHR5cGUsIG1lc3NhZ2UsIGFyZ3MpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJncywgMSk7XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLl9kZXNjcmlwdGlvbih0eXBlLnRvVXBwZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy50YXJnZXRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpbmRleF1bdHlwZV0uYXBwbHkodGhpcy50YXJnZXRzW2luZGV4XSwgW2Rlc2NyaXB0aW9uLCBtZXNzYWdlXS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9kZXNjcmlwdGlvbjogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAgICAgdmFyIHRpbWUgPSBTdHJpbmdVdGlscy5mb3JtYXRUaW1lKG5ldyBEYXRlKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFwiW1wiICsgdHlwZSArIFwiXSBcIiArIHRpbWU7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCIvKlxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuXG4gICAgdmFyIGJpbmRDdG9yID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIFJlY3VydmUuT2JqZWN0VXRpbHMgPVxuICAgIHtcbiAgICAgICAgZm9yRWFjaDogZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvYmouZm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gT2JqZWN0LmZvckVhY2gpIHtcbiAgICAgICAgICAgICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChSZWN1cnZlLk9iamVjdFV0aWxzLmlzQXJyYXkob2JqKSAmJiBvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IG9iai5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZhbHNlID09PSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpbmRleF0sIGluZGV4LCBvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IFJlY3VydmUuT2JqZWN0VXRpbHMua2V5cyhvYmopO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBrZXlzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleXNbaW5kZXhdXSwga2V5c1tpbmRleF0sIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAga2V5czogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICBpZiAoIVJlY3VydmUuT2JqZWN0VXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBrZXlzID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgfVxuXG4gICAgICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZyB8fCBcInN0cmluZ1wiID09IHR5cGVvZiB2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNFcnJvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEVycm9yO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzT2JqZWN0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBPYmplY3QodmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBcnJheTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEYXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0ZpbGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJbb2JqZWN0IEZpbGVdXCIgPT09IFN0cmluZyhkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBiaW5kOiBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBCYXNlZCBoZWF2aWx5IG9uIHVuZGVyc2NvcmUvZmlyZWZveCBpbXBsZW1lbnRhdGlvbi4gVE9ETyBUQkQgbWFrZSB1bmRlcnNjb3JlLmpzIGRlcGVuZGVuY3kgb2ZcbiAgICAgICAgICAgIC8vIHRoaXMgbGlicmFyeSBpbnN0ZWFkP1xuXG4gICAgICAgICAgICBpZiAoIVJlY3VydmUuT2JqZWN0VXRpbHMuaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmFwcGx5KGZ1bmMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG5cbiAgICAgICAgICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJpbmRDdG9yLnByb3RvdHlwZSA9IGZ1bmMucHJvdG90eXBlO1xuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gbmV3IGJpbmRDdG9yKCk7XG4gICAgICAgICAgICAgICAgYmluZEN0b3IucHJvdG90eXBlID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoYXQsIGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dGVuZDogZnVuY3Rpb24oZGVzdCwgc3JjKSB7XG4gICAgICAgICAgICBpZiAoIXNyYykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICAgICAgZGVzdFtrZXldID0gc3JjW2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkZXN0O1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvSnNvbjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICBpZiAoIVJlY3VydmUuT2JqZWN0VXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBhbiBvYmplY3QgdG8gY29udmVydCB0byBKU09OXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmcm9tSnNvbjogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICBpZiAoIXN0cikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvRm9ybURhdGE6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgICAgICAgICBSZWN1cnZlLk9iamVjdFV0aWxzLmZvckVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXMuam9pbihcIiZcIik7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbn0pKCk7XG4qL1xuXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZm9yRWFjaDogZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9iai5mb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBPYmplY3QuZm9yRWFjaCkge1xuICAgICAgICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaXNBcnJheShvYmopICYmIG9iai5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBvYmoubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZhbHNlID09PSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpbmRleF0sIGluZGV4LCBvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIga2V5cyA9IHRoaXMua2V5cyhvYmopO1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZhbHNlID09PSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXlzW2luZGV4XV0sIGtleXNbaW5kZXhdLCBvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9LFxuXG4gICAga2V5czogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGlmICghdGhpcy5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleXMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG5cbiAgICBpc1N0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZyB8fCBcInN0cmluZ1wiID09IHR5cGVvZiB2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzRXJyb3I6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEVycm9yO1xuICAgIH0sXG5cbiAgICBpc09iamVjdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBPYmplY3QodmFsdWUpO1xuICAgIH0sXG5cbiAgICBpc0FycmF5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBcnJheTtcbiAgICB9LFxuXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgdmFsdWU7XG4gICAgfSxcblxuICAgIGlzRGF0ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9LFxuXG4gICAgaXNGaWxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gXCJbb2JqZWN0IEZpbGVdXCIgPT09IFN0cmluZyhkYXRhKTtcbiAgICB9LFxuXG4gICAgYmluZDogZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgICAgICAvLyBCYXNlZCBoZWF2aWx5IG9uIHVuZGVyc2NvcmUvZmlyZWZveCBpbXBsZW1lbnRhdGlvbi5cblxuICAgICAgICBpZiAoIXRoaXMuaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoZnVuYywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG5cbiAgICAgICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYm91bmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiaW5kQ3Rvci5wcm90b3R5cGUgPSBmdW5jLnByb3RvdHlwZTtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gbmV3IGJpbmRDdG9yKCk7XG4gICAgICAgICAgICBiaW5kQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGF0LCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBib3VuZDtcbiAgICB9LFxuXG4gICAgZXh0ZW5kOiBmdW5jdGlvbihkZXN0LCBzcmMpIHtcbiAgICAgICAgaWYgKCFzcmMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoa2V5IGluIHNyYykge1xuICAgICAgICAgICAgZGVzdFtrZXldID0gc3JjW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9LFxuXG4gICAgdG9Kc29uOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBhbiBvYmplY3QgdG8gY29udmVydCB0byBKU09OXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgfSxcblxuICAgIGZyb21Kc29uOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyKTtcbiAgICB9LFxuXG4gICAgdG9Gb3JtRGF0YTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcblxuICAgICAgICB0aGlzLmZvckVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZXMuam9pbihcIiZcIik7XG4gICAgfVxufTtcblxuIiwiLy8oZnVuY3Rpb24oKSB7XG4vLyAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlID0gd2luZG93LlJlY3VydmUgfHwge307XG4vL1xuLy8gICAgdmFyIGRvbnRJbnZva2VDb25zdHJ1Y3RvciA9IHt9O1xuLy9cbi8vICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbi8vICAgICAgICByZXR1cm4gdmFsdWUgJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiB2YWx1ZTtcbi8vICAgIH1cbi8vXG4vLyAgICBSZWN1cnZlLlByb3RvID0gZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgLy8gZG8gbm90aGluZ1xuLy8gICAgfTtcbi8vXG4vLyAgICAvKipcbi8vICAgICAqIENyZWF0ZSBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgb2JqZWN0XG4vLyAgICAgKlxuLy8gICAgICogQHBhcmFtIG9wdGlvbnMgICBhcnJheSBjb25zaXN0aW5nIG9mIGNvbnN0cnVjdG9yLCBwcm90b3R5cGUvXCJtZW1iZXJcIiB2YXJpYWJsZXMvZnVuY3Rpb25zLFxuLy8gICAgICogICAgICAgICAgICAgICAgICBhbmQgbmFtZXNwYWNlL1wic3RhdGljXCIgdmFyaWFibGVzL2Z1bmN0aW9uXG4vLyAgICAgKi9cbi8vICAgIFJlY3VydmUuUHJvdG8uZGVmaW5lID0gZnVuY3Rpb24ob3B0aW9ucykge1xuLy8gICAgICAgIGlmICghb3B0aW9ucyB8fCAwID09PSBvcHRpb25zLmxlbmd0aCkge1xuLy8gICAgICAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIHZhciBwb3NzaWJsZUNvbnN0cnVjdG9yID0gb3B0aW9uc1swXTtcbi8vXG4vLyAgICAgICAgdmFyIHByb3BlcnRpZXM7XG4vLyAgICAgICAgdmFyIHN0YXRpY1Byb3BlcnRpZXM7XG4vL1xuLy8gICAgICAgIGlmIChpc0Z1bmN0aW9uKHBvc3NpYmxlQ29uc3RydWN0b3IpKSB7XG4vLyAgICAgICAgICAgIHByb3BlcnRpZXMgPSAxIDwgb3B0aW9ucy5sZW5ndGggPyBvcHRpb25zWzFdIDoge307XG4vLyAgICAgICAgICAgIHByb3BlcnRpZXNbIFwiJGN0b3JcIiBdID0gcG9zc2libGVDb25zdHJ1Y3Rvcjtcbi8vXG4vLyAgICAgICAgICAgIHN0YXRpY1Byb3BlcnRpZXMgPSBvcHRpb25zWzJdO1xuLy8gICAgICAgIH1cbi8vICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgcHJvcGVydGllcyA9IG9wdGlvbnNbMF07XG4vLyAgICAgICAgICAgIHN0YXRpY1Byb3BlcnRpZXMgPSBvcHRpb25zWzFdO1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgZnVuY3Rpb24gUHJvdG9PYmoocGFyYW0pXG4vLyAgICAgICAge1xuLy8gICAgICAgICAgICBpZiAoZG9udEludm9rZUNvbnN0cnVjdG9yICE9IHBhcmFtICYmXG4vLyAgICAgICAgICAgICAgICBpc0Z1bmN0aW9uKHRoaXMuJGN0b3IpKSB7XG4vLyAgICAgICAgICAgICAgICB0aGlzLiRjdG9yLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH07XG4vL1xuLy8gICAgICAgIFByb3RvT2JqLnByb3RvdHlwZSA9IG5ldyB0aGlzKGRvbnRJbnZva2VDb25zdHJ1Y3Rvcik7XG4vL1xuLy8gICAgICAgIC8vIFByb3RvdHlwZS9cIm1lbWJlclwiIHByb3BlcnRpZXNcbi8vICAgICAgICBmb3IgKGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4vLyAgICAgICAgICAgIGFkZFByb3RvUHJvcGVydHkoa2V5LCBwcm9wZXJ0aWVzW2tleV0sIFByb3RvT2JqLnByb3RvdHlwZVtrZXldKTtcbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIGZ1bmN0aW9uIGFkZFByb3RvUHJvcGVydHkoa2V5LCBwcm9wZXJ0eSwgc3VwZXJQcm9wZXJ0eSlcbi8vICAgICAgICB7XG4vLyAgICAgICAgICAgIGlmICghaXNGdW5jdGlvbihwcm9wZXJ0eSkgfHxcbi8vICAgICAgICAgICAgICAgICFpc0Z1bmN0aW9uKHN1cGVyUHJvcGVydHkpKSB7XG4vLyAgICAgICAgICAgICAgICBQcm90b09iai5wcm90b3R5cGVba2V5XSA9IHByb3BlcnR5O1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgICAgIGVsc2Vcbi8vICAgICAgICAgICAge1xuLy8gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGZ1bmN0aW9uIHdpdGggcmVmIHRvIGJhc2UgbWV0aG9kXG4vLyAgICAgICAgICAgICAgICBQcm90b09iai5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uKClcbi8vICAgICAgICAgICAgICAgIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IHN1cGVyUHJvcGVydHk7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgfVxuLy9cbi8vICAgICAgICBQcm90b09iai5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQcm90b09iajtcbi8vXG4vLyAgICAgICAgLy8gTmFtZXNwYWNlZC9cIlN0YXRpY1wiIHByb3BlcnRpZXNcbi8vICAgICAgICBQcm90b09iai5leHRlbmQgPSB0aGlzLmV4dGVuZCB8fCB0aGlzLmRlZmluZTtcbi8vICAgICAgICBQcm90b09iai5taXhpbiA9IHRoaXMubWl4aW47XG4vL1xuLy8gICAgICAgIGZvciAoa2V5IGluIHN0YXRpY1Byb3BlcnRpZXMpXG4vLyAgICAgICAge1xuLy8gICAgICAgICAgICBQcm90b09ialtrZXldID0gc3RhdGljUHJvcGVydGllc1trZXldO1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgcmV0dXJuIFByb3RvT2JqO1xuLy8gICAgfTtcbi8vXG4vLyAgICAvKipcbi8vICAgICAqIE1peGluIGEgc2V0IG9mIHZhcmlhYmxlcy9mdW5jdGlvbnMgYXMgcHJvdG90eXBlcyBmb3IgdGhpcyBvYmplY3QuIEFueSB2YXJpYWJsZXMvZnVuY3Rpb25zXG4vLyAgICAgKiB0aGF0IGFscmVhZHkgZXhpc3Qgd2l0aCB0aGUgc2FtZSBuYW1lIHdpbGwgYmUgb3ZlcnJpZGRlbi5cbi8vICAgICAqXG4vLyAgICAgKiBAcGFyYW0gcHJvcGVydGllcyAgICB2YXJpYWJsZXMvZnVuY3Rpb25zIHRvIG1peGluIHdpdGggdGhpcyBvYmplY3Rcbi8vICAgICAqL1xuLy8gICAgUmVjdXJ2ZS5Qcm90by5taXhpbiA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbi8vICAgICAgICBSZWN1cnZlLlByb3RvLm1peGluV2l0aCh0aGlzLCBwcm9wZXJ0aWVzKTtcbi8vICAgIH07XG4vL1xuLy8gICAgLyoqXG4vLyAgICAgKiBNaXhpbiBhIHNldCBvZiB2YXJpYWJsZXMvZnVuY3Rpb25zIGFzIHByb3RvdHlwZXMgZm9yIHRoZSBvYmplY3QuIEFueSB2YXJpYWJsZXMvZnVuY3Rpb25zXG4vLyAgICAgKiB0aGF0IGFscmVhZHkgZXhpc3Qgd2l0aCB0aGUgc2FtZSBuYW1lIHdpbGwgYmUgb3ZlcnJpZGRlbi5cbi8vICAgICAqXG4vLyAgICAgKiBAcGFyYW0gcHJvcGVydGllcyAgICB2YXJpYWJsZXMvZnVuY3Rpb25zIHRvIG1peGluIHdpdGggdGhpcyBvYmplY3Rcbi8vICAgICAqL1xuLy8gICAgUmVjdXJ2ZS5Qcm90by5taXhpbldpdGggPSBmdW5jdGlvbihvYmosIHByb3BlcnRpZXMpIHtcbi8vICAgICAgICBmb3IgKGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4vLyAgICAgICAgICAgIG9iai5wcm90b3R5cGVba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbi8vICAgICAgICB9XG4vLyAgICB9O1xuLy99KSgpO1xuXG52YXIgZG9udEludm9rZUNvbnN0cnVjdG9yID0ge307XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiB2YWx1ZTtcbn1cblxudmFyIFByb3RvID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gZG8gbm90aGluZ1xufTtcblxuLyoqXG4gKiBDcmVhdGUgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIG9iamVjdFxuICpcbiAqIEBwYXJhbSBvcHRpb25zICAgYXJyYXkgY29uc2lzdGluZyBvZiBjb25zdHJ1Y3RvciwgcHJvdG90eXBlL1wibWVtYmVyXCIgdmFyaWFibGVzL2Z1bmN0aW9ucyxcbiAqICAgICAgICAgICAgICAgICAgYW5kIG5hbWVzcGFjZS9cInN0YXRpY1wiIHZhcmlhYmxlcy9mdW5jdGlvblxuICovXG5Qcm90by5kZWZpbmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zIHx8IDAgPT09IG9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBwb3NzaWJsZUNvbnN0cnVjdG9yID0gb3B0aW9uc1swXTtcblxuICAgIHZhciBwcm9wZXJ0aWVzO1xuICAgIHZhciBzdGF0aWNQcm9wZXJ0aWVzO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24ocG9zc2libGVDb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgcHJvcGVydGllcyA9IDEgPCBvcHRpb25zLmxlbmd0aCA/IG9wdGlvbnNbMV0gOiB7fTtcbiAgICAgICAgcHJvcGVydGllc1sgXCIkY3RvclwiIF0gPSBwb3NzaWJsZUNvbnN0cnVjdG9yO1xuXG4gICAgICAgIHN0YXRpY1Byb3BlcnRpZXMgPSBvcHRpb25zWzJdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcHJvcGVydGllcyA9IG9wdGlvbnNbMF07XG4gICAgICAgIHN0YXRpY1Byb3BlcnRpZXMgPSBvcHRpb25zWzFdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFByb3RvT2JqKHBhcmFtKVxuICAgIHtcbiAgICAgICAgaWYgKGRvbnRJbnZva2VDb25zdHJ1Y3RvciAhPSBwYXJhbSAmJlxuICAgICAgICAgICAgaXNGdW5jdGlvbih0aGlzLiRjdG9yKSkge1xuICAgICAgICAgICAgdGhpcy4kY3Rvci5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQcm90b09iai5wcm90b3R5cGUgPSBuZXcgdGhpcyhkb250SW52b2tlQ29uc3RydWN0b3IpO1xuXG4gICAgLy8gUHJvdG90eXBlL1wibWVtYmVyXCIgcHJvcGVydGllc1xuICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnRpZXNba2V5XSwgUHJvdG9PYmoucHJvdG90eXBlW2tleV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFByb3RvUHJvcGVydHkoa2V5LCBwcm9wZXJ0eSwgc3VwZXJQcm9wZXJ0eSlcbiAgICB7XG4gICAgICAgIGlmICghaXNGdW5jdGlvbihwcm9wZXJ0eSkgfHxcbiAgICAgICAgICAgICFpc0Z1bmN0aW9uKHN1cGVyUHJvcGVydHkpKSB7XG4gICAgICAgICAgICBQcm90b09iai5wcm90b3R5cGVba2V5XSA9IHByb3BlcnR5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGZ1bmN0aW9uIHdpdGggcmVmIHRvIGJhc2UgbWV0aG9kXG4gICAgICAgICAgICBQcm90b09iai5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IHN1cGVyUHJvcGVydHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUHJvdG9PYmoucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHJvdG9PYmo7XG5cbiAgICAvLyBOYW1lc3BhY2VkL1wiU3RhdGljXCIgcHJvcGVydGllc1xuICAgIFByb3RvT2JqLmV4dGVuZCA9IHRoaXMuZXh0ZW5kIHx8IHRoaXMuZGVmaW5lO1xuICAgIFByb3RvT2JqLm1peGluID0gdGhpcy5taXhpbjtcblxuICAgIGZvciAoa2V5IGluIHN0YXRpY1Byb3BlcnRpZXMpXG4gICAge1xuICAgICAgICBQcm90b09ialtrZXldID0gc3RhdGljUHJvcGVydGllc1trZXldO1xuICAgIH1cblxuICAgIHJldHVybiBQcm90b09iajtcbn07XG5cbi8qKlxuICogTWl4aW4gYSBzZXQgb2YgdmFyaWFibGVzL2Z1bmN0aW9ucyBhcyBwcm90b3R5cGVzIGZvciB0aGlzIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbiAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuICovXG5Qcm90by5taXhpbiA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbiAgICBQcm90by5taXhpbldpdGgodGhpcywgcHJvcGVydGllcyk7XG59O1xuXG4vKipcbiAqIE1peGluIGEgc2V0IG9mIHZhcmlhYmxlcy9mdW5jdGlvbnMgYXMgcHJvdG90eXBlcyBmb3IgdGhlIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbiAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuICovXG5Qcm90by5taXhpbldpdGggPSBmdW5jdGlvbihvYmosIHByb3BlcnRpZXMpIHtcbiAgICBmb3IgKGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIG9iai5wcm90b3R5cGVba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvOyIsIi8qXG4oZnVuY3Rpb24oKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBSZWN1cnZlID0gd2luZG93LlJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSB8fCB7fTtcblxuICAgIFJlY3VydmUuU2lnbmFsID0gUmVjdXJ2ZS5Qcm90by5kZWZpbmUoW1xuICAgICAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgYWRkOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lckV4aXN0cyhjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKG5ldyBTaWduYWxMaXN0ZW5lcihjYWxsYmFjaywgY29udGV4dCkpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgYWRkT25jZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJFeGlzdHMoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChuZXcgU2lnbmFsTGlzdGVuZXIoY2FsbGJhY2ssIGNvbnRleHQsIHRydWUpKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zc2libGVMaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9zc2libGVMaXN0ZW5lci5pc1NhbWVDb250ZXh0KGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBvc3NpYmxlTGlzdGVuZXIuaXNTYW1lKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAtIG5vIG1hdGNoXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlY3VydmUuQXJyYXlVdGlscy5yZW1vdmVBdCh0aGlzLl9saXN0ZW5lcnMsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgb25lIG1hdGNoIGlmIGNhbGxiYWNrIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgcmVtb3ZlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoIC0gMTsgMCA8PSBpbmRleDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLnRyaWdnZXIoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25seU9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlY3VydmUuQXJyYXlVdGlscy5yZW1vdmVBdCh0aGlzLl9saXN0ZW5lcnMsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIF9saXN0ZW5lckV4aXN0czogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGggLSAxOyAwIDw9IGluZGV4OyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLmlzU2FtZShjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSk7XG5cbiAgICB2YXIgU2lnbmFsTGlzdGVuZXIgPSBSZWN1cnZlLlByb3RvLmRlZmluZShbXG4gICAgICAgIGZ1bmN0aW9uIGN0b3IoY2FsbGJhY2ssIGNvbnRleHQsIG9ubHlPbmNlKSB7XG4gICAgICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICB0aGlzLm9ubHlPbmNlID0gb25seU9uY2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgICAgaXNTYW1lOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FsbGJhY2sgPT09IGNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjayA9PT0gY2FsbGJhY2sgJiYgdGhpcy5fY29udGV4dCA9PT0gY29udGV4dDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGlzU2FtZUNvbnRleHQ6IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dCA9PT0gY29udGV4dDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5hcHBseSh0aGlzLl9jb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF0pO1xuXG59KSgpO1xuKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3JlY3VydmUtcHJvdG8uanNcIik7XG52YXIgQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtYXJyYXkuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJFeGlzdHMoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChuZXcgU2lnbmFsTGlzdGVuZXIoY2FsbGJhY2ssIGNvbnRleHQpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRPbmNlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyRXhpc3RzKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobmV3IFNpZ25hbExpc3RlbmVyKGNhbGxiYWNrLCBjb250ZXh0LCB0cnVlKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zc2libGVMaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zc2libGVMaXN0ZW5lci5pc1NhbWVDb250ZXh0KGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocG9zc2libGVMaXN0ZW5lci5pc1NhbWUoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBubyBtYXRjaFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBBcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbiBvbmx5IGJlIG9uZSBtYXRjaCBpZiBjYWxsYmFjayBzcGVjaWZpZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGggLSAxOyAwIDw9IGluZGV4OyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnRyaWdnZXIoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmx5T25jZSkge1xuICAgICAgICAgICAgICAgICAgICBBcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBfbGlzdGVuZXJFeGlzdHM6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGggLSAxOyAwIDw9IGluZGV4OyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5pc1NhbWUoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG5cbnZhciBTaWduYWxMaXN0ZW5lciA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcihjYWxsYmFjaywgY29udGV4dCwgb25seU9uY2UpIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMub25seU9uY2UgPSBvbmx5T25jZTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBpc1NhbWU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FsbGJhY2sgPT09IGNhbGxiYWNrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FsbGJhY2sgPT09IGNhbGxiYWNrICYmIHRoaXMuX2NvbnRleHQgPT09IGNvbnRleHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNTYW1lQ29udGV4dDogZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQgPT09IGNvbnRleHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2suYXBwbHkodGhpcy5fY29udGV4dCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCIvKihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBSZWN1cnZlID0gd2luZG93LlJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSB8fCB7fTtcblxuICAgIFJlY3VydmUuU3RyaW5nVXRpbHMgPVxuICAgIHtcbiAgICAgICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VhcmNoID0gXCJ7XCIgKyBpbmRleCArIFwifVwiO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShzZWFyY2gsIGFyZ3VtZW50c1tpbmRleF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9ybWF0V2l0aFByb3BlcnRpZXM6IGZ1bmN0aW9uKHZhbHVlLCBmb3JtYXRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGZvcm1hdFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0UHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlYXJjaCA9IFwie1wiICsgcHJvcGVydHkgKyBcIn1cIjtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHNlYXJjaCwgZm9ybWF0UHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhZDogZnVuY3Rpb24oIHZhbHVlLCBwYWRDb3VudCwgcGFkVmFsdWUgKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSBwYWRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHBhZFZhbHVlID0gXCIwXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlID0gU3RyaW5nKCB2YWx1ZSApO1xuXG4gICAgICAgICAgICB3aGlsZSAodmFsdWUubGVuZ3RoIDwgcGFkQ291bnQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhZFZhbHVlICsgdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXRUaW1lOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSBkYXRlKSB7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBob3VycyA9IHRoaXMucGFkKGRhdGUuZ2V0SG91cnMoKSwgMik7XG4gICAgICAgICAgICB2YXIgbWludXRlcyA9IHRoaXMucGFkKGRhdGUuZ2V0TWludXRlcygpLCAyKTtcbiAgICAgICAgICAgIHZhciBzZWNvbmRzID0gdGhpcy5wYWQoZGF0ZS5nZXRTZWNvbmRzKCksIDIpO1xuICAgICAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMucGFkKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCksIDIpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQoXG4gICAgICAgICAgICAgICAgXCJ7MH06ezF9OnsyfTp7M31cIiwgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMsIG1pbGxpc2Vjb25kcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9ybWF0TW9udGhEYXlZZWFyOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICBpZiAoIWRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBhZCA9IFJlY3VydmUuU3RyaW5nVXRpbHMucGFkO1xuXG4gICAgICAgICAgICB2YXIgbW9udGggPSBwYWQoZGF0ZS5nZXRNb250aCgpICsgMSk7XG4gICAgICAgICAgICB2YXIgZGF5ID0gcGFkKGRhdGUuZ2V0RGF0ZSgpKTtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQoXG4gICAgICAgICAgICAgICAgXCJ7MH0vezF9L3syfVwiLCBtb250aCwgZGF5LCB5ZWFyKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXRZZWFyUmFuZ2U6IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChzdGFydCAmJiBlbmQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHN0YXJ0ICsgXCIgLSBcIiArIGVuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzdGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZW5kO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FwaXRhbGl6ZUZpcnN0Q2hhcmFjdGVyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgICsgdmFsdWUuc2xpY2UoMSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXJsTGFzdFBhdGg6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3BsaXQgPSB2YWx1ZS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICByZXR1cm4gMCA8IHNwbGl0Lmxlbmd0aCA/IHNwbGl0W3NwbGl0Lmxlbmd0aC0xXSA6IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFzVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgJiYgMCA8IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBsaW5lc09mOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVzO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsaW5lcyA9IHZhbHVlLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNFcXVhbDogZnVuY3Rpb24oc3RyLCB2YWx1ZSwgaWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgaWYgKCFzdHIgfHwgIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ciA9PSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzdHIgPT0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNFcXVhbElnbm9yZUNhc2U6IGZ1bmN0aW9uKHN0ciwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWN1cnZlLlN0cmluZ1V0aWxzLmlzRXF1YWwoc3RyLCB2YWx1ZSwgdHJ1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uKHN0ciwgdmFsdWUsIGlnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgIGlmICghc3RyIHx8ICF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHIgPT0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMCA8PSBzdHIuaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkUGFyYW1ldGVyc1RvVXJsOiBmdW5jdGlvbih1cmwsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgIGlmICghdXJsIHx8ICFwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc2VwZXJhdG9yID0gUmVjdXJ2ZS5TdHJpbmdVdGlscy5jb250YWlucyh1cmwsIFwiP1wiKSA/IFwiJlwiIDogXCI/XCI7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1ldGVyc1trZXldO1xuXG4gICAgICAgICAgICAgICAgaWYgKFJlY3VydmUuT2JqZWN0VXRpbHMuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChSZWN1cnZlLk9iamVjdFV0aWxzLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gUmVjdXJ2ZS5PYmplY3RVdGlscy50b0pzb24odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdXJsICs9IHNlcGVyYXRvciArICBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbWV0ZXJzW2tleV0pO1xuICAgICAgICAgICAgICAgIHNlcGVyYXRvciA9IFwiP1wiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZVBhcmFtZXRlckZyb21Vcmw6IGZ1bmN0aW9uKHVybCwgcGFyYW1ldGVyKSB7XG4gICAgICAgICAgICBpZiAoIXVybCB8fCAhcGFyYW1ldGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gcGFyYW1ldGVyICsgXCI9XCI7XG4gICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKHNlYXJjaCk7XG5cbiAgICAgICAgICAgIGlmICgtMSA9PT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbmRJbmRleCA9IHVybC5pbmRleE9mKFwiJlwiLCBzdGFydEluZGV4KTtcblxuICAgICAgICAgICAgaWYgKC0xIDwgZW5kSW5kZXgpIHtcbiAgICAgICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyKDAsIE1hdGgubWF4KHN0YXJ0SW5kZXggLSAxLCAwKSkgKyB1cmwuc3Vic3RyKGVuZEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgTWF0aC5tYXgoc3RhcnRJbmRleCAtIDEsIDApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG4qL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1vYmplY3QuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZvcm1hdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJndW1lbnRzKTtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHNlYXJjaCA9IFwie1wiICsgaW5kZXggKyBcIn1cIjtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShzZWFyY2gsIGFyZ3VtZW50c1tpbmRleF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBmb3JtYXRXaXRoUHJvcGVydGllczogZnVuY3Rpb24odmFsdWUsIGZvcm1hdFByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBmb3JtYXRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0UHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VhcmNoID0gXCJ7XCIgKyBwcm9wZXJ0eSArIFwifVwiO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShzZWFyY2gsIGZvcm1hdFByb3BlcnRpZXNbcHJvcGVydHldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgcGFkOiBmdW5jdGlvbiggdmFsdWUsIHBhZENvdW50LCBwYWRWYWx1ZSApIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gcGFkVmFsdWUpIHtcbiAgICAgICAgICAgIHBhZFZhbHVlID0gXCIwXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IFN0cmluZyggdmFsdWUgKTtcblxuICAgICAgICB3aGlsZSAodmFsdWUubGVuZ3RoIDwgcGFkQ291bnQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFkVmFsdWUgKyB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgZm9ybWF0VGltZTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBkYXRlKSB7XG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBob3VycyA9IHRoaXMucGFkKGRhdGUuZ2V0SG91cnMoKSwgMik7XG4gICAgICAgIHZhciBtaW51dGVzID0gdGhpcy5wYWQoZGF0ZS5nZXRNaW51dGVzKCksIDIpO1xuICAgICAgICB2YXIgc2Vjb25kcyA9IHRoaXMucGFkKGRhdGUuZ2V0U2Vjb25kcygpLCAyKTtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMucGFkKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCksIDIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChcbiAgICAgICAgICAgIFwiezB9OnsxfTp7Mn06ezN9XCIsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtaWxsaXNlY29uZHMpO1xuICAgIH0sXG5cbiAgICBmb3JtYXRNb250aERheVllYXI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgaWYgKCFkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtb250aCA9IHRoaXMucGFkKGRhdGUuZ2V0TW9udGgoKSArIDEpO1xuICAgICAgICB2YXIgZGF5ID0gdGhpcy5wYWQoZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQoXG4gICAgICAgICAgICBcInswfS97MX0vezJ9XCIsIG1vbnRoLCBkYXksIHllYXIpO1xuICAgIH0sXG5cbiAgICBmb3JtYXRZZWFyUmFuZ2U6IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gXCJcIjtcblxuICAgICAgICBpZiAoc3RhcnQgJiYgZW5kKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHN0YXJ0ICsgXCIgLSBcIiArIGVuZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdGFydCkge1xuICAgICAgICAgICAgdmFsdWUgPSBzdGFydDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gZW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplRmlyc3RDaGFyYWN0ZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICArIHZhbHVlLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICB1cmxMYXN0UGF0aDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNwbGl0ID0gdmFsdWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICByZXR1cm4gMCA8IHNwbGl0Lmxlbmd0aCA/IHNwbGl0W3NwbGl0Lmxlbmd0aC0xXSA6IG51bGw7XG4gICAgfSxcblxuICAgIGhhc1ZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgMCA8IHZhbHVlLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgbGluZXNPZjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFyIGxpbmVzO1xuXG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgbGluZXMgPSB2YWx1ZS5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5lcztcbiAgICB9LFxuXG4gICAgaXNFcXVhbDogZnVuY3Rpb24oc3RyLCB2YWx1ZSwgaWdub3JlQ2FzZSkge1xuICAgICAgICBpZiAoIXN0ciB8fCAhdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgPT0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RyID09IHZhbHVlO1xuICAgIH0sXG5cbiAgICBpc0VxdWFsSWdub3JlQ2FzZTogZnVuY3Rpb24oc3RyLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0VxdWFsKHN0ciwgdmFsdWUsIHRydWUpO1xuICAgIH0sXG5cbiAgICBjb250YWluczogZnVuY3Rpb24oc3RyLCB2YWx1ZSwgaWdub3JlQ2FzZSkge1xuICAgICAgICBpZiAoIXN0ciB8fCAhdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgPT0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMCA8PSBzdHIuaW5kZXhPZih2YWx1ZSk7XG4gICAgfSxcblxuICAgIGFkZFBhcmFtZXRlcnNUb1VybDogZnVuY3Rpb24odXJsLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIGlmICghdXJsIHx8ICFwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VwZXJhdG9yID0gdGhpcy5jb250YWlucyh1cmwsIFwiP1wiKSA/IFwiJlwiIDogXCI/XCI7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcmFtZXRlcnNba2V5XTtcblxuICAgICAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gT2JqZWN0VXRpbHMudG9Kc29uKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVybCArPSBzZXBlcmF0b3IgKyAgZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1ldGVyc1trZXldKTtcbiAgICAgICAgICAgIHNlcGVyYXRvciA9IFwiP1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9LFxuXG4gICAgcmVtb3ZlUGFyYW1ldGVyRnJvbVVybDogZnVuY3Rpb24odXJsLCBwYXJhbWV0ZXIpIHtcbiAgICAgICAgaWYgKCF1cmwgfHwgIXBhcmFtZXRlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlYXJjaCA9IHBhcmFtZXRlciArIFwiPVwiO1xuICAgICAgICB2YXIgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKHNlYXJjaCk7XG5cbiAgICAgICAgaWYgKC0xID09PSBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVuZEluZGV4ID0gdXJsLmluZGV4T2YoXCImXCIsIHN0YXJ0SW5kZXgpO1xuXG4gICAgICAgIGlmICgtMSA8IGVuZEluZGV4KSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyKDAsIE1hdGgubWF4KHN0YXJ0SW5kZXggLSAxLCAwKSkgKyB1cmwuc3Vic3RyKGVuZEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgTWF0aC5tYXgoc3RhcnRJbmRleCAtIDEsIDApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxufTtcblxuIiwiLyooZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlID0gd2luZG93LlJlY3VydmUgfHwge307XG5cbiAgICBSZWN1cnZlLldpbmRvd1V0aWxzID1cbiAgICB7XG4gICAgICAgIGlzRmlsZVByb3RvY29sOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBcImZpbGU6XCIgPT09IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICAgICAgfSxcblxuICAgICAgICBnbG9iYWxFdmFsOiBmdW5jdGlvbihzcmMpIHtcbiAgICAgICAgICAgIGlmICghc3JjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBodHRwczovL3dlYmxvZ3MuamF2YS5uZXQvYmxvZy9kcmlzY29sbC9hcmNoaXZlLzIwMDkvMDkvMDgvZXZhbC1qYXZhc2NyaXB0LWdsb2JhbC1jb250ZXh0XG4gICAgICAgICAgICBpZiAod2luZG93LmV4ZWNTY3JpcHQpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZXhlY1NjcmlwdChzcmMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5ldmFsLmNhbGwod2luZG93LnNyYyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jKCk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTsgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzICA9IHtcbiAgICBpc0ZpbGVQcm90b2NvbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBcImZpbGU6XCIgPT09IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICB9LFxuXG4gICAgZ2xvYmFsRXZhbDogZnVuY3Rpb24oc3JjKSB7XG4gICAgICAgIGlmICghc3JjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBodHRwczovL3dlYmxvZ3MuamF2YS5uZXQvYmxvZy9kcmlzY29sbC9hcmNoaXZlLzIwMDkvMDkvMDgvZXZhbC1qYXZhc2NyaXB0LWdsb2JhbC1jb250ZXh0XG4gICAgICAgIGlmICh3aW5kb3cuZXhlY1NjcmlwdCkge1xuICAgICAgICAgICAgd2luZG93LmV4ZWNTY3JpcHQoc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB3aW5kb3cuZXZhbC5jYWxsKHdpbmRvdy5zcmMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmMoKTtcbiAgICB9XG59Il19
