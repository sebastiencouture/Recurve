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
},{"./assert.js":2,"./cache.js":3,"./global-error-handler.js":4,"./http/http.js":9,"./lazy-load.js":10,"./log/log-console.js":11,"./log/log.js":12,"./performance-monitor.js":13,"./proto.js":14,"./signal.js":15,"./storage/local-storage.js":16,"./storage/session-storage.js":17,"./utils/array.js":19,"./utils/date.js":20,"./utils/object.js":22,"./utils/string.js":23,"./utils/window.js":24}],2:[function(require,module,exports){
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
},{"./utils/array.js":19,"./utils/object.js":22,"./utils/string.js":23}],3:[function(require,module,exports){
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

},{"./assert.js":2,"./proto.js":14,"./utils/date.js":20,"./utils/object.js":22}],4:[function(require,module,exports){
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
},{"./proto.js":14,"./utils/array.js":19,"./utils/object.js":22,"./utils/string.js":23}],5:[function(require,module,exports){
"use strict";

var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
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
},{"../proto.js":14,"../utils/object.js":22,"../utils/string.js":23}],6:[function(require,module,exports){
"use strict";

var Signal = require("../signal.js");
var Proto = require("../proto.js");

module.exports = Proto.define([
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
},{"../proto.js":14,"../signal.js":15}],7:[function(require,module,exports){
"use strict";

var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
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
},{"../proto.js":14,"../utils/object.js":22,"../utils/string.js":23}],8:[function(require,module,exports){
"use strict";

var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
var WindowUtils = require("../utils/window.js");
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
},{"../proto.js":14,"../utils/object.js":22,"../utils/string.js":23,"../utils/window.js":24}],9:[function(require,module,exports){
"use strict";

var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
var DateUtils = require("../utils/date.js");

var Xhr = require("./http-xhr.js");
var JsonpRequest = require("./http-jsonp.js");
var CrossDomainScriptRequest = require("./http-cors-script.js");
var HttpDeferred = require("./http-deferred.js");

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
},{"../utils/date.js":20,"../utils/object.js":22,"../utils/string.js":23,"./http-cors-script.js":5,"./http-deferred.js":6,"./http-jsonp.js":7,"./http-xhr.js":8}],10:[function(require,module,exports){
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
},{"./utils/dom.js":21,"./utils/string.js":23}],11:[function(require,module,exports){
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

},{"../proto.js":14}],12:[function(require,module,exports){
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
},{"../proto.js":14,"../utils/array.js":19,"../utils/string.js":23,"./log-console.js":11}],13:[function(require,module,exports){
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
},{"./log/log.js":12,"./proto.js":14,"./utils/date.js":20}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{"./proto.js":14,"./utils/array.js":19}],16:[function(require,module,exports){
"use strict";

var Storage = require("./storage.js")

module.exports = new Storage(window.localStorage);
},{"./storage.js":18}],17:[function(require,module,exports){
var Storage = require("./storage.js")

module.exports = new Storage(window.sessionStorage);
},{"./storage.js":18}],18:[function(require,module,exports){
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
},{"../assert.js":2,"../cache.js":3,"../proto.js":14,"../utils/date.js":20,"../utils/object.js":22}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
"use strict";

module.exports = {
    now: function() {
        return new Date().getTime();
    },

    performanceNow: function() {
        return performance && performance.now ? performance.now() : this.now();
    }
};
},{}],21:[function(require,module,exports){
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
},{"./object.js":22}],22:[function(require,module,exports){
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


},{}],23:[function(require,module,exports){
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


},{"./object.js":22}],24:[function(require,module,exports){
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
},{}]},{},[1,2,3,4,10,13,14,15])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL19leHBvcnRzLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvYXNzZXJ0LmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvY2FjaGUuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9nbG9iYWwtZXJyb3ItaGFuZGxlci5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2h0dHAvaHR0cC1jb3JzLXNjcmlwdC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2h0dHAvaHR0cC1kZWZlcnJlZC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2h0dHAvaHR0cC1qc29ucC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2h0dHAvaHR0cC14aHIuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9odHRwL2h0dHAuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9sYXp5LWxvYWQuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9sb2cvbG9nLWNvbnNvbGUuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9sb2cvbG9nLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcGVyZm9ybWFuY2UtbW9uaXRvci5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3Byb3RvLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvc2lnbmFsLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvc3RvcmFnZS9sb2NhbC1zdG9yYWdlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvc3RvcmFnZS9zZXNzaW9uLXN0b3JhZ2UuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9zdG9yYWdlL3N0b3JhZ2UuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy91dGlscy9hcnJheS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3V0aWxzL2RhdGUuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy91dGlscy9kb20uanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy91dGlscy9vYmplY3QuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy91dGlscy9zdHJpbmcuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy91dGlscy93aW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSB8fCB7fTtcblxuICAgIFJlY3VydmUuU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9zdHJpbmcuanNcIik7XG4gICAgUmVjdXJ2ZS5XaW5kb3dVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL3dpbmRvdy5qc1wiKTtcbiAgICBSZWN1cnZlLkFycmF5VXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9hcnJheS5qc1wiKTtcbiAgICBSZWN1cnZlLkRhdGVVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2RhdGUuanNcIik7XG4gICAgUmVjdXJ2ZS5PYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL29iamVjdC5qc1wiKTtcblxuICAgIFJlY3VydmUuYXNzZXJ0ID0gcmVxdWlyZShcIi4vYXNzZXJ0LmpzXCIpO1xuXG4gICAgUmVjdXJ2ZS5Qcm90byA9IHJlcXVpcmUoXCIuL3Byb3RvLmpzXCIpO1xuICAgIFJlY3VydmUuQ2FjaGUgPSByZXF1aXJlKFwiLi9jYWNoZS5qc1wiKTtcbiAgICBSZWN1cnZlLkxvZyA9IHJlcXVpcmUoXCIuL2xvZy9sb2cuanNcIik7XG4gICAgUmVjdXJ2ZS5Mb2dDb25zb2xlVGFyZ2V0ID0gcmVxdWlyZShcIi4vbG9nL2xvZy1jb25zb2xlLmpzXCIpO1xuICAgIFJlY3VydmUuU2lnbmFsID0gcmVxdWlyZShcIi4vc2lnbmFsLmpzXCIpO1xuICAgIFJlY3VydmUuSHR0cCA9IHJlcXVpcmUoXCIuL2h0dHAvaHR0cC5qc1wiKTtcbiAgICBSZWN1cnZlLkdsb2JhbEVycm9ySGFuZGxlciA9IHJlcXVpcmUoXCIuL2dsb2JhbC1lcnJvci1oYW5kbGVyLmpzXCIpO1xuICAgIFJlY3VydmUuTG9jYWxTdG9yYWdlID0gcmVxdWlyZShcIi4vc3RvcmFnZS9sb2NhbC1zdG9yYWdlLmpzXCIpO1xuICAgIFJlY3VydmUuU2Vzc2lvblN0b3JhZ2UgPSByZXF1aXJlKFwiLi9zdG9yYWdlL3Nlc3Npb24tc3RvcmFnZS5qc1wiKTtcbiAgICBSZWN1cnZlLlBlcmZvcm1hbmNlTW9uaXRvciA9IHJlcXVpcmUoXCIuL3BlcmZvcm1hbmNlLW1vbml0b3IuanNcIik7XG4gICAgUmVjdXJ2ZS5MYXp5TG9hZCA9IHJlcXVpcmUoXCIuL2xhenktbG9hZC5qc1wiKTtcblxuICAgIHdpbmRvdy5SZWN1cnZlID0gUmVjdXJ2ZTtcbn0pKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZy5qc1wiKTtcbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL29iamVjdC5qc1wiKTtcbnZhciBBcnJheVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvYXJyYXkuanNcIik7XG5cbnZhciBhc3NlcnQgPSBmdW5jdGlvbihjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJndW1lbnRzKTtcbiAgICBtZXNzYWdlID0gU3RyaW5nVXRpbHMuZm9ybWF0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG59O1xuXG5hc3NlcnQgPSBPYmplY3RVdGlscy5leHRlbmQoYXNzZXJ0LCB7XG4gICAgb2s6IGZ1bmN0aW9uKGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgZXF1YWw6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAyKTtcbiAgICAgICAgYXNzZXJ0LmFwcGx5KHRoaXMsIFthY3R1YWwgPT0gZXhwZWN0ZWRdLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIG5vdEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbYWN0dWFsICE9IGV4cGVjdGVkXS5jb25jYXQoYXJncykpO1xuICAgIH0sXG5cbiAgICBzdHJpY3RFcXVhbDogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMsIDIpO1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgW2FjdHVhbCA9PT0gZXhwZWN0ZWRdLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIHN0cmljdE5vdEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbYWN0dWFsICE9PSBleHBlY3RlZF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9LFxuXG4gICAgZGVlcEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbT2JqZWN0VXRpbHMuYXJlRXF1YWwoYWN0dWFsLCBleHBlY3RlZCldLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIGRlZXBOb3RFcXVhbDogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMsIDIpO1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgWyFPYmplY3RVdGlscy5hcmVFcXVhbChhY3R1YWwsIGV4cGVjdGVkKV0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NlcnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3Byb3RvLmpzXCIpO1xudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2RhdGUuanNcIik7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZShcIi4vYXNzZXJ0LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3Rvcihjb3VudExpbWl0LCB0b3RhbENvc3RMaW1pdCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBjb3VudExpbWl0KSB7XG4gICAgICAgICAgICBjb3VudExpbWl0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSB0b3RhbENvc3RMaW1pdCkge1xuICAgICAgICAgICAgdG90YWxDb3N0TGltaXQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY291bnRMaW1pdCA9IGNvdW50TGltaXQ7XG4gICAgICAgIHRoaXMuX3RvdGFsQ29zdExpbWl0ID0gdG90YWxDb3N0TGltaXQ7XG5cbiAgICAgICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuX2NhY2hlW2tleV07XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA/IHZhbHVlLnZhbHVlIDogbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUsIGNvc3QpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXksIFwia2V5IG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSBjb3N0KSB7XG4gICAgICAgICAgICAgICAgY29zdCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlW2tleV0gPSB7dmFsdWU6IHZhbHVlLCBjb3N0OiBjb3N0fTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvdW50TGltaXQgfHwgKHRoaXMuX3RvdGFsQ29zdExpbWl0ICYmIGNvc3QpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZpY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jYWNoZVtrZXldO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q291bnRMaW1pdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50TGltaXQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2V2aWN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY291bnRMaW1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY291bnRMaW1pdDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRUb3RhbENvc3RMaW1pdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RvdGFsQ29zdExpbWl0ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9ldmljdCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvdGFsQ29zdExpbWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbENvc3RMaW1pdDtcbiAgICAgICAgfSxcblxuICAgICAgICBfY3VycmVudFRvdGFsQ29zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBUT0RPIFRCRCBzaG91bGQgd2UgY2FjaGUgdG90YWwgY29zdCBhbmQgY3VycmVudCBjb3VudD9cbiAgICAgICAgICAgIC8vIC4uLiBhbnkgcGVyZm9ybWFuY2Ugd29ycmllcyBmb3IgcG90ZW50aWFsbHkgaHVnZSBjYWNoZXM/P1xuICAgICAgICAgICAgdmFyIHRvdGFsQ29zdCA9IDA7XG5cbiAgICAgICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fY2FjaGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICB0b3RhbENvc3QgKz0gdmFsdWUuY29zdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdG90YWxDb3N0O1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jdXJyZW50Q291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLmtleUNvdW50KHRoaXMuX2NhY2hlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXZpY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9zaG91bGRFdmljdCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9ldmljdE1vc3RDb3N0bHkoKTtcbiAgICAgICAgICAgIHRoaXMuX2V2aWN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3Nob3VsZEV2aWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb3VudExpbWl0IDwgdGhpcy5fY3VycmVudENvdW50KCkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLl90b3RhbENvc3RMaW1pdCA8IHRoaXMuX2N1cnJlbnRUb3RhbENvc3QoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXZpY3RNb3N0Q29zdGx5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBtYXhDb3N0ID0gMDtcbiAgICAgICAgICAgIHZhciBtYXhLZXk7XG5cbiAgICAgICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fY2FjaGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1heEtleSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhLZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1heENvc3QgPCB2YWx1ZS5jb3N0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heEtleSA9IGtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBjb250aW51ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShtYXhLZXkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLy8gU21hbGxlciB0aGUgY29zdCBmb3IgbmV3ZXJcbiAgICAgICAgaW52ZXJzZUN1cnJlbnRUaW1lQ29zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gMSAvIERhdGVVdGlscy5ub3coKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBTbWFsbGVyIHRoZSBjb3N0IGZvciBvbGRlclxuICAgICAgICBjdXJyZW50VGltZUNvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIERhdGVVdGlscy5ub3coKTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3Byb3RvLmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIEFycmF5VXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9hcnJheS5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuXG4gICAgLyoqXG4gICAgICogTk9URSwgSWYgeW91ciBKUyBpcyBob3N0ZWQgb24gYSBDRE4gdGhlbiB0aGUgYnJvd3NlciB3aWxsIHNhbml0aXplIGFuZCBleGNsdWRlIGFsbCBlcnJvciBvdXRwdXRcbiAgICAgKiB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLiBTZWUgVE9ETyBUQkQgdHV0b3JpYWwgbGlua1xuICAgICAqXG4gICAgICogQHBhcmFtIG9uRXJyb3IsIGNhbGxiYWNrIGRlY2xhcmF0aW9uOiBvbkVycm9yKGRlc2NyaXB0aW9uLCBlcnJvciksIGVycm9yIHdpbGwgYmUgdW5kZWZpbmVkIGlmIG5vdCBzdXBwb3J0ZWQgYnkgYnJvd3NlclxuICAgICAqIEBwYXJhbSBlbmFibGVkLCBkZWZhdWx0IHRydWVcbiAgICAgKiBAcGFyYW0gcHJldmVudEJyb3dzZXJIYW5kbGUsIGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgICBmdW5jdGlvbiBjdG9yKG9uRXJyb3IsIGVuYWJsZWQsIHByZXZlbnRCcm93c2VySGFuZGxlKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGVuYWJsZWQpIHtcbiAgICAgICAgICAgIGVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gcHJldmVudEJyb3dzZXJIYW5kbGUpIHtcbiAgICAgICAgICAgIHByZXZlbnRCcm93c2VySGFuZGxlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICB0aGlzLl9wcmV2ZW50QnJvd3NlckhhbmRsZSA9IHByZXZlbnRCcm93c2VySGFuZGxlO1xuICAgICAgICB0aGlzLl9vbkVycm9yID0gb25FcnJvcjtcblxuICAgICAgICB3aW5kb3cub25lcnJvciA9IHRoaXMuX2Vycm9ySGFuZGxlci5iaW5kKHRoaXMpO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXcmFwIG1ldGhvZCBpbiB0cnkuLmNhdGNoIGFuZCBoYW5kbGUgZXJyb3Igd2l0aG91dCByYWlzaW5nIHVuY2F1Z2h0IGVycm9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXRob2RcbiAgICAgICAgICogQHBhcmFtIFssIGFyZzIsIC4uLiwgYXJnTl0sIGxpc3Qgb2YgYXJndW1lbnRzIGZvciBtZXRob2RcbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZEludm9rZTogZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgbWV0aG9kLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmliZUVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCBkZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZSBlcnJvciBhcyB3b3VsZCBiZSBkb25lIGZvciB1bmNhdWdodCBnbG9iYWwgZXJyb3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGVycm9yLCBhbnkgdHlwZSBvZiBlcnJvciAoc3RyaW5nLCBvYmplY3QsIEVycm9yKVxuICAgICAgICAgKiBAcGFyYW0gZGVzY3JpcHRpb25cbiAgICAgICAgICovXG4gICAgICAgIGhhbmRsZUVycm9yOiBmdW5jdGlvbihlcnJvciwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9vbkVycm9yKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgZGVzY3JpYmVFcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uO1xuXG4gICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNTdHJpbmcoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKE9iamVjdFV0aWxzLmlzRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBlcnJvci5tZXNzYWdlICsgXCJcXG5cIiArIGVycm9yLnN0YWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoT2JqZWN0VXRpbHMuaXNPYmplY3QoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBlcnJvci50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRpb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2Vycm9ySGFuZGxlcjogZnVuY3Rpb24obWVzc2FnZSwgZmlsZW5hbWUsIGxpbmUsIGNvbHVtbiwgZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gU3RyaW5nVXRpbHMuZm9ybWF0KFxuICAgICAgICAgICAgICAgIFwibWVzc2FnZTogezB9LCBmaWxlOiB7MX0sIGxpbmU6IHsyfVwiLCBtZXNzYWdlLCBmaWxlbmFtZSwgbGluZSk7XG5cbiAgICAgICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiArPSBTdHJpbmdVdGlscy5mb3JtYXQoXCIsIHN0YWNrOiB7MH1cIiwgZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fb25FcnJvcilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkVycm9yKGVycm9yLCBkZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcmV2ZW50QnJvd3NlckhhbmRsZTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL3N0cmluZy5qc1wiKTtcbnZhciBQcm90byA9IHJlcXVpcmUoXCIuLi9wcm90by5qc1wiKTtcblxudmFyIHJlcXVlc3RJZCA9IDA7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKG9wdGlvbnMsIGRlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLl9kZWZlcnJlZCA9IGRlZmVycmVkO1xuICAgICAgICB0aGlzLl9pZCA9IHJlcXVlc3RJZCsrO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gdGhpcy5fb3B0aW9ucy51cmw7XG4gICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRFcnJvckhhbmRsZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmIChldmVudCAmJiBcImVycm9yXCIgPT09IGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fZGVmZXJyZWQucmVqZWN0KHtzdGF0dXM6IDQwNCwgY2FuY2VsZWQ6IHRoYXQuX2NhbmNlbGVkfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9kZWZlcnJlZC5yZXNvbHZlKHtzdGF0dXM6IDIwMCwgY2FuY2VsZWQ6IHRoYXQuX2NhbmNlbGVkfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUT0RPIFRCRCBpZiBnb2luZyB0byBzdXBwb3J0IElFOCB0aGVuIG5lZWQgdG8gY2hlY2sgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBhcyB3ZWxsXG4gICAgICAgICAgICAvLyBodHRwOi8vcGllaXNnb29kLm9yZy90ZXN0L3NjcmlwdC1saW5rLWV2ZW50cy9cbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTaWduYWwgPSByZXF1aXJlKFwiLi4vc2lnbmFsLmpzXCIpO1xudmFyIFByb3RvID0gcmVxdWlyZShcIi4uL3Byb3RvLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcigpIHtcbiAgICAgICAgdGhpcy5fc3VjY2VlZGVkID0gbmV3IFNpZ25hbCgpO1xuICAgICAgICB0aGlzLl9lcnJvcmVkID0gbmV3IFNpZ25hbCgpO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJlc29sdmU6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdWNjZWVkZWQudHJpZ2dlcihyZXNwb25zZSk7XG4gICAgICAgICAgICB0aGlzLl9jbGVhblVwKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVqZWN0OiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC50cmlnZ2VyKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuVXAoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwcm9taXNlOiB7XG4gICAgICAgICAgICB0aGVuOiBmdW5jdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWNjZWVkZWQuYWRkT25jZShvblN1Y2Nlc3MpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yZWQuYWRkT25jZShvbkVycm9yKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG9uU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC5hZGRPbmNlKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzcyhyZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzLCByZXNwb25zZS5vcHRpb25zLCByZXNwb25zZS5jYW5jZWxlZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24ob25FcnJvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yZWQuYWRkT25jZShmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsIHJlc3BvbnNlLm9wdGlvbnMsIHJlc3BvbnNlLmNhbmNlbGVkKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgY2FuY2VsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3QgJiYgdGhpcy5yZXF1ZXN0LmNhbmNlbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9jbGVhblVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZCA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuX2Vycm9yZWQucmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB0aGlzLl9lcnJvcmVkID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL3N0cmluZy5qc1wiKTtcbnZhciBQcm90byA9IHJlcXVpcmUoXCIuLi9wcm90by5qc1wiKTtcblxudmFyIHJlcXVlc3RJZCA9IDA7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKG9wdGlvbnMsIGRlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLl9kZWZlcnJlZCA9IGRlZmVycmVkO1xuICAgICAgICB0aGlzLl9pZCA9IHJlcXVlc3RJZCsrO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrSWQgPSBcIlJlY3VydmVKc29uUENhbGxiYWNrXCIgKyB0aGlzLl9pZDtcbiAgICAgICAgICAgIHZhciB1cmwgPSBTdHJpbmdVdGlscy5yZW1vdmVQYXJhbWV0ZXJGcm9tVXJsKHRoaXMuX29wdGlvbnMudXJsLCBcImNhbGxiYWNrXCIpO1xuICAgICAgICAgICAgdXJsID0gU3RyaW5nVXRpbHMuYWRkUGFyYW1ldGVyc1RvVXJsKHVybCwge2NhbGxiYWNrOiBjYWxsYmFja0lkfSk7XG5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICAgICAgICAgIHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBjYWxsZWQ7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxiYWNrSGFuZGxlcihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGF0Ll9jYW5jZWxlZCAmJiB0aGF0Ll9vcHRpb25zLmVycm9yT25DYW5jZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2NvbXBsZXRlKHRydWUsIGRhdGEsIDIwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2FkRXJyb3JIYW5kbGVyIChldmVudCkge1xuICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgd2luZG93W2NhbGxiYWNrSWRdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIFwibG9hZFwiID09PSBldmVudC50eXBlICYmICFjYWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY29tcGxldGUoZmFsc2UsIG51bGwsIDQwNCwgXCJqc29ucCBjYWxsYmFjayBub3QgY2FsbGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVE9ETyBUQkQgaWYgZ29pbmcgdG8gc3VwcG9ydCBJRTggdGhlbiBuZWVkIHRvIGNoZWNrIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgYXMgd2VsbFxuICAgICAgICAgICAgLy8gaHR0cDovL3BpZWlzZ29vZC5vcmcvdGVzdC9zY3JpcHQtbGluay1ldmVudHMvXG4gICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuXG4gICAgICAgICAgICB3aW5kb3dbY2FsbGJhY2tJZF0gPSBjYWxsYmFja0hhbmRsZXI7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jb21wbGV0ZTogZnVuY3Rpb24oc3VjY2VzcywgZGF0YSwgc3RhdHVzLCBzdGF0dXNUZXh0KSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiBzdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMuX29wdGlvbnMsXG4gICAgICAgICAgICAgICAgY2FuY2VsZWQ6IHRoaXMuX2NhbmNlbGVkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL3N0cmluZy5qc1wiKTtcbnZhciBXaW5kb3dVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy93aW5kb3cuanNcIik7XG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi4vcHJvdG8uanNcIik7XG5cbnZhciByZXF1ZXN0SWQgPSAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcihvcHRpb25zLCBkZWZlcnJlZCkge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5fZGVmZXJyZWQgPSBkZWZlcnJlZDtcbiAgICAgICAgdGhpcy5faWQgPSByZXF1ZXN0SWQrKztcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBzZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl94aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlJlY3VydmUgb25seSBzdXBwb3J0cyBJRTgrXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jb25maWcoKTtcblxuICAgICAgICAgICAgdGhpcy5feGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9XG4gICAgICAgICAgICAgICAgT2JqZWN0VXRpbHMuYmluZCh0aGlzLl9zdGF0ZUNoYW5nZUhhbmRsZXIsIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLl94aHIub3Blbih0aGlzLl9vcHRpb25zLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCB0aGlzLl9vcHRpb25zLnVybCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJlZm9yZVNlbmQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vcHRpb25zLmJlZm9yZVNlbmQodGhpcy5feGhyLCB0aGlzLl9vcHRpb25zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5feGhyLnNlbmQodGhpcy5fb3B0aW9ucy5kYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5feGhyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feGhyLmFib3J0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbmZpZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9hZGRIZWFkZXJzKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLndpdGhDcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3hoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feGhyLnRpbWVvdXQgPSB0aGlzLl9vcHRpb25zLnRpbWVvdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnJlc3BvbnNlVHlwZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3hoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9vcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD03MzY0OFxuICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgd2lsbCB0aHJvdyBlcnJvciBmb3IgXCJqc29uXCIgbWV0aG9kLCBpZ25vcmUgdGhpcyBzaW5jZVxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gaGFuZGxlIGl0XG4gICAgICAgICAgICAgICAgICAgIGlmICghU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJqc29uXCIsIHRoaXMuX29wdGlvbnMubWV0aG9kKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2FkZEhlYWRlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaCh0aGlzLl9vcHRpb25zLmhlYWRlcnMsIGZ1bmN0aW9uKHZhbHVlLCBoZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICBfc3RhdGVDaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICg0ICE9PSB0aGlzLl94aHIucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzU3VjY2VzcygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlU3VjY2VzcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfaXNTdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYW5jZWxlZCAmJiB0aGlzLl9vcHRpb25zLmVycm9yT25DYW5jZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSB0aGlzLl94aHIuc3RhdHVzO1xuXG4gICAgICAgICAgICByZXR1cm4gKDIwMCA8PSBzdGF0dXMgJiYgMzAwID4gc3RhdHVzKSB8fFxuICAgICAgICAgICAgICAgIDMwNCA9PT0gc3RhdHVzIHx8XG4gICAgICAgICAgICAgICAgKDAgPT09IHN0YXR1cyAmJiBXaW5kb3dVdGlscy5pc0ZpbGVQcm90b2NvbCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfaGFuZGxlU3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGE7XG5cbiAgICAgICAgICAgIGlmIChTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCB0aGlzLl9vcHRpb25zLmRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9yZXF1ZXN0LnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBXaW5kb3dVdGlscy5nbG9iYWxFdmFsKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX3BhcnNlUmVzcG9uc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKFwidW5hYmxlIHRvIHBhcnNlIHJlc3BvbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZSh0cnVlLCBkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlKGZhbHNlLCBudWxsLCBzdGF0dXNUZXh0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBfY29tcGxldGU6IGZ1bmN0aW9uKHN1Y2Nlc3MsIGRhdGEsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1cyA6IHRoaXMuX3hoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgc3RhdHVzVGV4dCA6IHN0YXR1c1RleHQgPyBzdGF0dXNUZXh0IDogdGhpcy5feGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgaGVhZGVycyA6IHRoaXMuX3hoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSxcbiAgICAgICAgICAgICAgICBvcHRpb25zIDogdGhpcy5fb3B0aW9ucyxcbiAgICAgICAgICAgICAgICBjYW5jZWxlZCA6IHRoaXMuX2NhbmNlbGVkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfcGFyc2VSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYWNjZXB0ID0gIHRoaXMuX29wdGlvbnMuaGVhZGVycyAmJiB0aGlzLl9vcHRpb25zLmhlYWRlcnMuQWNjZXB0O1xuICAgICAgICAgICAgaWYgKCFhY2NlcHQpIHtcbiAgICAgICAgICAgICAgICBhY2NlcHQgPSB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YTtcblxuICAgICAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzRnVuY3Rpb24odGhpcy5fb3B0aW9ucy5zZXJpYWxpemVyKSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9vcHRpb25zLnBhcnNlcih0aGlzLl94aHIpLCBhY2NlcHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBPYmplY3RVdGlscy5mb3JFYWNoKHRoaXMuX29wdGlvbnMucGFyc2VyLCBmdW5jdGlvbihwYXJzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHBhcnNlcih0aGlzLl94aHIsIGFjY2VwdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9kYXRlLmpzXCIpO1xuXG52YXIgWGhyID0gcmVxdWlyZShcIi4vaHR0cC14aHIuanNcIik7XG52YXIgSnNvbnBSZXF1ZXN0ID0gcmVxdWlyZShcIi4vaHR0cC1qc29ucC5qc1wiKTtcbnZhciBDcm9zc0RvbWFpblNjcmlwdFJlcXVlc3QgPSByZXF1aXJlKFwiLi9odHRwLWNvcnMtc2NyaXB0LmpzXCIpO1xudmFyIEh0dHBEZWZlcnJlZCA9IHJlcXVpcmUoXCIuL2h0dHAtZGVmZXJyZWQuanNcIik7XG5cbnZhciBIdHRwID0ge1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIGFsbDoge30sXG5cbiAgICAgICAgICAgIGdldDoge30sXG4gICAgICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIiA6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHV0OiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIiA6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGVhZDoge30sXG4gICAgICAgICAgICBcImRlbGV0ZVwiOiB7fSxcbiAgICAgICAgICAgIGpzb25wOiB7fSxcbiAgICAgICAgICAgIHNjcmlwdDoge31cbiAgICAgICAgfSxcblxuICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcblxuICAgICAgICBjYWNoZTogdHJ1ZSxcblxuICAgICAgICBzZXJpYWxpemVyIDogW2RlZmF1bHRTZXJpYWxpemVyXSxcbiAgICAgICAgcGFyc2VyIDogW2RlZmF1bHRQYXJzZXJdLFxuXG4gICAgICAgIHJlcXVlc3RGYWN0b3J5OiBEZWZhdWx0UmVxdWVzdEZhY3RvcnksXG4gICAgICAgIGRlZmVycmVkRmFjdG9yeTogRGVmYXVsdERlZmVycmVkRmFjdG9yeSxcblxuICAgICAgICBlcnJvck9uQ2FuY2VsOiB0cnVlLFxuICAgICAgICBlbXVsYXRlSHR0cDogZmFsc2VcbiAgICB9LFxuXG4gICAgcmVxdWVzdDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgd2l0aERlZmF1bHRzID0gY3JlYXRlT3B0aW9uc1dpdGhEZWZhdWx0cyhvcHRpb25zLCBIdHRwLmRlZmF1bHRzKTtcblxuICAgICAgICB1cGRhdGVVcmwod2l0aERlZmF1bHRzKTtcbiAgICAgICAgdXBkYXRlSGVhZGVycyh3aXRoRGVmYXVsdHMpO1xuICAgICAgICB1cGRhdGVEYXRhKHdpdGhEZWZhdWx0cyk7XG4gICAgICAgIHNlcmlhbGl6ZURhdGEod2l0aERlZmF1bHRzKTtcblxuICAgICAgICB2YXIgZGVmZXJyZWQgPSB3aXRoRGVmYXVsdHMuZGVmZXJyZWRGYWN0b3J5KHdpdGhEZWZhdWx0cyk7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gd2l0aERlZmF1bHRzLnJlcXVlc3RGYWN0b3J5KHdpdGhEZWZhdWx0cywgZGVmZXJyZWQpO1xuXG4gICAgICAgIGRlZmVycmVkLnJlcXVlc3QgPSBkZWZlcnJlZDtcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG5cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcblxuICAgIGdldDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJnZXRcIiwgdXJsOiB1cmx9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgcG9zdDogZnVuY3Rpb24odXJsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJwb3N0XCIsIHVybDogdXJsLCBkYXRhOiBkYXRhfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGpzb25wOiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImpzb25wXCIsIHVybDogdXJsfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGRlbGV0ZTogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJkZWxldGVcIiwgdXJsOiB1cmx9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgaGVhZDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJoZWFkXCIsIHVybDogdXJsfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIHB1dDogZnVuY3Rpb24odXJsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJwdXRcIiwgdXJsOiB1cmwsIGRhdGE6IGRhdGF9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgcGF0Y2g6IGZ1bmN0aW9uKHVybCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwicGF0Y2hcIiwgdXJsOiB1cmwsIGRhdGE6IGRhdGF9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZ2V0U2NyaXB0OiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcInNjcmlwdFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cbn07XG5cblxuZnVuY3Rpb24gZGVmYXVsdFNlcmlhbGl6ZXIoZGF0YSwgY29udGVudFR5cGUpIHtcbiAgICB2YXIgaWdub3JlQ2FzZSA9IHRydWU7XG5cbiAgICBpZiAoU3RyaW5nVXRpbHMuY29udGFpbnMoY29udGVudFR5cGUsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsIGlnbm9yZUNhc2UpKSB7XG4gICAgICAgIGlmIChPYmplY3RVdGlscy5pc09iamVjdChkYXRhKSAmJiAhT2JqZWN0VXRpbHMuaXNGaWxlKGRhdGEpKSB7XG4gICAgICAgICAgICBkYXRhID0gT2JqZWN0VXRpbHMudG9Gb3JtRGF0YShkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChTdHJpbmdVdGlscy5jb250YWlucyhjb250ZW50VHlwZSwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIGlnbm9yZUNhc2UpKSB7XG4gICAgICAgIGlmIChPYmplY3RVdGlscy5pc09iamVjdChkYXRhKSAmJiAhT2JqZWN0VXRpbHMuaXNGaWxlKGRhdGEpKSB7XG4gICAgICAgICAgICBkYXRhID0gT2JqZWN0VXRpbHMudG9Kc29uKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBkbyBub3RoaW5nIC0gbm90aGluZyB0byBzZXJpYWxpemVcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuSHR0cC5zZXJpYWxpemVyID0gZGVmYXVsdFNlcmlhbGl6ZXI7XG5cblxuZnVuY3Rpb24gZGVmYXVsdFBhcnNlcih4aHIsIGFjY2VwdCkge1xuICAgIHZhciBkYXRhO1xuICAgIHZhciBpZ25vcmVDYXNlID0gdHJ1ZTtcblxuICAgIGlmIChTdHJpbmdVdGlscy5jb250YWlucyhhY2NlcHQsIFwiYXBwbGljYXRpb24veG1sXCIsIGlnbm9yZUNhc2UpIHx8XG4gICAgICAgIFN0cmluZ1V0aWxzLmNvbnRhaW5zKGFjY2VwdCwgXCJ0ZXh0L3htbFwiLCBpZ25vcmVDYXNlKSkge1xuICAgICAgICBkYXRhID0geGhyLnJlc3BvbnNlWE1MO1xuICAgIH1cbiAgICBlbHNlIGlmIChTdHJpbmdVdGlscy5jb250YWlucyhhY2NlcHQsIFwiYXBwbGljYXRpb24vanNvblwiLCBpZ25vcmVDYXNlKSkge1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YSA9IE9iamVjdFV0aWxzLnRvSnNvbih4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZGF0YSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbkh0dHAucGFyc2VyID0gZGVmYXVsdFBhcnNlcjtcblxuXG5mdW5jdGlvbiBEZWZhdWx0UmVxdWVzdEZhY3Rvcnkob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICB2YXIgcmVxdWVzdDtcblxuICAgIGlmIChTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcImpzb25wXCIsIG9wdGlvbnMubWV0aG9kKSkge1xuICAgICAgICByZXF1ZXN0ID0gbmV3IEpzb25wUmVxdWVzdChvcHRpb25zLCBkZWZlcnJlZCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG9wdGlvbnMuY3Jvc3NEb21haW4gJiZcbiAgICAgICAgU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJzY3JpcHRcIiwgb3B0aW9ucy5tZXRob2QpKSB7XG4gICAgICAgIHJlcXVlc3QgPSBuZXcgQ3Jvc3NEb21haW5TY3JpcHRSZXF1ZXN0KG9wdGlvbnMsIGRlZmVycmVkKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlcXVlc3QgPSBuZXcgWGhyKG9wdGlvbnMsIGRlZmVycmVkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVxdWVzdDtcbn07XG5cbkh0dHAuUmVxdWVzdEZhY3RvcnkgPSBEZWZhdWx0UmVxdWVzdEZhY3Rvcnk7XG5cblxuZnVuY3Rpb24gRGVmYXVsdERlZmVycmVkRmFjdG9yeSgpIHtcbiAgICByZXR1cm4gbmV3IEh0dHBEZWZlcnJlZCgpO1xufTtcblxuSHR0cC5EZWZlcnJlZEZhY3RvcnkgPSBEZWZhdWx0RGVmZXJyZWRGYWN0b3J5O1xuXG5cbmZ1bmN0aW9uIFFEZWZlcnJlZEZhY3RvcnkoKSB7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24ob25TdWNjZXNzKSB7XG4gICAgICAgIGRlZmVycmVkLnByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgb25TdWNjZXNzKFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzLCByZXNwb25zZS5vcHRpb25zLCByZXNwb25zZS5jYW5jZWxlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9kZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG5cbiAgICBkZWZlcnJlZC5wcm9taXNlLmVycm9yID0gZnVuY3Rpb24ob25FcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5wcm9taXNlLnRoZW4obnVsbCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIG9uRXJyb3IoXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsIHJlc3BvbnNlLm9wdGlvbnMsIHJlc3BvbnNlLmNhbmNlbGVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmVycmVkLnByb21pc2U7XG4gICAgfTtcblxuICAgIGRlZmVycmVkLnByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlZmVycmVkLnJlcXVlc3QuY2FuY2VsKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWZlcnJlZDtcbn07XG5cbkh0dHAuUURlZmVycmVkRmFjdG9yeSA9IFFEZWZlcnJlZEZhY3Rvcnk7XG5cblxuZnVuY3Rpb24gY3JlYXRlT3B0aW9uc1dpdGhEZWZhdWx0cyhvcHRpb25zLCBkZWZhdWx0cykge1xuICAgIHZhciB3aXRoRGVmYXVsdHMgPSBPYmplY3RVdGlscy5leHRlbmQoe30sIGRlZmF1bHRzKTtcblxuICAgIHdpdGhEZWZhdWx0cy5oZWFkZXJzID0ge307XG4gICAgbWVyZ2VIZWFkZXJzKG9wdGlvbnMubWV0aG9kLCB3aXRoRGVmYXVsdHMsIGRlZmF1bHRzLmhlYWRlcnMpO1xuXG4gICAgT2JqZWN0VXRpbHMuZXh0ZW5kKHdpdGhEZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gd2l0aERlZmF1bHRzO1xufVxuXG5mdW5jdGlvbiBtZXJnZUhlYWRlcnMobWV0aG9kLCBvcHRpb25zLCBkZWZhdWx0SGVhZGVycykge1xuICAgIG1ldGhvZCA9IG1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIGRlZmF1bHRIZWFkZXJzLmFsbCk7XG4gICAgT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIGRlZmF1bHRIZWFkZXJzW21ldGhvZF0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVVcmwob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5jYWNoZSkge1xuICAgICAgICBvcHRpb25zLnBhcmFtcy5jYWNoZSA9IERhdGVVdGlscy5ub3coKTtcbiAgICB9XG5cbiAgICBvcHRpb25zLnVybCA9XG4gICAgICAgIFN0cmluZ1V0aWxzLmFkZFBhcmFtZXRlcnNUb1VybChcbiAgICAgICAgICAgIG9wdGlvbnMudXJsLCBvcHRpb25zLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhlYWRlcnMob3B0aW9ucykge1xuICAgIGFkZEFjY2VwdEhlYWRlcihvcHRpb25zKTtcbiAgICBhZGRSZXF1ZXN0ZWRXaXRoSGVhZGVyKG9wdGlvbnMpO1xuICAgIHJlbW92ZUNvbnRlbnRUeXBlKG9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBhZGRBY2NlcHRIZWFkZXIob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMuQWNjZXB0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWNjZXB0ID0gXCIqLypcIjtcbiAgICB2YXIgZGF0YVR5cGUgPSBvcHRpb25zLmRhdGFUeXBlO1xuXG4gICAgaWYgKGRhdGFUeXBlKSB7XG4gICAgICAgIGRhdGFUeXBlID0gZGF0YVR5cGUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoXCJ0ZXh0XCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcInRleHQvcGxhaW4sKi8qO3E9MC4wMVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwiaHRtbFwiID09PSBkYXRhVHlwZSkge1xuICAgICAgICAgICAgYWNjZXB0ID0gXCJ0ZXh0L2h0bWwsKi8qO3E9MC4wMVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwieG1sXCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcImFwcGxpY2F0aW9uL3htbCx0ZXh0L3htbCwqLyo7cT0wLjAxXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXCJqc29uXCIgPT09IGRhdGFUeXBlIHx8IFwic2NyaXB0XCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcImFwcGxpY2F0aW9uL2pzb24sdGV4dC9qYXZhc2NyaXB0LCovKjtxPTAuMDFcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBkZWZhdWx0IHRvIGFsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucy5oZWFkZXJzLkFjY2VwdCA9IGFjY2VwdDtcbn1cblxuZnVuY3Rpb24gYWRkUmVxdWVzdGVkV2l0aEhlYWRlcihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmNyb3NzRG9tYWluICYmXG4gICAgICAgICFvcHRpb25zLmhlYWRlcnNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdICYmXG4gICAgICAgICFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCBvcHRpb25zLmRhdGFUeXBlKSkge1xuICAgICAgICBvcHRpb25zLmhlYWRlcnNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdID0gXCJYTUxIdHRwUmVxdWVzdFwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29udGVudFR5cGUob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBPYmplY3RVdGlscy5mb3JFYWNoKG9wdGlvbnMuaGVhZGVycywgZnVuY3Rpb24odmFsdWUsIGhlYWRlcikge1xuICAgICAgICBpZiAoU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJjb250ZW50LXR5cGVcIiwgaGVhZGVyKSkge1xuICAgICAgICAgICAgZGVsZXRlIG9wdGlvbnMuaGVhZGVyc1toZWFkZXJdO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURhdGEob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5lbXVsYXRlSHR0cCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInB1dFwiLCBvcHRpb25zLm1ldGhvZCkgfHxcbiAgICAgICAgIVN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwicGF0Y2hcIiwgb3B0aW9ucy5tZXRob2QpIHx8XG4gICAgICAgICFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcImRlbGV0ZVwiLCBvcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wdGlvbnMuZGF0YS5fbWV0aG9kID0gb3B0aW9ucy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplRGF0YShvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmRhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gb3B0aW9ucy5kYXRhO1xuXG4gICAgaWYgKE9iamVjdFV0aWxzLmlzRnVuY3Rpb24ob3B0aW9ucy5zZXJpYWxpemVyKSkge1xuICAgICAgICBkYXRhID0gb3B0aW9ucy5zZXJpYWxpemVyKGRhdGEsIHRoaXMuX29wdGlvbnMuY29udGVudFR5cGUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaChvcHRpb25zLnNlcmlhbGl6ZXIsIGZ1bmN0aW9uKHNlcmlhbGl6ZXIpIHtcbiAgICAgICAgICAgIGRhdGEgPSBzZXJpYWxpemVyKGRhdGEsIG9wdGlvbnMuY29udGVudFR5cGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvcHRpb25zLmRhdGEgPSBkYXRhO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRG9tVXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9kb20uanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9zdHJpbmcuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGpzOiBmdW5jdGlvbih1cmwsIG9uQ29tcGxldGUsIG9uRXJyb3IpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBEb21VdGlscy5jcmVhdGVFbGVtZW50KFwibGlua1wiLCB7dHlwZTogXCJ0ZXh0L2Nzc1wiLCByZWw6IFwic3R5bGVzaGVldFwiLCBocmVmOiB1cmx9KTtcbiAgICAgICAgbG9hZChlbGVtZW50LCBvbkNvbXBsZXRlLCBvbkVycm9yKTtcbiAgICB9LFxuXG4gICAgY3NzOiBmdW5jdGlvbih1cmwsIG9uQ29tcGxldGUsIG9uRXJyb3IpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBEb21VdGlscy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIsIHt0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiLCBzcmM6IHVybH0pO1xuICAgICAgICBsb2FkKGVsZW1lbnQsIG9uQ29tcGxldGUsIG9uRXJyb3IpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGxvYWQoZWxlbWVudCwgb25Db21wbGV0ZSwgb25FcnJvcikge1xuICAgIGZ1bmN0aW9uIHJlYWR5U3RhdGVIYW5kbGVyKCkge1xuICAgICAgICBpZiAoU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJsb2FkZWRcIiwgZWxlbWVudC5yZWFkeVN0YXRlKSB8fFxuICAgICAgICAgICAgU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJjb21wbGV0ZVwiLCBlbGVtZW50LnJlYWR5U3RhdGUpKSB7XG4gICAgICAgICAgICBsb2FkZWRIYW5kbGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkZWRIYW5kbGVyKCkge1xuICAgICAgICBjbGVhckNhbGxiYWNrcygpO1xuICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3JIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIGNsZWFyQ2FsbGJhY2tzKCk7XG4gICAgICAgIG9uRXJyb3IoZXZlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyQ2FsbGJhY2tzKCkge1xuICAgICAgICBlbGVtZW50Lm9ubG9hZCA9IG51bGw7XG4gICAgICAgIGVsZW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgZWxlbWVudC5vbmVycm9yID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYWludGFpbiBleGVjdXRpb24gb3JkZXJcbiAgICAvLyBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvRHluYW1pY19TY3JpcHRfRXhlY3V0aW9uX09yZGVyXG4gICAgLy8gaHR0cDovL3d3dy5uY3pvbmxpbmUubmV0L2Jsb2cvMjAxMC8xMi8yMS90aG91Z2h0cy1vbi1zY3JpcHQtbG9hZGVycy9cbiAgICBlbGVtZW50LmFzeW5jID0gZmFsc2U7XG4gICAgZWxlbWVudC5kZWZlciA9IGZhbHNlO1xuXG4gICAgLy8gaHR0cDovL3BpZWlzZ29vZC5vcmcvdGVzdC9zY3JpcHQtbGluay1ldmVudHMvXG4gICAgLy8gVE9ETyBUQkQgbGluayB0YWdzIGRvbid0IHN1cHBvcnQgYW55IHR5cGUgb2YgbG9hZCBjYWxsYmFjayBvbiBvbGQgV2ViS2l0IChTYWZhcmkgNSlcbiAgICAvLyBUT0RPIFRCRCBpZiBub3QgZ29pbmcgdG8gc3VwcG9ydCBJRTggdGhlbiBkb24ndCBuZWVkIHRvIHdvcnJ5IGFib3V0IG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAgIGlmIChEb21VdGlscy5lbGVtZW50U3VwcG9ydHNPbkV2ZW50KGVsZW1lbnQsIFwib25yZWFkeXN0YXRlY2hhbmdlXCIpKSB7XG4gICAgICAgIGVsZW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gcmVhZHlTdGF0ZUhhbmRsZXJcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGVsZW1lbnQub25sb2FkID0gbG9hZGVkSGFuZGxlcjtcbiAgICB9XG5cbiAgICBlbGVtZW50Lm9uZXJyb3IgPSBlcnJvckhhbmRsZXI7XG5cbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi4vcHJvdG8uanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBpbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIHdhcm46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZm8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnNvbGUgfHwgIWNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZm8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuLi9wcm90by5qc1wiKTtcbnZhciBBcnJheVV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL2FycmF5LmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL3N0cmluZy5qc1wiKTtcbnZhciBMb2dUYXJnZXQgPSByZXF1aXJlKFwiLi9sb2ctY29uc29sZS5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGFyZ2V0cywgYXJyYXkgb2YgdGFyZ2V0cyB0byBsb2cgdG8gKHNlZSBSZWN1cnZlLkxvZ0NvbnNvbGVUYXJnZXQgYXMgZXhhbXBsZSkuXG4gICAgICogRGVmYXVsdHMgdG8gUmVjdXJ2ZS5Mb2dDb25zb2xlVGFyZ2V0XG4gICAgICogQHBhcmFtIGVuYWJsZWQsIGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgICBmdW5jdGlvbiBjdG9yKGVuYWJsZWQsIHRhcmdldHMpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gZW5hYmxlZCkge1xuICAgICAgICAgICAgZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSB0YXJnZXRzKSB7XG4gICAgICAgICAgICB0YXJnZXRzID0gW25ldyBMb2dUYXJnZXQoKV07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhcmdldHMgPSB0YXJnZXRzO1xuICAgICAgICB0aGlzLmRpc2FibGUoIWVuYWJsZWQpO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2cgaW5mbyB0byBhbGwgdGFyZ2V0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBpbmZvOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faW5mb0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJpbmZvXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZyBkZWJ1ZyB0byBhbGwgdGFyZ2V0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBkZWJ1ZzogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RlYnVnRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcImRlYnVnXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZyB3YXJuaW5nIHRvIGFsbCB0YXJnZXRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIHdhcm46IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl93YXJuRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcIndhcm5cIiwgbWVzc2FnZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9nIGVycm9yIHRvIGFsbCB0YXJnZXRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZXJyb3JEaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiZXJyb3JcIiwgbWVzc2FnZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xlYXIgbG9nIGZvciBhbGwgdGFyZ2V0c1xuICAgICAgICAgKi9cbiAgICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudGFyZ2V0cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldHNbaW5kZXhdLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0Rpc2FibGVkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9pbmZvRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX3dhcm5EaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3JEaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGRlYnVnRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0Rpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mb0Rpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5faW5mb0Rpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgd2FybkRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fd2FybkRpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgZXJyb3JEaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2Vycm9yRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBfbG9nOiBmdW5jdGlvbih0eXBlLCBtZXNzYWdlLCBhcmdzKSB7XG4gICAgICAgICAgICBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3MsIDEpO1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5fZGVzY3JpcHRpb24odHlwZS50b1VwcGVyQ2FzZSgpKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudGFyZ2V0cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldHNbaW5kZXhdW3R5cGVdLmFwcGx5KHRoaXMudGFyZ2V0c1tpbmRleF0sIFtkZXNjcmlwdGlvbiwgbWVzc2FnZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfZGVzY3JpcHRpb246IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgIHZhciB0aW1lID0gU3RyaW5nVXRpbHMuZm9ybWF0VGltZShuZXcgRGF0ZSgpKTtcbiAgICAgICAgICAgIHJldHVybiBcIltcIiArIHR5cGUgKyBcIl0gXCIgKyB0aW1lO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3Byb3RvLmpzXCIpO1xudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2RhdGUuanNcIik7XG52YXIgTG9nID0gcmVxdWlyZShcIi4vbG9nL2xvZy5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3IobG9nLCBlbmFibGVkKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGxvZykge1xuICAgICAgICAgICAgdGhpcy5fbG9nID0gbmV3IExvZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gZW5hYmxlZCkge1xuICAgICAgICAgICAgZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc2FibGUoIWVuYWJsZWQpO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgVGltZXIodGhpcy5fbG9nLCBtZXNzYWdlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBlbmQ6IGZ1bmN0aW9uKHRpbWVyLCBkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkIHx8ICF0aW1lcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGltZXIuZW5kKGRlc2NyaXB0aW9uKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5dKTtcblxuXG52YXIgVGltZXIgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGxvZywgbWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nID0gbG9nO1xuXG4gICAgICAgICAgICBpZiAoc3VwcG9ydHNDb25zb2xlVGltZSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS50aW1lKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gRGF0ZVV0aWxzLnBlcmZvcm1hbmNlTm93KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVuZDogZnVuY3Rpb24oZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGlmIChzdXBwb3J0c0NvbnNvbGVUaW1lKCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQodGhpcy5fbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2cuaW5mbyh0aGlzLl9tZXNzYWdlICsgXCI6IFwiICsgKERhdGVVdGlscy5wZXJmb3JtYW5jZU5vdygpIC0gdGhpcy5fc3RhcnRUaW1lKSArIFwiIG1zXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2cuaW5mbyhkZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5dKTtcblxuZnVuY3Rpb24gc3VwcG9ydHNDb25zb2xlVGltZSgpIHtcbiAgICByZXR1cm4gY29uc29sZSAmJiBjb25zb2xlLnRpbWUgJiYgY29uc29sZS50aW1lRW5kO1xufSIsInZhciBkb250SW52b2tlQ29uc3RydWN0b3IgPSB7fTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHZhbHVlO1xufVxuXG52YXIgUHJvdG8gPSBmdW5jdGlvbigpIHtcbiAgICAvLyBkbyBub3RoaW5nXG59O1xuXG4vKipcbiAqIENyZWF0ZSBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIG9wdGlvbnMgICBhcnJheSBjb25zaXN0aW5nIG9mIGNvbnN0cnVjdG9yLCBwcm90b3R5cGUvXCJtZW1iZXJcIiB2YXJpYWJsZXMvZnVuY3Rpb25zLFxuICogICAgICAgICAgICAgICAgICBhbmQgbmFtZXNwYWNlL1wic3RhdGljXCIgdmFyaWFibGVzL2Z1bmN0aW9uXG4gKi9cblByb3RvLmRlZmluZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMgfHwgMCA9PT0gb3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIHBvc3NpYmxlQ29uc3RydWN0b3IgPSBvcHRpb25zWzBdO1xuXG4gICAgdmFyIHByb3BlcnRpZXM7XG4gICAgdmFyIHN0YXRpY1Byb3BlcnRpZXM7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihwb3NzaWJsZUNvbnN0cnVjdG9yKSkge1xuICAgICAgICBwcm9wZXJ0aWVzID0gMSA8IG9wdGlvbnMubGVuZ3RoID8gb3B0aW9uc1sxXSA6IHt9O1xuICAgICAgICBwcm9wZXJ0aWVzWyBcIiRjdG9yXCIgXSA9IHBvc3NpYmxlQ29uc3RydWN0b3I7XG5cbiAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcm9wZXJ0aWVzID0gb3B0aW9uc1swXTtcbiAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUHJvdG9PYmoocGFyYW0pXG4gICAge1xuICAgICAgICBpZiAoZG9udEludm9rZUNvbnN0cnVjdG9yICE9IHBhcmFtICYmXG4gICAgICAgICAgICBpc0Z1bmN0aW9uKHRoaXMuJGN0b3IpKSB7XG4gICAgICAgICAgICB0aGlzLiRjdG9yLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFByb3RvT2JqLnByb3RvdHlwZSA9IG5ldyB0aGlzKGRvbnRJbnZva2VDb25zdHJ1Y3Rvcik7XG5cbiAgICAvLyBQcm90b3R5cGUvXCJtZW1iZXJcIiBwcm9wZXJ0aWVzXG4gICAgZm9yIChrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgICBhZGRQcm90b1Byb3BlcnR5KGtleSwgcHJvcGVydGllc1trZXldLCBQcm90b09iai5wcm90b3R5cGVba2V5XSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnR5LCBzdXBlclByb3BlcnR5KVxuICAgIHtcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHByb3BlcnR5KSB8fFxuICAgICAgICAgICAgIWlzRnVuY3Rpb24oc3VwZXJQcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydHk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgZnVuY3Rpb24gd2l0aCByZWYgdG8gYmFzZSBtZXRob2RcbiAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gc3VwZXJQcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQcm90b09iai5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQcm90b09iajtcblxuICAgIC8vIE5hbWVzcGFjZWQvXCJTdGF0aWNcIiBwcm9wZXJ0aWVzXG4gICAgUHJvdG9PYmouZXh0ZW5kID0gdGhpcy5leHRlbmQgfHwgdGhpcy5kZWZpbmU7XG4gICAgUHJvdG9PYmoubWl4aW4gPSB0aGlzLm1peGluO1xuXG4gICAgZm9yIChrZXkgaW4gc3RhdGljUHJvcGVydGllcylcbiAgICB7XG4gICAgICAgIFByb3RvT2JqW2tleV0gPSBzdGF0aWNQcm9wZXJ0aWVzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb3RvT2JqO1xufTtcblxuLyoqXG4gKiBNaXhpbiBhIHNldCBvZiB2YXJpYWJsZXMvZnVuY3Rpb25zIGFzIHByb3RvdHlwZXMgZm9yIHRoaXMgb2JqZWN0LiBBbnkgdmFyaWFibGVzL2Z1bmN0aW9uc1xuICogdGhhdCBhbHJlYWR5IGV4aXN0IHdpdGggdGhlIHNhbWUgbmFtZSB3aWxsIGJlIG92ZXJyaWRkZW4uXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgICAgdmFyaWFibGVzL2Z1bmN0aW9ucyB0byBtaXhpbiB3aXRoIHRoaXMgb2JqZWN0XG4gKi9cblByb3RvLm1peGluID0gZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgIFByb3RvLm1peGluV2l0aCh0aGlzLCBwcm9wZXJ0aWVzKTtcbn07XG5cbi8qKlxuICogTWl4aW4gYSBzZXQgb2YgdmFyaWFibGVzL2Z1bmN0aW9ucyBhcyBwcm90b3R5cGVzIGZvciB0aGUgb2JqZWN0LiBBbnkgdmFyaWFibGVzL2Z1bmN0aW9uc1xuICogdGhhdCBhbHJlYWR5IGV4aXN0IHdpdGggdGhlIHNhbWUgbmFtZSB3aWxsIGJlIG92ZXJyaWRkZW4uXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgICAgdmFyaWFibGVzL2Z1bmN0aW9ucyB0byBtaXhpbiB3aXRoIHRoaXMgb2JqZWN0XG4gKi9cblByb3RvLm1peGluV2l0aCA9IGZ1bmN0aW9uKG9iaiwgcHJvcGVydGllcykge1xuICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgb2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG87IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3Byb3RvLmpzXCIpO1xudmFyIEFycmF5VXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9hcnJheS5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGFkZDogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lckV4aXN0cyhjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKG5ldyBTaWduYWxMaXN0ZW5lcihjYWxsYmFjaywgY29udGV4dCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZE9uY2U6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJFeGlzdHMoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChuZXcgU2lnbmFsTGlzdGVuZXIoY2FsbGJhY2ssIGNvbnRleHQsIHRydWUpKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHZhciBwb3NzaWJsZUxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZUxpc3RlbmVyLmlzU2FtZUNvbnRleHQoY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwb3NzaWJsZUxpc3RlbmVyLmlzU2FtZShjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAtIG5vIG1hdGNoXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5VXRpbHMucmVtb3ZlQXQodGhpcy5fbGlzdGVuZXJzLCBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgb25lIG1hdGNoIGlmIGNhbGxiYWNrIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCAtIDE7IDAgPD0gaW5kZXg7IGluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIudHJpZ2dlcihhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9ubHlPbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5VXRpbHMucmVtb3ZlQXQodGhpcy5fbGlzdGVuZXJzLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9saXN0ZW5lckV4aXN0czogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCAtIDE7IDAgPD0gaW5kZXg7IGluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLmlzU2FtZShjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5dKTtcblxudmFyIFNpZ25hbExpc3RlbmVyID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKGNhbGxiYWNrLCBjb250ZXh0LCBvbmx5T25jZSkge1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5vbmx5T25jZSA9IG9ubHlPbmNlO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGlzU2FtZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjayA9PT0gY2FsbGJhY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjayA9PT0gY2FsbGJhY2sgJiYgdGhpcy5fY29udGV4dCA9PT0gY29udGV4dDtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1NhbWVDb250ZXh0OiBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dCA9PT0gY29udGV4dDtcbiAgICAgICAgfSxcblxuICAgICAgICB0cmlnZ2VyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5hcHBseSh0aGlzLl9jb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgU3RvcmFnZSA9IHJlcXVpcmUoXCIuL3N0b3JhZ2UuanNcIilcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU3RvcmFnZSh3aW5kb3cubG9jYWxTdG9yYWdlKTsiLCJ2YXIgU3RvcmFnZSA9IHJlcXVpcmUoXCIuL3N0b3JhZ2UuanNcIilcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU3RvcmFnZSh3aW5kb3cuc2Vzc2lvblN0b3JhZ2UpOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGF0ZVV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL2RhdGUuanNcIik7XG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIFByb3RvID0gcmVxdWlyZShcIi4uL3Byb3RvLmpzXCIpO1xudmFyIENhY2hlID0gcmVxdWlyZShcIi4uL2NhY2hlLmpzXCIpO1xudmFyIGFzc2VydCA9IHJlcXVpcmUoXCIuLi9hc3NlcnQuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKHN0b3JhZ2UsIHVzZUNhY2hlLCBjYWNoZSkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSB1c2VDYWNoZSkge1xuICAgICAgICAgICAgdXNlQ2FjaGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc3RvcmFnZSA9IHN0b3JhZ2U7XG5cbiAgICAgICAgaWYgKHVzZUNhY2hlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSBjYWNoZSkge1xuICAgICAgICAgICAgICAgIGNhY2hlID0gbmV3IENhY2hlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlID0gY2FjaGU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9jYWNoZS5nZXQoa2V5KTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX3N0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICAgICAgdmFsdWUgPSBkZVNlcmlhbGl6ZSh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNlcmlhbGl6ZWQgPSBzZXJpYWxpemUodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXRJdGVtKGtleSwgc2VyaWFsaXplZCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLnJlbW92ZShrZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5jbGVhcigpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFdpdGhFeHBpcmF0aW9uOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5nZXQoa2V5KTtcbiAgICAgICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZWxhcHNlZCA9IERhdGVVdGlscy5ub3coKSAtIGl0ZW0udGltZTtcbiAgICAgICAgICAgIGlmIChpdGVtLmV4cGlyeSA8IGVsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0udmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0V2l0aEV4cGlyYXRpb246IGZ1bmN0aW9uKGtleSwgdmFsdWUsIGV4cGlyeSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB7dmFsdWU6IHZhbHVlLCBleHBpcnk6IGV4cGlyeSwgdGltZTogRGF0ZVV0aWxzLm5vdygpfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9yRWFjaDogZnVuY3Rpb24oaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIGFzc2VydChpdGVyYXRvciwgXCJpdGVyYXRvciBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX3N0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldChrZXkpO1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldENhY2hlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWx1ZSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGRlU2VyaWFsaXplKHZhbHVlKSB7XG4gICAgaWYgKCFPYmplY3RVdGlscy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgfVxuICAgIGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIHx8IHVuZGVmaW5lZDtcbiAgICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbW92ZUl0ZW06IGZ1bmN0aW9uKGFycmF5LCBpdGVtKSB7XG4gICAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG5cbiAgICAgICAgaWYgKC0xIDwgaW5kZXgpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlQXQ6IGZ1bmN0aW9uKGFycmF5LCBpbmRleCkge1xuICAgICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoMCA8PSBpbmRleCAmJiBhcnJheS5sZW5ndGggPiBpbmRleCkge1xuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXBsYWNlSXRlbTogZnVuY3Rpb24oYXJyYXksIGl0ZW0pIHtcbiAgICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblxuICAgICAgICBpZiAoLTEgPCBpbmRleCkge1xuICAgICAgICAgICAgYXJyYXlbaW5kZXhdID0gaXRlbTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gIXZhbHVlIHx8IDAgPT09IHZhbHVlLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgYXJndW1lbnRzVG9BcnJheTogZnVuY3Rpb24oYXJncywgc2xpY2VDb3VudCkge1xuICAgICAgICByZXR1cm4gc2xpY2VDb3VudCA8IGFyZ3MubGVuZ3RoID8gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgc2xpY2VDb3VudCkgOiBbXTtcbiAgICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBub3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfSxcblxuICAgIHBlcmZvcm1hbmNlTm93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlICYmIHBlcmZvcm1hbmNlLm5vdyA/IHBlcmZvcm1hbmNlLm5vdygpIDogdGhpcy5ub3coKTtcbiAgICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi9vYmplY3QuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xuXG4gICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0sXG5cbiAgICBlbGVtZW50U3VwcG9ydHNPbkV2ZW50OiBmdW5jdGlvbihlbGVtZW50LCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lIGluIGVsZW1lbnQ7XG4gICAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZm9yRWFjaDogZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9iai5mb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBPYmplY3QuZm9yRWFjaCkge1xuICAgICAgICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaXNBcnJheShvYmopICYmIG9iai5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBvYmoubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZhbHNlID09PSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpbmRleF0sIGluZGV4LCBvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIga2V5cyA9IHRoaXMua2V5cyhvYmopO1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZhbHNlID09PSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXlzW2luZGV4XV0sIGtleXNbaW5kZXhdLCBvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9LFxuXG4gICAga2V5czogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGlmICghdGhpcy5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleXMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG5cbiAgICBrZXlDb3VudDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGlmICghdGhpcy5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9LFxuXG4gICAgLy8gYm90aCB2YWx1ZXMgcGFzcyBzdHJpY3QgZXF1YWxpdHkgKD09PSlcbiAgICAvLyBib3RoIG9iamVjdHMgYXJlIHNhbWUgdHlwZSBhbmQgYWxsIHByb3BlcnRpZXMgcGFzcyBzdHJpY3QgZXF1YWxpdHlcbiAgICAvLyBib3RoIGFyZSBOYU5cbiAgICBhcmVFcXVhbDogZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG51bGwgPT09IHZhbHVlIHx8IG51bGwgPT09IG90aGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOYU4gaXMgTmFOIVxuICAgICAgICBpZiAodGhpcy5pc05hTih2YWx1ZSkgJiYgdGhpcy5pc05hTihvdGhlcikpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzU2FtZVR5cGUodmFsdWUsIG90aGVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT0gb3RoZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYXJlRXF1YWwodmFsdWVbaW5kZXhdLCBvdGhlcltpbmRleF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmdldFRpbWUoKSA9PSBvdGhlci5nZXRUaW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIga2V5c09mVmFsdWUgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRnVuY3Rpb24odmFsdWVba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFyZUVxdWFsKHZhbHVlW2tleV0sIG90aGVyW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBrZXlzT2ZWYWx1ZVtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG90aGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNGdW5jdGlvbihvdGhlcltrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIWtleXNPZlZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGlzTmFOOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAvLyBOYU4gaXMgbmV2ZXIgZXF1YWwgdG8gaXRzZWxmLCBpbnRlcmVzdGluZyA6KVxuICAgICAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xuICAgIH0sXG5cbiAgICBpc1NhbWVUeXBlOiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSB0eXBlb2Ygb3RoZXI7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8IFwic3RyaW5nXCIgPT0gdHlwZW9mIHZhbHVlKTtcbiAgICB9LFxuXG4gICAgaXNFcnJvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRXJyb3I7XG4gICAgfSxcblxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IE9iamVjdCh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5O1xuICAgIH0sXG5cbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gXCJmdW5jdGlvblwiID09IHR5cGVvZiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgaXNEYXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICBpc0ZpbGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBcIltvYmplY3QgRmlsZV1cIiA9PT0gU3RyaW5nKGRhdGEpO1xuICAgIH0sXG5cbiAgICBiaW5kOiBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgICAgIC8vIEJhc2VkIGhlYXZpbHkgb24gdW5kZXJzY29yZS9maXJlZm94IGltcGxlbWVudGF0aW9uLlxuXG4gICAgICAgIGlmICghdGhpcy5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseShmdW5jLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcblxuICAgICAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJpbmRDdG9yLnByb3RvdHlwZSA9IGZ1bmMucHJvdG90eXBlO1xuICAgICAgICAgICAgdmFyIHRoYXQgPSBuZXcgYmluZEN0b3IoKTtcbiAgICAgICAgICAgIGJpbmRDdG9yLnByb3RvdHlwZSA9IG51bGw7XG5cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoYXQsIGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGJvdW5kO1xuICAgIH0sXG5cbiAgICBleHRlbmQ6IGZ1bmN0aW9uKGRlc3QsIHNyYykge1xuICAgICAgICBpZiAoIXNyYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgICAgICAgICAgZGVzdFtrZXldID0gc3JjW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9LFxuXG4gICAgdG9Kc29uOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBhbiBvYmplY3QgdG8gY29udmVydCB0byBKU09OXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgfSxcblxuICAgIGZyb21Kc29uOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyKTtcbiAgICB9LFxuXG4gICAgdG9Gb3JtRGF0YTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcblxuICAgICAgICB0aGlzLmZvckVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZXMuam9pbihcIiZcIik7XG4gICAgfVxufTtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuL29iamVjdC5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseShhcmd1bWVudHMpO1xuXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gXCJ7XCIgKyBpbmRleCArIFwifVwiO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHNlYXJjaCwgYXJndW1lbnRzW2luZGV4XSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIGZvcm1hdFdpdGhQcm9wZXJ0aWVzOiBmdW5jdGlvbih2YWx1ZSwgZm9ybWF0UHJvcGVydGllcykge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGZvcm1hdFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWFyY2ggPSBcIntcIiArIHByb3BlcnR5ICsgXCJ9XCI7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHNlYXJjaCwgZm9ybWF0UHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBwYWQ6IGZ1bmN0aW9uKCB2YWx1ZSwgcGFkQ291bnQsIHBhZFZhbHVlICkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBwYWRWYWx1ZSkge1xuICAgICAgICAgICAgcGFkVmFsdWUgPSBcIjBcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gU3RyaW5nKCB2YWx1ZSApO1xuXG4gICAgICAgIHdoaWxlICh2YWx1ZS5sZW5ndGggPCBwYWRDb3VudCkge1xuICAgICAgICAgICAgdmFsdWUgPSBwYWRWYWx1ZSArIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBmb3JtYXRUaW1lOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGRhdGUpIHtcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhvdXJzID0gdGhpcy5wYWQoZGF0ZS5nZXRIb3VycygpLCAyKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSB0aGlzLnBhZChkYXRlLmdldE1pbnV0ZXMoKSwgMik7XG4gICAgICAgIHZhciBzZWNvbmRzID0gdGhpcy5wYWQoZGF0ZS5nZXRTZWNvbmRzKCksIDIpO1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5wYWQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KFxuICAgICAgICAgICAgXCJ7MH06ezF9OnsyfTp7M31cIiwgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMsIG1pbGxpc2Vjb25kcyk7XG4gICAgfSxcblxuICAgIGZvcm1hdE1vbnRoRGF5WWVhcjogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZiAoIWRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1vbnRoID0gdGhpcy5wYWQoZGF0ZS5nZXRNb250aCgpICsgMSk7XG4gICAgICAgIHZhciBkYXkgPSB0aGlzLnBhZChkYXRlLmdldERhdGUoKSk7XG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChcbiAgICAgICAgICAgIFwiezB9L3sxfS97Mn1cIiwgbW9udGgsIGRheSwgeWVhcik7XG4gICAgfSxcblxuICAgIGZvcm1hdFllYXJSYW5nZTogZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBcIlwiO1xuXG4gICAgICAgIGlmIChzdGFydCAmJiBlbmQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gc3RhcnQgKyBcIiAtIFwiICsgZW5kO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN0YXJ0KSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBlbmQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIGNhcGl0YWxpemVGaXJzdENoYXJhY3RlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgICsgdmFsdWUuc2xpY2UoMSk7XG4gICAgfSxcblxuICAgIHVybExhc3RQYXRoOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3BsaXQgPSB2YWx1ZS5zcGxpdChcIi9cIik7XG4gICAgICAgIHJldHVybiAwIDwgc3BsaXQubGVuZ3RoID8gc3BsaXRbc3BsaXQubGVuZ3RoLTFdIDogbnVsbDtcbiAgICB9LFxuXG4gICAgaGFzVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAmJiAwIDwgdmFsdWUubGVuZ3RoO1xuICAgIH0sXG5cbiAgICBsaW5lc09mOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB2YXIgbGluZXM7XG5cbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBsaW5lcyA9IHZhbHVlLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH0sXG5cbiAgICBpc0VxdWFsOiBmdW5jdGlvbihzdHIsIHZhbHVlLCBpZ25vcmVDYXNlKSB7XG4gICAgICAgIGlmICghc3RyIHx8ICF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciA9PSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHIgPT0gdmFsdWU7XG4gICAgfSxcblxuICAgIGlzRXF1YWxJZ25vcmVDYXNlOiBmdW5jdGlvbihzdHIsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzRXF1YWwoc3RyLCB2YWx1ZSwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihzdHIsIHZhbHVlLCBpZ25vcmVDYXNlKSB7XG4gICAgICAgIGlmICghc3RyIHx8ICF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciA9PSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwIDw9IHN0ci5pbmRleE9mKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgYWRkUGFyYW1ldGVyc1RvVXJsOiBmdW5jdGlvbih1cmwsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgaWYgKCF1cmwgfHwgIXBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZXBlcmF0b3IgPSB0aGlzLmNvbnRhaW5zKHVybCwgXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGFyYW1ldGVycykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1ldGVyc1trZXldO1xuXG4gICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBPYmplY3RVdGlscy50b0pzb24odmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXJsICs9IHNlcGVyYXRvciArICBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbWV0ZXJzW2tleV0pO1xuICAgICAgICAgICAgc2VwZXJhdG9yID0gXCI/XCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH0sXG5cbiAgICByZW1vdmVQYXJhbWV0ZXJGcm9tVXJsOiBmdW5jdGlvbih1cmwsIHBhcmFtZXRlcikge1xuICAgICAgICBpZiAoIXVybCB8fCAhcGFyYW1ldGVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VhcmNoID0gcGFyYW1ldGVyICsgXCI9XCI7XG4gICAgICAgIHZhciBzdGFydEluZGV4ID0gdXJsLmluZGV4T2Yoc2VhcmNoKTtcblxuICAgICAgICBpZiAoLTEgPT09IGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZW5kSW5kZXggPSB1cmwuaW5kZXhPZihcIiZcIiwgc3RhcnRJbmRleCk7XG5cbiAgICAgICAgaWYgKC0xIDwgZW5kSW5kZXgpIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgTWF0aC5tYXgoc3RhcnRJbmRleCAtIDEsIDApKSArIHVybC5zdWJzdHIoZW5kSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCBNYXRoLm1heChzdGFydEluZGV4IC0gMSwgMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG59O1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgID0ge1xuICAgIGlzRmlsZVByb3RvY29sOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFwiZmlsZTpcIiA9PT0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sO1xuICAgIH0sXG5cbiAgICBnbG9iYWxFdmFsOiBmdW5jdGlvbihzcmMpIHtcbiAgICAgICAgaWYgKCFzcmMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGh0dHBzOi8vd2VibG9ncy5qYXZhLm5ldC9ibG9nL2RyaXNjb2xsL2FyY2hpdmUvMjAwOS8wOS8wOC9ldmFsLWphdmFzY3JpcHQtZ2xvYmFsLWNvbnRleHRcbiAgICAgICAgaWYgKHdpbmRvdy5leGVjU2NyaXB0KSB7XG4gICAgICAgICAgICB3aW5kb3cuZXhlY1NjcmlwdChzcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHdpbmRvdy5ldmFsLmNhbGwod2luZG93LnNyYyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuYygpO1xuICAgIH1cbn0iXX0=
