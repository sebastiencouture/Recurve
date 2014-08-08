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
"use strict";

var ObjectUtils = require("./recurve-object.js");
var StringUtils = require("./recurve-string.js");
var DateUtils = require("./recurve-window.js");
var WindowUtils = require("./recurve-window.js");
var Signal = require("./recurve-signal.js");
var Proto = require("./recurve-proto.js");

var Http = {
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

        errorOnCancel: true,
        emulateHttp: false
    },

    request: function(options) {
        var withDefaults = createOptionsWithDefaults(options, Http.defaults);

        updateUrl(withDefaults);
        updateHeaders(withDefaults);
        updateData(withDefaults);
        serializeData(withDefaults);

        var deferred = withDefaults.deferredFactory(withDefaults);
        var request = withDefaults.requestFactory(withDefaults, deferred);

        deferred.request = deferred;
        request.send();

        return deferred.promise;
    },

    get: function(url, options) {
        options = ObjectUtils.extend(options, {method: "get", url: url});
        return this.request(options);
    },

    post: function(url, data, options) {
        options = ObjectUtils.extend(options, {method: "post", url: url, data: data});
        return this.request(options);
    },

    jsonp: function(url, options) {
        options = ObjectUtils.extend(options, {method: "jsonp", url: url});
        return this.request(options);
    },

    delete: function(url, options) {
        options = ObjectUtils.extend(options, {method: "delete", url: url});
        return this.request(options);
    },

    head: function(url, options) {
        options = ObjectUtils.extend(options, {method: "head", url: url});
        return this.request(options);
    },

    put: function(url, data, options) {
        options = ObjectUtils.extend(options, {method: "put", url: url, data: data});
        return this.request(options);
    },

    patch: function(url, data, options) {
        options = ObjectUtils.extend(options, {method: "patch", url: url, data: data});
        return this.request(options);
    },

    getScript: function(url, options) {
        options = ObjectUtils.extend(options, {method: "script", url: url});
        return this.request(options);
    }
};


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

function updateData(options) {
    if (!options.emulateHttp) {
        return;
    }

    if (!StringUtils.isEqualIgnoreCase("put", options.method) ||
        !StringUtils.isEqualIgnoreCase("patch", options.method) ||
        !StringUtils.isEqualIgnoreCase("delete", options.method)) {
        return;
    }

    options.data._method = options.method.toLowerCase();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2V4cG9ydHMuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLWFycmF5LmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1hc3NlcnQuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLWRhdGUuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLWdsb2JhbC1lcnJvci1oYW5kbGVyLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1odHRwLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1sb2ctY29uc29sZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3JlY3VydmUtbG9nLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1vYmplY3QuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLXByb3RvLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcmVjdXJ2ZS1zaWduYWwuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLXN0cmluZy5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3JlY3VydmUtd2luZG93LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDenBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ROQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSB8fCB7fTtcblxuICAgIFJlY3VydmUuU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLXN0cmluZy5qc1wiKTtcbiAgICBSZWN1cnZlLldpbmRvd1V0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS13aW5kb3cuanNcIik7XG4gICAgUmVjdXJ2ZS5BcnJheVV0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1hcnJheS5qc1wiKTtcbiAgICBSZWN1cnZlLkRhdGVVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtZGF0ZS5qc1wiKTtcbiAgICBSZWN1cnZlLk9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1vYmplY3QuanNcIik7XG5cbiAgICBSZWN1cnZlLmFzc2VydCA9IHJlcXVpcmUoXCIuL3JlY3VydmUtYXNzZXJ0LmpzXCIpO1xuXG4gICAgUmVjdXJ2ZS5Qcm90byA9IHJlcXVpcmUoXCIuL3JlY3VydmUtcHJvdG8uanNcIik7XG4gICAgUmVjdXJ2ZS5Mb2cgPSByZXF1aXJlKFwiLi9yZWN1cnZlLWxvZy5qc1wiKTtcbiAgICBSZWN1cnZlLkxvZ0NvbnNvbGVUYXJnZXQgPSByZXF1aXJlKFwiLi9yZWN1cnZlLWxvZy1jb25zb2xlLmpzXCIpO1xuICAgIFJlY3VydmUuU2lnbmFsID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1zaWduYWwuanNcIik7XG4gICAgUmVjdXJ2ZS5IdHRwID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1odHRwLmpzXCIpO1xuICAgIFJlY3VydmUuR2xvYmFsRXJyb3JIYW5kbGVyID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1nbG9iYWwtZXJyb3ItaGFuZGxlci5qc1wiKTtcblxuICAgIHdpbmRvdy5SZWN1cnZlID0gUmVjdXJ2ZTtcbn0pKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbW92ZUl0ZW06IGZ1bmN0aW9uKGFycmF5LCBpdGVtKSB7XG4gICAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG5cbiAgICAgICAgaWYgKC0xIDwgaW5kZXgpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlQXQ6IGZ1bmN0aW9uKGFycmF5LCBpbmRleCkge1xuICAgICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoMCA8PSBpbmRleCAmJiBhcnJheS5sZW5ndGggPiBpbmRleCkge1xuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXBsYWNlSXRlbTogZnVuY3Rpb24oYXJyYXksIGl0ZW0pIHtcbiAgICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblxuICAgICAgICBpZiAoLTEgPCBpbmRleCkge1xuICAgICAgICAgICAgYXJyYXlbaW5kZXhdID0gaXRlbTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gIXZhbHVlIHx8IDAgPT09IHZhbHVlLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgYXJndW1lbnRzVG9BcnJheTogZnVuY3Rpb24oYXJncywgc2xpY2VDb3VudCkge1xuICAgICAgICByZXR1cm4gc2xpY2VDb3VudCA8IGFyZ3MubGVuZ3RoID8gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgc2xpY2VDb3VudCkgOiBbXTtcbiAgICB9XG59OyIsIi8qXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlID0gd2luZG93LlJlY3VydmUgfHwge307XG5cbiAgICBSZWN1cnZlLmFzc2VydCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgICAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJndW1lbnRzKTtcbiAgICAgICAgbWVzc2FnZSA9IFJlY3VydmUuU3RyaW5nVXRpbHMuZm9ybWF0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH07XG59KSgpO1xuKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtc3RyaW5nLmpzXCIpO1xuXG4vLyBUT0RPIFRCRCBhZGQgbWV0aG9kcyBzdWNoIGFzOiBvaywgZXF1YWwsIGVxdWFsU3RyaWN0LCBldGMuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseShhcmd1bWVudHMpO1xuICAgIG1lc3NhZ2UgPSBTdHJpbmdVdGlscy5mb3JtYXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbn07IiwiLyooZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlID0gd2luZG93LlJlY3VydmUgfHwge307XG5cbiAgICBSZWN1cnZlLkRhdGVVdGlscyA9XG4gICAge1xuICAgICAgICBub3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RhcnRZZWFyRnJvbVJhbmdlOiBmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICAgICAgaWYgKCFyYW5nZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3BsaXQgPSByYW5nZS5zcGxpdChcIi1cIik7XG4gICAgICAgICAgICByZXR1cm4gMCA8IHNwbGl0Lmxlbmd0aCA/IHNwbGl0WzBdIDogXCJcIjtcbiAgICAgICAgfSxcblxuICAgICAgICBlbmRZZWFyRnJvbVJhbmdlOiBmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICAgICAgaWYgKCFyYW5nZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3BsaXQgPSByYW5nZS5zcGxpdChcIi1cIik7XG4gICAgICAgICAgICByZXR1cm4gMiA8IHNwbGl0Lmxlbmd0aCA/IHNwbGl0WzJdIDogXCJcIjtcbiAgICAgICAgfVxuICAgIH07XG59KSgpOyovXG5cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBub3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKTtcbiAgICB9LFxuXG4gICAgc3RhcnRZZWFyRnJvbVJhbmdlOiBmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICBpZiAoIXJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzcGxpdCA9IHJhbmdlLnNwbGl0KFwiLVwiKTtcbiAgICAgICAgcmV0dXJuIDAgPCBzcGxpdC5sZW5ndGggPyBzcGxpdFswXSA6IFwiXCI7XG4gICAgfSxcblxuICAgIGVuZFllYXJGcm9tUmFuZ2U6IGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNwbGl0ID0gcmFuZ2Uuc3BsaXQoXCItXCIpO1xuICAgICAgICByZXR1cm4gMiA8IHNwbGl0Lmxlbmd0aCA/IHNwbGl0WzJdIDogXCJcIjtcbiAgICB9XG59OyIsIi8vKGZ1bmN0aW9uKCkge1xuLy8gICAgXCJ1c2Ugc3RyaWN0XCI7XG4vL1xuLy8gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuLy9cbi8vICAgIFJlY3VydmUuR2xvYmFsRXJyb3JIYW5kbGVyID0gUmVjdXJ2ZS5Qcm90by5kZWZpbmUoW1xuLy9cbi8vICAgICAgICAvKipcbi8vICAgICAgICAgKiBOT1RFLCBJZiB5b3VyIEpTIGlzIGhvc3RlZCBvbiBhIENETiB0aGVuIHRoZSBicm93c2VyIHdpbGwgc2FuaXRpemUgYW5kIGV4Y2x1ZGUgYWxsIGVycm9yIG91dHB1dFxuLy8gICAgICAgICAqIHVubGVzcyBleHBsaWNpdGx5IGVuYWJsZWQuIFNlZSBUT0RPIFRCRCB0dXRvcmlhbCBsaW5rXG4vLyAgICAgICAgICpcbi8vICAgICAgICAgKiBAcGFyYW0gb25FcnJvciwgY2FsbGJhY2sgZGVjbGFyYXRpb246IG9uRXJyb3IoZGVzY3JpcHRpb24sIGVycm9yKSwgZXJyb3Igd2lsbCBiZSB1bmRlZmluZWQgaWYgbm90IHN1cHBvcnRlZCBieSBicm93c2VyXG4vLyAgICAgICAgICogQHBhcmFtIGVuYWJsZWQsIGRlZmF1bHQgdHJ1ZVxuLy8gICAgICAgICAqIEBwYXJhbSBwcmV2ZW50QnJvd3NlckhhbmRsZSwgZGVmYXVsdCB0cnVlXG4vLyAgICAgICAgICovXG4vLyAgICAgICAgZnVuY3Rpb24gY3RvcihvbkVycm9yLCBlbmFibGVkLCBwcmV2ZW50QnJvd3NlckhhbmRsZSkge1xuLy8gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSBlbmFibGVkKSB7XG4vLyAgICAgICAgICAgICAgICBlbmFibGVkID0gdHJ1ZTtcbi8vICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gcHJldmVudEJyb3dzZXJIYW5kbGUpIHtcbi8vICAgICAgICAgICAgICAgIHByZXZlbnRCcm93c2VySGFuZGxlID0gdHJ1ZTtcbi8vICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IGVuYWJsZWQ7XG4vLyAgICAgICAgICAgIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlID0gcHJldmVudEJyb3dzZXJIYW5kbGU7XG4vLyAgICAgICAgICAgIHRoaXMuX29uRXJyb3IgPSBvbkVycm9yO1xuLy9cbi8vICAgICAgICAgICAgd2luZG93Lm9uZXJyb3IgPSB0aGlzLl9lcnJvckhhbmRsZXIuYmluZCh0aGlzKTtcbi8vICAgICAgICB9LFxuLy9cbi8vICAgICAgICB7XG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBXcmFwIG1ldGhvZCBpbiB0cnkuLmNhdGNoIGFuZCBoYW5kbGUgZXJyb3Igd2l0aG91dCByYWlzaW5nIHVuY2F1Z2h0IGVycm9yXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBtZXRob2Rcbi8vICAgICAgICAgICAgICogQHBhcmFtIFssIGFyZzIsIC4uLiwgYXJnTl0sIGxpc3Qgb2YgYXJndW1lbnRzIGZvciBtZXRob2Rcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIHByb3RlY3RlZEludm9rZTogZnVuY3Rpb24obWV0aG9kKSB7XG4vLyAgICAgICAgICAgICAgICB0cnkge1xuLy8gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gUmVjdXJ2ZS5BcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAxKTtcbi8vICAgICAgICAgICAgICAgICAgICBtZXRob2QuYXBwbHkobnVsbCwgYXJncyk7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbi8vICAgICAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaWJlRXJyb3IoZXJyb3IpO1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBIYW5kbGUgZXJyb3IgYXMgd291bGQgYmUgZG9uZSBmb3IgdW5jYXVnaHQgZ2xvYmFsIGVycm9yXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBlcnJvciwgYW55IHR5cGUgb2YgZXJyb3IgKHN0cmluZywgb2JqZWN0LCBFcnJvcilcbi8vICAgICAgICAgICAgICogQHBhcmFtIGRlc2NyaXB0aW9uXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBoYW5kbGVFcnJvcjogZnVuY3Rpb24oZXJyb3IsIGRlc2NyaXB0aW9uKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodGhpcy5fb25FcnJvcilcbi8vICAgICAgICAgICAgICAgIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkVycm9yKGVycm9yLCBkZXNjcmlwdGlvbik7XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vXG4vLyAgICAgICAgICAgIGRlc2NyaWJlRXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uO1xuLy9cbi8vICAgICAgICAgICAgICAgIGlmIChSZWN1cnZlLk9iamVjdFV0aWxzLmlzU3RyaW5nKGVycm9yKSkge1xuLy8gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gZXJyb3I7XG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICBlbHNlIGlmIChSZWN1cnZlLk9iamVjdFV0aWxzLmlzRXJyb3IoZXJyb3IpKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBlcnJvci5tZXNzYWdlICsgXCJcXG5cIiArIGVycm9yLnN0YWNrO1xuLy8gICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgZWxzZSBpZiAoUmVjdXJ2ZS5PYmplY3RVdGlscy5pc09iamVjdChlcnJvcikpIHtcbi8vICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgIGVsc2Vcbi8vICAgICAgICAgICAgICAgIHtcbi8vICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yLnRvU3RyaW5nKCk7XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0aW9uO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgX2Vycm9ySGFuZGxlcjogZnVuY3Rpb24obWVzc2FnZSwgZmlsZW5hbWUsIGxpbmUsIGNvbHVtbiwgZXJyb3IpIHtcbi8vICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZW5hYmxlZCkge1xuLy8gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBSZWN1cnZlLlN0cmluZ1V0aWxzLmZvcm1hdChcbi8vICAgICAgICAgICAgICAgICAgICBcIm1lc3NhZ2U6IHswfSwgZmlsZTogezF9LCBsaW5lOiB7Mn1cIiwgbWVzc2FnZSwgZmlsZW5hbWUsIGxpbmUpO1xuLy9cbi8vICAgICAgICAgICAgICAgIGlmIChlcnJvcilcbi8vICAgICAgICAgICAgICAgIHtcbi8vICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiArPSBSZWN1cnZlLlN0cmluZ1V0aWxzLmZvcm1hdChcIiwgc3RhY2s6IHswfVwiLCBlcnJvci5zdGFjayk7XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgaWYgKHRoaXMuX29uRXJyb3IpXG4vLyAgICAgICAgICAgICAgICB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25FcnJvcihlcnJvciwgZGVzY3JpcHRpb24pO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcmV2ZW50QnJvd3NlckhhbmRsZTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vICAgIF0pO1xuLy99KSgpO1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1wcm90by5qc1wiKTtcbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtc3RyaW5nLmpzXCIpO1xudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1vYmplY3QuanNcIik7XG52YXIgQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtYXJyYXkuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcblxuICAgIC8qKlxuICAgICAqIE5PVEUsIElmIHlvdXIgSlMgaXMgaG9zdGVkIG9uIGEgQ0ROIHRoZW4gdGhlIGJyb3dzZXIgd2lsbCBzYW5pdGl6ZSBhbmQgZXhjbHVkZSBhbGwgZXJyb3Igb3V0cHV0XG4gICAgICogdW5sZXNzIGV4cGxpY2l0bHkgZW5hYmxlZC4gU2VlIFRPRE8gVEJEIHR1dG9yaWFsIGxpbmtcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvbkVycm9yLCBjYWxsYmFjayBkZWNsYXJhdGlvbjogb25FcnJvcihkZXNjcmlwdGlvbiwgZXJyb3IpLCBlcnJvciB3aWxsIGJlIHVuZGVmaW5lZCBpZiBub3Qgc3VwcG9ydGVkIGJ5IGJyb3dzZXJcbiAgICAgKiBAcGFyYW0gZW5hYmxlZCwgZGVmYXVsdCB0cnVlXG4gICAgICogQHBhcmFtIHByZXZlbnRCcm93c2VySGFuZGxlLCBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY3RvcihvbkVycm9yLCBlbmFibGVkLCBwcmV2ZW50QnJvd3NlckhhbmRsZSkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBlbmFibGVkKSB7XG4gICAgICAgICAgICBlbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHByZXZlbnRCcm93c2VySGFuZGxlKSB7XG4gICAgICAgICAgICBwcmV2ZW50QnJvd3NlckhhbmRsZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5fcHJldmVudEJyb3dzZXJIYW5kbGUgPSBwcmV2ZW50QnJvd3NlckhhbmRsZTtcbiAgICAgICAgdGhpcy5fb25FcnJvciA9IG9uRXJyb3I7XG5cbiAgICAgICAgd2luZG93Lm9uZXJyb3IgPSB0aGlzLl9lcnJvckhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcCBtZXRob2QgaW4gdHJ5Li5jYXRjaCBhbmQgaGFuZGxlIGVycm9yIHdpdGhvdXQgcmFpc2luZyB1bmNhdWdodCBlcnJvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWV0aG9kXG4gICAgICAgICAqIEBwYXJhbSBbLCBhcmcyLCAuLi4sIGFyZ05dLCBsaXN0IG9mIGFyZ3VtZW50cyBmb3IgbWV0aG9kXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWRJbnZva2U6IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgIG1ldGhvZC5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpYmVFcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcihlcnJvciwgZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGUgZXJyb3IgYXMgd291bGQgYmUgZG9uZSBmb3IgdW5jYXVnaHQgZ2xvYmFsIGVycm9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBlcnJvciwgYW55IHR5cGUgb2YgZXJyb3IgKHN0cmluZywgb2JqZWN0LCBFcnJvcilcbiAgICAgICAgICogQHBhcmFtIGRlc2NyaXB0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBoYW5kbGVFcnJvcjogZnVuY3Rpb24oZXJyb3IsIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fb25FcnJvcilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkVycm9yKGVycm9yLCBkZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcmV2ZW50QnJvd3NlckhhbmRsZTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIGRlc2NyaWJlRXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbjtcblxuICAgICAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzU3RyaW5nKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChPYmplY3RVdGlscy5pc0Vycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gZXJyb3IubWVzc2FnZSArIFwiXFxuXCIgKyBlcnJvci5zdGFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKE9iamVjdFV0aWxzLmlzT2JqZWN0KGVycm9yKSkge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gZXJyb3IudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0aW9uO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9lcnJvckhhbmRsZXI6IGZ1bmN0aW9uKG1lc3NhZ2UsIGZpbGVuYW1lLCBsaW5lLCBjb2x1bW4sIGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IFN0cmluZ1V0aWxzLmZvcm1hdChcbiAgICAgICAgICAgICAgICBcIm1lc3NhZ2U6IHswfSwgZmlsZTogezF9LCBsaW5lOiB7Mn1cIiwgbWVzc2FnZSwgZmlsZW5hbWUsIGxpbmUpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3IpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gKz0gU3RyaW5nVXRpbHMuZm9ybWF0KFwiLCBzdGFjazogezB9XCIsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX29uRXJyb3IpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25FcnJvcihlcnJvciwgZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJldmVudEJyb3dzZXJIYW5kbGU7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLXN0cmluZy5qc1wiKTtcbnZhciBEYXRlVXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLXdpbmRvdy5qc1wiKTtcbnZhciBXaW5kb3dVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtd2luZG93LmpzXCIpO1xudmFyIFNpZ25hbCA9IHJlcXVpcmUoXCIuL3JlY3VydmUtc2lnbmFsLmpzXCIpO1xudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1wcm90by5qc1wiKTtcblxudmFyIEh0dHAgPSB7XG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgYWxsOiB7fSxcblxuICAgICAgICAgICAgZ2V0OiB7fSxcbiAgICAgICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwdXQ6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkOiB7fSxcbiAgICAgICAgICAgIFwiZGVsZXRlXCI6IHt9LFxuICAgICAgICAgICAganNvbnA6IHt9LFxuICAgICAgICAgICAgc2NyaXB0OiB7fVxuICAgICAgICB9LFxuXG4gICAgICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuXG4gICAgICAgIGNhY2hlOiB0cnVlLFxuXG4gICAgICAgIHNlcmlhbGl6ZXIgOiBbZGVmYXVsdFNlcmlhbGl6ZXJdLFxuICAgICAgICBwYXJzZXIgOiBbZGVmYXVsdFBhcnNlcl0sXG5cbiAgICAgICAgcmVxdWVzdEZhY3Rvcnk6IERlZmF1bHRSZXF1ZXN0RmFjdG9yeSxcbiAgICAgICAgZGVmZXJyZWRGYWN0b3J5OiBEZWZhdWx0RGVmZXJyZWRGYWN0b3J5LFxuXG4gICAgICAgIGVycm9yT25DYW5jZWw6IHRydWUsXG4gICAgICAgIGVtdWxhdGVIdHRwOiBmYWxzZVxuICAgIH0sXG5cbiAgICByZXF1ZXN0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciB3aXRoRGVmYXVsdHMgPSBjcmVhdGVPcHRpb25zV2l0aERlZmF1bHRzKG9wdGlvbnMsIEh0dHAuZGVmYXVsdHMpO1xuXG4gICAgICAgIHVwZGF0ZVVybCh3aXRoRGVmYXVsdHMpO1xuICAgICAgICB1cGRhdGVIZWFkZXJzKHdpdGhEZWZhdWx0cyk7XG4gICAgICAgIHVwZGF0ZURhdGEod2l0aERlZmF1bHRzKTtcbiAgICAgICAgc2VyaWFsaXplRGF0YSh3aXRoRGVmYXVsdHMpO1xuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IHdpdGhEZWZhdWx0cy5kZWZlcnJlZEZhY3Rvcnkod2l0aERlZmF1bHRzKTtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB3aXRoRGVmYXVsdHMucmVxdWVzdEZhY3Rvcnkod2l0aERlZmF1bHRzLCBkZWZlcnJlZCk7XG5cbiAgICAgICAgZGVmZXJyZWQucmVxdWVzdCA9IGRlZmVycmVkO1xuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcblxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImdldFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBwb3N0OiBmdW5jdGlvbih1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcInBvc3RcIiwgdXJsOiB1cmwsIGRhdGE6IGRhdGF9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAganNvbnA6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwianNvbnBcIiwgdXJsOiB1cmx9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZGVsZXRlOiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImRlbGV0ZVwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBoZWFkOiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImhlYWRcIiwgdXJsOiB1cmx9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgcHV0OiBmdW5jdGlvbih1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcInB1dFwiLCB1cmw6IHVybCwgZGF0YTogZGF0YX0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBwYXRjaDogZnVuY3Rpb24odXJsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJwYXRjaFwiLCB1cmw6IHVybCwgZGF0YTogZGF0YX0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBnZXRTY3JpcHQ6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwic2NyaXB0XCIsIHVybDogdXJsfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxufTtcblxuXG5mdW5jdGlvbiBkZWZhdWx0U2VyaWFsaXplcihkYXRhLCBjb250ZW50VHlwZSkge1xuICAgIHZhciBpZ25vcmVDYXNlID0gdHJ1ZTtcblxuICAgIGlmIChTdHJpbmdVdGlscy5jb250YWlucyhjb250ZW50VHlwZSwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzT2JqZWN0KGRhdGEpICYmICFPYmplY3RVdGlscy5pc0ZpbGUoZGF0YSkpIHtcbiAgICAgICAgICAgIGRhdGEgPSBPYmplY3RVdGlscy50b0Zvcm1EYXRhKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGNvbnRlbnRUeXBlLCBcImFwcGxpY2F0aW9uL2pzb25cIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzT2JqZWN0KGRhdGEpICYmICFPYmplY3RVdGlscy5pc0ZpbGUoZGF0YSkpIHtcbiAgICAgICAgICAgIGRhdGEgPSBPYmplY3RVdGlscy50b0pzb24oZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcgLSBub3RoaW5nIHRvIHNlcmlhbGl6ZVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5IdHRwLnNlcmlhbGl6ZXIgPSBkZWZhdWx0U2VyaWFsaXplcjtcblxuXG5mdW5jdGlvbiBkZWZhdWx0UGFyc2VyKHhociwgYWNjZXB0KSB7XG4gICAgdmFyIGRhdGE7XG4gICAgdmFyIGlnbm9yZUNhc2UgPSB0cnVlO1xuXG4gICAgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGFjY2VwdCwgXCJhcHBsaWNhdGlvbi94bWxcIiwgaWdub3JlQ2FzZSkgfHxcbiAgICAgICAgU3RyaW5nVXRpbHMuY29udGFpbnMoYWNjZXB0LCBcInRleHQveG1sXCIsIGlnbm9yZUNhc2UpKSB7XG4gICAgICAgIGRhdGEgPSB4aHIucmVzcG9uc2VYTUw7XG4gICAgfVxuICAgIGVsc2UgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGFjY2VwdCwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIGlnbm9yZUNhc2UpKSB7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0gT2JqZWN0VXRpbHMudG9Kc29uKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkYXRhID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuSHR0cC5wYXJzZXIgPSBkZWZhdWx0UGFyc2VyO1xuXG5cbmZ1bmN0aW9uIERlZmF1bHRSZXF1ZXN0RmFjdG9yeShvcHRpb25zLCBkZWZlcnJlZCkge1xuICAgIHZhciByZXF1ZXN0O1xuXG4gICAgaWYgKFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwianNvbnBcIiwgb3B0aW9ucy5tZXRob2QpKSB7XG4gICAgICAgIHJlcXVlc3QgPSBuZXcgSnNvbnBSZXF1ZXN0KG9wdGlvbnMsIGRlZmVycmVkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAob3B0aW9ucy5jcm9zc0RvbWFpbiAmJlxuICAgICAgICBTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCBvcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgICAgcmVxdWVzdCA9IG5ldyBDcm9zc0RvbWFpblNjcmlwdFJlcXVlc3Qob3B0aW9ucywgZGVmZXJyZWQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVxdWVzdCA9IG5ldyBYaHIob3B0aW9ucywgZGVmZXJyZWQpO1xuICAgIH1cblxuICAgIHJldHVybiByZXF1ZXN0O1xufTtcblxuSHR0cC5SZXF1ZXN0RmFjdG9yeSA9IERlZmF1bHRSZXF1ZXN0RmFjdG9yeTtcblxuXG5mdW5jdGlvbiBEZWZhdWx0RGVmZXJyZWRGYWN0b3J5KCkge1xuICAgIHJldHVybiBuZXcgSHR0cERlZmVycmVkKCk7XG59O1xuXG5IdHRwLkRlZmVycmVkRmFjdG9yeSA9IERlZmF1bHREZWZlcnJlZEZhY3Rvcnk7XG5cblxuZnVuY3Rpb24gUURlZmVycmVkRmFjdG9yeSgpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICBkZWZlcnJlZC5wcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbihvblN1Y2Nlc3MpIHtcbiAgICAgICAgZGVmZXJyZWQucHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBvblN1Y2Nlc3MoXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsIHJlc3BvbnNlLm9wdGlvbnMsIHJlc3BvbnNlLmNhbmNlbGVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmVycmVkLnByb21pc2U7XG4gICAgfTtcblxuICAgIGRlZmVycmVkLnByb21pc2UuZXJyb3IgPSBmdW5jdGlvbihvbkVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnByb21pc2UudGhlbihudWxsLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgb25FcnJvcihcbiAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZGVmZXJyZWQucmVxdWVzdC5jYW5jZWwoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmVycmVkO1xufTtcblxuSHR0cC5RRGVmZXJyZWRGYWN0b3J5ID0gUURlZmVycmVkRmFjdG9yeTtcblxuXG5mdW5jdGlvbiBjcmVhdGVPcHRpb25zV2l0aERlZmF1bHRzKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gICAgdmFyIHdpdGhEZWZhdWx0cyA9IE9iamVjdFV0aWxzLmV4dGVuZCh7fSwgZGVmYXVsdHMpO1xuXG4gICAgd2l0aERlZmF1bHRzLmhlYWRlcnMgPSB7fTtcbiAgICBtZXJnZUhlYWRlcnMob3B0aW9ucy5tZXRob2QsIHdpdGhEZWZhdWx0cywgZGVmYXVsdHMuaGVhZGVycyk7XG5cbiAgICBPYmplY3RVdGlscy5leHRlbmQod2l0aERlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB3aXRoRGVmYXVsdHM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSGVhZGVycyhtZXRob2QsIG9wdGlvbnMsIGRlZmF1bHRIZWFkZXJzKSB7XG4gICAgbWV0aG9kID0gbWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywgZGVmYXVsdEhlYWRlcnMuYWxsKTtcbiAgICBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywgZGVmYXVsdEhlYWRlcnNbbWV0aG9kXSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVVybChvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmNhY2hlKSB7XG4gICAgICAgIG9wdGlvbnMucGFyYW1zLmNhY2hlID0gRGF0ZVV0aWxzLm5vdygpLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICBvcHRpb25zLnVybCA9XG4gICAgICAgIFN0cmluZ1V0aWxzLmFkZFBhcmFtZXRlcnNUb1VybChcbiAgICAgICAgICAgIG9wdGlvbnMudXJsLCBvcHRpb25zLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhlYWRlcnMob3B0aW9ucykge1xuICAgIGFkZEFjY2VwdEhlYWRlcihvcHRpb25zKTtcbiAgICBhZGRSZXF1ZXN0ZWRXaXRoSGVhZGVyKG9wdGlvbnMpO1xuICAgIHJlbW92ZUNvbnRlbnRUeXBlKG9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBhZGRBY2NlcHRIZWFkZXIob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMuQWNjZXB0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWNjZXB0ID0gXCIqLypcIjtcbiAgICB2YXIgZGF0YVR5cGUgPSBvcHRpb25zLmRhdGFUeXBlO1xuXG4gICAgaWYgKGRhdGFUeXBlKSB7XG4gICAgICAgIGRhdGFUeXBlID0gZGF0YVR5cGUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoXCJ0ZXh0XCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcInRleHQvcGxhaW4sKi8qO3E9MC4wMVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwiaHRtbFwiID09PSBkYXRhVHlwZSkge1xuICAgICAgICAgICAgYWNjZXB0ID0gXCJ0ZXh0L2h0bWwsKi8qO3E9MC4wMVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwieG1sXCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcImFwcGxpY2F0aW9uL3htbCx0ZXh0L3htbCwqLyo7cT0wLjAxXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXCJqc29uXCIgPT09IGRhdGFUeXBlIHx8IFwic2NyaXB0XCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcImFwcGxpY2F0aW9uL2pzb24sdGV4dC9qYXZhc2NyaXB0LCovKjtxPTAuMDFcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBkZWZhdWx0IHRvIGFsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucy5oZWFkZXJzLkFjY2VwdCA9IGFjY2VwdDtcbn1cblxuZnVuY3Rpb24gYWRkUmVxdWVzdGVkV2l0aEhlYWRlcihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmNyb3NzRG9tYWluICYmXG4gICAgICAgICFvcHRpb25zLmhlYWRlcnNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdICYmXG4gICAgICAgICFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCBvcHRpb25zLmRhdGFUeXBlKSkge1xuICAgICAgICBvcHRpb25zLmhlYWRlcnNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdID0gXCJYTUxIdHRwUmVxdWVzdFwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29udGVudFR5cGUob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBPYmplY3RVdGlscy5mb3JFYWNoKG9wdGlvbnMuaGVhZGVycywgZnVuY3Rpb24odmFsdWUsIGhlYWRlcikge1xuICAgICAgICBpZiAoU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJjb250ZW50LXR5cGVcIiwgaGVhZGVyKSkge1xuICAgICAgICAgICAgZGVsZXRlIG9wdGlvbnMuaGVhZGVyc1toZWFkZXJdO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURhdGEob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5lbXVsYXRlSHR0cCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInB1dFwiLCBvcHRpb25zLm1ldGhvZCkgfHxcbiAgICAgICAgIVN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwicGF0Y2hcIiwgb3B0aW9ucy5tZXRob2QpIHx8XG4gICAgICAgICFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcImRlbGV0ZVwiLCBvcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wdGlvbnMuZGF0YS5fbWV0aG9kID0gb3B0aW9ucy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplRGF0YShvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmRhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gb3B0aW9ucy5kYXRhO1xuXG4gICAgaWYgKE9iamVjdFV0aWxzLmlzRnVuY3Rpb24ob3B0aW9ucy5zZXJpYWxpemVyKSkge1xuICAgICAgICBkYXRhID0gb3B0aW9ucy5zZXJpYWxpemVyKGRhdGEsIHRoaXMuX29wdGlvbnMuY29udGVudFR5cGUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaChvcHRpb25zLnNlcmlhbGl6ZXIsIGZ1bmN0aW9uKHNlcmlhbGl6ZXIpIHtcbiAgICAgICAgICAgIGRhdGEgPSBzZXJpYWxpemVyKGRhdGEsIG9wdGlvbnMuY29udGVudFR5cGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvcHRpb25zLmRhdGEgPSBkYXRhO1xufVxuXG5cbnZhciBIdHRwRGVmZXJyZWQgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3N1Y2NlZWRlZCA9IG5ldyBTaWduYWwoKTtcbiAgICAgICAgdGhpcy5fZXJyb3JlZCA9IG5ldyBTaWduYWwoKTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByZXNvbHZlOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLnRyaWdnZXIocmVzcG9uc2UpO1xuICAgICAgICAgICAgdGhpcy5fY2xlYW5VcCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlamVjdDogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yZWQudHJpZ2dlcihyZXNwb25zZSk7XG4gICAgICAgICAgICB0aGlzLl9jbGVhblVwKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJvbWlzZToge1xuICAgICAgICAgICAgdGhlbjogZnVuY3Rpb24ob25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLmFkZE9uY2Uob25TdWNjZXNzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcmVkLmFkZE9uY2Uob25FcnJvcik7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihvblN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWNjZWVkZWQuYWRkT25jZShmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3MocmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKG9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcmVkLmFkZE9uY2UoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihyZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzLCByZXNwb25zZS5vcHRpb25zLCByZXNwb25zZS5jYW5jZWxlZCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0ICYmIHRoaXMucmVxdWVzdC5jYW5jZWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfY2xlYW5VcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9zdWNjZWVkZWQucmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB0aGlzLl9zdWNjZWVkZWQgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLl9lcnJvcmVkLnJlbW92ZUFsbCgpO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3JlZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5dKTtcblxuXG52YXIgcmVxdWVzdElkID0gMDtcblxudmFyIFhociA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcihvcHRpb25zLCBkZWZlcnJlZCkge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5fZGVmZXJyZWQgPSBkZWZlcnJlZDtcbiAgICAgICAgdGhpcy5faWQgPSByZXF1ZXN0SWQrKztcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBzZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl94aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlJlY3VydmUgb25seSBzdXBwb3J0cyBJRTgrXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jb25maWcoKTtcblxuICAgICAgICAgICAgdGhpcy5feGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9XG4gICAgICAgICAgICAgICAgT2JqZWN0VXRpbHMuYmluZCh0aGlzLl9zdGF0ZUNoYW5nZUhhbmRsZXIsIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLl94aHIub3Blbih0aGlzLl9vcHRpb25zLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCB0aGlzLl9vcHRpb25zLnVybCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJlZm9yZVNlbmQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vcHRpb25zLmJlZm9yZVNlbmQodGhpcy5feGhyLCB0aGlzLl9vcHRpb25zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5feGhyLnNlbmQodGhpcy5fb3B0aW9ucy5kYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5feGhyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feGhyLmFib3J0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbmZpZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9hZGRIZWFkZXJzKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLndpdGhDcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3hoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feGhyLnRpbWVvdXQgPSB0aGlzLl9vcHRpb25zLnRpbWVvdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnJlc3BvbnNlVHlwZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3hoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9vcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD03MzY0OFxuICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgd2lsbCB0aHJvdyBlcnJvciBmb3IgXCJqc29uXCIgbWV0aG9kLCBpZ25vcmUgdGhpcyBzaW5jZVxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gaGFuZGxlIGl0XG4gICAgICAgICAgICAgICAgICAgIGlmICghU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJqc29uXCIsIHRoaXMuX29wdGlvbnMubWV0aG9kKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2FkZEhlYWRlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaCh0aGlzLl9vcHRpb25zLmhlYWRlcnMsIGZ1bmN0aW9uKHZhbHVlLCBoZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICBfc3RhdGVDaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICg0ICE9PSB0aGlzLl94aHIucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzU3VjY2VzcygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlU3VjY2VzcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfaXNTdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYW5jZWxlZCAmJiB0aGlzLl9vcHRpb25zLmVycm9yT25DYW5jZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSB0aGlzLl94aHIuc3RhdHVzO1xuXG4gICAgICAgICAgICByZXR1cm4gKDIwMCA8PSBzdGF0dXMgJiYgMzAwID4gc3RhdHVzKSB8fFxuICAgICAgICAgICAgICAgIDMwNCA9PT0gc3RhdHVzIHx8XG4gICAgICAgICAgICAgICAgKDAgPT09IHN0YXR1cyAmJiBXaW5kb3dVdGlscy5pc0ZpbGVQcm90b2NvbCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfaGFuZGxlU3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGE7XG5cbiAgICAgICAgICAgIGlmIChTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCB0aGlzLl9vcHRpb25zLmRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9yZXF1ZXN0LnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBXaW5kb3dVdGlscy5nbG9iYWxFdmFsKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX3BhcnNlUmVzcG9uc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKFwidW5hYmxlIHRvIHBhcnNlIHJlc3BvbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZSh0cnVlLCBkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlKGZhbHNlLCBudWxsLCBzdGF0dXNUZXh0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBfY29tcGxldGU6IGZ1bmN0aW9uKHN1Y2Nlc3MsIGRhdGEsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1cyA6IHRoaXMuX3hoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgc3RhdHVzVGV4dCA6IHN0YXR1c1RleHQgPyBzdGF0dXNUZXh0IDogdGhpcy5feGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgaGVhZGVycyA6IHRoaXMuX3hoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSxcbiAgICAgICAgICAgICAgICBvcHRpb25zIDogdGhpcy5fb3B0aW9ucyxcbiAgICAgICAgICAgICAgICBjYW5jZWxlZCA6IHRoaXMuX2NhbmNlbGVkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfcGFyc2VSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYWNjZXB0ID0gIHRoaXMuX29wdGlvbnMuaGVhZGVycyAmJiB0aGlzLl9vcHRpb25zLmhlYWRlcnMuQWNjZXB0O1xuICAgICAgICAgICAgaWYgKCFhY2NlcHQpIHtcbiAgICAgICAgICAgICAgICBhY2NlcHQgPSB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YTtcblxuICAgICAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzRnVuY3Rpb24odGhpcy5fb3B0aW9ucy5zZXJpYWxpemVyKSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9vcHRpb25zLnBhcnNlcih0aGlzLl94aHIpLCBhY2NlcHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBPYmplY3RVdGlscy5mb3JFYWNoKHRoaXMuX29wdGlvbnMucGFyc2VyLCBmdW5jdGlvbihwYXJzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHBhcnNlcih0aGlzLl94aHIsIGFjY2VwdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG5cblxudmFyIEpzb25wUmVxdWVzdCA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcihvcHRpb25zLCBkZWZlcnJlZCkge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5fZGVmZXJyZWQgPSBkZWZlcnJlZDtcbiAgICAgICAgdGhpcy5faWQgPSByZXF1ZXN0SWQrKztcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBzZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFja0lkID0gXCJSZWN1cnZlSnNvblBDYWxsYmFja1wiICsgdGhpcy5faWQ7XG4gICAgICAgICAgICB2YXIgdXJsID0gU3RyaW5nVXRpbHMucmVtb3ZlUGFyYW1ldGVyRnJvbVVybCh0aGlzLl9vcHRpb25zLnVybCwgXCJjYWxsYmFja1wiKTtcbiAgICAgICAgICAgIHVybCA9IFN0cmluZ1V0aWxzLmFkZFBhcmFtZXRlcnNUb1VybCh1cmwsIHtjYWxsYmFjazogY2FsbGJhY2tJZH0pO1xuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgICAgICAgICBzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgY2FsbGVkO1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsYmFja0hhbmRsZXIoZGF0YSkge1xuICAgICAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhhdC5fY2FuY2VsZWQgJiYgdGhhdC5fb3B0aW9ucy5lcnJvck9uQ2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2NvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jb21wbGV0ZSh0cnVlLCBkYXRhLCAyMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEVycm9ySGFuZGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHdpbmRvd1tjYWxsYmFja0lkXTtcblxuICAgICAgICAgICAgICAgIGlmIChldmVudCAmJiBcImxvYWRcIiA9PT0gZXZlbnQudHlwZSAmJiAhY2FsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2NvbXBsZXRlKGZhbHNlLCBudWxsLCA0MDQsIFwianNvbnAgY2FsbGJhY2sgbm90IGNhbGxlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgIHdpbmRvd1tjYWxsYmFja0lkXSA9IGNhbGxiYWNrSGFuZGxlcjtcblxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbXBsZXRlOiBmdW5jdGlvbihzdWNjZXNzLCBkYXRhLCBzdGF0dXMsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogdGhpcy5fb3B0aW9ucyxcbiAgICAgICAgICAgICAgICBjYW5jZWxlZDogdGhpcy5fY2FuY2VsZWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWZlcnJlZC5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXSk7XG5cbnZhciBDcm9zc0RvbWFpblNjcmlwdFJlcXVlc3QgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB0aGlzLl9vcHRpb25zLnVybDtcbiAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEVycm9ySGFuZGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIFwiZXJyb3JcIiA9PT0gZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9kZWZlcnJlZC5yZWplY3Qoe3N0YXR1czogNDA0LCBjYW5jZWxlZDogdGhhdC5fY2FuY2VsZWR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2RlZmVycmVkLnJlc29sdmUoe3N0YXR1czogMjAwLCBjYW5jZWxlZDogdGhhdC5fY2FuY2VsZWR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3JlY3VydmUtcHJvdG8uanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBpbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIHdhcm46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZm8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnNvbGUgfHwgIWNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZm8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuIiwiLy8oZnVuY3Rpb24oKSB7XG4vLyAgICBcInVzZSBzdHJpY3RcIjtcbi8vXG4vLyAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlID0gd2luZG93LlJlY3VydmUgfHwge307XG4vL1xuLy8gICAgUmVjdXJ2ZS5Mb2cgPSBSZWN1cnZlLlByb3RvLmRlZmluZShbXG4vL1xuLy8gICAgICAgIC8qKlxuLy8gICAgICAgICAqXG4vLyAgICAgICAgICogQHBhcmFtIHRhcmdldHMsIGFycmF5IG9mIHRhcmdldHMgdG8gbG9nIHRvIChzZWUgUmVjdXJ2ZS5Mb2dDb25zb2xlVGFyZ2V0IGFzIGV4YW1wbGUpLlxuLy8gICAgICAgICAqIERlZmF1bHRzIHRvIFJlY3VydmUuTG9nQ29uc29sZVRhcmdldFxuLy8gICAgICAgICAqIEBwYXJhbSBlbmFibGVkLCBkZWZhdWx0IHRydWVcbi8vICAgICAgICAgKi9cbi8vICAgICAgICBmdW5jdGlvbiBjdG9yKGVuYWJsZWQsIHRhcmdldHMpIHtcbi8vICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gZW5hYmxlZCkge1xuLy8gICAgICAgICAgICAgICAgZW5hYmxlZCA9IHRydWU7XG4vLyAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHRhcmdldHMpIHtcbi8vICAgICAgICAgICAgICAgIHRhcmdldHMgPSBbbmV3IFJlY3VydmUuTG9nQ29uc29sZVRhcmdldCgpXTtcbi8vICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgdGhpcy50YXJnZXRzID0gdGFyZ2V0cztcbi8vICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCFlbmFibGVkKTtcbi8vICAgICAgICB9LFxuLy9cbi8vICAgICAgICB7XG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBMb2cgaW5mbyB0byBhbGwgdGFyZ2V0c1xuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2Zcbi8vICAgICAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBpbmZvOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5mb0Rpc2FibGVkKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHRoaXMuX2xvZyhcImluZm9cIiwgbWVzc2FnZSwgYXJndW1lbnRzKTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBMb2cgZGVidWcgdG8gYWxsIHRhcmdldHNcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICogQHBhcmFtIG1lc3NhZ2Vcbi8vICAgICAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4vLyAgICAgICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgZGVidWc6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbi8vICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWJ1Z0Rpc2FibGVkKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHRoaXMuX2xvZyhcImRlYnVnXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogTG9nIHdhcm5pbmcgdG8gYWxsIHRhcmdldHNcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICogQHBhcmFtIG1lc3NhZ2Vcbi8vICAgICAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4vLyAgICAgICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgd2FybjogZnVuY3Rpb24obWVzc2FnZSkge1xuLy8gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3dhcm5EaXNhYmxlZCkge1xuLy8gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9sb2coXCJ3YXJuXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogTG9nIGVycm9yIHRvIGFsbCB0YXJnZXRzXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuLy8gICAgICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXJyb3JEaXNhYmxlZCkge1xuLy8gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9sb2coXCJlcnJvclwiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIENsZWFyIGxvZyBmb3IgYWxsIHRhcmdldHNcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnRhcmdldHMubGVuZ3RoOyBpbmRleCsrKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzW2luZGV4XS5jbGVhcigpO1xuLy8gICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnRGlzYWJsZWQgPSB2YWx1ZTtcbi8vICAgICAgICAgICAgICAgIHRoaXMuX2luZm9EaXNhYmxlZCA9IHZhbHVlO1xuLy8gICAgICAgICAgICAgICAgdGhpcy5fd2FybkRpc2FibGVkID0gdmFsdWU7XG4vLyAgICAgICAgICAgICAgICB0aGlzLl9lcnJvckRpc2FibGVkID0gdmFsdWU7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBkZWJ1Z0Rpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1Z0Rpc2FibGVkID0gdmFsdWU7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBpbmZvRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHRoaXMuX2luZm9EaXNhYmxlZCA9IHZhbHVlO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgd2FybkRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB0aGlzLl93YXJuRGlzYWJsZWQgPSB2YWx1ZTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIGVycm9yRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yRGlzYWJsZWQgPSB2YWx1ZTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIF9sb2c6IGZ1bmN0aW9uKHR5cGUsIG1lc3NhZ2UsIGFyZ3MpIHtcbi8vICAgICAgICAgICAgICAgIGFyZ3MgPSBSZWN1cnZlLkFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmdzLCAxKTtcbi8vICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHRoaXMuX2Rlc2NyaXB0aW9uKHR5cGUudG9VcHBlckNhc2UoKSk7XG4vL1xuLy8gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudGFyZ2V0cy5sZW5ndGg7IGluZGV4KyspIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldHNbaW5kZXhdW3R5cGVdLmFwcGx5KHRoaXMudGFyZ2V0c1tpbmRleF0sIFtkZXNjcmlwdGlvbiwgbWVzc2FnZV0uY29uY2F0KGFyZ3MpKTtcbi8vICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIF9kZXNjcmlwdGlvbjogZnVuY3Rpb24odHlwZSkge1xuLy8gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBSZWN1cnZlLlN0cmluZ1V0aWxzLmZvcm1hdFRpbWUobmV3IERhdGUoKSk7XG4vLyAgICAgICAgICAgICAgICByZXR1cm4gXCJbXCIgKyB0eXBlICsgXCJdIFwiICsgdGltZTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vXG4vLyAgICBdKTtcbi8vXG4vLyAgICAvKipcbi8vICAgICAqIExvZyB0YXJnZXQgZm9yIFJlY3VydmUuTG9nXG4vLyAgICAgKiBIYW5kbGVzIGJyb3dzZXJzIHRoYXQgZG8gbm90IHN1cHBvcnQgY29uc29sZSBvciBoYXZlIGxpbWl0ZWQgY29uc29sZSBzdXBwb3J0IChpLmUuIG9ubHkgc3VwcG9ydCBjb25zb2xlLmxvZylcbi8vICAgICAqXG4vLyAgICAgKi9cbi8vICAgIFJlY3VydmUuTG9nQ29uc29sZVRhcmdldCA9IFJlY3VydmUuUHJvdG8uZGVmaW5lKFtcbi8vICAgICAgICB7XG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2Zcbi8vICAgICAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBpbmZvOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2Zcbi8vICAgICAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICBkZWJ1ZzogZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICBpZiAoIWNvbnNvbGUgfHwgIWNvbnNvbGUuZGVidWcpIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLmluZm8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbi8vICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1Zy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuLy8gICAgICAgICAgICB9LFxuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuLy8gICAgICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgIHdhcm46IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLndhcm4pIHtcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLmluZm8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbi8vICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgICAgICB9XG4vL1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS53YXJuLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgIH0sXG4vL1xuLy8gICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICogQHBhcmFtIG1lc3NhZ2Vcbi8vICAgICAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4vLyAgICAgICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLmVycm9yKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbi8vICAgICAgICAgICAgfSxcbi8vXG4vLyAgICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5jbGVhcigpO1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgfVxuLy8gICAgXSk7XG4vL1xuLy99KSgpO1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1wcm90by5qc1wiKTtcbnZhciBBcnJheVV0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1hcnJheS5qc1wiKTtcbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuL3JlY3VydmUtc3RyaW5nLmpzXCIpO1xudmFyIExvZ1RhcmdldCA9IHJlcXVpcmUoXCIuL3JlY3VydmUtbG9nLWNvbnNvbGUuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHRhcmdldHMsIGFycmF5IG9mIHRhcmdldHMgdG8gbG9nIHRvIChzZWUgUmVjdXJ2ZS5Mb2dDb25zb2xlVGFyZ2V0IGFzIGV4YW1wbGUpLlxuICAgICAqIERlZmF1bHRzIHRvIFJlY3VydmUuTG9nQ29uc29sZVRhcmdldFxuICAgICAqIEBwYXJhbSBlbmFibGVkLCBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY3RvcihlbmFibGVkLCB0YXJnZXRzKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGVuYWJsZWQpIHtcbiAgICAgICAgICAgIGVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdGFyZ2V0cykge1xuICAgICAgICAgICAgdGFyZ2V0cyA9IFtuZXcgTG9nVGFyZ2V0KCldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YXJnZXRzID0gdGFyZ2V0cztcbiAgICAgICAgdGhpcy5kaXNhYmxlKCFlbmFibGVkKTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogTG9nIGluZm8gdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mbzogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2luZm9EaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiaW5mb1wiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2cgZGVidWcgdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWc6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZWJ1Z0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJkZWJ1Z1wiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2cgd2FybmluZyB0byBhbGwgdGFyZ2V0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICB3YXJuOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fd2FybkRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJ3YXJuXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZyBlcnJvciB0byBhbGwgdGFyZ2V0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBlcnJvcjogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Vycm9yRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcImVycm9yXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFyIGxvZyBmb3IgYWxsIHRhcmdldHNcbiAgICAgICAgICovXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnRhcmdldHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzW2luZGV4XS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGVidWdEaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5faW5mb0Rpc2FibGVkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl93YXJuRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBkZWJ1Z0Rpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGVidWdEaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGluZm9EaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2luZm9EaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIHdhcm5EaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3dhcm5EaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGVycm9yRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9lcnJvckRpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2xvZzogZnVuY3Rpb24odHlwZSwgbWVzc2FnZSwgYXJncykge1xuICAgICAgICAgICAgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmdzLCAxKTtcbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHRoaXMuX2Rlc2NyaXB0aW9uKHR5cGUudG9VcHBlckNhc2UoKSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnRhcmdldHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzW2luZGV4XVt0eXBlXS5hcHBseSh0aGlzLnRhcmdldHNbaW5kZXhdLCBbZGVzY3JpcHRpb24sIG1lc3NhZ2VdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2Rlc2NyaXB0aW9uOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICB2YXIgdGltZSA9IFN0cmluZ1V0aWxzLmZvcm1hdFRpbWUobmV3IERhdGUoKSk7XG4gICAgICAgICAgICByZXR1cm4gXCJbXCIgKyB0eXBlICsgXCJdIFwiICsgdGltZTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIi8qXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlID0gd2luZG93LlJlY3VydmUgfHwge307XG5cbiAgICB2YXIgYmluZEN0b3IgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgUmVjdXJ2ZS5PYmplY3RVdGlscyA9XG4gICAge1xuICAgICAgICBmb3JFYWNoOiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9iai5mb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBPYmplY3QuZm9yRWFjaCkge1xuICAgICAgICAgICAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKFJlY3VydmUuT2JqZWN0VXRpbHMuaXNBcnJheShvYmopICYmIG9iai5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgb2JqLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2luZGV4XSwgaW5kZXgsIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gUmVjdXJ2ZS5PYmplY3RVdGlscy5rZXlzKG9iaik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmYWxzZSA9PT0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5c1tpbmRleF1dLCBrZXlzW2luZGV4XSwgb2JqKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgfSxcblxuICAgICAgICBrZXlzOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgIGlmICghUmVjdXJ2ZS5PYmplY3RVdGlscy5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8IFwic3RyaW5nXCIgPT0gdHlwZW9mIHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0Vycm9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRXJyb3I7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNPYmplY3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IE9iamVjdCh2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNBcnJheTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJmdW5jdGlvblwiID09IHR5cGVvZiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0RhdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzRmlsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBcIltvYmplY3QgRmlsZV1cIiA9PT0gU3RyaW5nKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGJpbmQ6IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIEJhc2VkIGhlYXZpbHkgb24gdW5kZXJzY29yZS9maXJlZm94IGltcGxlbWVudGF0aW9uLiBUT0RPIFRCRCBtYWtlIHVuZGVyc2NvcmUuanMgZGVwZW5kZW5jeSBvZlxuICAgICAgICAgICAgLy8gdGhpcyBsaWJyYXJ5IGluc3RlYWQ/XG5cbiAgICAgICAgICAgIGlmICghUmVjdXJ2ZS5PYmplY3RVdGlscy5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoZnVuYywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcblxuICAgICAgICAgICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYmluZEN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSBuZXcgYmluZEN0b3IoKTtcbiAgICAgICAgICAgICAgICBiaW5kQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhhdCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gYm91bmQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0ZW5kOiBmdW5jdGlvbihkZXN0LCBzcmMpIHtcbiAgICAgICAgICAgIGlmICghc3JjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9Kc29uOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgIGlmICghUmVjdXJ2ZS5PYmplY3RVdGlscy5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGFuIG9iamVjdCB0byBjb252ZXJ0IHRvIEpTT05cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZyb21Kc29uOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIGlmICghc3RyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHN0cik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9Gb3JtRGF0YTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICAgICAgICAgIFJlY3VydmUuT2JqZWN0VXRpbHMuZm9yRWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKFwiJlwiKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxufSkoKTtcbiovXG5cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2JqLmZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IE9iamVjdC5mb3JFYWNoKSB7XG4gICAgICAgICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc0FycmF5KG9iaikgJiYgb2JqLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IG9iai5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2luZGV4XSwgaW5kZXgsIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBrZXlzID0gdGhpcy5rZXlzKG9iaik7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwga2V5cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleXNbaW5kZXhdXSwga2V5c1tpbmRleF0sIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG5cbiAgICBrZXlzOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8IFwic3RyaW5nXCIgPT0gdHlwZW9mIHZhbHVlKTtcbiAgICB9LFxuXG4gICAgaXNFcnJvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRXJyb3I7XG4gICAgfSxcblxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IE9iamVjdCh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5O1xuICAgIH0sXG5cbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gXCJmdW5jdGlvblwiID09IHR5cGVvZiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgaXNEYXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICBpc0ZpbGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBcIltvYmplY3QgRmlsZV1cIiA9PT0gU3RyaW5nKGRhdGEpO1xuICAgIH0sXG5cbiAgICBiaW5kOiBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgICAgIC8vIEJhc2VkIGhlYXZpbHkgb24gdW5kZXJzY29yZS9maXJlZm94IGltcGxlbWVudGF0aW9uLlxuXG4gICAgICAgIGlmICghdGhpcy5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseShmdW5jLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcblxuICAgICAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJpbmRDdG9yLnByb3RvdHlwZSA9IGZ1bmMucHJvdG90eXBlO1xuICAgICAgICAgICAgdmFyIHRoYXQgPSBuZXcgYmluZEN0b3IoKTtcbiAgICAgICAgICAgIGJpbmRDdG9yLnByb3RvdHlwZSA9IG51bGw7XG5cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoYXQsIGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGJvdW5kO1xuICAgIH0sXG5cbiAgICBleHRlbmQ6IGZ1bmN0aW9uKGRlc3QsIHNyYykge1xuICAgICAgICBpZiAoIXNyYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH0sXG5cbiAgICB0b0pzb246IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoIXRoaXMuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGFuIG9iamVjdCB0byBjb252ZXJ0IHRvIEpTT05cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICB9LFxuXG4gICAgZnJvbUpzb246IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBpZiAoIXN0cikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xuICAgIH0sXG5cbiAgICB0b0Zvcm1EYXRhOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKFwiJlwiKTtcbiAgICB9XG59O1xuXG4iLCIvLyhmdW5jdGlvbigpIHtcbi8vICAgIHZhciBSZWN1cnZlID0gd2luZG93LlJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSB8fCB7fTtcbi8vXG4vLyAgICB2YXIgZG9udEludm9rZUNvbnN0cnVjdG9yID0ge307XG4vL1xuLy8gICAgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuLy8gICAgICAgIHJldHVybiB2YWx1ZSAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHZhbHVlO1xuLy8gICAgfVxuLy9cbi8vICAgIFJlY3VydmUuUHJvdG8gPSBmdW5jdGlvbigpIHtcbi8vICAgICAgICAvLyBkbyBub3RoaW5nXG4vLyAgICB9O1xuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQ3JlYXRlIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhpcyBvYmplY3Rcbi8vICAgICAqXG4vLyAgICAgKiBAcGFyYW0gb3B0aW9ucyAgIGFycmF5IGNvbnNpc3Rpbmcgb2YgY29uc3RydWN0b3IsIHByb3RvdHlwZS9cIm1lbWJlclwiIHZhcmlhYmxlcy9mdW5jdGlvbnMsXG4vLyAgICAgKiAgICAgICAgICAgICAgICAgIGFuZCBuYW1lc3BhY2UvXCJzdGF0aWNcIiB2YXJpYWJsZXMvZnVuY3Rpb25cbi8vICAgICAqL1xuLy8gICAgUmVjdXJ2ZS5Qcm90by5kZWZpbmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4vLyAgICAgICAgaWYgKCFvcHRpb25zIHx8IDAgPT09IG9wdGlvbnMubGVuZ3RoKSB7XG4vLyAgICAgICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgdmFyIHBvc3NpYmxlQ29uc3RydWN0b3IgPSBvcHRpb25zWzBdO1xuLy9cbi8vICAgICAgICB2YXIgcHJvcGVydGllcztcbi8vICAgICAgICB2YXIgc3RhdGljUHJvcGVydGllcztcbi8vXG4vLyAgICAgICAgaWYgKGlzRnVuY3Rpb24ocG9zc2libGVDb25zdHJ1Y3RvcikpIHtcbi8vICAgICAgICAgICAgcHJvcGVydGllcyA9IDEgPCBvcHRpb25zLmxlbmd0aCA/IG9wdGlvbnNbMV0gOiB7fTtcbi8vICAgICAgICAgICAgcHJvcGVydGllc1sgXCIkY3RvclwiIF0gPSBwb3NzaWJsZUNvbnN0cnVjdG9yO1xuLy9cbi8vICAgICAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMl07XG4vLyAgICAgICAgfVxuLy8gICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICBwcm9wZXJ0aWVzID0gb3B0aW9uc1swXTtcbi8vICAgICAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMV07XG4vLyAgICAgICAgfVxuLy9cbi8vICAgICAgICBmdW5jdGlvbiBQcm90b09iaihwYXJhbSlcbi8vICAgICAgICB7XG4vLyAgICAgICAgICAgIGlmIChkb250SW52b2tlQ29uc3RydWN0b3IgIT0gcGFyYW0gJiZcbi8vICAgICAgICAgICAgICAgIGlzRnVuY3Rpb24odGhpcy4kY3RvcikpIHtcbi8vICAgICAgICAgICAgICAgIHRoaXMuJGN0b3IuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgfTtcbi8vXG4vLyAgICAgICAgUHJvdG9PYmoucHJvdG90eXBlID0gbmV3IHRoaXMoZG9udEludm9rZUNvbnN0cnVjdG9yKTtcbi8vXG4vLyAgICAgICAgLy8gUHJvdG90eXBlL1wibWVtYmVyXCIgcHJvcGVydGllc1xuLy8gICAgICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbi8vICAgICAgICAgICAgYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnRpZXNba2V5XSwgUHJvdG9PYmoucHJvdG90eXBlW2tleV0pO1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgZnVuY3Rpb24gYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnR5LCBzdXBlclByb3BlcnR5KVxuLy8gICAgICAgIHtcbi8vICAgICAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHByb3BlcnR5KSB8fFxuLy8gICAgICAgICAgICAgICAgIWlzRnVuY3Rpb24oc3VwZXJQcm9wZXJ0eSkpIHtcbi8vICAgICAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydHk7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgZWxzZVxuLy8gICAgICAgICAgICB7XG4vLyAgICAgICAgICAgICAgICAvLyBDcmVhdGUgZnVuY3Rpb24gd2l0aCByZWYgdG8gYmFzZSBtZXRob2Rcbi8vICAgICAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24oKVxuLy8gICAgICAgICAgICAgICAge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gc3VwZXJQcm9wZXJ0eTtcbi8vICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbi8vICAgICAgICAgICAgICAgIH07XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIFByb3RvT2JqLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFByb3RvT2JqO1xuLy9cbi8vICAgICAgICAvLyBOYW1lc3BhY2VkL1wiU3RhdGljXCIgcHJvcGVydGllc1xuLy8gICAgICAgIFByb3RvT2JqLmV4dGVuZCA9IHRoaXMuZXh0ZW5kIHx8IHRoaXMuZGVmaW5lO1xuLy8gICAgICAgIFByb3RvT2JqLm1peGluID0gdGhpcy5taXhpbjtcbi8vXG4vLyAgICAgICAgZm9yIChrZXkgaW4gc3RhdGljUHJvcGVydGllcylcbi8vICAgICAgICB7XG4vLyAgICAgICAgICAgIFByb3RvT2JqW2tleV0gPSBzdGF0aWNQcm9wZXJ0aWVzW2tleV07XG4vLyAgICAgICAgfVxuLy9cbi8vICAgICAgICByZXR1cm4gUHJvdG9PYmo7XG4vLyAgICB9O1xuLy9cbi8vICAgIC8qKlxuLy8gICAgICogTWl4aW4gYSBzZXQgb2YgdmFyaWFibGVzL2Z1bmN0aW9ucyBhcyBwcm90b3R5cGVzIGZvciB0aGlzIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbi8vICAgICAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuLy8gICAgICpcbi8vICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuLy8gICAgICovXG4vLyAgICBSZWN1cnZlLlByb3RvLm1peGluID0gZnVuY3Rpb24ocHJvcGVydGllcykge1xuLy8gICAgICAgIFJlY3VydmUuUHJvdG8ubWl4aW5XaXRoKHRoaXMsIHByb3BlcnRpZXMpO1xuLy8gICAgfTtcbi8vXG4vLyAgICAvKipcbi8vICAgICAqIE1peGluIGEgc2V0IG9mIHZhcmlhYmxlcy9mdW5jdGlvbnMgYXMgcHJvdG90eXBlcyBmb3IgdGhlIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbi8vICAgICAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuLy8gICAgICpcbi8vICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuLy8gICAgICovXG4vLyAgICBSZWN1cnZlLlByb3RvLm1peGluV2l0aCA9IGZ1bmN0aW9uKG9iaiwgcHJvcGVydGllcykge1xuLy8gICAgICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbi8vICAgICAgICAgICAgb2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuLy8gICAgICAgIH1cbi8vICAgIH07XG4vL30pKCk7XG5cbnZhciBkb250SW52b2tlQ29uc3RydWN0b3IgPSB7fTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHZhbHVlO1xufVxuXG52YXIgUHJvdG8gPSBmdW5jdGlvbigpIHtcbiAgICAvLyBkbyBub3RoaW5nXG59O1xuXG4vKipcbiAqIENyZWF0ZSBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIG9wdGlvbnMgICBhcnJheSBjb25zaXN0aW5nIG9mIGNvbnN0cnVjdG9yLCBwcm90b3R5cGUvXCJtZW1iZXJcIiB2YXJpYWJsZXMvZnVuY3Rpb25zLFxuICogICAgICAgICAgICAgICAgICBhbmQgbmFtZXNwYWNlL1wic3RhdGljXCIgdmFyaWFibGVzL2Z1bmN0aW9uXG4gKi9cblByb3RvLmRlZmluZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMgfHwgMCA9PT0gb3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIHBvc3NpYmxlQ29uc3RydWN0b3IgPSBvcHRpb25zWzBdO1xuXG4gICAgdmFyIHByb3BlcnRpZXM7XG4gICAgdmFyIHN0YXRpY1Byb3BlcnRpZXM7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihwb3NzaWJsZUNvbnN0cnVjdG9yKSkge1xuICAgICAgICBwcm9wZXJ0aWVzID0gMSA8IG9wdGlvbnMubGVuZ3RoID8gb3B0aW9uc1sxXSA6IHt9O1xuICAgICAgICBwcm9wZXJ0aWVzWyBcIiRjdG9yXCIgXSA9IHBvc3NpYmxlQ29uc3RydWN0b3I7XG5cbiAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcm9wZXJ0aWVzID0gb3B0aW9uc1swXTtcbiAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUHJvdG9PYmoocGFyYW0pXG4gICAge1xuICAgICAgICBpZiAoZG9udEludm9rZUNvbnN0cnVjdG9yICE9IHBhcmFtICYmXG4gICAgICAgICAgICBpc0Z1bmN0aW9uKHRoaXMuJGN0b3IpKSB7XG4gICAgICAgICAgICB0aGlzLiRjdG9yLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFByb3RvT2JqLnByb3RvdHlwZSA9IG5ldyB0aGlzKGRvbnRJbnZva2VDb25zdHJ1Y3Rvcik7XG5cbiAgICAvLyBQcm90b3R5cGUvXCJtZW1iZXJcIiBwcm9wZXJ0aWVzXG4gICAgZm9yIChrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgICBhZGRQcm90b1Byb3BlcnR5KGtleSwgcHJvcGVydGllc1trZXldLCBQcm90b09iai5wcm90b3R5cGVba2V5XSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnR5LCBzdXBlclByb3BlcnR5KVxuICAgIHtcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHByb3BlcnR5KSB8fFxuICAgICAgICAgICAgIWlzRnVuY3Rpb24oc3VwZXJQcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydHk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgZnVuY3Rpb24gd2l0aCByZWYgdG8gYmFzZSBtZXRob2RcbiAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gc3VwZXJQcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQcm90b09iai5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQcm90b09iajtcblxuICAgIC8vIE5hbWVzcGFjZWQvXCJTdGF0aWNcIiBwcm9wZXJ0aWVzXG4gICAgUHJvdG9PYmouZXh0ZW5kID0gdGhpcy5leHRlbmQgfHwgdGhpcy5kZWZpbmU7XG4gICAgUHJvdG9PYmoubWl4aW4gPSB0aGlzLm1peGluO1xuXG4gICAgZm9yIChrZXkgaW4gc3RhdGljUHJvcGVydGllcylcbiAgICB7XG4gICAgICAgIFByb3RvT2JqW2tleV0gPSBzdGF0aWNQcm9wZXJ0aWVzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb3RvT2JqO1xufTtcblxuLyoqXG4gKiBNaXhpbiBhIHNldCBvZiB2YXJpYWJsZXMvZnVuY3Rpb25zIGFzIHByb3RvdHlwZXMgZm9yIHRoaXMgb2JqZWN0LiBBbnkgdmFyaWFibGVzL2Z1bmN0aW9uc1xuICogdGhhdCBhbHJlYWR5IGV4aXN0IHdpdGggdGhlIHNhbWUgbmFtZSB3aWxsIGJlIG92ZXJyaWRkZW4uXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgICAgdmFyaWFibGVzL2Z1bmN0aW9ucyB0byBtaXhpbiB3aXRoIHRoaXMgb2JqZWN0XG4gKi9cblByb3RvLm1peGluID0gZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgIFByb3RvLm1peGluV2l0aCh0aGlzLCBwcm9wZXJ0aWVzKTtcbn07XG5cbi8qKlxuICogTWl4aW4gYSBzZXQgb2YgdmFyaWFibGVzL2Z1bmN0aW9ucyBhcyBwcm90b3R5cGVzIGZvciB0aGUgb2JqZWN0LiBBbnkgdmFyaWFibGVzL2Z1bmN0aW9uc1xuICogdGhhdCBhbHJlYWR5IGV4aXN0IHdpdGggdGhlIHNhbWUgbmFtZSB3aWxsIGJlIG92ZXJyaWRkZW4uXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgICAgdmFyaWFibGVzL2Z1bmN0aW9ucyB0byBtaXhpbiB3aXRoIHRoaXMgb2JqZWN0XG4gKi9cblByb3RvLm1peGluV2l0aCA9IGZ1bmN0aW9uKG9iaiwgcHJvcGVydGllcykge1xuICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgb2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG87IiwiLypcbihmdW5jdGlvbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuXG4gICAgUmVjdXJ2ZS5TaWduYWwgPSBSZWN1cnZlLlByb3RvLmRlZmluZShbXG4gICAgICAgIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyRXhpc3RzKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobmV3IFNpZ25hbExpc3RlbmVyKGNhbGxiYWNrLCBjb250ZXh0KSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBhZGRPbmNlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lckV4aXN0cyhjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKG5ldyBTaWduYWxMaXN0ZW5lcihjYWxsYmFjaywgY29udGV4dCwgdHJ1ZSkpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NzaWJsZUxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZUxpc3RlbmVyLmlzU2FtZUNvbnRleHQoY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocG9zc2libGVMaXN0ZW5lci5pc1NhbWUoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nIC0gbm8gbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVjdXJ2ZS5BcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW4gb25seSBiZSBvbmUgbWF0Y2ggaWYgY2FsbGJhY2sgc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICByZW1vdmVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGggLSAxOyAwIDw9IGluZGV4OyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG5cbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIudHJpZ2dlcihhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmx5T25jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVjdXJ2ZS5BcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgX2xpc3RlbmVyRXhpc3RzOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCAtIDE7IDAgPD0gaW5kZXg7IGluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuaXNTYW1lKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBdKTtcblxuICAgIHZhciBTaWduYWxMaXN0ZW5lciA9IFJlY3VydmUuUHJvdG8uZGVmaW5lKFtcbiAgICAgICAgZnVuY3Rpb24gY3RvcihjYWxsYmFjaywgY29udGV4dCwgb25seU9uY2UpIHtcbiAgICAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgIHRoaXMub25seU9uY2UgPSBvbmx5T25jZTtcbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBpc1NhbWU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjayA9PT0gY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrID09PSBjYWxsYmFjayAmJiB0aGlzLl9jb250ZXh0ID09PSBjb250ZXh0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNTYW1lQ29udGV4dDogZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0ID09PSBjb250ZXh0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrLmFwcGx5KHRoaXMuX2NvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSk7XG5cbn0pKCk7XG4qL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1wcm90by5qc1wiKTtcbnZhciBBcnJheVV0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1hcnJheS5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGFkZDogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lckV4aXN0cyhjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKG5ldyBTaWduYWxMaXN0ZW5lcihjYWxsYmFjaywgY29udGV4dCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZE9uY2U6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJFeGlzdHMoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChuZXcgU2lnbmFsTGlzdGVuZXIoY2FsbGJhY2ssIGNvbnRleHQsIHRydWUpKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHZhciBwb3NzaWJsZUxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZUxpc3RlbmVyLmlzU2FtZUNvbnRleHQoY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwb3NzaWJsZUxpc3RlbmVyLmlzU2FtZShjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAtIG5vIG1hdGNoXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5VXRpbHMucmVtb3ZlQXQodGhpcy5fbGlzdGVuZXJzLCBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgb25lIG1hdGNoIGlmIGNhbGxiYWNrIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCAtIDE7IDAgPD0gaW5kZXg7IGluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIudHJpZ2dlcihhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9ubHlPbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5VXRpbHMucmVtb3ZlQXQodGhpcy5fbGlzdGVuZXJzLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9saXN0ZW5lckV4aXN0czogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCAtIDE7IDAgPD0gaW5kZXg7IGluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLmlzU2FtZShjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5dKTtcblxudmFyIFNpZ25hbExpc3RlbmVyID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKGNhbGxiYWNrLCBjb250ZXh0LCBvbmx5T25jZSkge1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5vbmx5T25jZSA9IG9ubHlPbmNlO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGlzU2FtZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjayA9PT0gY2FsbGJhY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjayA9PT0gY2FsbGJhY2sgJiYgdGhpcy5fY29udGV4dCA9PT0gY29udGV4dDtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1NhbWVDb250ZXh0OiBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dCA9PT0gY29udGV4dDtcbiAgICAgICAgfSxcblxuICAgICAgICB0cmlnZ2VyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5hcHBseSh0aGlzLl9jb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIi8qKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuXG4gICAgUmVjdXJ2ZS5TdHJpbmdVdGlscyA9XG4gICAge1xuICAgICAgICBmb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseShhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHZhciBzZWFyY2ggPSBcIntcIiArIGluZGV4ICsgXCJ9XCI7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHNlYXJjaCwgYXJndW1lbnRzW2luZGV4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXRXaXRoUHJvcGVydGllczogZnVuY3Rpb24odmFsdWUsIGZvcm1hdFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZm9ybWF0UHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYXRQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VhcmNoID0gXCJ7XCIgKyBwcm9wZXJ0eSArIFwifVwiO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2Uoc2VhcmNoLCBmb3JtYXRQcm9wZXJ0aWVzW3Byb3BlcnR5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFkOiBmdW5jdGlvbiggdmFsdWUsIHBhZENvdW50LCBwYWRWYWx1ZSApIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHBhZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcGFkVmFsdWUgPSBcIjBcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsdWUgPSBTdHJpbmcoIHZhbHVlICk7XG5cbiAgICAgICAgICAgIHdoaWxlICh2YWx1ZS5sZW5ndGggPCBwYWRDb3VudCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFkVmFsdWUgKyB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvcm1hdFRpbWU6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IGRhdGUpIHtcbiAgICAgICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGhvdXJzID0gdGhpcy5wYWQoZGF0ZS5nZXRIb3VycygpLCAyKTtcbiAgICAgICAgICAgIHZhciBtaW51dGVzID0gdGhpcy5wYWQoZGF0ZS5nZXRNaW51dGVzKCksIDIpO1xuICAgICAgICAgICAgdmFyIHNlY29uZHMgPSB0aGlzLnBhZChkYXRlLmdldFNlY29uZHMoKSwgMik7XG4gICAgICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5wYWQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMik7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChcbiAgICAgICAgICAgICAgICBcInswfTp7MX06ezJ9OnszfVwiLCBob3VycywgbWludXRlcywgc2Vjb25kcywgbWlsbGlzZWNvbmRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXRNb250aERheVllYXI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgIGlmICghZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFkID0gUmVjdXJ2ZS5TdHJpbmdVdGlscy5wYWQ7XG5cbiAgICAgICAgICAgIHZhciBtb250aCA9IHBhZChkYXRlLmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgIHZhciBkYXkgPSBwYWQoZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICAgICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChcbiAgICAgICAgICAgICAgICBcInswfS97MX0vezJ9XCIsIG1vbnRoLCBkYXksIHllYXIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvcm1hdFllYXJSYW5nZTogZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0ICYmIGVuZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gc3RhcnQgKyBcIiAtIFwiICsgZW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc3RhcnQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHN0YXJ0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBlbmQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYXBpdGFsaXplRmlyc3RDaGFyYWN0ZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSAgKyB2YWx1ZS5zbGljZSgxKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cmxMYXN0UGF0aDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzcGxpdCA9IHZhbHVlLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICAgIHJldHVybiAwIDwgc3BsaXQubGVuZ3RoID8gc3BsaXRbc3BsaXQubGVuZ3RoLTFdIDogbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSAmJiAwIDwgdmFsdWUubGVuZ3RoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxpbmVzT2Y6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbGluZXM7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGxpbmVzID0gdmFsdWUuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBsaW5lcztcbiAgICAgICAgfSxcblxuICAgICAgICBpc0VxdWFsOiBmdW5jdGlvbihzdHIsIHZhbHVlLCBpZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICBpZiAoIXN0ciB8fCAhdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyID09IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN0ciA9PSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0VxdWFsSWdub3JlQ2FzZTogZnVuY3Rpb24oc3RyLCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFJlY3VydmUuU3RyaW5nVXRpbHMuaXNFcXVhbChzdHIsIHZhbHVlLCB0cnVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb250YWluczogZnVuY3Rpb24oc3RyLCB2YWx1ZSwgaWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgaWYgKCFzdHIgfHwgIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ciA9PSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwIDw9IHN0ci5pbmRleE9mKHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRQYXJhbWV0ZXJzVG9Vcmw6IGZ1bmN0aW9uKHVybCwgcGFyYW1ldGVycykge1xuICAgICAgICAgICAgaWYgKCF1cmwgfHwgIXBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzZXBlcmF0b3IgPSBSZWN1cnZlLlN0cmluZ1V0aWxzLmNvbnRhaW5zKHVybCwgXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcblxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJhbWV0ZXJzW2tleV07XG5cbiAgICAgICAgICAgICAgICBpZiAoUmVjdXJ2ZS5PYmplY3RVdGlscy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFJlY3VydmUuT2JqZWN0VXRpbHMuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBSZWN1cnZlLk9iamVjdFV0aWxzLnRvSnNvbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB1cmwgKz0gc2VwZXJhdG9yICsgIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtZXRlcnNba2V5XSk7XG4gICAgICAgICAgICAgICAgc2VwZXJhdG9yID0gXCI/XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB1cmw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlUGFyYW1ldGVyRnJvbVVybDogZnVuY3Rpb24odXJsLCBwYXJhbWV0ZXIpIHtcbiAgICAgICAgICAgIGlmICghdXJsIHx8ICFwYXJhbWV0ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSBwYXJhbWV0ZXIgKyBcIj1cIjtcbiAgICAgICAgICAgIHZhciBzdGFydEluZGV4ID0gdXJsLmluZGV4T2Yoc2VhcmNoKTtcblxuICAgICAgICAgICAgaWYgKC0xID09PSBpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVuZEluZGV4ID0gdXJsLmluZGV4T2YoXCImXCIsIHN0YXJ0SW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAoLTEgPCBlbmRJbmRleCkge1xuICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgTWF0aC5tYXgoc3RhcnRJbmRleCAtIDEsIDApKSArIHVybC5zdWJzdHIoZW5kSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCBNYXRoLm1heChzdGFydEluZGV4IC0gMSwgMCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbiovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi9yZWN1cnZlLW9iamVjdC5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseShhcmd1bWVudHMpO1xuXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gXCJ7XCIgKyBpbmRleCArIFwifVwiO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHNlYXJjaCwgYXJndW1lbnRzW2luZGV4XSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIGZvcm1hdFdpdGhQcm9wZXJ0aWVzOiBmdW5jdGlvbih2YWx1ZSwgZm9ybWF0UHJvcGVydGllcykge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGZvcm1hdFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWFyY2ggPSBcIntcIiArIHByb3BlcnR5ICsgXCJ9XCI7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHNlYXJjaCwgZm9ybWF0UHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBwYWQ6IGZ1bmN0aW9uKCB2YWx1ZSwgcGFkQ291bnQsIHBhZFZhbHVlICkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBwYWRWYWx1ZSkge1xuICAgICAgICAgICAgcGFkVmFsdWUgPSBcIjBcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gU3RyaW5nKCB2YWx1ZSApO1xuXG4gICAgICAgIHdoaWxlICh2YWx1ZS5sZW5ndGggPCBwYWRDb3VudCkge1xuICAgICAgICAgICAgdmFsdWUgPSBwYWRWYWx1ZSArIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBmb3JtYXRUaW1lOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGRhdGUpIHtcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhvdXJzID0gdGhpcy5wYWQoZGF0ZS5nZXRIb3VycygpLCAyKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSB0aGlzLnBhZChkYXRlLmdldE1pbnV0ZXMoKSwgMik7XG4gICAgICAgIHZhciBzZWNvbmRzID0gdGhpcy5wYWQoZGF0ZS5nZXRTZWNvbmRzKCksIDIpO1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5wYWQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KFxuICAgICAgICAgICAgXCJ7MH06ezF9OnsyfTp7M31cIiwgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMsIG1pbGxpc2Vjb25kcyk7XG4gICAgfSxcblxuICAgIGZvcm1hdE1vbnRoRGF5WWVhcjogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZiAoIWRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1vbnRoID0gdGhpcy5wYWQoZGF0ZS5nZXRNb250aCgpICsgMSk7XG4gICAgICAgIHZhciBkYXkgPSB0aGlzLnBhZChkYXRlLmdldERhdGUoKSk7XG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChcbiAgICAgICAgICAgIFwiezB9L3sxfS97Mn1cIiwgbW9udGgsIGRheSwgeWVhcik7XG4gICAgfSxcblxuICAgIGZvcm1hdFllYXJSYW5nZTogZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBcIlwiO1xuXG4gICAgICAgIGlmIChzdGFydCAmJiBlbmQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gc3RhcnQgKyBcIiAtIFwiICsgZW5kO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN0YXJ0KSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBlbmQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIGNhcGl0YWxpemVGaXJzdENoYXJhY3RlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgICsgdmFsdWUuc2xpY2UoMSk7XG4gICAgfSxcblxuICAgIHVybExhc3RQYXRoOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3BsaXQgPSB2YWx1ZS5zcGxpdChcIi9cIik7XG4gICAgICAgIHJldHVybiAwIDwgc3BsaXQubGVuZ3RoID8gc3BsaXRbc3BsaXQubGVuZ3RoLTFdIDogbnVsbDtcbiAgICB9LFxuXG4gICAgaGFzVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAmJiAwIDwgdmFsdWUubGVuZ3RoO1xuICAgIH0sXG5cbiAgICBsaW5lc09mOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB2YXIgbGluZXM7XG5cbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBsaW5lcyA9IHZhbHVlLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH0sXG5cbiAgICBpc0VxdWFsOiBmdW5jdGlvbihzdHIsIHZhbHVlLCBpZ25vcmVDYXNlKSB7XG4gICAgICAgIGlmICghc3RyIHx8ICF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciA9PSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHIgPT0gdmFsdWU7XG4gICAgfSxcblxuICAgIGlzRXF1YWxJZ25vcmVDYXNlOiBmdW5jdGlvbihzdHIsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzRXF1YWwoc3RyLCB2YWx1ZSwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihzdHIsIHZhbHVlLCBpZ25vcmVDYXNlKSB7XG4gICAgICAgIGlmICghc3RyIHx8ICF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciA9PSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwIDw9IHN0ci5pbmRleE9mKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgYWRkUGFyYW1ldGVyc1RvVXJsOiBmdW5jdGlvbih1cmwsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgaWYgKCF1cmwgfHwgIXBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZXBlcmF0b3IgPSB0aGlzLmNvbnRhaW5zKHVybCwgXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGFyYW1ldGVycykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1ldGVyc1trZXldO1xuXG4gICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBPYmplY3RVdGlscy50b0pzb24odmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXJsICs9IHNlcGVyYXRvciArICBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbWV0ZXJzW2tleV0pO1xuICAgICAgICAgICAgc2VwZXJhdG9yID0gXCI/XCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH0sXG5cbiAgICByZW1vdmVQYXJhbWV0ZXJGcm9tVXJsOiBmdW5jdGlvbih1cmwsIHBhcmFtZXRlcikge1xuICAgICAgICBpZiAoIXVybCB8fCAhcGFyYW1ldGVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VhcmNoID0gcGFyYW1ldGVyICsgXCI9XCI7XG4gICAgICAgIHZhciBzdGFydEluZGV4ID0gdXJsLmluZGV4T2Yoc2VhcmNoKTtcblxuICAgICAgICBpZiAoLTEgPT09IGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihcIiZcIiwgc3RhcnRJbmRleCk7XG5cbiAgICAgICAgaWYgKC0xIDwgZW5kSW5kZXgpIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgTWF0aC5tYXgoc3RhcnRJbmRleCAtIDEsIDApKSArIHVybC5zdWJzdHIoZW5kSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCBNYXRoLm1heChzdGFydEluZGV4IC0gMSwgMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG59O1xuXG4iLCIvKihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBSZWN1cnZlID0gd2luZG93LlJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSB8fCB7fTtcblxuICAgIFJlY3VydmUuV2luZG93VXRpbHMgPVxuICAgIHtcbiAgICAgICAgaXNGaWxlUHJvdG9jb2w6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZmlsZTpcIiA9PT0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdsb2JhbEV2YWw6IGZ1bmN0aW9uKHNyYykge1xuICAgICAgICAgICAgaWYgKCFzcmMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGh0dHBzOi8vd2VibG9ncy5qYXZhLm5ldC9ibG9nL2RyaXNjb2xsL2FyY2hpdmUvMjAwOS8wOS8wOC9ldmFsLWphdmFzY3JpcHQtZ2xvYmFsLWNvbnRleHRcbiAgICAgICAgICAgIGlmICh3aW5kb3cuZXhlY1NjcmlwdCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5leGVjU2NyaXB0KHNyYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmV2YWwuY2FsbCh3aW5kb3cuc3JjKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZ1bmMoKTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpOyAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgID0ge1xuICAgIGlzRmlsZVByb3RvY29sOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFwiZmlsZTpcIiA9PT0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xuICAgIH0sXG5cbiAgICBnbG9iYWxFdmFsOiBmdW5jdGlvbihzcmMpIHtcbiAgICAgICAgaWYgKCFzcmMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGh0dHBzOi8vd2VibG9ncy5qYXZhLm5ldC9ibG9nL2RyaXNjb2xsL2FyY2hpdmUvMjAwOS8wOS8wOC9ldmFsLWphdmFzY3JpcHQtZ2xvYmFsLWNvbnRleHRcbiAgICAgICAgaWYgKHdpbmRvdy5leGVjU2NyaXB0KSB7XG4gICAgICAgICAgICB3aW5kb3cuZXhlY1NjcmlwdChzcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHdpbmRvdy5ldmFsLmNhbGwod2luZG93LnNyYyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuYygpO1xuICAgIH1cbn0iXX0=
