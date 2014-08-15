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
},{"./utils/array.js":19,"./utils/object.js":22,"./utils/string.js":23}],2:[function(require,module,exports){
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

},{"./assert.js":1,"./proto.js":14,"./utils/date.js":20,"./utils/object.js":22}],3:[function(require,module,exports){
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
},{"./assert.js":1,"./cache.js":2,"./global-error-handler.js":4,"./http/http.js":9,"./lazy-load.js":10,"./log/log-console.js":11,"./log/log.js":12,"./performance-monitor.js":13,"./proto.js":14,"./signal.js":15,"./storage/local-storage.js":16,"./storage/session-storage.js":17,"./utils/array.js":19,"./utils/date.js":20,"./utils/object.js":22,"./utils/string.js":23,"./utils/window.js":24}],4:[function(require,module,exports){
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
},{"../assert.js":1,"../cache.js":2,"../proto.js":14,"../utils/date.js":20,"../utils/object.js":22}],19:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2Fzc2VydC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2NhY2hlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvZXhwb3J0cy5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2dsb2JhbC1lcnJvci1oYW5kbGVyLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvaHR0cC9odHRwLWNvcnMtc2NyaXB0LmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvaHR0cC9odHRwLWRlZmVycmVkLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvaHR0cC9odHRwLWpzb25wLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvaHR0cC9odHRwLXhoci5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2h0dHAvaHR0cC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2xhenktbG9hZC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2xvZy9sb2ctY29uc29sZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL2xvZy9sb2cuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9wZXJmb3JtYW5jZS1tb25pdG9yLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvcHJvdG8uanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9zaWduYWwuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9zdG9yYWdlL2xvY2FsLXN0b3JhZ2UuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9zdG9yYWdlL3Nlc3Npb24tc3RvcmFnZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3N0b3JhZ2Uvc3RvcmFnZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3V0aWxzL2FycmF5LmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvZGF0ZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3V0aWxzL2RvbS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3V0aWxzL29iamVjdC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3V0aWxzL3N0cmluZy5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3V0aWxzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZy5qc1wiKTtcbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL29iamVjdC5qc1wiKTtcbnZhciBBcnJheVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvYXJyYXkuanNcIik7XG5cbnZhciBhc3NlcnQgPSBmdW5jdGlvbihjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJndW1lbnRzKTtcbiAgICBtZXNzYWdlID0gU3RyaW5nVXRpbHMuZm9ybWF0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG59O1xuXG5hc3NlcnQgPSBPYmplY3RVdGlscy5leHRlbmQoYXNzZXJ0LCB7XG4gICAgb2s6IGZ1bmN0aW9uKGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgZXF1YWw6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAyKTtcbiAgICAgICAgYXNzZXJ0LmFwcGx5KHRoaXMsIFthY3R1YWwgPT0gZXhwZWN0ZWRdLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIG5vdEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbYWN0dWFsICE9IGV4cGVjdGVkXS5jb25jYXQoYXJncykpO1xuICAgIH0sXG5cbiAgICBzdHJpY3RFcXVhbDogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMsIDIpO1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgW2FjdHVhbCA9PT0gZXhwZWN0ZWRdLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIHN0cmljdE5vdEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbYWN0dWFsICE9PSBleHBlY3RlZF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9LFxuXG4gICAgZGVlcEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbT2JqZWN0VXRpbHMuYXJlRXF1YWwoYWN0dWFsLCBleHBlY3RlZCldLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIGRlZXBOb3RFcXVhbDogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMsIDIpO1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgWyFPYmplY3RVdGlscy5hcmVFcXVhbChhY3R1YWwsIGV4cGVjdGVkKV0uY29uY2F0KGFyZ3MpKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NlcnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuL3Byb3RvLmpzXCIpO1xudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2RhdGUuanNcIik7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZShcIi4vYXNzZXJ0LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3Rvcihjb3VudExpbWl0LCB0b3RhbENvc3RMaW1pdCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBjb3VudExpbWl0KSB7XG4gICAgICAgICAgICBjb3VudExpbWl0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSB0b3RhbENvc3RMaW1pdCkge1xuICAgICAgICAgICAgdG90YWxDb3N0TGltaXQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY291bnRMaW1pdCA9IGNvdW50TGltaXQ7XG4gICAgICAgIHRoaXMuX3RvdGFsQ29zdExpbWl0ID0gdG90YWxDb3N0TGltaXQ7XG5cbiAgICAgICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuX2NhY2hlW2tleV07XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA/IHZhbHVlLnZhbHVlIDogbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUsIGNvc3QpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXksIFwia2V5IG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSBjb3N0KSB7XG4gICAgICAgICAgICAgICAgY29zdCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlW2tleV0gPSB7dmFsdWU6IHZhbHVlLCBjb3N0OiBjb3N0fTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvdW50TGltaXQgfHwgKHRoaXMuX3RvdGFsQ29zdExpbWl0ICYmIGNvc3QpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZpY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jYWNoZVtrZXldO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q291bnRMaW1pdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50TGltaXQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2V2aWN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY291bnRMaW1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY291bnRMaW1pdDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRUb3RhbENvc3RMaW1pdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RvdGFsQ29zdExpbWl0ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9ldmljdCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvdGFsQ29zdExpbWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3RhbENvc3RMaW1pdDtcbiAgICAgICAgfSxcblxuICAgICAgICBfY3VycmVudFRvdGFsQ29zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBUT0RPIFRCRCBzaG91bGQgd2UgY2FjaGUgdG90YWwgY29zdCBhbmQgY3VycmVudCBjb3VudD9cbiAgICAgICAgICAgIC8vIC4uLiBhbnkgcGVyZm9ybWFuY2Ugd29ycmllcyBmb3IgcG90ZW50aWFsbHkgaHVnZSBjYWNoZXM/P1xuICAgICAgICAgICAgdmFyIHRvdGFsQ29zdCA9IDA7XG5cbiAgICAgICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fY2FjaGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICB0b3RhbENvc3QgKz0gdmFsdWUuY29zdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdG90YWxDb3N0O1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jdXJyZW50Q291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLmtleUNvdW50KHRoaXMuX2NhY2hlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXZpY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9zaG91bGRFdmljdCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9ldmljdE1vc3RDb3N0bHkoKTtcbiAgICAgICAgICAgIHRoaXMuX2V2aWN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3Nob3VsZEV2aWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb3VudExpbWl0IDwgdGhpcy5fY3VycmVudENvdW50KCkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLl90b3RhbENvc3RMaW1pdCA8IHRoaXMuX2N1cnJlbnRUb3RhbENvc3QoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXZpY3RNb3N0Q29zdGx5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBtYXhDb3N0ID0gMDtcbiAgICAgICAgICAgIHZhciBtYXhLZXk7XG5cbiAgICAgICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fY2FjaGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1heEtleSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhLZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1heENvc3QgPCB2YWx1ZS5jb3N0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heEtleSA9IGtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBjb250aW51ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShtYXhLZXkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLy8gU21hbGxlciB0aGUgY29zdCBmb3IgbmV3ZXJcbiAgICAgICAgaW52ZXJzZUN1cnJlbnRUaW1lQ29zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gMSAvIERhdGVVdGlscy5ub3coKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBTbWFsbGVyIHRoZSBjb3N0IGZvciBvbGRlclxuICAgICAgICBjdXJyZW50VGltZUNvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIERhdGVVdGlscy5ub3coKTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuXG4gICAgUmVjdXJ2ZS5TdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZy5qc1wiKTtcbiAgICBSZWN1cnZlLldpbmRvd1V0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvd2luZG93LmpzXCIpO1xuICAgIFJlY3VydmUuQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2FycmF5LmpzXCIpO1xuICAgIFJlY3VydmUuRGF0ZVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvZGF0ZS5qc1wiKTtcbiAgICBSZWN1cnZlLk9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xuXG4gICAgUmVjdXJ2ZS5hc3NlcnQgPSByZXF1aXJlKFwiLi9hc3NlcnQuanNcIik7XG5cbiAgICBSZWN1cnZlLlByb3RvID0gcmVxdWlyZShcIi4vcHJvdG8uanNcIik7XG4gICAgUmVjdXJ2ZS5DYWNoZSA9IHJlcXVpcmUoXCIuL2NhY2hlLmpzXCIpO1xuICAgIFJlY3VydmUuTG9nID0gcmVxdWlyZShcIi4vbG9nL2xvZy5qc1wiKTtcbiAgICBSZWN1cnZlLkxvZ0NvbnNvbGVUYXJnZXQgPSByZXF1aXJlKFwiLi9sb2cvbG9nLWNvbnNvbGUuanNcIik7XG4gICAgUmVjdXJ2ZS5TaWduYWwgPSByZXF1aXJlKFwiLi9zaWduYWwuanNcIik7XG4gICAgUmVjdXJ2ZS5IdHRwID0gcmVxdWlyZShcIi4vaHR0cC9odHRwLmpzXCIpO1xuICAgIFJlY3VydmUuR2xvYmFsRXJyb3JIYW5kbGVyID0gcmVxdWlyZShcIi4vZ2xvYmFsLWVycm9yLWhhbmRsZXIuanNcIik7XG4gICAgUmVjdXJ2ZS5Mb2NhbFN0b3JhZ2UgPSByZXF1aXJlKFwiLi9zdG9yYWdlL2xvY2FsLXN0b3JhZ2UuanNcIik7XG4gICAgUmVjdXJ2ZS5TZXNzaW9uU3RvcmFnZSA9IHJlcXVpcmUoXCIuL3N0b3JhZ2Uvc2Vzc2lvbi1zdG9yYWdlLmpzXCIpO1xuICAgIFJlY3VydmUuUGVyZm9ybWFuY2VNb25pdG9yID0gcmVxdWlyZShcIi4vcGVyZm9ybWFuY2UtbW9uaXRvci5qc1wiKTtcbiAgICBSZWN1cnZlLkxhenlMb2FkID0gcmVxdWlyZShcIi4vbGF6eS1sb2FkLmpzXCIpO1xuXG4gICAgd2luZG93LlJlY3VydmUgPSBSZWN1cnZlO1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcHJvdG8uanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9zdHJpbmcuanNcIik7XG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2FycmF5LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG5cbiAgICAvKipcbiAgICAgKiBOT1RFLCBJZiB5b3VyIEpTIGlzIGhvc3RlZCBvbiBhIENETiB0aGVuIHRoZSBicm93c2VyIHdpbGwgc2FuaXRpemUgYW5kIGV4Y2x1ZGUgYWxsIGVycm9yIG91dHB1dFxuICAgICAqIHVubGVzcyBleHBsaWNpdGx5IGVuYWJsZWQuIFNlZSBUT0RPIFRCRCB0dXRvcmlhbCBsaW5rXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb25FcnJvciwgY2FsbGJhY2sgZGVjbGFyYXRpb246IG9uRXJyb3IoZGVzY3JpcHRpb24sIGVycm9yKSwgZXJyb3Igd2lsbCBiZSB1bmRlZmluZWQgaWYgbm90IHN1cHBvcnRlZCBieSBicm93c2VyXG4gICAgICogQHBhcmFtIGVuYWJsZWQsIGRlZmF1bHQgdHJ1ZVxuICAgICAqIEBwYXJhbSBwcmV2ZW50QnJvd3NlckhhbmRsZSwgZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgIGZ1bmN0aW9uIGN0b3Iob25FcnJvciwgZW5hYmxlZCwgcHJldmVudEJyb3dzZXJIYW5kbGUpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gZW5hYmxlZCkge1xuICAgICAgICAgICAgZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBwcmV2ZW50QnJvd3NlckhhbmRsZSkge1xuICAgICAgICAgICAgcHJldmVudEJyb3dzZXJIYW5kbGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlID0gcHJldmVudEJyb3dzZXJIYW5kbGU7XG4gICAgICAgIHRoaXMuX29uRXJyb3IgPSBvbkVycm9yO1xuXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gdGhpcy5fZXJyb3JIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXAgbWV0aG9kIGluIHRyeS4uY2F0Y2ggYW5kIGhhbmRsZSBlcnJvciB3aXRob3V0IHJhaXNpbmcgdW5jYXVnaHQgZXJyb3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZFxuICAgICAgICAgKiBAcGFyYW0gWywgYXJnMiwgLi4uLCBhcmdOXSwgbGlzdCBvZiBhcmd1bWVudHMgZm9yIG1ldGhvZFxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkSW52b2tlOiBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICBtZXRob2QuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaWJlRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlIGVycm9yIGFzIHdvdWxkIGJlIGRvbmUgZm9yIHVuY2F1Z2h0IGdsb2JhbCBlcnJvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXJyb3IsIGFueSB0eXBlIG9mIGVycm9yIChzdHJpbmcsIG9iamVjdCwgRXJyb3IpXG4gICAgICAgICAqIEBwYXJhbSBkZXNjcmlwdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKGVycm9yLCBkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX29uRXJyb3IpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25FcnJvcihlcnJvciwgZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJldmVudEJyb3dzZXJIYW5kbGU7XG4gICAgICAgIH0sXG5cblxuICAgICAgICBkZXNjcmliZUVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb247XG5cbiAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc1N0cmluZyhlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoT2JqZWN0VXRpbHMuaXNFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yLm1lc3NhZ2UgKyBcIlxcblwiICsgZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChPYmplY3RVdGlscy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXJyb3JIYW5kbGVyOiBmdW5jdGlvbihtZXNzYWdlLCBmaWxlbmFtZSwgbGluZSwgY29sdW1uLCBlcnJvcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBTdHJpbmdVdGlscy5mb3JtYXQoXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlOiB7MH0sIGZpbGU6IHsxfSwgbGluZTogezJ9XCIsIG1lc3NhZ2UsIGZpbGVuYW1lLCBsaW5lKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9IFN0cmluZ1V0aWxzLmZvcm1hdChcIiwgc3RhY2s6IHswfVwiLCBlcnJvci5zdGFjayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vbkVycm9yKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIFByb3RvID0gcmVxdWlyZShcIi4uL3Byb3RvLmpzXCIpO1xuXG52YXIgcmVxdWVzdElkID0gMDtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB0aGlzLl9vcHRpb25zLnVybDtcbiAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEVycm9ySGFuZGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIFwiZXJyb3JcIiA9PT0gZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9kZWZlcnJlZC5yZWplY3Qoe3N0YXR1czogNDA0LCBjYW5jZWxlZDogdGhhdC5fY2FuY2VsZWR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2RlZmVycmVkLnJlc29sdmUoe3N0YXR1czogMjAwLCBjYW5jZWxlZDogdGhhdC5fY2FuY2VsZWR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRPRE8gVEJEIGlmIGdvaW5nIHRvIHN1cHBvcnQgSUU4IHRoZW4gbmVlZCB0byBjaGVjayBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGFzIHdlbGxcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9waWVpc2dvb2Qub3JnL3Rlc3Qvc2NyaXB0LWxpbmstZXZlbnRzL1xuICAgICAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNpZ25hbCA9IHJlcXVpcmUoXCIuLi9zaWduYWwuanNcIik7XG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi4vcHJvdG8uanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9zdWNjZWVkZWQgPSBuZXcgU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuX2Vycm9yZWQgPSBuZXcgU2lnbmFsKCk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcmVzb2x2ZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC50cmlnZ2VyKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuVXAoKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWplY3Q6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9lcnJvcmVkLnRyaWdnZXIocmVzcG9uc2UpO1xuICAgICAgICAgICAgdGhpcy5fY2xlYW5VcCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByb21pc2U6IHtcbiAgICAgICAgICAgIHRoZW46IGZ1bmN0aW9uKG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC5hZGRPbmNlKG9uU3VjY2Vzcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5hZGRPbmNlKG9uRXJyb3IpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ob25TdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLmFkZE9uY2UoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsIHJlc3BvbnNlLm9wdGlvbnMsIHJlc3BvbnNlLmNhbmNlbGVkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5hZGRPbmNlKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IocmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdCAmJiB0aGlzLnJlcXVlc3QuY2FuY2VsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NsZWFuVXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLnJlbW92ZUFsbCgpO1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIFByb3RvID0gcmVxdWlyZShcIi4uL3Byb3RvLmpzXCIpO1xuXG52YXIgcmVxdWVzdElkID0gMDtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJZCA9IFwiUmVjdXJ2ZUpzb25QQ2FsbGJhY2tcIiArIHRoaXMuX2lkO1xuICAgICAgICAgICAgdmFyIHVybCA9IFN0cmluZ1V0aWxzLnJlbW92ZVBhcmFtZXRlckZyb21VcmwodGhpcy5fb3B0aW9ucy51cmwsIFwiY2FsbGJhY2tcIik7XG4gICAgICAgICAgICB1cmwgPSBTdHJpbmdVdGlscy5hZGRQYXJhbWV0ZXJzVG9VcmwodXJsLCB7Y2FsbGJhY2s6IGNhbGxiYWNrSWR9KTtcblxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gdXJsO1xuICAgICAgICAgICAgc2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgICAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcblxuICAgICAgICAgICAgdmFyIGNhbGxlZDtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbGJhY2tIYW5kbGVyKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuX2NhbmNlbGVkICYmIHRoYXQuX29wdGlvbnMuZXJyb3JPbkNhbmNlbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY29tcGxldGUodHJ1ZSwgZGF0YSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRFcnJvckhhbmRsZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB3aW5kb3dbY2FsbGJhY2tJZF07XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQgJiYgXCJsb2FkXCIgPT09IGV2ZW50LnR5cGUgJiYgIWNhbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jb21wbGV0ZShmYWxzZSwgbnVsbCwgNDA0LCBcImpzb25wIGNhbGxiYWNrIG5vdCBjYWxsZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUT0RPIFRCRCBpZiBnb2luZyB0byBzdXBwb3J0IElFOCB0aGVuIG5lZWQgdG8gY2hlY2sgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBhcyB3ZWxsXG4gICAgICAgICAgICAvLyBodHRwOi8vcGllaXNnb29kLm9yZy90ZXN0L3NjcmlwdC1saW5rLWV2ZW50cy9cbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgbG9hZEVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgICAgIHdpbmRvd1tjYWxsYmFja0lkXSA9IGNhbGxiYWNrSGFuZGxlcjtcblxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbXBsZXRlOiBmdW5jdGlvbihzdWNjZXNzLCBkYXRhLCBzdGF0dXMsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogdGhpcy5fb3B0aW9ucyxcbiAgICAgICAgICAgICAgICBjYW5jZWxlZDogdGhpcy5fY2FuY2VsZWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWZlcnJlZC5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIFdpbmRvd1V0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL3dpbmRvdy5qc1wiKTtcbnZhciBQcm90byA9IHJlcXVpcmUoXCIuLi9wcm90by5qc1wiKTtcblxudmFyIHJlcXVlc3RJZCA9IDA7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKG9wdGlvbnMsIGRlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLl9kZWZlcnJlZCA9IGRlZmVycmVkO1xuICAgICAgICB0aGlzLl9pZCA9IHJlcXVlc3RJZCsrO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3hociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUmVjdXJ2ZSBvbmx5IHN1cHBvcnRzIElFOCtcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZygpO1xuXG4gICAgICAgICAgICB0aGlzLl94aHIub25yZWFkeXN0YXRlY2hhbmdlID1cbiAgICAgICAgICAgICAgICBPYmplY3RVdGlscy5iaW5kKHRoaXMuX3N0YXRlQ2hhbmdlSGFuZGxlciwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3hoci5vcGVuKHRoaXMuX29wdGlvbnMubWV0aG9kLnRvVXBwZXJDYXNlKCksIHRoaXMuX29wdGlvbnMudXJsLCB0cnVlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuYmVmb3JlU2VuZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29wdGlvbnMuYmVmb3JlU2VuZCh0aGlzLl94aHIsIHRoaXMuX29wdGlvbnMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl94aHIuc2VuZCh0aGlzLl9vcHRpb25zLmRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl94aHIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl94aHIuYWJvcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfY29uZmlnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEhlYWRlcnMoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMud2l0aENyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl94aHIudGltZW91dCA9IHRoaXMuX29wdGlvbnMudGltZW91dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMucmVzcG9uc2VUeXBlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX29wdGlvbnMucmVzcG9uc2VUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTczNjQ4XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaSB3aWxsIHRocm93IGVycm9yIGZvciBcImpzb25cIiBtZXRob2QsIGlnbm9yZSB0aGlzIHNpbmNlXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGNhbiBoYW5kbGUgaXRcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcImpzb25cIiwgdGhpcy5fb3B0aW9ucy5tZXRob2QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfYWRkSGVhZGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBPYmplY3RVdGlscy5mb3JFYWNoKHRoaXMuX29wdGlvbnMuaGVhZGVycywgZnVuY3Rpb24odmFsdWUsIGhlYWRlcikge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl94aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuXG4gICAgICAgIF9zdGF0ZUNoYW5nZUhhbmRsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKDQgIT09IHRoaXMuX3hoci5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5faXNTdWNjZXNzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVTdWNjZXNzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9pc1N1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NhbmNlbGVkICYmIHRoaXMuX29wdGlvbnMuZXJyb3JPbkNhbmNlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHRoaXMuX3hoci5zdGF0dXM7XG5cbiAgICAgICAgICAgIHJldHVybiAoMjAwIDw9IHN0YXR1cyAmJiAzMDAgPiBzdGF0dXMpIHx8XG4gICAgICAgICAgICAgICAgMzA0ID09PSBzdGF0dXMgfHxcbiAgICAgICAgICAgICAgICAoMCA9PT0gc3RhdHVzICYmIFdpbmRvd1V0aWxzLmlzRmlsZVByb3RvY29sKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9oYW5kbGVTdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fb3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YTtcblxuICAgICAgICAgICAgaWYgKFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwic2NyaXB0XCIsIHRoaXMuX29wdGlvbnMuZGF0YVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX3JlcXVlc3QucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIFdpbmRvd1V0aWxzLmdsb2JhbEV2YWwoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fcGFyc2VSZXNwb25zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoXCJ1bmFibGUgdG8gcGFyc2UgcmVzcG9uc2VcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlKHRydWUsIGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9oYW5kbGVFcnJvcjogZnVuY3Rpb24oc3RhdHVzVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUoZmFsc2UsIG51bGwsIHN0YXR1c1RleHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jb21wbGV0ZTogZnVuY3Rpb24oc3VjY2VzcywgZGF0YSwgc3RhdHVzVGV4dCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgc3RhdHVzIDogdGhpcy5feGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgICBzdGF0dXNUZXh0IDogc3RhdHVzVGV4dCA/IHN0YXR1c1RleHQgOiB0aGlzLl94aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzIDogdGhpcy5feGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpLFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgOiB0aGlzLl9vcHRpb25zLFxuICAgICAgICAgICAgICAgIGNhbmNlbGVkIDogdGhpcy5fY2FuY2VsZWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWZlcnJlZC5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9wYXJzZVJlc3BvbnNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhY2NlcHQgPSAgdGhpcy5fb3B0aW9ucy5oZWFkZXJzICYmIHRoaXMuX29wdGlvbnMuaGVhZGVycy5BY2NlcHQ7XG4gICAgICAgICAgICBpZiAoIWFjY2VwdCkge1xuICAgICAgICAgICAgICAgIGFjY2VwdCA9IHRoaXMuX3hoci5nZXRSZXNwb25zZUhlYWRlcignY29udGVudC10eXBlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkYXRhO1xuXG4gICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNGdW5jdGlvbih0aGlzLl9vcHRpb25zLnNlcmlhbGl6ZXIpKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX29wdGlvbnMucGFyc2VyKHRoaXMuX3hociksIGFjY2VwdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2godGhpcy5fb3B0aW9ucy5wYXJzZXIsIGZ1bmN0aW9uKHBhcnNlcikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gcGFyc2VyKHRoaXMuX3hociwgYWNjZXB0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL29iamVjdC5qc1wiKTtcbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9zdHJpbmcuanNcIik7XG52YXIgRGF0ZVV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL2RhdGUuanNcIik7XG5cbnZhciBYaHIgPSByZXF1aXJlKFwiLi9odHRwLXhoci5qc1wiKTtcbnZhciBKc29ucFJlcXVlc3QgPSByZXF1aXJlKFwiLi9odHRwLWpzb25wLmpzXCIpO1xudmFyIENyb3NzRG9tYWluU2NyaXB0UmVxdWVzdCA9IHJlcXVpcmUoXCIuL2h0dHAtY29ycy1zY3JpcHQuanNcIik7XG52YXIgSHR0cERlZmVycmVkID0gcmVxdWlyZShcIi4vaHR0cC1kZWZlcnJlZC5qc1wiKTtcblxudmFyIEh0dHAgPSB7XG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgYWxsOiB7fSxcblxuICAgICAgICAgICAgZ2V0OiB7fSxcbiAgICAgICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwdXQ6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkOiB7fSxcbiAgICAgICAgICAgIFwiZGVsZXRlXCI6IHt9LFxuICAgICAgICAgICAganNvbnA6IHt9LFxuICAgICAgICAgICAgc2NyaXB0OiB7fVxuICAgICAgICB9LFxuXG4gICAgICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuXG4gICAgICAgIGNhY2hlOiB0cnVlLFxuXG4gICAgICAgIHNlcmlhbGl6ZXIgOiBbZGVmYXVsdFNlcmlhbGl6ZXJdLFxuICAgICAgICBwYXJzZXIgOiBbZGVmYXVsdFBhcnNlcl0sXG5cbiAgICAgICAgcmVxdWVzdEZhY3Rvcnk6IERlZmF1bHRSZXF1ZXN0RmFjdG9yeSxcbiAgICAgICAgZGVmZXJyZWRGYWN0b3J5OiBEZWZhdWx0RGVmZXJyZWRGYWN0b3J5LFxuXG4gICAgICAgIGVycm9yT25DYW5jZWw6IHRydWUsXG4gICAgICAgIGVtdWxhdGVIdHRwOiBmYWxzZVxuICAgIH0sXG5cbiAgICByZXF1ZXN0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciB3aXRoRGVmYXVsdHMgPSBjcmVhdGVPcHRpb25zV2l0aERlZmF1bHRzKG9wdGlvbnMsIEh0dHAuZGVmYXVsdHMpO1xuXG4gICAgICAgIHVwZGF0ZVVybCh3aXRoRGVmYXVsdHMpO1xuICAgICAgICB1cGRhdGVIZWFkZXJzKHdpdGhEZWZhdWx0cyk7XG4gICAgICAgIHVwZGF0ZURhdGEod2l0aERlZmF1bHRzKTtcbiAgICAgICAgc2VyaWFsaXplRGF0YSh3aXRoRGVmYXVsdHMpO1xuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IHdpdGhEZWZhdWx0cy5kZWZlcnJlZEZhY3Rvcnkod2l0aERlZmF1bHRzKTtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB3aXRoRGVmYXVsdHMucmVxdWVzdEZhY3Rvcnkod2l0aERlZmF1bHRzLCBkZWZlcnJlZCk7XG5cbiAgICAgICAgZGVmZXJyZWQucmVxdWVzdCA9IGRlZmVycmVkO1xuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcblxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImdldFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBwb3N0OiBmdW5jdGlvbih1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcInBvc3RcIiwgdXJsOiB1cmwsIGRhdGE6IGRhdGF9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAganNvbnA6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwianNvbnBcIiwgdXJsOiB1cmx9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZGVsZXRlOiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImRlbGV0ZVwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBoZWFkOiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcImhlYWRcIiwgdXJsOiB1cmx9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgcHV0OiBmdW5jdGlvbih1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcInB1dFwiLCB1cmw6IHVybCwgZGF0YTogZGF0YX0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBwYXRjaDogZnVuY3Rpb24odXJsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJwYXRjaFwiLCB1cmw6IHVybCwgZGF0YTogZGF0YX0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBnZXRTY3JpcHQ6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwic2NyaXB0XCIsIHVybDogdXJsfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxufTtcblxuXG5mdW5jdGlvbiBkZWZhdWx0U2VyaWFsaXplcihkYXRhLCBjb250ZW50VHlwZSkge1xuICAgIHZhciBpZ25vcmVDYXNlID0gdHJ1ZTtcblxuICAgIGlmIChTdHJpbmdVdGlscy5jb250YWlucyhjb250ZW50VHlwZSwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzT2JqZWN0KGRhdGEpICYmICFPYmplY3RVdGlscy5pc0ZpbGUoZGF0YSkpIHtcbiAgICAgICAgICAgIGRhdGEgPSBPYmplY3RVdGlscy50b0Zvcm1EYXRhKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGNvbnRlbnRUeXBlLCBcImFwcGxpY2F0aW9uL2pzb25cIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzT2JqZWN0KGRhdGEpICYmICFPYmplY3RVdGlscy5pc0ZpbGUoZGF0YSkpIHtcbiAgICAgICAgICAgIGRhdGEgPSBPYmplY3RVdGlscy50b0pzb24oZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcgLSBub3RoaW5nIHRvIHNlcmlhbGl6ZVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5IdHRwLnNlcmlhbGl6ZXIgPSBkZWZhdWx0U2VyaWFsaXplcjtcblxuXG5mdW5jdGlvbiBkZWZhdWx0UGFyc2VyKHhociwgYWNjZXB0KSB7XG4gICAgdmFyIGRhdGE7XG4gICAgdmFyIGlnbm9yZUNhc2UgPSB0cnVlO1xuXG4gICAgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGFjY2VwdCwgXCJhcHBsaWNhdGlvbi94bWxcIiwgaWdub3JlQ2FzZSkgfHxcbiAgICAgICAgU3RyaW5nVXRpbHMuY29udGFpbnMoYWNjZXB0LCBcInRleHQveG1sXCIsIGlnbm9yZUNhc2UpKSB7XG4gICAgICAgIGRhdGEgPSB4aHIucmVzcG9uc2VYTUw7XG4gICAgfVxuICAgIGVsc2UgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGFjY2VwdCwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIGlnbm9yZUNhc2UpKSB7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0gT2JqZWN0VXRpbHMudG9Kc29uKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkYXRhID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuSHR0cC5wYXJzZXIgPSBkZWZhdWx0UGFyc2VyO1xuXG5cbmZ1bmN0aW9uIERlZmF1bHRSZXF1ZXN0RmFjdG9yeShvcHRpb25zLCBkZWZlcnJlZCkge1xuICAgIHZhciByZXF1ZXN0O1xuXG4gICAgaWYgKFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwianNvbnBcIiwgb3B0aW9ucy5tZXRob2QpKSB7XG4gICAgICAgIHJlcXVlc3QgPSBuZXcgSnNvbnBSZXF1ZXN0KG9wdGlvbnMsIGRlZmVycmVkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAob3B0aW9ucy5jcm9zc0RvbWFpbiAmJlxuICAgICAgICBTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCBvcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgICAgcmVxdWVzdCA9IG5ldyBDcm9zc0RvbWFpblNjcmlwdFJlcXVlc3Qob3B0aW9ucywgZGVmZXJyZWQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVxdWVzdCA9IG5ldyBYaHIob3B0aW9ucywgZGVmZXJyZWQpO1xuICAgIH1cblxuICAgIHJldHVybiByZXF1ZXN0O1xufTtcblxuSHR0cC5SZXF1ZXN0RmFjdG9yeSA9IERlZmF1bHRSZXF1ZXN0RmFjdG9yeTtcblxuXG5mdW5jdGlvbiBEZWZhdWx0RGVmZXJyZWRGYWN0b3J5KCkge1xuICAgIHJldHVybiBuZXcgSHR0cERlZmVycmVkKCk7XG59O1xuXG5IdHRwLkRlZmVycmVkRmFjdG9yeSA9IERlZmF1bHREZWZlcnJlZEZhY3Rvcnk7XG5cblxuZnVuY3Rpb24gUURlZmVycmVkRmFjdG9yeSgpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICBkZWZlcnJlZC5wcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbihvblN1Y2Nlc3MpIHtcbiAgICAgICAgZGVmZXJyZWQucHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBvblN1Y2Nlc3MoXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsIHJlc3BvbnNlLm9wdGlvbnMsIHJlc3BvbnNlLmNhbmNlbGVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmVycmVkLnByb21pc2U7XG4gICAgfTtcblxuICAgIGRlZmVycmVkLnByb21pc2UuZXJyb3IgPSBmdW5jdGlvbihvbkVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnByb21pc2UudGhlbihudWxsLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgb25FcnJvcihcbiAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZGVmZXJyZWQucmVxdWVzdC5jYW5jZWwoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmVycmVkO1xufTtcblxuSHR0cC5RRGVmZXJyZWRGYWN0b3J5ID0gUURlZmVycmVkRmFjdG9yeTtcblxuXG5mdW5jdGlvbiBjcmVhdGVPcHRpb25zV2l0aERlZmF1bHRzKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gICAgdmFyIHdpdGhEZWZhdWx0cyA9IE9iamVjdFV0aWxzLmV4dGVuZCh7fSwgZGVmYXVsdHMpO1xuXG4gICAgd2l0aERlZmF1bHRzLmhlYWRlcnMgPSB7fTtcbiAgICBtZXJnZUhlYWRlcnMob3B0aW9ucy5tZXRob2QsIHdpdGhEZWZhdWx0cywgZGVmYXVsdHMuaGVhZGVycyk7XG5cbiAgICBPYmplY3RVdGlscy5leHRlbmQod2l0aERlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB3aXRoRGVmYXVsdHM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSGVhZGVycyhtZXRob2QsIG9wdGlvbnMsIGRlZmF1bHRIZWFkZXJzKSB7XG4gICAgbWV0aG9kID0gbWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywgZGVmYXVsdEhlYWRlcnMuYWxsKTtcbiAgICBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywgZGVmYXVsdEhlYWRlcnNbbWV0aG9kXSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVVybChvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmNhY2hlKSB7XG4gICAgICAgIG9wdGlvbnMucGFyYW1zLmNhY2hlID0gRGF0ZVV0aWxzLm5vdygpO1xuICAgIH1cblxuICAgIG9wdGlvbnMudXJsID1cbiAgICAgICAgU3RyaW5nVXRpbHMuYWRkUGFyYW1ldGVyc1RvVXJsKFxuICAgICAgICAgICAgb3B0aW9ucy51cmwsIG9wdGlvbnMucGFyYW1zKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSGVhZGVycyhvcHRpb25zKSB7XG4gICAgYWRkQWNjZXB0SGVhZGVyKG9wdGlvbnMpO1xuICAgIGFkZFJlcXVlc3RlZFdpdGhIZWFkZXIob3B0aW9ucyk7XG4gICAgcmVtb3ZlQ29udGVudFR5cGUob3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGFkZEFjY2VwdEhlYWRlcihvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycy5BY2NlcHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBhY2NlcHQgPSBcIiovKlwiO1xuICAgIHZhciBkYXRhVHlwZSA9IG9wdGlvbnMuZGF0YVR5cGU7XG5cbiAgICBpZiAoZGF0YVR5cGUpIHtcbiAgICAgICAgZGF0YVR5cGUgPSBkYXRhVHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGlmIChcInRleHRcIiA9PT0gZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIGFjY2VwdCA9IFwidGV4dC9wbGFpbiwqLyo7cT0wLjAxXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXCJodG1sXCIgPT09IGRhdGFUeXBlKSB7XG4gICAgICAgICAgICBhY2NlcHQgPSBcInRleHQvaHRtbCwqLyo7cT0wLjAxXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXCJ4bWxcIiA9PT0gZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIGFjY2VwdCA9IFwiYXBwbGljYXRpb24veG1sLHRleHQveG1sLCovKjtxPTAuMDFcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcImpzb25cIiA9PT0gZGF0YVR5cGUgfHwgXCJzY3JpcHRcIiA9PT0gZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIGFjY2VwdCA9IFwiYXBwbGljYXRpb24vanNvbix0ZXh0L2phdmFzY3JpcHQsKi8qO3E9MC4wMVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZG8gbm90aGluZyAtIGRlZmF1bHQgdG8gYWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvcHRpb25zLmhlYWRlcnMuQWNjZXB0ID0gYWNjZXB0O1xufVxuXG5mdW5jdGlvbiBhZGRSZXF1ZXN0ZWRXaXRoSGVhZGVyKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuY3Jvc3NEb21haW4gJiZcbiAgICAgICAgIW9wdGlvbnMuaGVhZGVyc1tcIlgtUmVxdWVzdGVkLVdpdGhcIl0gJiZcbiAgICAgICAgIVN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwic2NyaXB0XCIsIG9wdGlvbnMuZGF0YVR5cGUpKSB7XG4gICAgICAgIG9wdGlvbnMuaGVhZGVyc1tcIlgtUmVxdWVzdGVkLVdpdGhcIl0gPSBcIlhNTEh0dHBSZXF1ZXN0XCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVDb250ZW50VHlwZShvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmRhdGEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIE9iamVjdFV0aWxzLmZvckVhY2gob3B0aW9ucy5oZWFkZXJzLCBmdW5jdGlvbih2YWx1ZSwgaGVhZGVyKSB7XG4gICAgICAgIGlmIChTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcImNvbnRlbnQtdHlwZVwiLCBoZWFkZXIpKSB7XG4gICAgICAgICAgICBkZWxldGUgb3B0aW9ucy5oZWFkZXJzW2hlYWRlcl07XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRGF0YShvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmVtdWxhdGVIdHRwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIVN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwicHV0XCIsIG9wdGlvbnMubWV0aG9kKSB8fFxuICAgICAgICAhU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJwYXRjaFwiLCBvcHRpb25zLm1ldGhvZCkgfHxcbiAgICAgICAgIVN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwiZGVsZXRlXCIsIG9wdGlvbnMubWV0aG9kKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3B0aW9ucy5kYXRhLl9tZXRob2QgPSBvcHRpb25zLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVEYXRhKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGEgPSBvcHRpb25zLmRhdGE7XG5cbiAgICBpZiAoT2JqZWN0VXRpbHMuaXNGdW5jdGlvbihvcHRpb25zLnNlcmlhbGl6ZXIpKSB7XG4gICAgICAgIGRhdGEgPSBvcHRpb25zLnNlcmlhbGl6ZXIoZGF0YSwgdGhpcy5fb3B0aW9ucy5jb250ZW50VHlwZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBPYmplY3RVdGlscy5mb3JFYWNoKG9wdGlvbnMuc2VyaWFsaXplciwgZnVuY3Rpb24oc2VyaWFsaXplcikge1xuICAgICAgICAgICAgZGF0YSA9IHNlcmlhbGl6ZXIoZGF0YSwgb3B0aW9ucy5jb250ZW50VHlwZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEb21VdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2RvbS5qc1wiKTtcbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL3N0cmluZy5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAganM6IGZ1bmN0aW9uKHVybCwgb25Db21wbGV0ZSwgb25FcnJvcikge1xuICAgICAgICB2YXIgZWxlbWVudCA9IERvbVV0aWxzLmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIsIHt0eXBlOiBcInRleHQvY3NzXCIsIHJlbDogXCJzdHlsZXNoZWV0XCIsIGhyZWY6IHVybH0pO1xuICAgICAgICBsb2FkKGVsZW1lbnQsIG9uQ29tcGxldGUsIG9uRXJyb3IpO1xuICAgIH0sXG5cbiAgICBjc3M6IGZ1bmN0aW9uKHVybCwgb25Db21wbGV0ZSwgb25FcnJvcikge1xuICAgICAgICB2YXIgZWxlbWVudCA9IERvbVV0aWxzLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiwge3R5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIsIHNyYzogdXJsfSk7XG4gICAgICAgIGxvYWQoZWxlbWVudCwgb25Db21wbGV0ZSwgb25FcnJvcik7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gbG9hZChlbGVtZW50LCBvbkNvbXBsZXRlLCBvbkVycm9yKSB7XG4gICAgZnVuY3Rpb24gcmVhZHlTdGF0ZUhhbmRsZXIoKSB7XG4gICAgICAgIGlmIChTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcImxvYWRlZFwiLCBlbGVtZW50LnJlYWR5U3RhdGUpIHx8XG4gICAgICAgICAgICBTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcImNvbXBsZXRlXCIsIGVsZW1lbnQucmVhZHlTdGF0ZSkpIHtcbiAgICAgICAgICAgIGxvYWRlZEhhbmRsZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRlZEhhbmRsZXIoKSB7XG4gICAgICAgIGNsZWFyQ2FsbGJhY2tzKCk7XG4gICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvckhhbmRsZXIoZXZlbnQpIHtcbiAgICAgICAgY2xlYXJDYWxsYmFja3MoKTtcbiAgICAgICAgb25FcnJvcihldmVudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJDYWxsYmFja3MoKSB7XG4gICAgICAgIGVsZW1lbnQub25sb2FkID0gbnVsbDtcbiAgICAgICAgZWxlbWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICBlbGVtZW50Lm9uZXJyb3IgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIE1haW50YWluIGV4ZWN1dGlvbiBvcmRlclxuICAgIC8vIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9EeW5hbWljX1NjcmlwdF9FeGVjdXRpb25fT3JkZXJcbiAgICAvLyBodHRwOi8vd3d3Lm5jem9ubGluZS5uZXQvYmxvZy8yMDEwLzEyLzIxL3Rob3VnaHRzLW9uLXNjcmlwdC1sb2FkZXJzL1xuICAgIGVsZW1lbnQuYXN5bmMgPSBmYWxzZTtcbiAgICBlbGVtZW50LmRlZmVyID0gZmFsc2U7XG5cbiAgICAvLyBodHRwOi8vcGllaXNnb29kLm9yZy90ZXN0L3NjcmlwdC1saW5rLWV2ZW50cy9cbiAgICAvLyBUT0RPIFRCRCBsaW5rIHRhZ3MgZG9uJ3Qgc3VwcG9ydCBhbnkgdHlwZSBvZiBsb2FkIGNhbGxiYWNrIG9uIG9sZCBXZWJLaXQgKFNhZmFyaSA1KVxuICAgIC8vIFRPRE8gVEJEIGlmIG5vdCBnb2luZyB0byBzdXBwb3J0IElFOCB0aGVuIGRvbid0IG5lZWQgdG8gd29ycnkgYWJvdXQgb25yZWFkeXN0YXRlY2hhbmdlXG4gICAgaWYgKERvbVV0aWxzLmVsZW1lbnRTdXBwb3J0c09uRXZlbnQoZWxlbWVudCwgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIikpIHtcbiAgICAgICAgZWxlbWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSByZWFkeVN0YXRlSGFuZGxlclxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5vbmxvYWQgPSBsb2FkZWRIYW5kbGVyO1xuICAgIH1cblxuICAgIGVsZW1lbnQub25lcnJvciA9IGVycm9ySGFuZGxlcjtcblxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQcm90byA9IHJlcXVpcmUoXCIuLi9wcm90by5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGluZm86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBkZWJ1ZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnNvbGUgfHwgIWNvbnNvbGUuZGVidWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZm8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgd2FybjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnNvbGUgfHwgIWNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS53YXJuLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS5lcnJvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5lcnJvci5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUgJiYgY29uc29sZS5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4uL3Byb3RvLmpzXCIpO1xudmFyIEFycmF5VXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvYXJyYXkuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIExvZ1RhcmdldCA9IHJlcXVpcmUoXCIuL2xvZy1jb25zb2xlLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0YXJnZXRzLCBhcnJheSBvZiB0YXJnZXRzIHRvIGxvZyB0byAoc2VlIFJlY3VydmUuTG9nQ29uc29sZVRhcmdldCBhcyBleGFtcGxlKS5cbiAgICAgKiBEZWZhdWx0cyB0byBSZWN1cnZlLkxvZ0NvbnNvbGVUYXJnZXRcbiAgICAgKiBAcGFyYW0gZW5hYmxlZCwgZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgIGZ1bmN0aW9uIGN0b3IoZW5hYmxlZCwgdGFyZ2V0cykge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBlbmFibGVkKSB7XG4gICAgICAgICAgICBlbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHRhcmdldHMpIHtcbiAgICAgICAgICAgIHRhcmdldHMgPSBbbmV3IExvZ1RhcmdldCgpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IHRhcmdldHM7XG4gICAgICAgIHRoaXMuZGlzYWJsZSghZW5hYmxlZCk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZyBpbmZvIHRvIGFsbCB0YXJnZXRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGluZm86IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbmZvRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcImluZm9cIiwgbWVzc2FnZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9nIGRlYnVnIHRvIGFsbCB0YXJnZXRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGRlYnVnOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGVidWdEaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiZGVidWdcIiwgbWVzc2FnZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9nIHdhcm5pbmcgdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgd2FybjogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3dhcm5EaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwid2FyblwiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2cgZXJyb3IgdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9lcnJvckRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJlcnJvclwiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGVhciBsb2cgZm9yIGFsbCB0YXJnZXRzXG4gICAgICAgICAqL1xuICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy50YXJnZXRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpbmRleF0uY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2RlYnVnRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2luZm9EaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fd2FybkRpc2FibGVkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9lcnJvckRpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB2YWx1ZSwgZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWdEaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2RlYnVnRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBpbmZvRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9pbmZvRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICB3YXJuRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl93YXJuRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBlcnJvckRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZXJyb3JEaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9sb2c6IGZ1bmN0aW9uKHR5cGUsIG1lc3NhZ2UsIGFyZ3MpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJncywgMSk7XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLl9kZXNjcmlwdGlvbih0eXBlLnRvVXBwZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy50YXJnZXRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0c1tpbmRleF1bdHlwZV0uYXBwbHkodGhpcy50YXJnZXRzW2luZGV4XSwgW2Rlc2NyaXB0aW9uLCBtZXNzYWdlXS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9kZXNjcmlwdGlvbjogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAgICAgdmFyIHRpbWUgPSBTdHJpbmdVdGlscy5mb3JtYXRUaW1lKG5ldyBEYXRlKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFwiW1wiICsgdHlwZSArIFwiXSBcIiArIHRpbWU7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcHJvdG8uanNcIik7XG52YXIgRGF0ZVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvZGF0ZS5qc1wiKTtcbnZhciBMb2cgPSByZXF1aXJlKFwiLi9sb2cvbG9nLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3Rvcihsb2csIGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gbG9nKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2cgPSBuZXcgTG9nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBlbmFibGVkKSB7XG4gICAgICAgICAgICBlbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzYWJsZSghZW5hYmxlZCk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUaW1lcih0aGlzLl9sb2csIG1lc3NhZ2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVuZDogZnVuY3Rpb24odGltZXIsIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQgfHwgIXRpbWVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aW1lci5lbmQoZGVzY3JpcHRpb24pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuXG5cbnZhciBUaW1lciA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcigpIHtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBzdGFydDogZnVuY3Rpb24obG9nLCBtZXNzYWdlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2cgPSBsb2c7XG5cbiAgICAgICAgICAgIGlmIChzdXBwb3J0c0NvbnNvbGVUaW1lKCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLnRpbWUobWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGFydFRpbWUgPSBEYXRlVXRpbHMucGVyZm9ybWFuY2VOb3coKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW5kOiBmdW5jdGlvbihkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgaWYgKHN1cHBvcnRzQ29uc29sZVRpbWUoKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCh0aGlzLl9tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZy5pbmZvKHRoaXMuX21lc3NhZ2UgKyBcIjogXCIgKyAoRGF0ZVV0aWxzLnBlcmZvcm1hbmNlTm93KCkgLSB0aGlzLl9zdGFydFRpbWUpICsgXCIgbXNcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZy5pbmZvKGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbl0pO1xuXG5mdW5jdGlvbiBzdXBwb3J0c0NvbnNvbGVUaW1lKCkge1xuICAgIHJldHVybiBjb25zb2xlICYmIGNvbnNvbGUudGltZSAmJiBjb25zb2xlLnRpbWVFbmQ7XG59IiwidmFyIGRvbnRJbnZva2VDb25zdHJ1Y3RvciA9IHt9O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgdmFsdWU7XG59XG5cbnZhciBQcm90byA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIGRvIG5vdGhpbmdcbn07XG5cbi8qKlxuICogQ3JlYXRlIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhpcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyAgIGFycmF5IGNvbnNpc3Rpbmcgb2YgY29uc3RydWN0b3IsIHByb3RvdHlwZS9cIm1lbWJlclwiIHZhcmlhYmxlcy9mdW5jdGlvbnMsXG4gKiAgICAgICAgICAgICAgICAgIGFuZCBuYW1lc3BhY2UvXCJzdGF0aWNcIiB2YXJpYWJsZXMvZnVuY3Rpb25cbiAqL1xuUHJvdG8uZGVmaW5lID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucyB8fCAwID09PSBvcHRpb25zLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgcG9zc2libGVDb25zdHJ1Y3RvciA9IG9wdGlvbnNbMF07XG5cbiAgICB2YXIgcHJvcGVydGllcztcbiAgICB2YXIgc3RhdGljUHJvcGVydGllcztcblxuICAgIGlmIChpc0Z1bmN0aW9uKHBvc3NpYmxlQ29uc3RydWN0b3IpKSB7XG4gICAgICAgIHByb3BlcnRpZXMgPSAxIDwgb3B0aW9ucy5sZW5ndGggPyBvcHRpb25zWzFdIDoge307XG4gICAgICAgIHByb3BlcnRpZXNbIFwiJGN0b3JcIiBdID0gcG9zc2libGVDb25zdHJ1Y3RvcjtcblxuICAgICAgICBzdGF0aWNQcm9wZXJ0aWVzID0gb3B0aW9uc1syXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHByb3BlcnRpZXMgPSBvcHRpb25zWzBdO1xuICAgICAgICBzdGF0aWNQcm9wZXJ0aWVzID0gb3B0aW9uc1sxXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBQcm90b09iaihwYXJhbSlcbiAgICB7XG4gICAgICAgIGlmIChkb250SW52b2tlQ29uc3RydWN0b3IgIT0gcGFyYW0gJiZcbiAgICAgICAgICAgIGlzRnVuY3Rpb24odGhpcy4kY3RvcikpIHtcbiAgICAgICAgICAgIHRoaXMuJGN0b3IuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUHJvdG9PYmoucHJvdG90eXBlID0gbmV3IHRoaXMoZG9udEludm9rZUNvbnN0cnVjdG9yKTtcblxuICAgIC8vIFByb3RvdHlwZS9cIm1lbWJlclwiIHByb3BlcnRpZXNcbiAgICBmb3IgKGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGFkZFByb3RvUHJvcGVydHkoa2V5LCBwcm9wZXJ0aWVzW2tleV0sIFByb3RvT2JqLnByb3RvdHlwZVtrZXldKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRQcm90b1Byb3BlcnR5KGtleSwgcHJvcGVydHksIHN1cGVyUHJvcGVydHkpXG4gICAge1xuICAgICAgICBpZiAoIWlzRnVuY3Rpb24ocHJvcGVydHkpIHx8XG4gICAgICAgICAgICAhaXNGdW5jdGlvbihzdXBlclByb3BlcnR5KSkge1xuICAgICAgICAgICAgUHJvdG9PYmoucHJvdG90eXBlW2tleV0gPSBwcm9wZXJ0eTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBmdW5jdGlvbiB3aXRoIHJlZiB0byBiYXNlIG1ldGhvZFxuICAgICAgICAgICAgUHJvdG9PYmoucHJvdG90eXBlW2tleV0gPSBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIgPSBzdXBlclByb3BlcnR5O1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFByb3RvT2JqLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFByb3RvT2JqO1xuXG4gICAgLy8gTmFtZXNwYWNlZC9cIlN0YXRpY1wiIHByb3BlcnRpZXNcbiAgICBQcm90b09iai5leHRlbmQgPSB0aGlzLmV4dGVuZCB8fCB0aGlzLmRlZmluZTtcbiAgICBQcm90b09iai5taXhpbiA9IHRoaXMubWl4aW47XG5cbiAgICBmb3IgKGtleSBpbiBzdGF0aWNQcm9wZXJ0aWVzKVxuICAgIHtcbiAgICAgICAgUHJvdG9PYmpba2V5XSA9IHN0YXRpY1Byb3BlcnRpZXNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvdG9PYmo7XG59O1xuXG4vKipcbiAqIE1peGluIGEgc2V0IG9mIHZhcmlhYmxlcy9mdW5jdGlvbnMgYXMgcHJvdG90eXBlcyBmb3IgdGhpcyBvYmplY3QuIEFueSB2YXJpYWJsZXMvZnVuY3Rpb25zXG4gKiB0aGF0IGFscmVhZHkgZXhpc3Qgd2l0aCB0aGUgc2FtZSBuYW1lIHdpbGwgYmUgb3ZlcnJpZGRlbi5cbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAgICB2YXJpYWJsZXMvZnVuY3Rpb25zIHRvIG1peGluIHdpdGggdGhpcyBvYmplY3RcbiAqL1xuUHJvdG8ubWl4aW4gPSBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgUHJvdG8ubWl4aW5XaXRoKHRoaXMsIHByb3BlcnRpZXMpO1xufTtcblxuLyoqXG4gKiBNaXhpbiBhIHNldCBvZiB2YXJpYWJsZXMvZnVuY3Rpb25zIGFzIHByb3RvdHlwZXMgZm9yIHRoZSBvYmplY3QuIEFueSB2YXJpYWJsZXMvZnVuY3Rpb25zXG4gKiB0aGF0IGFscmVhZHkgZXhpc3Qgd2l0aCB0aGUgc2FtZSBuYW1lIHdpbGwgYmUgb3ZlcnJpZGRlbi5cbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAgICB2YXJpYWJsZXMvZnVuY3Rpb25zIHRvIG1peGluIHdpdGggdGhpcyBvYmplY3RcbiAqL1xuUHJvdG8ubWl4aW5XaXRoID0gZnVuY3Rpb24ob2JqLCBwcm9wZXJ0aWVzKSB7XG4gICAgZm9yIChrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgICBvYmoucHJvdG90eXBlW2tleV0gPSBwcm9wZXJ0aWVzW2tleV07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90bzsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcHJvdG8uanNcIik7XG52YXIgQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2FycmF5LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcigpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgYWRkOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyRXhpc3RzKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobmV3IFNpZ25hbExpc3RlbmVyKGNhbGxiYWNrLCBjb250ZXh0KSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkT25jZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lckV4aXN0cyhjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKG5ldyBTaWduYWxMaXN0ZW5lcihjYWxsYmFjaywgY29udGV4dCwgdHJ1ZSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvc3NpYmxlTGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaDtcblxuICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc3NpYmxlTGlzdGVuZXIuaXNTYW1lQ29udGV4dChjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBvc3NpYmxlTGlzdGVuZXIuaXNTYW1lKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nIC0gbm8gbWF0Y2hcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXlVdGlscy5yZW1vdmVBdCh0aGlzLl9saXN0ZW5lcnMsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjYW4gb25seSBiZSBvbmUgbWF0Y2ggaWYgY2FsbGJhY2sgc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZUFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgfSxcblxuICAgICAgICB0cmlnZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoIC0gMTsgMCA8PSBpbmRleDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG5cbiAgICAgICAgICAgICAgICBsaXN0ZW5lci50cmlnZ2VyKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25seU9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXlVdGlscy5yZW1vdmVBdCh0aGlzLl9saXN0ZW5lcnMsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2xpc3RlbmVyRXhpc3RzOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoIC0gMTsgMCA8PSBpbmRleDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG5cbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuaXNTYW1lKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuXG52YXIgU2lnbmFsTGlzdGVuZXIgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3IoY2FsbGJhY2ssIGNvbnRleHQsIG9ubHlPbmNlKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLm9ubHlPbmNlID0gb25seU9uY2U7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgaXNTYW1lOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrID09PSBjYWxsYmFjaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrID09PSBjYWxsYmFjayAmJiB0aGlzLl9jb250ZXh0ID09PSBjb250ZXh0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzU2FtZUNvbnRleHQ6IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0ID09PSBjb250ZXh0O1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrLmFwcGx5KHRoaXMuX2NvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTdG9yYWdlID0gcmVxdWlyZShcIi4vc3RvcmFnZS5qc1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTdG9yYWdlKHdpbmRvdy5sb2NhbFN0b3JhZ2UpOyIsInZhciBTdG9yYWdlID0gcmVxdWlyZShcIi4vc3RvcmFnZS5qc1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTdG9yYWdlKHdpbmRvdy5zZXNzaW9uU3RvcmFnZSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEYXRlVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvZGF0ZS5qc1wiKTtcbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi4vcHJvdG8uanNcIik7XG52YXIgQ2FjaGUgPSByZXF1aXJlKFwiLi4vY2FjaGUuanNcIik7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZShcIi4uL2Fzc2VydC5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Ioc3RvcmFnZSwgdXNlQ2FjaGUsIGNhY2hlKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHVzZUNhY2hlKSB7XG4gICAgICAgICAgICB1c2VDYWNoZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdG9yYWdlID0gc3RvcmFnZTtcblxuICAgICAgICBpZiAodXNlQ2FjaGUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgY2FjaGUgPSBuZXcgQ2FjaGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY2FjaGUgPSBjYWNoZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBhc3NlcnQoa2V5LCBcImtleSBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICAgICAgdmFyIHZhbHVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX2NhY2hlLmdldChrZXkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgICAgICB2YWx1ZSA9IGRlU2VyaWFsaXplKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGUuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBhc3NlcnQoa2V5LCBcImtleSBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShrZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc2VyaWFsaXplZCA9IHNlcmlhbGl6ZSh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldEl0ZW0oa2V5LCBzZXJpYWxpemVkKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGUuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBhc3NlcnQoa2V5LCBcImtleSBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGUucmVtb3ZlKGtleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0V2l0aEV4cGlyYXRpb246IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbGFwc2VkID0gRGF0ZVV0aWxzLm5vdygpIC0gaXRlbS50aW1lO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZXhwaXJ5IDwgZWxhcHNlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaXRlbS52YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRXaXRoRXhwaXJhdGlvbjogZnVuY3Rpb24oa2V5LCB2YWx1ZSwgZXhwaXJ5KSB7XG4gICAgICAgICAgICB0aGlzLnNldChrZXksIHt2YWx1ZTogdmFsdWUsIGV4cGlyeTogZXhwaXJ5LCB0aW1lOiBEYXRlVXRpbHMubm93KCl9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JFYWNoOiBmdW5jdGlvbihpdGVyYXRvcikge1xuICAgICAgICAgICAgYXNzZXJ0KGl0ZXJhdG9yLCBcIml0ZXJhdG9yIG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fc3RvcmFnZSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KGtleSk7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3Ioa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q2FjaGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWNoZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG5cblxuZnVuY3Rpb24gc2VyaWFsaXplKHZhbHVlKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gZGVTZXJpYWxpemUodmFsdWUpIHtcbiAgICBpZiAoIU9iamVjdFV0aWxzLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICB9XG4gICAgY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgfHwgdW5kZWZpbmVkO1xuICAgIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVtb3ZlSXRlbTogZnVuY3Rpb24oYXJyYXksIGl0ZW0pIHtcbiAgICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblxuICAgICAgICBpZiAoLTEgPCBpbmRleCkge1xuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW1vdmVBdDogZnVuY3Rpb24oYXJyYXksIGluZGV4KSB7XG4gICAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgwIDw9IGluZGV4ICYmIGFycmF5Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlcGxhY2VJdGVtOiBmdW5jdGlvbihhcnJheSwgaXRlbSkge1xuICAgICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuXG4gICAgICAgIGlmICgtMSA8IGluZGV4KSB7XG4gICAgICAgICAgICBhcnJheVtpbmRleF0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiAhdmFsdWUgfHwgMCA9PT0gdmFsdWUubGVuZ3RoO1xuICAgIH0sXG5cbiAgICBhcmd1bWVudHNUb0FycmF5OiBmdW5jdGlvbihhcmdzLCBzbGljZUNvdW50KSB7XG4gICAgICAgIHJldHVybiBzbGljZUNvdW50IDwgYXJncy5sZW5ndGggPyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCBzbGljZUNvdW50KSA6IFtdO1xuICAgIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIG5vdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9LFxuXG4gICAgcGVyZm9ybWFuY2VOb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcGVyZm9ybWFuY2UgJiYgcGVyZm9ybWFuY2Uubm93ID8gcGVyZm9ybWFuY2Uubm93KCkgOiB0aGlzLm5vdygpO1xuICAgIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuL29iamVjdC5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY3JlYXRlRWxlbWVudDogZnVuY3Rpb24obmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG5cbiAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSxcblxuICAgIGVsZW1lbnRTdXBwb3J0c09uRXZlbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgaW4gZWxlbWVudDtcbiAgICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2JqLmZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IE9iamVjdC5mb3JFYWNoKSB7XG4gICAgICAgICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc0FycmF5KG9iaikgJiYgb2JqLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IG9iai5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2luZGV4XSwgaW5kZXgsIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBrZXlzID0gdGhpcy5rZXlzKG9iaik7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwga2V5cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleXNbaW5kZXhdXSwga2V5c1tpbmRleF0sIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG5cbiAgICBrZXlzOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcblxuICAgIGtleUNvdW50OiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvdW50ID0gMDtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH0sXG5cbiAgICAvLyBib3RoIHZhbHVlcyBwYXNzIHN0cmljdCBlcXVhbGl0eSAoPT09KVxuICAgIC8vIGJvdGggb2JqZWN0cyBhcmUgc2FtZSB0eXBlIGFuZCBhbGwgcHJvcGVydGllcyBwYXNzIHN0cmljdCBlcXVhbGl0eVxuICAgIC8vIGJvdGggYXJlIE5hTlxuICAgIGFyZUVxdWFsOiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobnVsbCA9PT0gdmFsdWUgfHwgbnVsbCA9PT0gb3RoZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5hTiBpcyBOYU4hXG4gICAgICAgIGlmICh0aGlzLmlzTmFOKHZhbHVlKSAmJiB0aGlzLmlzTmFOKG90aGVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNTYW1lVHlwZSh2YWx1ZSwgb3RoZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PSBvdGhlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5hcmVFcXVhbCh2YWx1ZVtpbmRleF0sIG90aGVyW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuZ2V0VGltZSgpID09IG90aGVyLmdldFRpbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBrZXlzT2ZWYWx1ZSA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNGdW5jdGlvbih2YWx1ZVtrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYXJlRXF1YWwodmFsdWVba2V5XSwgb3RoZXJba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGtleXNPZlZhbHVlW2tleV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb3RoZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0Z1bmN0aW9uKG90aGVyW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgha2V5c09mVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgaXNOYU46IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIE5hTiBpcyBuZXZlciBlcXVhbCB0byBpdHNlbGYsIGludGVyZXN0aW5nIDopXG4gICAgICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG4gICAgfSxcblxuICAgIGlzU2FtZVR5cGU6IGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09IHR5cGVvZiBvdGhlcjtcbiAgICB9LFxuXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcgfHwgXCJzdHJpbmdcIiA9PSB0eXBlb2YgdmFsdWUpO1xuICAgIH0sXG5cbiAgICBpc0Vycm9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBFcnJvcjtcbiAgICB9LFxuXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gT2JqZWN0KHZhbHVlKTtcbiAgICB9LFxuXG4gICAgaXNBcnJheTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgfSxcblxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHZhbHVlO1xuICAgIH0sXG5cbiAgICBpc0RhdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGU7XG4gICAgfSxcblxuICAgIGlzRmlsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIFwiW29iamVjdCBGaWxlXVwiID09PSBTdHJpbmcoZGF0YSk7XG4gICAgfSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICAgICAgLy8gQmFzZWQgaGVhdmlseSBvbiB1bmRlcnNjb3JlL2ZpcmVmb3ggaW1wbGVtZW50YXRpb24uXG5cbiAgICAgICAgaWYgKCF0aGlzLmlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChGdW5jdGlvbi5wcm90b3R5cGUuYmluZCkge1xuICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmFwcGx5KGZ1bmMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuXG4gICAgICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmluZEN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IG5ldyBiaW5kQ3RvcigpO1xuICAgICAgICAgICAgYmluZEN0b3IucHJvdG90eXBlID0gbnVsbDtcblxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhhdCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gYm91bmQ7XG4gICAgfSxcblxuICAgIGV4dGVuZDogZnVuY3Rpb24oZGVzdCwgc3JjKSB7XG4gICAgICAgIGlmICghc3JjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH0sXG5cbiAgICB0b0pzb246IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoIXRoaXMuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGFuIG9iamVjdCB0byBjb252ZXJ0IHRvIEpTT05cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICB9LFxuXG4gICAgZnJvbUpzb246IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBpZiAoIXN0cikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xuICAgIH0sXG5cbiAgICB0b0Zvcm1EYXRhOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKFwiJlwiKTtcbiAgICB9XG59O1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vb2JqZWN0LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNoaWZ0LmFwcGx5KGFyZ3VtZW50cyk7XG5cbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSBcIntcIiArIGluZGV4ICsgXCJ9XCI7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2Uoc2VhcmNoLCBhcmd1bWVudHNbaW5kZXhdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgZm9ybWF0V2l0aFByb3BlcnRpZXM6IGZ1bmN0aW9uKHZhbHVlLCBmb3JtYXRQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gZm9ybWF0UHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKGZvcm1hdFByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlYXJjaCA9IFwie1wiICsgcHJvcGVydHkgKyBcIn1cIjtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2Uoc2VhcmNoLCBmb3JtYXRQcm9wZXJ0aWVzW3Byb3BlcnR5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIHBhZDogZnVuY3Rpb24oIHZhbHVlLCBwYWRDb3VudCwgcGFkVmFsdWUgKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHBhZFZhbHVlKSB7XG4gICAgICAgICAgICBwYWRWYWx1ZSA9IFwiMFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgPSBTdHJpbmcoIHZhbHVlICk7XG5cbiAgICAgICAgd2hpbGUgKHZhbHVlLmxlbmd0aCA8IHBhZENvdW50KSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhZFZhbHVlICsgdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIGZvcm1hdFRpbWU6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gZGF0ZSkge1xuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaG91cnMgPSB0aGlzLnBhZChkYXRlLmdldEhvdXJzKCksIDIpO1xuICAgICAgICB2YXIgbWludXRlcyA9IHRoaXMucGFkKGRhdGUuZ2V0TWludXRlcygpLCAyKTtcbiAgICAgICAgdmFyIHNlY29uZHMgPSB0aGlzLnBhZChkYXRlLmdldFNlY29uZHMoKSwgMik7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLnBhZChkYXRlLmdldE1pbGxpc2Vjb25kcygpLCAyKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQoXG4gICAgICAgICAgICBcInswfTp7MX06ezJ9OnszfVwiLCBob3VycywgbWludXRlcywgc2Vjb25kcywgbWlsbGlzZWNvbmRzKTtcbiAgICB9LFxuXG4gICAgZm9ybWF0TW9udGhEYXlZZWFyOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIGlmICghZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbW9udGggPSB0aGlzLnBhZChkYXRlLmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgdmFyIGRheSA9IHRoaXMucGFkKGRhdGUuZ2V0RGF0ZSgpKTtcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KFxuICAgICAgICAgICAgXCJ7MH0vezF9L3syfVwiLCBtb250aCwgZGF5LCB5ZWFyKTtcbiAgICB9LFxuXG4gICAgZm9ybWF0WWVhclJhbmdlOiBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHN0YXJ0ICYmIGVuZCkge1xuICAgICAgICAgICAgdmFsdWUgPSBzdGFydCArIFwiIC0gXCIgKyBlbmQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RhcnQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGVuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZUZpcnN0Q2hhcmFjdGVyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSAgKyB2YWx1ZS5zbGljZSgxKTtcbiAgICB9LFxuXG4gICAgdXJsTGFzdFBhdGg6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzcGxpdCA9IHZhbHVlLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgcmV0dXJuIDAgPCBzcGxpdC5sZW5ndGggPyBzcGxpdFtzcGxpdC5sZW5ndGgtMV0gOiBudWxsO1xuICAgIH0sXG5cbiAgICBoYXNWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIDAgPCB2YWx1ZS5sZW5ndGg7XG4gICAgfSxcblxuICAgIGxpbmVzT2Y6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciBsaW5lcztcblxuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIGxpbmVzID0gdmFsdWUuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgfSxcblxuICAgIGlzRXF1YWw6IGZ1bmN0aW9uKHN0ciwgdmFsdWUsIGlnbm9yZUNhc2UpIHtcbiAgICAgICAgaWYgKCFzdHIgfHwgIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyID09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0ciA9PSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgaXNFcXVhbElnbm9yZUNhc2U6IGZ1bmN0aW9uKHN0ciwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNFcXVhbChzdHIsIHZhbHVlLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKHN0ciwgdmFsdWUsIGlnbm9yZUNhc2UpIHtcbiAgICAgICAgaWYgKCFzdHIgfHwgIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyID09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDAgPD0gc3RyLmluZGV4T2YodmFsdWUpO1xuICAgIH0sXG5cbiAgICBhZGRQYXJhbWV0ZXJzVG9Vcmw6IGZ1bmN0aW9uKHVybCwgcGFyYW1ldGVycykge1xuICAgICAgICBpZiAoIXVybCB8fCAhcGFyYW1ldGVycykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlcGVyYXRvciA9IHRoaXMuY29udGFpbnModXJsLCBcIj9cIikgPyBcIiZcIiA6IFwiP1wiO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJhbWV0ZXJzW2tleV07XG5cbiAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IE9iamVjdFV0aWxzLnRvSnNvbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cmwgKz0gc2VwZXJhdG9yICsgIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtZXRlcnNba2V5XSk7XG4gICAgICAgICAgICBzZXBlcmF0b3IgPSBcIj9cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfSxcblxuICAgIHJlbW92ZVBhcmFtZXRlckZyb21Vcmw6IGZ1bmN0aW9uKHVybCwgcGFyYW1ldGVyKSB7XG4gICAgICAgIGlmICghdXJsIHx8ICFwYXJhbWV0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWFyY2ggPSBwYXJhbWV0ZXIgKyBcIj1cIjtcbiAgICAgICAgdmFyIHN0YXJ0SW5kZXggPSB1cmwuaW5kZXhPZihzZWFyY2gpO1xuXG4gICAgICAgIGlmICgtMSA9PT0gaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbmRJbmRleCA9IHVybC5pbmRleE9mKFwiJlwiLCBzdGFydEluZGV4KTtcblxuICAgICAgICBpZiAoLTEgPCBlbmRJbmRleCkge1xuICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCBNYXRoLm1heChzdGFydEluZGV4IC0gMSwgMCkpICsgdXJsLnN1YnN0cihlbmRJbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyKDAsIE1hdGgubWF4KHN0YXJ0SW5kZXggLSAxLCAwKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH1cbn07XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyAgPSB7XG4gICAgaXNGaWxlUHJvdG9jb2w6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gXCJmaWxlOlwiID09PSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2w7XG4gICAgfSxcblxuICAgIGdsb2JhbEV2YWw6IGZ1bmN0aW9uKHNyYykge1xuICAgICAgICBpZiAoIXNyYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaHR0cHM6Ly93ZWJsb2dzLmphdmEubmV0L2Jsb2cvZHJpc2NvbGwvYXJjaGl2ZS8yMDA5LzA5LzA4L2V2YWwtamF2YXNjcmlwdC1nbG9iYWwtY29udGV4dFxuICAgICAgICBpZiAod2luZG93LmV4ZWNTY3JpcHQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5leGVjU2NyaXB0KHNyYyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgd2luZG93LmV2YWwuY2FsbCh3aW5kb3cuc3JjKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jKCk7XG4gICAgfVxufSJdfQ==
