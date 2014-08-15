/*!
Recurve.js - v0.1.0
Created by Sebastien Couture on 2014-08-14.

git://github.com/sebastiencouture/Recurve.git

The MIT License (MIT)

Copyright (c) 2014 Sebastien Couture

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var StringUtils = require("./utils/string.js");
var ObjectUtils = require("./utils/object.js");
var ArrayUtils = require("./utils/array.js");

var assert = function(condition, message) {
    if (condition) {
        return;
    }

    Array.prototype.shift.apply(arguments);
    message = StringUtils.format.apply(this, arguments);

    throw new Error(message);
};

assert = ObjectUtils.extend(assert, {
    ok: function(condition, message) {
        assert.apply(this, arguments);
    },

    equal: function(actual, expected, message) {
        var args = ArrayUtils.argumentsToArray(arguments, 2);
        assert.apply(this, [actual == expected].concat(args));
    },

    notEqual: function(actual, expected, message) {
        var args = ArrayUtils.argumentsToArray(arguments, 2);
        assert.apply(this, [actual != expected].concat(args));
    },

    strictEqual: function(actual, expected, message) {
        var args = ArrayUtils.argumentsToArray(arguments, 2);
        assert.apply(this, [actual === expected].concat(args));
    },

    strictNotEqual: function(actual, expected, message) {
        var args = ArrayUtils.argumentsToArray(arguments, 2);
        assert.apply(this, [actual !== expected].concat(args));
    },

    deepEqual: function(actual, expected, message) {
        var args = ArrayUtils.argumentsToArray(arguments, 2);
        assert.apply(this, [ObjectUtils.areEqual(actual, expected)].concat(args));
    },

    deepNotEqual: function(actual, expected, message) {
        var args = ArrayUtils.argumentsToArray(arguments, 2);
        assert.apply(this, [!ObjectUtils.areEqual(actual, expected)].concat(args));
    }
});

module.exports = assert;
},{"./utils/array.js":15,"./utils/object.js":18,"./utils/string.js":19}],2:[function(require,module,exports){
"use strict";

var Proto = require("./proto.js");
var ObjectUtils = require("./utils/object.js");
var DateUtils = require("./utils/date.js");
var assert = require("./assert.js");

module.exports = Proto.define([
    function ctor(countLimit, totalCostLimit) {
        if (undefined === countLimit) {
            countLimit = 0;
        }
        if (undefined === totalCostLimit) {
            totalCostLimit = 0;
        }

        this._countLimit = countLimit;
        this._totalCostLimit = totalCostLimit;

        this._cache = {};
    },

    {
        get: function(key) {
            assert(key, "key must be set");

            var value = this._cache[key];

            return value ? value.value : null;
        },

        set: function(key, value, cost) {
            assert(key, "key must be set");

            if (undefined === cost) {
                cost = 0;
            }

            this._cache[key] = {value: value, cost: cost};

            if (this._countLimit || (this._totalCostLimit && cost)) {
                this._evict();
            }
        },

        remove: function(key) {
            assert(key, "key must be set");

            delete this._cache[key];
        },

        clear: function() {
            this._cache = {};
        },

        setCountLimit: function(value) {
            this._countLimit = value;
            this._evict();
        },

        countLimit: function() {
            return this._countLimit;
        },

        setTotalCostLimit: function(value) {
            this._totalCostLimit = value;
            this._evict();
        },

        totalCostLimit: function() {
            return this._totalCostLimit;
        },

        _currentTotalCost: function() {
            // TODO TBD should we cache total cost and current count?
            // ... any performance worries for potentially huge caches??
            var totalCost = 0;

            ObjectUtils.forEach(this._cache, function(value, key) {
                totalCost += value.cost;
            });

            return totalCost;
        },

        _currentCount: function() {
            return ObjectUtils.keyCount(this._cache);
        },

        _evict: function() {
            if (!this._shouldEvict()) {
                return;
            }

            this._evictMostCostly();
            this._evict();
        },

        _shouldEvict: function() {
            return this._countLimit < this._currentCount() ||
                this._totalCostLimit < this._currentTotalCost();
        },

        _evictMostCostly: function() {
            var maxCost = 0;
            var maxKey;

            ObjectUtils.forEach(this._cache, function(value, key) {
                if (!maxKey) {
                    maxKey = key;
                }
                else if (maxCost < value.cost) {
                    maxKey = key;
                }
                else {
                    // do nothing - continue
                }
            });

            this.remove(maxKey);
        }
    },

    {
        // Smaller the cost for newer
        inverseCurrentTimeCost: function() {
            return 1 / DateUtils.now();
        },

        // Smaller the cost for older
        currentTimeCost: function() {
            return DateUtils.now();
        }
    }
]);

},{"./assert.js":1,"./proto.js":10,"./utils/date.js":16,"./utils/object.js":18}],3:[function(require,module,exports){
(function(){
    "use strict";

    var Recurve = window.Recurve || {};

    Recurve.StringUtils = require("./utils/string.js");
    Recurve.WindowUtils = require("./utils/window.js");
    Recurve.ArrayUtils = require("./utils/array.js");
    Recurve.DateUtils = require("./utils/date.js");
    Recurve.ObjectUtils = require("./utils/object.js");

    Recurve.assert = require("./assert.js");

    Recurve.Proto = require("./proto.js");
    Recurve.Cache = require("./cache.js");
    Recurve.Log = require("./log/log.js");
    Recurve.LogConsoleTarget = require("./log/log-console.js");
    Recurve.Signal = require("./signal.js");
    Recurve.Http = require("./http/http.js");
    Recurve.GlobalErrorHandler = require("./global-error-handler.js");
    Recurve.LocalStorage = require("./storage/local-storage.js");
    Recurve.SessionStorage = require("./storage/session-storage.js");
    Recurve.PerformanceMonitor = require("./performance-monitor.js");
    Recurve.LazyLoad = require("./lazy-load.js");

    window.Recurve = Recurve;
})();
},{"./assert.js":1,"./cache.js":2,"./global-error-handler.js":4,"./http/http.js":5,"./lazy-load.js":6,"./log/log-console.js":7,"./log/log.js":8,"./performance-monitor.js":9,"./proto.js":10,"./signal.js":11,"./storage/local-storage.js":12,"./storage/session-storage.js":13,"./utils/array.js":15,"./utils/date.js":16,"./utils/object.js":18,"./utils/string.js":19,"./utils/window.js":20}],4:[function(require,module,exports){
"use strict";

var Proto = require("./proto.js");
var StringUtils = require("./utils/string.js");
var ObjectUtils = require("./utils/object.js");
var ArrayUtils = require("./utils/array.js");

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
},{"./proto.js":10,"./utils/array.js":15,"./utils/object.js":18,"./utils/string.js":19}],5:[function(require,module,exports){
"use strict";

var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
var DateUtils = require("../utils/date.js");
var WindowUtils = require("../utils/window.js");
var Signal = require("../signal.js");
var Proto = require("../proto.js");

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
        options.params.cache = DateUtils.now();
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

            // TODO TBD if going to support IE8 then need to check "onreadystatechange" as well
            // http://pieisgood.org/test/script-link-events/
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

            // TODO TBD if going to support IE8 then need to check "onreadystatechange" as well
            // http://pieisgood.org/test/script-link-events/
            script.addEventListener("load", loadErrorHandler);
            script.addEventListener("error", loadErrorHandler);

            document.head.appendChild(script);
        },

        cancel: function() {
            this._canceled = true;
        }
    }
]);
},{"../proto.js":10,"../signal.js":11,"../utils/date.js":16,"../utils/object.js":18,"../utils/string.js":19,"../utils/window.js":20}],6:[function(require,module,exports){
"use strict";

var DomUtils = require("./utils/dom.js");
var StringUtils = require("./utils/string.js");

module.exports = {
    js: function(url, onComplete, onError) {
        var element = DomUtils.createElement("link", {type: "text/css", rel: "stylesheet", href: url});
        load(element, onComplete, onError);
    },

    css: function(url, onComplete, onError) {
        var element = DomUtils.createElement("script", {type: "text/javascript", src: url});
        load(element, onComplete, onError);
    }
};

function load(element, onComplete, onError) {
    function readyStateHandler() {
        if (StringUtils.isEqualIgnoreCase("loaded", element.readyState) ||
            StringUtils.isEqualIgnoreCase("complete", element.readyState)) {
            loadedHandler();
        }
    }

    function loadedHandler() {
        clearCallbacks();
        onComplete();
    }

    function errorHandler(event) {
        clearCallbacks();
        onError(event);
    }

    function clearCallbacks() {
        element.onload = null;
        element.onreadystatechange = null;
        element.onerror = null;
    }

    // Maintain execution order
    // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    // http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
    element.async = false;
    element.defer = false;

    // http://pieisgood.org/test/script-link-events/
    // TODO TBD link tags don't support any type of load callback on old WebKit (Safari 5)
    // TODO TBD if not going to support IE8 then don't need to worry about onreadystatechange
    if (DomUtils.elementSupportsOnEvent(element, "onreadystatechange")) {
        element.onreadystatechange = readyStateHandler
    }
    else {
        element.onload = loadedHandler;
    }

    element.onerror = errorHandler;

    document.head.appendChild(element);
}
},{"./utils/dom.js":17,"./utils/string.js":19}],7:[function(require,module,exports){
"use strict";

var Proto = require("../proto.js");

module.exports = Proto.define([
    function ctor() {
    },

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

},{"../proto.js":10}],8:[function(require,module,exports){
"use strict";

var Proto = require("../proto.js");
var ArrayUtils = require("../utils/array.js");
var StringUtils = require("../utils/string.js");
var LogTarget = require("./log-console.js");

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
},{"../proto.js":10,"../utils/array.js":15,"../utils/string.js":19,"./log-console.js":7}],9:[function(require,module,exports){
"use strict";

var Proto = require("./proto.js");
var DateUtils = require("./utils/date.js");
var Log = require("./log/log.js");

module.exports = Proto.define([
    function ctor(log, enabled) {
        if (undefined === log) {
            this._log = new Log();
        }

        if (undefined === enabled) {
            enabled = true;
        }

        this.disable(!enabled);
    },

    {
        start: function(message) {
            if (this._disabled) {
                return;
            }

            return new Timer(this._log, message);
        },

        end: function(timer, description) {
            if (this._disabled || !timer) {
                return;
            }

            timer.end(description);
        },

        disable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._disabled = value;
        }
    }
]);


var Timer = Proto.define([
    function ctor() {
    },

    {
        start: function(log, message) {
            this._log = log;

            if (supportsConsoleTime()) {
                console.time(message);
            }
            else {
                this._startTime = DateUtils.performanceNow();
            }

            this._message = message;
        },

        end: function(description) {
            if (supportsConsoleTime()) {
                console.timeEnd(this._message);
            }
            else {
                this._log.info(this._message + ": " + (DateUtils.performanceNow() - this._startTime) + " ms");
            }

            if (description) {
                this._log.info(description);
            }
        }
    }
]);

function supportsConsoleTime() {
    return console && console.time && console.timeEnd;
}
},{"./log/log.js":8,"./proto.js":10,"./utils/date.js":16}],10:[function(require,module,exports){
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
"use strict";

var Proto = require("./proto.js");
var ArrayUtils = require("./utils/array.js");

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
},{"./proto.js":10,"./utils/array.js":15}],12:[function(require,module,exports){
"use strict";

var Storage = require("./storage.js")

module.exports = new Storage(window.localStorage);
},{"./storage.js":14}],13:[function(require,module,exports){
var Storage = require("./storage.js")

module.exports = new Storage(window.sessionStorage);
},{"./storage.js":14}],14:[function(require,module,exports){
"use strict";

var DateUtils = require("../utils/date.js");
var ObjectUtils = require("../utils/object.js");
var Proto = require("../proto.js");
var Cache = require("../cache.js");
var assert = require("../assert.js");

module.exports = Proto.define([
    function ctor(storage, useCache, cache) {
        if (undefined === useCache) {
            useCache = true;
        }

        this._storage = storage;

        if (useCache) {
            if (undefined === cache) {
                cache = new Cache();
            }

            this._cache = cache;
        }
    },

    {
        get: function(key) {
            assert(key, "key must be set");

            var value;

            if (this._cache) {
                value = this._cache.get(key);

                if (value) {
                    return value;
                }
            }

            value = this._storage.getItem(key);
            value = deSerialize(value);

            if (this._cache) {
                this._cache.set(key, value);
            }

            return value;
        },

        set: function(key, value) {
            assert(key, "key must be set");

            if (undefined === value) {
                this.remove(key);
            }

            var serialized = serialize(value);
            this._storage.setItem(key, serialized);

            if (this._cache) {
                this._cache.set(key, value);
            }
        },

        remove: function(key) {
            assert(key, "key must be set");

            if (this._cache) {
                this._cache.remove(key);
            }

            return this._storage.removeItem(key);
        },

        clear: function() {
            this._storage.clear();

            if (this._cache) {
                this._cache.clear();
            }
        },

        getWithExpiration: function(key) {
            var item = this.get(key);
            if (!item) {
                return null;
            }

            var elapsed = DateUtils.now() - item.time;
            if (item.expiry < elapsed) {
                return null;
            }

            return item.value;
        },

        setWithExpiration: function(key, value, expiry) {
            this.set(key, {value: value, expiry: expiry, time: DateUtils.now()});
        },

        forEach: function(iterator) {
            assert(iterator, "iterator must be set");

            for (var key in this._storage) {
                var value = this.get(key);
                iterator(key, value);
            }
        },

        setCache: function(value) {
            this._cache = value;
        }
    }
]);


function serialize(value) {
    return JSON.stringify(value);
}

function deSerialize(value) {
    if (!ObjectUtils.isString(value)) {
        return undefined;
    }

    try {
        return JSON.parse(value);
    }
    catch(e) {
        return value || undefined;
    }
}
},{"../assert.js":1,"../cache.js":2,"../proto.js":10,"../utils/date.js":16,"../utils/object.js":18}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
"use strict";

module.exports = {
    now: function() {
        return new Date().getTime();
    },

    performanceNow: function() {
        return performance && performance.now ? performance.now() : this.now();
    }
};
},{}],17:[function(require,module,exports){
"use strict";

var ObjectUtils = require("./object.js");

module.exports = {
    createElement: function(name, attributes) {
        var element = document.createElement(name);

        ObjectUtils.forEach(attributes, function(value, key) {
            element.setAttribute(key, value);
        });

        return element;
    },

    elementSupportsOnEvent: function(element, name) {
        return name in element;
    }
};
},{"./object.js":18}],18:[function(require,module,exports){
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

    keyCount: function(obj) {
        if (!this.isObject(obj)) {
            return 0;
        }

        var count = 0;

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                count++;
            }
        }

        return count;
    },

    // both values pass strict equality (===)
    // both objects are same type and all properties pass strict equality
    // both are NaN
    areEqual: function(value, other) {
        if (value === other) {
            return true;
        }

        if (null === value || null === other) {
            return false;
        }

        // NaN is NaN!
        if (this.isNaN(value) && this.isNaN(other)) {
            return true;
        }

        if (!this.isSameType(value, other)) {
            return false;
        }

        if (!this.isObject(value)) {
            return false;
        }

        if (this.isArray(value)) {
            if (value.length == other.length) {
                for (var index = 0; index < value.length; index++) {
                    if (!this.areEqual(value[index], other[index])) {
                        return false;
                    }
                }

                return true;
            }
        }
        else if(this.isDate(value)) {
            return value.getTime() == other.getTime();
        }
        else {
            var keysOfValue = {};
            for (var key in value) {
                if (this.isFunction(value[key])) {
                    continue;
                }

                if (!this.areEqual(value[key], other[key])) {
                    return false;
                }

                keysOfValue[key] = true;
            }

            for (var key in other) {
                if (this.isFunction(other[key])) {
                    continue;
                }

                if (!keysOfValue.hasOwnProperty(key)) {
                    return false;
                }
            }

            return true;
        }

        return false;
    },

    isNaN: function(value) {
        // NaN is never equal to itself, interesting :)
        return value !== value;
    },

    isSameType: function(value, other) {
        return typeof value == typeof other;
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

        for (var key in src) {
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


},{}],19:[function(require,module,exports){
"use strict";

var ObjectUtils = require("./object.js");

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


},{"./object.js":18}],20:[function(require,module,exports){
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
},{}]},{},[1,2,3,4,6,9,10,11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2Fzc2VydC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2NhY2hlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvZXhwb3J0cy5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2dsb2JhbC1lcnJvci1oYW5kbGVyLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvaHR0cC9odHRwLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvbGF6eS1sb2FkLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvbG9nL2xvZy1jb25zb2xlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvbG9nL2xvZy5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3BlcmZvcm1hbmNlLW1vbml0b3IuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9wcm90by5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3NpZ25hbC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3N0b3JhZ2UvbG9jYWwtc3RvcmFnZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3N0b3JhZ2Uvc2Vzc2lvbi1zdG9yYWdlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvc3RvcmFnZS9zdG9yYWdlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvYXJyYXkuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy91dGlscy9kYXRlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvZG9tLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvb2JqZWN0LmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvc3RyaW5nLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvd2luZG93LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3cEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZy5qc1wiKTtcbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL29iamVjdC5qc1wiKTtcbnZhciBBcnJheVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvYXJyYXkuanNcIik7XG5cbnZhciBhc3NlcnQgPSBmdW5jdGlvbihjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJndW1lbnRzKTtcbiAgICBtZXNzYWdlID0gU3RyaW5nVXRpbHMuZm9ybWF0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG59O1xuXG5hc3NlcnQgPSBPYmplY3RVdGlscy5leHRlbmQoYXNzZXJ0LCB7XG4gICAgb2s6IGZ1bmN0aW9uKGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgZXF1YWw6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAyKTtcbiAgICAgICAgYXNzZXJ0LmFwcGx5KHRoaXMsIFthY3R1YWwgPT0gZXhwZWN0ZWRdLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIG5vdEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbYWN0dWFsICE9IGV4cGVjdGVkXS5jb25jYXQoYXJncykpO1xuICAgIH0sXG5cbiAgICBzdHJpY3RFcXVhbDogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMsIDIpO1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgW2FjdHVhbCA9PT0gZXhwZWN0ZWRdLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIHN0cmljdE5vdEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbYWN0dWFsICE9PSBleHBlY3RlZF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9LFxuXG4gICAgZGVlcEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbT2JqZWN0VXRpbHMuYXJlRXF1YWwoYWN0dWFsLCBleHBlY3RlZCldLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIGRlZXBOb3RFcXVhbDogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMsIDIpO1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgWyFPYmplY3RVdGlscy5hcmVFcXVhbChhY3R1YWwsIGV4cGVjdGVkKV0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NlcnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3Byb3RvLmpzXCIpO1xudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2RhdGUuanNcIik7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZShcIi4vYXNzZXJ0LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3Rvcihjb3VudExpbWl0LCB0b3RhbENvc3RMaW1pdCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBjb3VudExpbWl0KSB7XG4gICAgICAgICAgICBjb3VudExpbWl0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSB0b3RhbENvc3RMaW1pdCkge1xuICAgICAgICAgICAgdG90YWxDb3N0TGltaXQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY291bnRMaW1pdCA9IGNvdW50TGltaXQ7XG4gICAgICAgIHRoaXMuX3RvdGFsQ29zdExpbWl0ID0gdG90YWxDb3N0TGltaXQ7XG5cbiAgICAgICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuX2NhY2hlW2tleV07XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA/IHZhbHVlLnZhbHVlIDogbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUsIGNvc3QpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXksIFwia2V5IG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSBjb3N0KSB7XG4gICAgICAgICAgICAgICAgY29zdCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlW2tleV0gPSB7dmFsdWU6IHZhbHVlLCBjb3N0OiBjb3N0fTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvdW50TGltaXQgfHwgKHRoaXMuX3RvdGFsQ29zdExpbWl0ICYmIGNvc3QpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZpY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jYWNoZVtrZXldO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q291bnRMaW1pdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50TGltaXQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2V2aWN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY291bnRMaW1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY291bnRMaW1pdDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRUb3RhbENvc3RMaW1pdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RvdGFsQ29zdExpbWl0ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9ldmljdCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvdGFsQ29zdExpbWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbENvc3RMaW1pdDtcbiAgICAgICAgfSxcblxuICAgICAgICBfY3VycmVudFRvdGFsQ29zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBUT0RPIFRCRCBzaG91bGQgd2UgY2FjaGUgdG90YWwgY29zdCBhbmQgY3VycmVudCBjb3VudD9cbiAgICAgICAgICAgIC8vIC4uLiBhbnkgcGVyZm9ybWFuY2Ugd29ycmllcyBmb3IgcG90ZW50aWFsbHkgaHVnZSBjYWNoZXM/P1xuICAgICAgICAgICAgdmFyIHRvdGFsQ29zdCA9IDA7XG5cbiAgICAgICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fY2FjaGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICB0b3RhbENvc3QgKz0gdmFsdWUuY29zdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdG90YWxDb3N0O1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jdXJyZW50Q291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLmtleUNvdW50KHRoaXMuX2NhY2hlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXZpY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9zaG91bGRFdmljdCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9ldmljdE1vc3RDb3N0bHkoKTtcbiAgICAgICAgICAgIHRoaXMuX2V2aWN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3Nob3VsZEV2aWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb3VudExpbWl0IDwgdGhpcy5fY3VycmVudENvdW50KCkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLl90b3RhbENvc3RMaW1pdCA8IHRoaXMuX2N1cnJlbnRUb3RhbENvc3QoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXZpY3RNb3N0Q29zdGx5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBtYXhDb3N0ID0gMDtcbiAgICAgICAgICAgIHZhciBtYXhLZXk7XG5cbiAgICAgICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fY2FjaGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1heEtleSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhLZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1heENvc3QgPCB2YWx1ZS5jb3N0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heEtleSA9IGtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBjb250aW51ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShtYXhLZXkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLy8gU21hbGxlciB0aGUgY29zdCBmb3IgbmV3ZXJcbiAgICAgICAgaW52ZXJzZUN1cnJlbnRUaW1lQ29zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gMSAvIERhdGVVdGlscy5ub3coKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBTbWFsbGVyIHRoZSBjb3N0IGZvciBvbGRlclxuICAgICAgICBjdXJyZW50VGltZUNvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIERhdGVVdGlscy5ub3coKTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuXG4gICAgUmVjdXJ2ZS5TdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZy5qc1wiKTtcbiAgICBSZWN1cnZlLldpbmRvd1V0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvd2luZG93LmpzXCIpO1xuICAgIFJlY3VydmUuQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2FycmF5LmpzXCIpO1xuICAgIFJlY3VydmUuRGF0ZVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvZGF0ZS5qc1wiKTtcbiAgICBSZWN1cnZlLk9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xuXG4gICAgUmVjdXJ2ZS5hc3NlcnQgPSByZXF1aXJlKFwiLi9hc3NlcnQuanNcIik7XG5cbiAgICBSZWN1cnZlLlByb3RvID0gcmVxdWlyZShcIi4vcHJvdG8uanNcIik7XG4gICAgUmVjdXJ2ZS5DYWNoZSA9IHJlcXVpcmUoXCIuL2NhY2hlLmpzXCIpO1xuICAgIFJlY3VydmUuTG9nID0gcmVxdWlyZShcIi4vbG9nL2xvZy5qc1wiKTtcbiAgICBSZWN1cnZlLkxvZ0NvbnNvbGVUYXJnZXQgPSByZXF1aXJlKFwiLi9sb2cvbG9nLWNvbnNvbGUuanNcIik7XG4gICAgUmVjdXJ2ZS5TaWduYWwgPSByZXF1aXJlKFwiLi9zaWduYWwuanNcIik7XG4gICAgUmVjdXJ2ZS5IdHRwID0gcmVxdWlyZShcIi4vaHR0cC9odHRwLmpzXCIpO1xuICAgIFJlY3VydmUuR2xvYmFsRXJyb3JIYW5kbGVyID0gcmVxdWlyZShcIi4vZ2xvYmFsLWVycm9yLWhhbmRsZXIuanNcIik7XG4gICAgUmVjdXJ2ZS5Mb2NhbFN0b3JhZ2UgPSByZXF1aXJlKFwiLi9zdG9yYWdlL2xvY2FsLXN0b3JhZ2UuanNcIik7XG4gICAgUmVjdXJ2ZS5TZXNzaW9uU3RvcmFnZSA9IHJlcXVpcmUoXCIuL3N0b3JhZ2Uvc2Vzc2lvbi1zdG9yYWdlLmpzXCIpO1xuICAgIFJlY3VydmUuUGVyZm9ybWFuY2VNb25pdG9yID0gcmVxdWlyZShcIi4vcGVyZm9ybWFuY2UtbW9uaXRvci5qc1wiKTtcbiAgICBSZWN1cnZlLkxhenlMb2FkID0gcmVxdWlyZShcIi4vbGF6eS1sb2FkLmpzXCIpO1xuXG4gICAgd2luZG93LlJlY3VydmUgPSBSZWN1cnZlO1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcHJvdG8uanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9zdHJpbmcuanNcIik7XG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2FycmF5LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG5cbiAgICAvKipcbiAgICAgKiBOT1RFLCBJZiB5b3VyIEpTIGlzIGhvc3RlZCBvbiBhIENETiB0aGVuIHRoZSBicm93c2VyIHdpbGwgc2FuaXRpemUgYW5kIGV4Y2x1ZGUgYWxsIGVycm9yIG91dHB1dFxuICAgICAqIHVubGVzcyBleHBsaWNpdGx5IGVuYWJsZWQuIFNlZSBUT0RPIFRCRCB0dXRvcmlhbCBsaW5rXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb25FcnJvciwgY2FsbGJhY2sgZGVjbGFyYXRpb246IG9uRXJyb3IoZGVzY3JpcHRpb24sIGVycm9yKSwgZXJyb3Igd2lsbCBiZSB1bmRlZmluZWQgaWYgbm90IHN1cHBvcnRlZCBieSBicm93c2VyXG4gICAgICogQHBhcmFtIGVuYWJsZWQsIGRlZmF1bHQgdHJ1ZVxuICAgICAqIEBwYXJhbSBwcmV2ZW50QnJvd3NlckhhbmRsZSwgZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgIGZ1bmN0aW9uIGN0b3Iob25FcnJvciwgZW5hYmxlZCwgcHJldmVudEJyb3dzZXJIYW5kbGUpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gZW5hYmxlZCkge1xuICAgICAgICAgICAgZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBwcmV2ZW50QnJvd3NlckhhbmRsZSkge1xuICAgICAgICAgICAgcHJldmVudEJyb3dzZXJIYW5kbGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlID0gcHJldmVudEJyb3dzZXJIYW5kbGU7XG4gICAgICAgIHRoaXMuX29uRXJyb3IgPSBvbkVycm9yO1xuXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gdGhpcy5fZXJyb3JIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXAgbWV0aG9kIGluIHRyeS4uY2F0Y2ggYW5kIGhhbmRsZSBlcnJvciB3aXRob3V0IHJhaXNpbmcgdW5jYXVnaHQgZXJyb3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZFxuICAgICAgICAgKiBAcGFyYW0gWywgYXJnMiwgLi4uLCBhcmdOXSwgbGlzdCBvZiBhcmd1bWVudHMgZm9yIG1ldGhvZFxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkSW52b2tlOiBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICBtZXRob2QuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaWJlRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlIGVycm9yIGFzIHdvdWxkIGJlIGRvbmUgZm9yIHVuY2F1Z2h0IGdsb2JhbCBlcnJvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXJyb3IsIGFueSB0eXBlIG9mIGVycm9yIChzdHJpbmcsIG9iamVjdCwgRXJyb3IpXG4gICAgICAgICAqIEBwYXJhbSBkZXNjcmlwdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKGVycm9yLCBkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX29uRXJyb3IpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25FcnJvcihlcnJvciwgZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJldmVudEJyb3dzZXJIYW5kbGU7XG4gICAgICAgIH0sXG5cblxuICAgICAgICBkZXNjcmliZUVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb247XG5cbiAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc1N0cmluZyhlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoT2JqZWN0VXRpbHMuaXNFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yLm1lc3NhZ2UgKyBcIlxcblwiICsgZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChPYmplY3RVdGlscy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXJyb3JIYW5kbGVyOiBmdW5jdGlvbihtZXNzYWdlLCBmaWxlbmFtZSwgbGluZSwgY29sdW1uLCBlcnJvcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBTdHJpbmdVdGlscy5mb3JtYXQoXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlOiB7MH0sIGZpbGU6IHsxfSwgbGluZTogezJ9XCIsIG1lc3NhZ2UsIGZpbGVuYW1lLCBsaW5lKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9IFN0cmluZ1V0aWxzLmZvcm1hdChcIiwgc3RhY2s6IHswfVwiLCBlcnJvci5zdGFjayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vbkVycm9yKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9kYXRlLmpzXCIpO1xudmFyIFdpbmRvd1V0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL3dpbmRvdy5qc1wiKTtcbnZhciBTaWduYWwgPSByZXF1aXJlKFwiLi4vc2lnbmFsLmpzXCIpO1xudmFyIFByb3RvID0gcmVxdWlyZShcIi4uL3Byb3RvLmpzXCIpO1xuXG52YXIgSHR0cCA9IHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBhbGw6IHt9LFxuXG4gICAgICAgICAgICBnZXQ6IHt9LFxuICAgICAgICAgICAgcG9zdDoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCIgOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHB1dDoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCIgOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWQ6IHt9LFxuICAgICAgICAgICAgXCJkZWxldGVcIjoge30sXG4gICAgICAgICAgICBqc29ucDoge30sXG4gICAgICAgICAgICBzY3JpcHQ6IHt9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG5cbiAgICAgICAgY2FjaGU6IHRydWUsXG5cbiAgICAgICAgc2VyaWFsaXplciA6IFtkZWZhdWx0U2VyaWFsaXplcl0sXG4gICAgICAgIHBhcnNlciA6IFtkZWZhdWx0UGFyc2VyXSxcblxuICAgICAgICByZXF1ZXN0RmFjdG9yeTogRGVmYXVsdFJlcXVlc3RGYWN0b3J5LFxuICAgICAgICBkZWZlcnJlZEZhY3Rvcnk6IERlZmF1bHREZWZlcnJlZEZhY3RvcnksXG5cbiAgICAgICAgZXJyb3JPbkNhbmNlbDogdHJ1ZSxcbiAgICAgICAgZW11bGF0ZUh0dHA6IGZhbHNlXG4gICAgfSxcblxuICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHdpdGhEZWZhdWx0cyA9IGNyZWF0ZU9wdGlvbnNXaXRoRGVmYXVsdHMob3B0aW9ucywgSHR0cC5kZWZhdWx0cyk7XG5cbiAgICAgICAgdXBkYXRlVXJsKHdpdGhEZWZhdWx0cyk7XG4gICAgICAgIHVwZGF0ZUhlYWRlcnMod2l0aERlZmF1bHRzKTtcbiAgICAgICAgdXBkYXRlRGF0YSh3aXRoRGVmYXVsdHMpO1xuICAgICAgICBzZXJpYWxpemVEYXRhKHdpdGhEZWZhdWx0cyk7XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gd2l0aERlZmF1bHRzLmRlZmVycmVkRmFjdG9yeSh3aXRoRGVmYXVsdHMpO1xuICAgICAgICB2YXIgcmVxdWVzdCA9IHdpdGhEZWZhdWx0cy5yZXF1ZXN0RmFjdG9yeSh3aXRoRGVmYXVsdHMsIGRlZmVycmVkKTtcblxuICAgICAgICBkZWZlcnJlZC5yZXF1ZXN0ID0gZGVmZXJyZWQ7XG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwiZ2V0XCIsIHVybDogdXJsfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIHBvc3Q6IGZ1bmN0aW9uKHVybCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwicG9zdFwiLCB1cmw6IHVybCwgZGF0YTogZGF0YX0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBqc29ucDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJqc29ucFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBkZWxldGU6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwiZGVsZXRlXCIsIHVybDogdXJsfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGhlYWQ6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwiaGVhZFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBwdXQ6IGZ1bmN0aW9uKHVybCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwicHV0XCIsIHVybDogdXJsLCBkYXRhOiBkYXRhfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIHBhdGNoOiBmdW5jdGlvbih1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcInBhdGNoXCIsIHVybDogdXJsLCBkYXRhOiBkYXRhfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGdldFNjcmlwdDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJzY3JpcHRcIiwgdXJsOiB1cmx9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG59O1xuXG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXJpYWxpemVyKGRhdGEsIGNvbnRlbnRUeXBlKSB7XG4gICAgdmFyIGlnbm9yZUNhc2UgPSB0cnVlO1xuXG4gICAgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGNvbnRlbnRUeXBlLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLCBpZ25vcmVDYXNlKSkge1xuICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNPYmplY3QoZGF0YSkgJiYgIU9iamVjdFV0aWxzLmlzRmlsZShkYXRhKSkge1xuICAgICAgICAgICAgZGF0YSA9IE9iamVjdFV0aWxzLnRvRm9ybURhdGEoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoU3RyaW5nVXRpbHMuY29udGFpbnMoY29udGVudFR5cGUsIFwiYXBwbGljYXRpb24vanNvblwiLCBpZ25vcmVDYXNlKSkge1xuICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNPYmplY3QoZGF0YSkgJiYgIU9iamVjdFV0aWxzLmlzRmlsZShkYXRhKSkge1xuICAgICAgICAgICAgZGF0YSA9IE9iamVjdFV0aWxzLnRvSnNvbihkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gZG8gbm90aGluZyAtIG5vdGhpbmcgdG8gc2VyaWFsaXplXG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbkh0dHAuc2VyaWFsaXplciA9IGRlZmF1bHRTZXJpYWxpemVyO1xuXG5cbmZ1bmN0aW9uIGRlZmF1bHRQYXJzZXIoeGhyLCBhY2NlcHQpIHtcbiAgICB2YXIgZGF0YTtcbiAgICB2YXIgaWdub3JlQ2FzZSA9IHRydWU7XG5cbiAgICBpZiAoU3RyaW5nVXRpbHMuY29udGFpbnMoYWNjZXB0LCBcImFwcGxpY2F0aW9uL3htbFwiLCBpZ25vcmVDYXNlKSB8fFxuICAgICAgICBTdHJpbmdVdGlscy5jb250YWlucyhhY2NlcHQsIFwidGV4dC94bWxcIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgZGF0YSA9IHhoci5yZXNwb25zZVhNTDtcbiAgICB9XG4gICAgZWxzZSBpZiAoU3RyaW5nVXRpbHMuY29udGFpbnMoYWNjZXB0LCBcImFwcGxpY2F0aW9uL2pzb25cIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEgPSBPYmplY3RVdGlscy50b0pzb24oeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRhdGEgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5IdHRwLnBhcnNlciA9IGRlZmF1bHRQYXJzZXI7XG5cblxuZnVuY3Rpb24gRGVmYXVsdFJlcXVlc3RGYWN0b3J5KG9wdGlvbnMsIGRlZmVycmVkKSB7XG4gICAgdmFyIHJlcXVlc3Q7XG5cbiAgICBpZiAoU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJqc29ucFwiLCBvcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgICAgcmVxdWVzdCA9IG5ldyBKc29ucFJlcXVlc3Qob3B0aW9ucywgZGVmZXJyZWQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChvcHRpb25zLmNyb3NzRG9tYWluICYmXG4gICAgICAgIFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwic2NyaXB0XCIsIG9wdGlvbnMubWV0aG9kKSkge1xuICAgICAgICByZXF1ZXN0ID0gbmV3IENyb3NzRG9tYWluU2NyaXB0UmVxdWVzdChvcHRpb25zLCBkZWZlcnJlZCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXF1ZXN0ID0gbmV3IFhocihvcHRpb25zLCBkZWZlcnJlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcXVlc3Q7XG59O1xuXG5IdHRwLlJlcXVlc3RGYWN0b3J5ID0gRGVmYXVsdFJlcXVlc3RGYWN0b3J5O1xuXG5cbmZ1bmN0aW9uIERlZmF1bHREZWZlcnJlZEZhY3RvcnkoKSB7XG4gICAgcmV0dXJuIG5ldyBIdHRwRGVmZXJyZWQoKTtcbn07XG5cbkh0dHAuRGVmZXJyZWRGYWN0b3J5ID0gRGVmYXVsdERlZmVycmVkRmFjdG9yeTtcblxuXG5mdW5jdGlvbiBRRGVmZXJyZWRGYWN0b3J5KCkge1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgIGRlZmVycmVkLnByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uKG9uU3VjY2Vzcykge1xuICAgICAgICBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIG9uU3VjY2VzcyhcbiAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uKG9uRXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucHJvbWlzZS50aGVuKG51bGwsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBvbkVycm9yKFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzLCByZXNwb25zZS5vcHRpb25zLCByZXNwb25zZS5jYW5jZWxlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9kZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG5cbiAgICBkZWZlcnJlZC5wcm9taXNlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWZlcnJlZC5yZXF1ZXN0LmNhbmNlbCgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmZXJyZWQ7XG59O1xuXG5IdHRwLlFEZWZlcnJlZEZhY3RvcnkgPSBRRGVmZXJyZWRGYWN0b3J5O1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZU9wdGlvbnNXaXRoRGVmYXVsdHMob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIgd2l0aERlZmF1bHRzID0gT2JqZWN0VXRpbHMuZXh0ZW5kKHt9LCBkZWZhdWx0cyk7XG5cbiAgICB3aXRoRGVmYXVsdHMuaGVhZGVycyA9IHt9O1xuICAgIG1lcmdlSGVhZGVycyhvcHRpb25zLm1ldGhvZCwgd2l0aERlZmF1bHRzLCBkZWZhdWx0cy5oZWFkZXJzKTtcblxuICAgIE9iamVjdFV0aWxzLmV4dGVuZCh3aXRoRGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHdpdGhEZWZhdWx0cztcbn1cblxuZnVuY3Rpb24gbWVyZ2VIZWFkZXJzKG1ldGhvZCwgb3B0aW9ucywgZGVmYXVsdEhlYWRlcnMpIHtcbiAgICBtZXRob2QgPSBtZXRob2QudG9Mb3dlckNhc2UoKTtcblxuICAgIE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCBkZWZhdWx0SGVhZGVycy5hbGwpO1xuICAgIE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCBkZWZhdWx0SGVhZGVyc1ttZXRob2RdKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVXJsKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuY2FjaGUpIHtcbiAgICAgICAgb3B0aW9ucy5wYXJhbXMuY2FjaGUgPSBEYXRlVXRpbHMubm93KCk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy51cmwgPVxuICAgICAgICBTdHJpbmdVdGlscy5hZGRQYXJhbWV0ZXJzVG9VcmwoXG4gICAgICAgICAgICBvcHRpb25zLnVybCwgb3B0aW9ucy5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIZWFkZXJzKG9wdGlvbnMpIHtcbiAgICBhZGRBY2NlcHRIZWFkZXIob3B0aW9ucyk7XG4gICAgYWRkUmVxdWVzdGVkV2l0aEhlYWRlcihvcHRpb25zKTtcbiAgICByZW1vdmVDb250ZW50VHlwZShvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gYWRkQWNjZXB0SGVhZGVyKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzLkFjY2VwdCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFjY2VwdCA9IFwiKi8qXCI7XG4gICAgdmFyIGRhdGFUeXBlID0gb3B0aW9ucy5kYXRhVHlwZTtcblxuICAgIGlmIChkYXRhVHlwZSkge1xuICAgICAgICBkYXRhVHlwZSA9IGRhdGFUeXBlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgaWYgKFwidGV4dFwiID09PSBkYXRhVHlwZSkge1xuICAgICAgICAgICAgYWNjZXB0ID0gXCJ0ZXh0L3BsYWluLCovKjtxPTAuMDFcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcImh0bWxcIiA9PT0gZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIGFjY2VwdCA9IFwidGV4dC9odG1sLCovKjtxPTAuMDFcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcInhtbFwiID09PSBkYXRhVHlwZSkge1xuICAgICAgICAgICAgYWNjZXB0ID0gXCJhcHBsaWNhdGlvbi94bWwsdGV4dC94bWwsKi8qO3E9MC4wMVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwianNvblwiID09PSBkYXRhVHlwZSB8fCBcInNjcmlwdFwiID09PSBkYXRhVHlwZSkge1xuICAgICAgICAgICAgYWNjZXB0ID0gXCJhcHBsaWNhdGlvbi9qc29uLHRleHQvamF2YXNjcmlwdCwqLyo7cT0wLjAxXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIC0gZGVmYXVsdCB0byBhbGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wdGlvbnMuaGVhZGVycy5BY2NlcHQgPSBhY2NlcHQ7XG59XG5cbmZ1bmN0aW9uIGFkZFJlcXVlc3RlZFdpdGhIZWFkZXIob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5jcm9zc0RvbWFpbiAmJlxuICAgICAgICAhb3B0aW9ucy5oZWFkZXJzW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXSAmJlxuICAgICAgICAhU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJzY3JpcHRcIiwgb3B0aW9ucy5kYXRhVHlwZSkpIHtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXSA9IFwiWE1MSHR0cFJlcXVlc3RcIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNvbnRlbnRUeXBlKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgT2JqZWN0VXRpbHMuZm9yRWFjaChvcHRpb25zLmhlYWRlcnMsIGZ1bmN0aW9uKHZhbHVlLCBoZWFkZXIpIHtcbiAgICAgICAgaWYgKFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwiY29udGVudC10eXBlXCIsIGhlYWRlcikpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLmhlYWRlcnNbaGVhZGVyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVEYXRhKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuZW11bGF0ZUh0dHApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJwdXRcIiwgb3B0aW9ucy5tZXRob2QpIHx8XG4gICAgICAgICFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInBhdGNoXCIsIG9wdGlvbnMubWV0aG9kKSB8fFxuICAgICAgICAhU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJkZWxldGVcIiwgb3B0aW9ucy5tZXRob2QpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvcHRpb25zLmRhdGEuX21ldGhvZCA9IG9wdGlvbnMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuICAgIGlmIChPYmplY3RVdGlscy5pc0Z1bmN0aW9uKG9wdGlvbnMuc2VyaWFsaXplcikpIHtcbiAgICAgICAgZGF0YSA9IG9wdGlvbnMuc2VyaWFsaXplcihkYXRhLCB0aGlzLl9vcHRpb25zLmNvbnRlbnRUeXBlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2gob3B0aW9ucy5zZXJpYWxpemVyLCBmdW5jdGlvbihzZXJpYWxpemVyKSB7XG4gICAgICAgICAgICBkYXRhID0gc2VyaWFsaXplcihkYXRhLCBvcHRpb25zLmNvbnRlbnRUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5kYXRhID0gZGF0YTtcbn1cblxuXG52YXIgSHR0cERlZmVycmVkID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9zdWNjZWVkZWQgPSBuZXcgU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuX2Vycm9yZWQgPSBuZXcgU2lnbmFsKCk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcmVzb2x2ZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC50cmlnZ2VyKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuVXAoKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWplY3Q6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9lcnJvcmVkLnRyaWdnZXIocmVzcG9uc2UpO1xuICAgICAgICAgICAgdGhpcy5fY2xlYW5VcCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByb21pc2U6IHtcbiAgICAgICAgICAgIHRoZW46IGZ1bmN0aW9uKG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC5hZGRPbmNlKG9uU3VjY2Vzcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5hZGRPbmNlKG9uRXJyb3IpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ob25TdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLmFkZE9uY2UoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsIHJlc3BvbnNlLm9wdGlvbnMsIHJlc3BvbnNlLmNhbmNlbGVkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5hZGRPbmNlKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IocmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdCAmJiB0aGlzLnJlcXVlc3QuY2FuY2VsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NsZWFuVXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLnJlbW92ZUFsbCgpO1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG5cblxudmFyIHJlcXVlc3RJZCA9IDA7XG5cbnZhciBYaHIgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWN1cnZlIG9ubHkgc3VwcG9ydHMgSUU4K1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY29uZmlnKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3hoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPVxuICAgICAgICAgICAgICAgIE9iamVjdFV0aWxzLmJpbmQodGhpcy5fc3RhdGVDaGFuZ2VIYW5kbGVyLCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5feGhyLm9wZW4odGhpcy5fb3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKSwgdGhpcy5fb3B0aW9ucy51cmwsIHRydWUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5iZWZvcmVTZW5kKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3B0aW9ucy5iZWZvcmVTZW5kKHRoaXMuX3hociwgdGhpcy5fb3B0aW9ucyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3hoci5zZW5kKHRoaXMuX29wdGlvbnMuZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FuY2VsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX3hocikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3hoci5hYm9ydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9jb25maWc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fYWRkSGVhZGVycygpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl94aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZW91dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3hoci50aW1lb3V0ID0gdGhpcy5fb3B0aW9ucy50aW1lb3V0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5yZXNwb25zZVR5cGUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fb3B0aW9ucy5yZXNwb25zZVR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NzM2NDhcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIHdpbGwgdGhyb3cgZXJyb3IgZm9yIFwianNvblwiIG1ldGhvZCwgaWdub3JlIHRoaXMgc2luY2VcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgY2FuIGhhbmRsZSBpdFxuICAgICAgICAgICAgICAgICAgICBpZiAoIVN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwianNvblwiLCB0aGlzLl9vcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9hZGRIZWFkZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fb3B0aW9ucy5oZWFkZXJzLCBmdW5jdGlvbih2YWx1ZSwgaGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3N0YXRlQ2hhbmdlSGFuZGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoNCAhPT0gdGhpcy5feGhyLnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1N1Y2Nlc3MoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZVN1Y2Nlc3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2lzU3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FuY2VsZWQgJiYgdGhpcy5fb3B0aW9ucy5lcnJvck9uQ2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3RhdHVzID0gdGhpcy5feGhyLnN0YXR1cztcblxuICAgICAgICAgICAgcmV0dXJuICgyMDAgPD0gc3RhdHVzICYmIDMwMCA+IHN0YXR1cykgfHxcbiAgICAgICAgICAgICAgICAzMDQgPT09IHN0YXR1cyB8fFxuICAgICAgICAgICAgICAgICgwID09PSBzdGF0dXMgJiYgV2luZG93VXRpbHMuaXNGaWxlUHJvdG9jb2woKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2hhbmRsZVN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkYXRhO1xuXG4gICAgICAgICAgICBpZiAoU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJzY3JpcHRcIiwgdGhpcy5fb3B0aW9ucy5kYXRhVHlwZSkpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fcmVxdWVzdC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgV2luZG93VXRpbHMuZ2xvYmFsRXZhbChkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9wYXJzZVJlc3BvbnNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihcInVuYWJsZSB0byBwYXJzZSByZXNwb25zZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUodHJ1ZSwgZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2hhbmRsZUVycm9yOiBmdW5jdGlvbihzdGF0dXNUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZShmYWxzZSwgbnVsbCwgc3RhdHVzVGV4dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbXBsZXRlOiBmdW5jdGlvbihzdWNjZXNzLCBkYXRhLCBzdGF0dXNUZXh0KSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXMgOiB0aGlzLl94aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQgOiBzdGF0dXNUZXh0ID8gc3RhdHVzVGV4dCA6IHRoaXMuX3hoci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgIGhlYWRlcnMgOiB0aGlzLl94aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCksXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA6IHRoaXMuX29wdGlvbnMsXG4gICAgICAgICAgICAgICAgY2FuY2VsZWQgOiB0aGlzLl9jYW5jZWxlZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3BhcnNlUmVzcG9uc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFjY2VwdCA9ICB0aGlzLl9vcHRpb25zLmhlYWRlcnMgJiYgdGhpcy5fb3B0aW9ucy5oZWFkZXJzLkFjY2VwdDtcbiAgICAgICAgICAgIGlmICghYWNjZXB0KSB7XG4gICAgICAgICAgICAgICAgYWNjZXB0ID0gdGhpcy5feGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGE7XG5cbiAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc0Z1bmN0aW9uKHRoaXMuX29wdGlvbnMuc2VyaWFsaXplcikpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fb3B0aW9ucy5wYXJzZXIodGhpcy5feGhyKSwgYWNjZXB0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaCh0aGlzLl9vcHRpb25zLnBhcnNlciwgZnVuY3Rpb24ocGFyc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBwYXJzZXIodGhpcy5feGhyLCBhY2NlcHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuXG5cbnZhciBKc29ucFJlcXVlc3QgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJZCA9IFwiUmVjdXJ2ZUpzb25QQ2FsbGJhY2tcIiArIHRoaXMuX2lkO1xuICAgICAgICAgICAgdmFyIHVybCA9IFN0cmluZ1V0aWxzLnJlbW92ZVBhcmFtZXRlckZyb21VcmwodGhpcy5fb3B0aW9ucy51cmwsIFwiY2FsbGJhY2tcIik7XG4gICAgICAgICAgICB1cmwgPSBTdHJpbmdVdGlscy5hZGRQYXJhbWV0ZXJzVG9VcmwodXJsLCB7Y2FsbGJhY2s6IGNhbGxiYWNrSWR9KTtcblxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gdXJsO1xuICAgICAgICAgICAgc2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgICAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcblxuICAgICAgICAgICAgdmFyIGNhbGxlZDtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbGJhY2tIYW5kbGVyKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuX2NhbmNlbGVkICYmIHRoYXQuX29wdGlvbnMuZXJyb3JPbkNhbmNlbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY29tcGxldGUodHJ1ZSwgZGF0YSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRFcnJvckhhbmRsZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB3aW5kb3dbY2FsbGJhY2tJZF07XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQgJiYgXCJsb2FkXCIgPT09IGV2ZW50LnR5cGUgJiYgIWNhbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jb21wbGV0ZShmYWxzZSwgbnVsbCwgNDA0LCBcImpzb25wIGNhbGxiYWNrIG5vdCBjYWxsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUT0RPIFRCRCBpZiBnb2luZyB0byBzdXBwb3J0IElFOCB0aGVuIG5lZWQgdG8gY2hlY2sgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBhcyB3ZWxsXG4gICAgICAgICAgICAvLyBodHRwOi8vcGllaXNnb29kLm9yZy90ZXN0L3NjcmlwdC1saW5rLWV2ZW50cy9cbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgIHdpbmRvd1tjYWxsYmFja0lkXSA9IGNhbGxiYWNrSGFuZGxlcjtcblxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbXBsZXRlOiBmdW5jdGlvbihzdWNjZXNzLCBkYXRhLCBzdGF0dXMsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogdGhpcy5fb3B0aW9ucyxcbiAgICAgICAgICAgICAgICBjYW5jZWxlZDogdGhpcy5fY2FuY2VsZWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWZlcnJlZC5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXSk7XG5cbnZhciBDcm9zc0RvbWFpblNjcmlwdFJlcXVlc3QgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB0aGlzLl9vcHRpb25zLnVybDtcbiAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEVycm9ySGFuZGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIFwiZXJyb3JcIiA9PT0gZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9kZWZlcnJlZC5yZWplY3Qoe3N0YXR1czogNDA0LCBjYW5jZWxlZDogdGhhdC5fY2FuY2VsZWR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2RlZmVycmVkLnJlc29sdmUoe3N0YXR1czogMjAwLCBjYW5jZWxlZDogdGhhdC5fY2FuY2VsZWR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRPRE8gVEJEIGlmIGdvaW5nIHRvIHN1cHBvcnQgSUU4IHRoZW4gbmVlZCB0byBjaGVjayBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGFzIHdlbGxcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9waWVpc2dvb2Qub3JnL3Rlc3Qvc2NyaXB0LWxpbmstZXZlbnRzL1xuICAgICAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERvbVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvZG9tLmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBqczogZnVuY3Rpb24odXJsLCBvbkNvbXBsZXRlLCBvbkVycm9yKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gRG9tVXRpbHMuY3JlYXRlRWxlbWVudChcImxpbmtcIiwge3R5cGU6IFwidGV4dC9jc3NcIiwgcmVsOiBcInN0eWxlc2hlZXRcIiwgaHJlZjogdXJsfSk7XG4gICAgICAgIGxvYWQoZWxlbWVudCwgb25Db21wbGV0ZSwgb25FcnJvcik7XG4gICAgfSxcblxuICAgIGNzczogZnVuY3Rpb24odXJsLCBvbkNvbXBsZXRlLCBvbkVycm9yKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gRG9tVXRpbHMuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiLCB7dHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiB1cmx9KTtcbiAgICAgICAgbG9hZChlbGVtZW50LCBvbkNvbXBsZXRlLCBvbkVycm9yKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBsb2FkKGVsZW1lbnQsIG9uQ29tcGxldGUsIG9uRXJyb3IpIHtcbiAgICBmdW5jdGlvbiByZWFkeVN0YXRlSGFuZGxlcigpIHtcbiAgICAgICAgaWYgKFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwibG9hZGVkXCIsIGVsZW1lbnQucmVhZHlTdGF0ZSkgfHxcbiAgICAgICAgICAgIFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwiY29tcGxldGVcIiwgZWxlbWVudC5yZWFkeVN0YXRlKSkge1xuICAgICAgICAgICAgbG9hZGVkSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZGVkSGFuZGxlcigpIHtcbiAgICAgICAgY2xlYXJDYWxsYmFja3MoKTtcbiAgICAgICAgb25Db21wbGV0ZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlcihldmVudCkge1xuICAgICAgICBjbGVhckNhbGxiYWNrcygpO1xuICAgICAgICBvbkVycm9yKGV2ZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckNhbGxiYWNrcygpIHtcbiAgICAgICAgZWxlbWVudC5vbmxvYWQgPSBudWxsO1xuICAgICAgICBlbGVtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgIGVsZW1lbnQub25lcnJvciA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gTWFpbnRhaW4gZXhlY3V0aW9uIG9yZGVyXG4gICAgLy8gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0R5bmFtaWNfU2NyaXB0X0V4ZWN1dGlvbl9PcmRlclxuICAgIC8vIGh0dHA6Ly93d3cubmN6b25saW5lLm5ldC9ibG9nLzIwMTAvMTIvMjEvdGhvdWdodHMtb24tc2NyaXB0LWxvYWRlcnMvXG4gICAgZWxlbWVudC5hc3luYyA9IGZhbHNlO1xuICAgIGVsZW1lbnQuZGVmZXIgPSBmYWxzZTtcblxuICAgIC8vIGh0dHA6Ly9waWVpc2dvb2Qub3JnL3Rlc3Qvc2NyaXB0LWxpbmstZXZlbnRzL1xuICAgIC8vIFRPRE8gVEJEIGxpbmsgdGFncyBkb24ndCBzdXBwb3J0IGFueSB0eXBlIG9mIGxvYWQgY2FsbGJhY2sgb24gb2xkIFdlYktpdCAoU2FmYXJpIDUpXG4gICAgLy8gVE9ETyBUQkQgaWYgbm90IGdvaW5nIHRvIHN1cHBvcnQgSUU4IHRoZW4gZG9uJ3QgbmVlZCB0byB3b3JyeSBhYm91dCBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgICBpZiAoRG9tVXRpbHMuZWxlbWVudFN1cHBvcnRzT25FdmVudChlbGVtZW50LCBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiKSkge1xuICAgICAgICBlbGVtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHJlYWR5U3RhdGVIYW5kbGVyXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBlbGVtZW50Lm9ubG9hZCA9IGxvYWRlZEhhbmRsZXI7XG4gICAgfVxuXG4gICAgZWxlbWVudC5vbmVycm9yID0gZXJyb3JIYW5kbGVyO1xuXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4uL3Byb3RvLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcigpIHtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGRlYnVnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS5kZWJ1Zykge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5kZWJ1Zy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICB3YXJuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZSAmJiBjb25zb2xlLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9XG5dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi4vcHJvdG8uanNcIik7XG52YXIgQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9hcnJheS5qc1wiKTtcbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9zdHJpbmcuanNcIik7XG52YXIgTG9nVGFyZ2V0ID0gcmVxdWlyZShcIi4vbG9nLWNvbnNvbGUuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHRhcmdldHMsIGFycmF5IG9mIHRhcmdldHMgdG8gbG9nIHRvIChzZWUgUmVjdXJ2ZS5Mb2dDb25zb2xlVGFyZ2V0IGFzIGV4YW1wbGUpLlxuICAgICAqIERlZmF1bHRzIHRvIFJlY3VydmUuTG9nQ29uc29sZVRhcmdldFxuICAgICAqIEBwYXJhbSBlbmFibGVkLCBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICAgZnVuY3Rpb24gY3RvcihlbmFibGVkLCB0YXJnZXRzKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGVuYWJsZWQpIHtcbiAgICAgICAgICAgIGVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdGFyZ2V0cykge1xuICAgICAgICAgICAgdGFyZ2V0cyA9IFtuZXcgTG9nVGFyZ2V0KCldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YXJnZXRzID0gdGFyZ2V0cztcbiAgICAgICAgdGhpcy5kaXNhYmxlKCFlbmFibGVkKTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogTG9nIGluZm8gdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mbzogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2luZm9EaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiaW5mb1wiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2cgZGVidWcgdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWc6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZWJ1Z0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJkZWJ1Z1wiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2cgd2FybmluZyB0byBhbGwgdGFyZ2V0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICB3YXJuOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fd2FybkRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJ3YXJuXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZyBlcnJvciB0byBhbGwgdGFyZ2V0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBlcnJvcjogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Vycm9yRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcImVycm9yXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFyIGxvZyBmb3IgYWxsIHRhcmdldHNcbiAgICAgICAgICovXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnRhcmdldHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzW2luZGV4XS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGVidWdEaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5faW5mb0Rpc2FibGVkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl93YXJuRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBkZWJ1Z0Rpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGVidWdEaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGluZm9EaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2luZm9EaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIHdhcm5EaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3dhcm5EaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGVycm9yRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9lcnJvckRpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2xvZzogZnVuY3Rpb24odHlwZSwgbWVzc2FnZSwgYXJncykge1xuICAgICAgICAgICAgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmdzLCAxKTtcbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHRoaXMuX2Rlc2NyaXB0aW9uKHR5cGUudG9VcHBlckNhc2UoKSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnRhcmdldHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzW2luZGV4XVt0eXBlXS5hcHBseSh0aGlzLnRhcmdldHNbaW5kZXhdLCBbZGVzY3JpcHRpb24sIG1lc3NhZ2VdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2Rlc2NyaXB0aW9uOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICB2YXIgdGltZSA9IFN0cmluZ1V0aWxzLmZvcm1hdFRpbWUobmV3IERhdGUoKSk7XG4gICAgICAgICAgICByZXR1cm4gXCJbXCIgKyB0eXBlICsgXCJdIFwiICsgdGltZTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi9wcm90by5qc1wiKTtcbnZhciBEYXRlVXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9kYXRlLmpzXCIpO1xudmFyIExvZyA9IHJlcXVpcmUoXCIuL2xvZy9sb2cuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKGxvZywgZW5hYmxlZCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBsb2cpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZyA9IG5ldyBMb2coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGVuYWJsZWQpIHtcbiAgICAgICAgICAgIGVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNhYmxlKCFlbmFibGVkKTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBzdGFydDogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFRpbWVyKHRoaXMuX2xvZywgbWVzc2FnZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW5kOiBmdW5jdGlvbih0aW1lciwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNhYmxlZCB8fCAhdGltZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRpbWVyLmVuZChkZXNjcmlwdGlvbik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG5cblxudmFyIFRpbWVyID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbihsb2csIG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZyA9IGxvZztcblxuICAgICAgICAgICAgaWYgKHN1cHBvcnRzQ29uc29sZVRpbWUoKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUudGltZShtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IERhdGVVdGlscy5wZXJmb3JtYW5jZU5vdygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgfSxcblxuICAgICAgICBlbmQ6IGZ1bmN0aW9uKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAoc3VwcG9ydHNDb25zb2xlVGltZSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKHRoaXMuX21lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nLmluZm8odGhpcy5fbWVzc2FnZSArIFwiOiBcIiArIChEYXRlVXRpbHMucGVyZm9ybWFuY2VOb3coKSAtIHRoaXMuX3N0YXJ0VGltZSkgKyBcIiBtc1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nLmluZm8oZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXSk7XG5cbmZ1bmN0aW9uIHN1cHBvcnRzQ29uc29sZVRpbWUoKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUgJiYgY29uc29sZS50aW1lICYmIGNvbnNvbGUudGltZUVuZDtcbn0iLCJ2YXIgZG9udEludm9rZUNvbnN0cnVjdG9yID0ge307XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiB2YWx1ZTtcbn1cblxudmFyIFByb3RvID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gZG8gbm90aGluZ1xufTtcblxuLyoqXG4gKiBDcmVhdGUgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIG9iamVjdFxuICpcbiAqIEBwYXJhbSBvcHRpb25zICAgYXJyYXkgY29uc2lzdGluZyBvZiBjb25zdHJ1Y3RvciwgcHJvdG90eXBlL1wibWVtYmVyXCIgdmFyaWFibGVzL2Z1bmN0aW9ucyxcbiAqICAgICAgICAgICAgICAgICAgYW5kIG5hbWVzcGFjZS9cInN0YXRpY1wiIHZhcmlhYmxlcy9mdW5jdGlvblxuICovXG5Qcm90by5kZWZpbmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zIHx8IDAgPT09IG9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBwb3NzaWJsZUNvbnN0cnVjdG9yID0gb3B0aW9uc1swXTtcblxuICAgIHZhciBwcm9wZXJ0aWVzO1xuICAgIHZhciBzdGF0aWNQcm9wZXJ0aWVzO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24ocG9zc2libGVDb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgcHJvcGVydGllcyA9IDEgPCBvcHRpb25zLmxlbmd0aCA/IG9wdGlvbnNbMV0gOiB7fTtcbiAgICAgICAgcHJvcGVydGllc1sgXCIkY3RvclwiIF0gPSBwb3NzaWJsZUNvbnN0cnVjdG9yO1xuXG4gICAgICAgIHN0YXRpY1Byb3BlcnRpZXMgPSBvcHRpb25zWzJdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcHJvcGVydGllcyA9IG9wdGlvbnNbMF07XG4gICAgICAgIHN0YXRpY1Byb3BlcnRpZXMgPSBvcHRpb25zWzFdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFByb3RvT2JqKHBhcmFtKVxuICAgIHtcbiAgICAgICAgaWYgKGRvbnRJbnZva2VDb25zdHJ1Y3RvciAhPSBwYXJhbSAmJlxuICAgICAgICAgICAgaXNGdW5jdGlvbih0aGlzLiRjdG9yKSkge1xuICAgICAgICAgICAgdGhpcy4kY3Rvci5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQcm90b09iai5wcm90b3R5cGUgPSBuZXcgdGhpcyhkb250SW52b2tlQ29uc3RydWN0b3IpO1xuXG4gICAgLy8gUHJvdG90eXBlL1wibWVtYmVyXCIgcHJvcGVydGllc1xuICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnRpZXNba2V5XSwgUHJvdG9PYmoucHJvdG90eXBlW2tleV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFByb3RvUHJvcGVydHkoa2V5LCBwcm9wZXJ0eSwgc3VwZXJQcm9wZXJ0eSlcbiAgICB7XG4gICAgICAgIGlmICghaXNGdW5jdGlvbihwcm9wZXJ0eSkgfHxcbiAgICAgICAgICAgICFpc0Z1bmN0aW9uKHN1cGVyUHJvcGVydHkpKSB7XG4gICAgICAgICAgICBQcm90b09iai5wcm90b3R5cGVba2V5XSA9IHByb3BlcnR5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGZ1bmN0aW9uIHdpdGggcmVmIHRvIGJhc2UgbWV0aG9kXG4gICAgICAgICAgICBQcm90b09iai5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IHN1cGVyUHJvcGVydHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUHJvdG9PYmoucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHJvdG9PYmo7XG5cbiAgICAvLyBOYW1lc3BhY2VkL1wiU3RhdGljXCIgcHJvcGVydGllc1xuICAgIFByb3RvT2JqLmV4dGVuZCA9IHRoaXMuZXh0ZW5kIHx8IHRoaXMuZGVmaW5lO1xuICAgIFByb3RvT2JqLm1peGluID0gdGhpcy5taXhpbjtcblxuICAgIGZvciAoa2V5IGluIHN0YXRpY1Byb3BlcnRpZXMpXG4gICAge1xuICAgICAgICBQcm90b09ialtrZXldID0gc3RhdGljUHJvcGVydGllc1trZXldO1xuICAgIH1cblxuICAgIHJldHVybiBQcm90b09iajtcbn07XG5cbi8qKlxuICogTWl4aW4gYSBzZXQgb2YgdmFyaWFibGVzL2Z1bmN0aW9ucyBhcyBwcm90b3R5cGVzIGZvciB0aGlzIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbiAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuICovXG5Qcm90by5taXhpbiA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbiAgICBQcm90by5taXhpbldpdGgodGhpcywgcHJvcGVydGllcyk7XG59O1xuXG4vKipcbiAqIE1peGluIGEgc2V0IG9mIHZhcmlhYmxlcy9mdW5jdGlvbnMgYXMgcHJvdG90eXBlcyBmb3IgdGhlIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbiAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuICovXG5Qcm90by5taXhpbldpdGggPSBmdW5jdGlvbihvYmosIHByb3BlcnRpZXMpIHtcbiAgICBmb3IgKGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIG9iai5wcm90b3R5cGVba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi9wcm90by5qc1wiKTtcbnZhciBBcnJheVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvYXJyYXkuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJFeGlzdHMoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChuZXcgU2lnbmFsTGlzdGVuZXIoY2FsbGJhY2ssIGNvbnRleHQpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRPbmNlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyRXhpc3RzKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobmV3IFNpZ25hbExpc3RlbmVyKGNhbGxiYWNrLCBjb250ZXh0LCB0cnVlKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zc2libGVMaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zc2libGVMaXN0ZW5lci5pc1NhbWVDb250ZXh0KGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocG9zc2libGVMaXN0ZW5lci5pc1NhbWUoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBubyBtYXRjaFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBBcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbiBvbmx5IGJlIG9uZSBtYXRjaCBpZiBjYWxsYmFjayBzcGVjaWZpZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGggLSAxOyAwIDw9IGluZGV4OyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnRyaWdnZXIoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmx5T25jZSkge1xuICAgICAgICAgICAgICAgICAgICBBcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBfbGlzdGVuZXJFeGlzdHM6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGggLSAxOyAwIDw9IGluZGV4OyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5pc1NhbWUoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG5cbnZhciBTaWduYWxMaXN0ZW5lciA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcihjYWxsYmFjaywgY29udGV4dCwgb25seU9uY2UpIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMub25seU9uY2UgPSBvbmx5T25jZTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBpc1NhbWU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FsbGJhY2sgPT09IGNhbGxiYWNrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FsbGJhY2sgPT09IGNhbGxiYWNrICYmIHRoaXMuX2NvbnRleHQgPT09IGNvbnRleHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNTYW1lQ29udGV4dDogZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQgPT09IGNvbnRleHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2suYXBwbHkodGhpcy5fY29udGV4dCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFN0b3JhZ2UgPSByZXF1aXJlKFwiLi9zdG9yYWdlLmpzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFN0b3JhZ2Uod2luZG93LmxvY2FsU3RvcmFnZSk7IiwidmFyIFN0b3JhZ2UgPSByZXF1aXJlKFwiLi9zdG9yYWdlLmpzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFN0b3JhZ2Uod2luZG93LnNlc3Npb25TdG9yYWdlKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9kYXRlLmpzXCIpO1xudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL29iamVjdC5qc1wiKTtcbnZhciBQcm90byA9IHJlcXVpcmUoXCIuLi9wcm90by5qc1wiKTtcbnZhciBDYWNoZSA9IHJlcXVpcmUoXCIuLi9jYWNoZS5qc1wiKTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKFwiLi4vYXNzZXJ0LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcihzdG9yYWdlLCB1c2VDYWNoZSwgY2FjaGUpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdXNlQ2FjaGUpIHtcbiAgICAgICAgICAgIHVzZUNhY2hlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3N0b3JhZ2UgPSBzdG9yYWdlO1xuXG4gICAgICAgIGlmICh1c2VDYWNoZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gY2FjaGUpIHtcbiAgICAgICAgICAgICAgICBjYWNoZSA9IG5ldyBDYWNoZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jYWNoZSA9IGNhY2hlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXksIFwia2V5IG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICB2YXIgdmFsdWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fY2FjaGUuZ2V0KGtleSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9zdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgICAgICAgIHZhbHVlID0gZGVTZXJpYWxpemUodmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXksIFwia2V5IG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKGtleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzZXJpYWxpemVkID0gc2VyaWFsaXplKHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0SXRlbShrZXksIHNlcmlhbGl6ZWQpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXksIFwia2V5IG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZS5yZW1vdmUoa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UuY2xlYXIoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGUuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRXaXRoRXhwaXJhdGlvbjogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVsYXBzZWQgPSBEYXRlVXRpbHMubm93KCkgLSBpdGVtLnRpbWU7XG4gICAgICAgICAgICBpZiAoaXRlbS5leHBpcnkgPCBlbGFwc2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFdpdGhFeHBpcmF0aW9uOiBmdW5jdGlvbihrZXksIHZhbHVlLCBleHBpcnkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KGtleSwge3ZhbHVlOiB2YWx1ZSwgZXhwaXJ5OiBleHBpcnksIHRpbWU6IERhdGVVdGlscy5ub3coKX0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvckVhY2g6IGZ1bmN0aW9uKGl0ZXJhdG9yKSB7XG4gICAgICAgICAgICBhc3NlcnQoaXRlcmF0b3IsIFwiaXRlcmF0b3IgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9zdG9yYWdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoa2V5KTtcbiAgICAgICAgICAgICAgICBpdGVyYXRvcihrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzZXRDYWNoZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5dKTtcblxuXG5mdW5jdGlvbiBzZXJpYWxpemUodmFsdWUpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBkZVNlcmlhbGl6ZSh2YWx1ZSkge1xuICAgIGlmICghT2JqZWN0VXRpbHMuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgIH1cbiAgICBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSB8fCB1bmRlZmluZWQ7XG4gICAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW1vdmVJdGVtOiBmdW5jdGlvbihhcnJheSwgaXRlbSkge1xuICAgICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuXG4gICAgICAgIGlmICgtMSA8IGluZGV4KSB7XG4gICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbW92ZUF0OiBmdW5jdGlvbihhcnJheSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKDAgPD0gaW5kZXggJiYgYXJyYXkubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVwbGFjZUl0ZW06IGZ1bmN0aW9uKGFycmF5LCBpdGVtKSB7XG4gICAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG5cbiAgICAgICAgaWYgKC0xIDwgaW5kZXgpIHtcbiAgICAgICAgICAgIGFycmF5W2luZGV4XSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNFbXB0eTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICF2YWx1ZSB8fCAwID09PSB2YWx1ZS5sZW5ndGg7XG4gICAgfSxcblxuICAgIGFyZ3VtZW50c1RvQXJyYXk6IGZ1bmN0aW9uKGFyZ3MsIHNsaWNlQ291bnQpIHtcbiAgICAgICAgcmV0dXJuIHNsaWNlQ291bnQgPCBhcmdzLmxlbmd0aCA/IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIHNsaWNlQ291bnQpIDogW107XG4gICAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbm93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0sXG5cbiAgICBwZXJmb3JtYW5jZU5vdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwZXJmb3JtYW5jZSAmJiBwZXJmb3JtYW5jZS5ub3cgPyBwZXJmb3JtYW5jZS5ub3coKSA6IHRoaXMubm93KCk7XG4gICAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vb2JqZWN0LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbihuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcblxuICAgICAgICBPYmplY3RVdGlscy5mb3JFYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9LFxuXG4gICAgZWxlbWVudFN1cHBvcnRzT25FdmVudDogZnVuY3Rpb24oZWxlbWVudCwgbmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiBlbGVtZW50O1xuICAgIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZvckVhY2g6IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvYmouZm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gT2JqZWN0LmZvckVhY2gpIHtcbiAgICAgICAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmlzQXJyYXkob2JqKSAmJiBvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgb2JqLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmIChmYWxzZSA9PT0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaW5kZXhdLCBpbmRleCwgb2JqKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGtleXMgPSB0aGlzLmtleXMob2JqKTtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBrZXlzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmIChmYWxzZSA9PT0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5c1tpbmRleF1dLCBrZXlzW2luZGV4XSwgb2JqKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcblxuICAgIGtleXM6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoIXRoaXMuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9LFxuXG4gICAga2V5Q291bnQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoIXRoaXMuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY291bnQgPSAwO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgfSxcblxuICAgIC8vIGJvdGggdmFsdWVzIHBhc3Mgc3RyaWN0IGVxdWFsaXR5ICg9PT0pXG4gICAgLy8gYm90aCBvYmplY3RzIGFyZSBzYW1lIHR5cGUgYW5kIGFsbCBwcm9wZXJ0aWVzIHBhc3Mgc3RyaWN0IGVxdWFsaXR5XG4gICAgLy8gYm90aCBhcmUgTmFOXG4gICAgYXJlRXF1YWw6IGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICAgICAgICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChudWxsID09PSB2YWx1ZSB8fCBudWxsID09PSBvdGhlcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTmFOIGlzIE5hTiFcbiAgICAgICAgaWYgKHRoaXMuaXNOYU4odmFsdWUpICYmIHRoaXMuaXNOYU4ob3RoZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc1NhbWVUeXBlKHZhbHVlLCBvdGhlcikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09IG90aGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFyZUVxdWFsKHZhbHVlW2luZGV4XSwgb3RoZXJbaW5kZXhdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5nZXRUaW1lKCkgPT0gb3RoZXIuZ2V0VGltZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGtleXNPZlZhbHVlID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0Z1bmN0aW9uKHZhbHVlW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5hcmVFcXVhbCh2YWx1ZVtrZXldLCBvdGhlcltrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAga2V5c09mVmFsdWVba2V5XSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvdGhlcikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRnVuY3Rpb24ob3RoZXJba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFrZXlzT2ZWYWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBpc05hTjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgLy8gTmFOIGlzIG5ldmVyIGVxdWFsIHRvIGl0c2VsZiwgaW50ZXJlc3RpbmcgOilcbiAgICAgICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgaXNTYW1lVHlwZTogZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gdHlwZW9mIG90aGVyO1xuICAgIH0sXG5cbiAgICBpc1N0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZyB8fCBcInN0cmluZ1wiID09IHR5cGVvZiB2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzRXJyb3I6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEVycm9yO1xuICAgIH0sXG5cbiAgICBpc09iamVjdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBPYmplY3QodmFsdWUpO1xuICAgIH0sXG5cbiAgICBpc0FycmF5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBcnJheTtcbiAgICB9LFxuXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgdmFsdWU7XG4gICAgfSxcblxuICAgIGlzRGF0ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9LFxuXG4gICAgaXNGaWxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gXCJbb2JqZWN0IEZpbGVdXCIgPT09IFN0cmluZyhkYXRhKTtcbiAgICB9LFxuXG4gICAgYmluZDogZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgICAgICAvLyBCYXNlZCBoZWF2aWx5IG9uIHVuZGVyc2NvcmUvZmlyZWZveCBpbXBsZW1lbnRhdGlvbi5cblxuICAgICAgICBpZiAoIXRoaXMuaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoZnVuYywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG5cbiAgICAgICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYm91bmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiaW5kQ3Rvci5wcm90b3R5cGUgPSBmdW5jLnByb3RvdHlwZTtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gbmV3IGJpbmRDdG9yKCk7XG4gICAgICAgICAgICBiaW5kQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGF0LCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBib3VuZDtcbiAgICB9LFxuXG4gICAgZXh0ZW5kOiBmdW5jdGlvbihkZXN0LCBzcmMpIHtcbiAgICAgICAgaWYgKCFzcmMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgIGRlc3Rba2V5XSA9IHNyY1trZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfSxcblxuICAgIHRvSnNvbjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGlmICghdGhpcy5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgYW4gb2JqZWN0IHRvIGNvbnZlcnQgdG8gSlNPTlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgIH0sXG5cbiAgICBmcm9tSnNvbjogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIGlmICghc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHN0cik7XG4gICAgfSxcblxuICAgIHRvRm9ybURhdGE6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgdmFsdWVzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdmFsdWVzLmpvaW4oXCImXCIpO1xuICAgIH1cbn07XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi9vYmplY3QuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZvcm1hdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJndW1lbnRzKTtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHNlYXJjaCA9IFwie1wiICsgaW5kZXggKyBcIn1cIjtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShzZWFyY2gsIGFyZ3VtZW50c1tpbmRleF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBmb3JtYXRXaXRoUHJvcGVydGllczogZnVuY3Rpb24odmFsdWUsIGZvcm1hdFByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBmb3JtYXRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0UHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VhcmNoID0gXCJ7XCIgKyBwcm9wZXJ0eSArIFwifVwiO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShzZWFyY2gsIGZvcm1hdFByb3BlcnRpZXNbcHJvcGVydHldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgcGFkOiBmdW5jdGlvbiggdmFsdWUsIHBhZENvdW50LCBwYWRWYWx1ZSApIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gcGFkVmFsdWUpIHtcbiAgICAgICAgICAgIHBhZFZhbHVlID0gXCIwXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IFN0cmluZyggdmFsdWUgKTtcblxuICAgICAgICB3aGlsZSAodmFsdWUubGVuZ3RoIDwgcGFkQ291bnQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFkVmFsdWUgKyB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgZm9ybWF0VGltZTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBkYXRlKSB7XG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBob3VycyA9IHRoaXMucGFkKGRhdGUuZ2V0SG91cnMoKSwgMik7XG4gICAgICAgIHZhciBtaW51dGVzID0gdGhpcy5wYWQoZGF0ZS5nZXRNaW51dGVzKCksIDIpO1xuICAgICAgICB2YXIgc2Vjb25kcyA9IHRoaXMucGFkKGRhdGUuZ2V0U2Vjb25kcygpLCAyKTtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMucGFkKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCksIDIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChcbiAgICAgICAgICAgIFwiezB9OnsxfTp7Mn06ezN9XCIsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtaWxsaXNlY29uZHMpO1xuICAgIH0sXG5cbiAgICBmb3JtYXRNb250aERheVllYXI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgaWYgKCFkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtb250aCA9IHRoaXMucGFkKGRhdGUuZ2V0TW9udGgoKSArIDEpO1xuICAgICAgICB2YXIgZGF5ID0gdGhpcy5wYWQoZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQoXG4gICAgICAgICAgICBcInswfS97MX0vezJ9XCIsIG1vbnRoLCBkYXksIHllYXIpO1xuICAgIH0sXG5cbiAgICBmb3JtYXRZZWFyUmFuZ2U6IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gXCJcIjtcblxuICAgICAgICBpZiAoc3RhcnQgJiYgZW5kKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHN0YXJ0ICsgXCIgLSBcIiArIGVuZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdGFydCkge1xuICAgICAgICAgICAgdmFsdWUgPSBzdGFydDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gZW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplRmlyc3RDaGFyYWN0ZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICArIHZhbHVlLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICB1cmxMYXN0UGF0aDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNwbGl0ID0gdmFsdWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICByZXR1cm4gMCA8IHNwbGl0Lmxlbmd0aCA/IHNwbGl0W3NwbGl0Lmxlbmd0aC0xXSA6IG51bGw7XG4gICAgfSxcblxuICAgIGhhc1ZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgMCA8IHZhbHVlLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgbGluZXNPZjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFyIGxpbmVzO1xuXG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgbGluZXMgPSB2YWx1ZS5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5lcztcbiAgICB9LFxuXG4gICAgaXNFcXVhbDogZnVuY3Rpb24oc3RyLCB2YWx1ZSwgaWdub3JlQ2FzZSkge1xuICAgICAgICBpZiAoIXN0ciB8fCAhdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgPT0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RyID09IHZhbHVlO1xuICAgIH0sXG5cbiAgICBpc0VxdWFsSWdub3JlQ2FzZTogZnVuY3Rpb24oc3RyLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0VxdWFsKHN0ciwgdmFsdWUsIHRydWUpO1xuICAgIH0sXG5cbiAgICBjb250YWluczogZnVuY3Rpb24oc3RyLCB2YWx1ZSwgaWdub3JlQ2FzZSkge1xuICAgICAgICBpZiAoIXN0ciB8fCAhdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgPT0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMCA8PSBzdHIuaW5kZXhPZih2YWx1ZSk7XG4gICAgfSxcblxuICAgIGFkZFBhcmFtZXRlcnNUb1VybDogZnVuY3Rpb24odXJsLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIGlmICghdXJsIHx8ICFwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VwZXJhdG9yID0gdGhpcy5jb250YWlucyh1cmwsIFwiP1wiKSA/IFwiJlwiIDogXCI/XCI7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcmFtZXRlcnNba2V5XTtcblxuICAgICAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gT2JqZWN0VXRpbHMudG9Kc29uKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVybCArPSBzZXBlcmF0b3IgKyAgZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1ldGVyc1trZXldKTtcbiAgICAgICAgICAgIHNlcGVyYXRvciA9IFwiP1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9LFxuXG4gICAgcmVtb3ZlUGFyYW1ldGVyRnJvbVVybDogZnVuY3Rpb24odXJsLCBwYXJhbWV0ZXIpIHtcbiAgICAgICAgaWYgKCF1cmwgfHwgIXBhcmFtZXRlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlYXJjaCA9IHBhcmFtZXRlciArIFwiPVwiO1xuICAgICAgICB2YXIgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKHNlYXJjaCk7XG5cbiAgICAgICAgaWYgKC0xID09PSBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVuZEluZGV4ID0gdXJsLmluZGV4T2YoXCImXCIsIHN0YXJ0SW5kZXgpO1xuXG4gICAgICAgIGlmICgtMSA8IGVuZEluZGV4KSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyKDAsIE1hdGgubWF4KHN0YXJ0SW5kZXggLSAxLCAwKSkgKyB1cmwuc3Vic3RyKGVuZEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgTWF0aC5tYXgoc3RhcnRJbmRleCAtIDEsIDApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxufTtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzICA9IHtcbiAgICBpc0ZpbGVQcm90b2NvbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBcImZpbGU6XCIgPT09IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICB9LFxuXG4gICAgZ2xvYmFsRXZhbDogZnVuY3Rpb24oc3JjKSB7XG4gICAgICAgIGlmICghc3JjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBodHRwczovL3dlYmxvZ3MuamF2YS5uZXQvYmxvZy9kcmlzY29sbC9hcmNoaXZlLzIwMDkvMDkvMDgvZXZhbC1qYXZhc2NyaXB0LWdsb2JhbC1jb250ZXh0XG4gICAgICAgIGlmICh3aW5kb3cuZXhlY1NjcmlwdCkge1xuICAgICAgICAgICAgd2luZG93LmV4ZWNTY3JpcHQoc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB3aW5kb3cuZXZhbC5jYWxsKHdpbmRvdy5zcmMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmMoKTtcbiAgICB9XG59Il19
