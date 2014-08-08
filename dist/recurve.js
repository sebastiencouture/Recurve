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
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13]);