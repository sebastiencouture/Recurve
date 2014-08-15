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
    Recurve.Cookies = require("./cookies.js");

    window.Recurve = Recurve;
})();
},{"./assert.js":2,"./cache.js":3,"./cookies.js":4,"./global-error-handler.js":5,"./http/http.js":10,"./lazy-load.js":11,"./log/log-console.js":12,"./log/log.js":13,"./performance-monitor.js":14,"./proto.js":15,"./signal.js":16,"./storage/local-storage.js":17,"./storage/session-storage.js":18,"./utils/array.js":20,"./utils/date.js":21,"./utils/object.js":23,"./utils/string.js":24,"./utils/window.js":26}],2:[function(require,module,exports){
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
},{"./utils/array.js":20,"./utils/object.js":23,"./utils/string.js":24}],3:[function(require,module,exports){
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

        exists: function(key) {
            assert(key, "key must be set");

            return this._cache[key] ? true : false;
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

        forEach: function(iterator) {
            assert(iterator, "iterator must be set");

            ObjectUtils.forEach(this._cache, iterator);
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

},{"./assert.js":2,"./proto.js":15,"./utils/date.js":21,"./utils/object.js":23}],4:[function(require,module,exports){
"use strict";

var ObjectUtils = require("./utils/object.js");
var StringUtils = require("./utils/string.js");
var DateUtils = require("./utils/date.js");
var assert = require("./assert.js");

module.exports = {
    get: function(key) {
        assert(key, "key must be set");

        var value = null;

        forEachCookie(function(cookie, name){
            if (name === key) {
                var rawValue = StringUtils.afterSeparator(cookie, "=");
                value = parse(rawValue);

                return false;
            }
        });

        return value;
    },

    set: function(key, value, options) {
        assert(key, "key must be set");

        if (undefined === options) {
            options = {};
        }

        if (ObjectUtils.isNumber(options.expires)) {
            options.expires = DateUtils.addDaysFromNow(options.expires);
        }

        var cookie = encodeURIComponent(key) + "=" + serialize(value);

        if (ObjectUtils.isDate(options.expires)) {
            cookie +=  "; expires=" + options.expires.toUTCString();
        }

        if (options.domain) {
            cookie += "; domain=" + options.domain;
        }

        if (options.path) {
            cookie += "; path=" + options.path;
        }

        if (options.secure) {
            cookie += "; secure";
        }

        document.cookie = cookie;
    },

    remove: function(key, options) {
        assert(key, "key must be set");

        if (undefined === options) {
            options = {};
        }

        if (!this.exists(key)) {
            return false;
        }

        var updated = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        if (options.domain) {
            updated += "; domain=" + options.domain;
        }

        if (options.path) {
            updated += "; path=" + options.path;
        }

        document.cookie = updated;

        return true;
    },

    exists: function(key) {
        var exists = false;

        forEachCookie(function(cookie, name){
            if (name === key) {
                exists = true;
                return false;
            }
        });

        return exists;
    },

    forEach: function(iterator) {
        assert(iterator, "iterator must be set");

        forEachCookie(function(cookie, name){
            var rawValue = StringUtils.afterSeparator(cookie, "=");
            var value = parse(rawValue);

            iterator(value, name, cookie);
        });
    }
};


function forEachCookie(iterator) {
    var cookies = document.cookie ? document.cookie.split(";") : [];

    ObjectUtils.forEach(cookies, function(cookie) {
        cookie = cookie.trim();
        var name = decodeURIComponent(StringUtils.beforeSeparator(cookie, "="));
        iterator(cookie, name);
    });
}

function serialize(value) {
    var string = ObjectUtils.isObject(value) ? JSON.stringify(value) : String(value);
    return encodeURIComponent(string);
}

function parse(value) {
    if (!ObjectUtils.isString(value)) {
        return null;
    }

    // quoted cookie, unescape
    if (0 === value.indexOf('"')) {
        value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
        value = decodeURIComponent(value);
        return JSON.parse(value);
    }
    catch(e) {
        return value;
    }
}
},{"./assert.js":2,"./utils/date.js":21,"./utils/object.js":23,"./utils/string.js":24}],5:[function(require,module,exports){
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
},{"./proto.js":15,"./utils/array.js":20,"./utils/object.js":23,"./utils/string.js":24}],6:[function(require,module,exports){
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
},{"../proto.js":15,"../utils/object.js":23,"../utils/string.js":24}],7:[function(require,module,exports){
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
},{"../proto.js":15,"../signal.js":16}],8:[function(require,module,exports){
"use strict";

var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
var UrlUtils = require("../utils/url.js");
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
            var url = UrlUtils.removeParameterFromUrl(this._options.url, "callback");
            url = UrlUtils.addParametersToUrl(url, {callback: callbackId});

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
},{"../proto.js":15,"../utils/object.js":23,"../utils/string.js":24,"../utils/url.js":25}],9:[function(require,module,exports){
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
},{"../proto.js":15,"../utils/object.js":23,"../utils/string.js":24,"../utils/window.js":26}],10:[function(require,module,exports){
"use strict";

var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
var DateUtils = require("../utils/date.js");
var UrlUtils = require("../utils/url.js");

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
        UrlUtils.addParametersToUrl(
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
},{"../utils/date.js":21,"../utils/object.js":23,"../utils/string.js":24,"../utils/url.js":25,"./http-cors-script.js":6,"./http-deferred.js":7,"./http-jsonp.js":8,"./http-xhr.js":9}],11:[function(require,module,exports){
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
},{"./utils/dom.js":22,"./utils/string.js":24}],12:[function(require,module,exports){
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

},{"../proto.js":15}],13:[function(require,module,exports){
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
},{"../proto.js":15,"../utils/array.js":20,"../utils/string.js":24,"./log-console.js":12}],14:[function(require,module,exports){
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
},{"./log/log.js":13,"./proto.js":15,"./utils/date.js":21}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"./proto.js":15,"./utils/array.js":20}],17:[function(require,module,exports){
"use strict";

var Storage = require("./storage.js")

module.exports = new Storage(window.localStorage);
},{"./storage.js":19}],18:[function(require,module,exports){
var Storage = require("./storage.js")

module.exports = new Storage(window.sessionStorage);
},{"./storage.js":19}],19:[function(require,module,exports){
"use strict";

var DateUtils = require("../utils/date.js");
var ObjectUtils = require("../utils/object.js");
var StringUtils = require("../utils/string.js");
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

        this.supported = isSupported(this._storage);
    },

    {
        get: function(key) {
            assert(key, "key must be set");

            if (!this.supported) {
                return null;
            }

            var value;

            if (this._cache) {
                value = this._cache.get(key);

                if (value) {
                    return value;
                }
            }

            value = this._storage.getItem(key);
            value = parse(value);

            if (this._cache) {
                this._cache.set(key, value);
            }

            return value;
        },

        set: function(key, value) {
            assert(key, "key must be set");

            if (!this.supported) {
                return;
            }

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

            if (!this.supported) {
                return;
            }

            if (this._cache) {
                this._cache.remove(key);
            }

            return this._storage.removeItem(key);
        },

        exists: function(key) {
            assert(key, "key must be set");

            if (!this.supported) {
                return false;
            }

            return this._storage.getItem(key) ? true : false;
        },

        clear: function() {
            if (!this.supported) {
                return;
            }

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

            if (!this.supported) {
                return;
            }

            for (var key in this._storage) {
                var value = this.get(key);
                iterator(value, key);
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

function parse(value) {
    if (!ObjectUtils.isString(value)) {
        return null;
    }

    try {
        return JSON.parse(value);
    }
    catch(e) {
        return value;
    }
}

function isSupported(storage) {
    if (!storage) {
        return false;
    }

    // When Safari is in private browsing mode, storage will still be available
    // but it will throw an error when trying to set an item
    var key = "_recurve" + StringUtils.generateUUID();
    try {
        storage.setItem(key, "");
        storage.removeItem(key);
    }
    catch (e) {
        return false;
    }

    return true;
}
},{"../assert.js":2,"../cache.js":3,"../proto.js":15,"../utils/date.js":21,"../utils/object.js":23,"../utils/string.js":24}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
"use strict";

module.exports = {
    now: function() {
        return Date.now ? Date.now() : new Date().getTime();
    },

    performanceNow: function() {
        return performance && performance.now ? performance.now() : this.now();
    },

    addDaysFromNow: function(days) {
        var date = new Date();
        date.setDate(date.getDate() + days);

        return date;
    }
};
},{}],22:[function(require,module,exports){
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
},{"./object.js":23}],23:[function(require,module,exports){
"use strict";

module.exports = {
    forEach: function(obj, iterator, context) {
        if (!obj || !iterator) {
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
                var key = keys[index];
                if (false === iterator.call(context, obj[key], key, obj)) {
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

    isNumber: function(value) {
        return "number" == typeof value;
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


},{}],24:[function(require,module,exports){
"use strict";

var ObjectUtils = require("./object.js");
var DateUtils = require("./date.js");

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

    beforeSeparator: function(str, separator) {
        if (!str || !separator) {
            return null;
        }

        var index = str.indexOf(separator);
        return -1 < index ? str.substring(0, index) : null;
    },

    afterSeparator: function(str, separator) {
        if (!str || !separator) {
            return null;
        }

        var index = str.indexOf(separator);
        return -1 < index ? str.substring(index + 1) : null;
    },

    // TODO TBD where to put this function?
    generateUUID: function() {
        var now = DateUtils.now();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(character) {
            var random = (now + Math.random()*16)%16 | 0;
            now = Math.floor(now/16);
            return (character=='x' ? random : (random&0x7|0x8)).toString(16);
        });

        return uuid;
    }
};


},{"./date.js":21,"./object.js":23}],25:[function(require,module,exports){
"use strict";

var ObjectUtils = require("./object.js");
var StringUtils = require("./string.js");

module.exports = {
    urlLastPath: function(value) {
        if (!value) {
            return;
        }

        var split = value.split("/");
        return 0 < split.length ? split[split.length-1] : null;
    },

    addParametersToUrl: function(url, parameters) {
        if (!url || !parameters) {
            return;
        }

        var seperator = StringUtils.contains(url, "?") ? "&" : "?";

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
},{"./object.js":23,"./string.js":24}],26:[function(require,module,exports){
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
},{}]},{},[1,2,3,4,5,11,14,15,16])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL19leHBvcnRzLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvYXNzZXJ0LmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvY2FjaGUuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9jb29raWVzLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvZ2xvYmFsLWVycm9yLWhhbmRsZXIuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9odHRwL2h0dHAtY29ycy1zY3JpcHQuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9odHRwL2h0dHAtZGVmZXJyZWQuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9odHRwL2h0dHAtanNvbnAuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9odHRwL2h0dHAteGhyLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvaHR0cC9odHRwLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvbGF6eS1sb2FkLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvbG9nL2xvZy1jb25zb2xlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvbG9nL2xvZy5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3BlcmZvcm1hbmNlLW1vbml0b3IuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9wcm90by5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3NpZ25hbC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3N0b3JhZ2UvbG9jYWwtc3RvcmFnZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3N0b3JhZ2Uvc2Vzc2lvbi1zdG9yYWdlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvc3RvcmFnZS9zdG9yYWdlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvYXJyYXkuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy91dGlscy9kYXRlLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvZG9tLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvb2JqZWN0LmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvc3RyaW5nLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvdXJsLmpzIiwiL1VzZXJzL3NlYmFzdGllbmNvdXR1cmUvRG9jdW1lbnRzL3N2bi9wZXJzb25hbC9qcy9Qcm9kdWN0cy9MaWJyYXJpZXMvUmVjdXJ2ZS9zcmMvdXRpbHMvd2luZG93LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSB8fCB7fTtcblxuICAgIFJlY3VydmUuU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9zdHJpbmcuanNcIik7XG4gICAgUmVjdXJ2ZS5XaW5kb3dVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL3dpbmRvdy5qc1wiKTtcbiAgICBSZWN1cnZlLkFycmF5VXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9hcnJheS5qc1wiKTtcbiAgICBSZWN1cnZlLkRhdGVVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2RhdGUuanNcIik7XG4gICAgUmVjdXJ2ZS5PYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL29iamVjdC5qc1wiKTtcblxuICAgIFJlY3VydmUuYXNzZXJ0ID0gcmVxdWlyZShcIi4vYXNzZXJ0LmpzXCIpO1xuXG4gICAgUmVjdXJ2ZS5Qcm90byA9IHJlcXVpcmUoXCIuL3Byb3RvLmpzXCIpO1xuICAgIFJlY3VydmUuQ2FjaGUgPSByZXF1aXJlKFwiLi9jYWNoZS5qc1wiKTtcbiAgICBSZWN1cnZlLkxvZyA9IHJlcXVpcmUoXCIuL2xvZy9sb2cuanNcIik7XG4gICAgUmVjdXJ2ZS5Mb2dDb25zb2xlVGFyZ2V0ID0gcmVxdWlyZShcIi4vbG9nL2xvZy1jb25zb2xlLmpzXCIpO1xuICAgIFJlY3VydmUuU2lnbmFsID0gcmVxdWlyZShcIi4vc2lnbmFsLmpzXCIpO1xuICAgIFJlY3VydmUuSHR0cCA9IHJlcXVpcmUoXCIuL2h0dHAvaHR0cC5qc1wiKTtcbiAgICBSZWN1cnZlLkdsb2JhbEVycm9ySGFuZGxlciA9IHJlcXVpcmUoXCIuL2dsb2JhbC1lcnJvci1oYW5kbGVyLmpzXCIpO1xuICAgIFJlY3VydmUuTG9jYWxTdG9yYWdlID0gcmVxdWlyZShcIi4vc3RvcmFnZS9sb2NhbC1zdG9yYWdlLmpzXCIpO1xuICAgIFJlY3VydmUuU2Vzc2lvblN0b3JhZ2UgPSByZXF1aXJlKFwiLi9zdG9yYWdlL3Nlc3Npb24tc3RvcmFnZS5qc1wiKTtcbiAgICBSZWN1cnZlLlBlcmZvcm1hbmNlTW9uaXRvciA9IHJlcXVpcmUoXCIuL3BlcmZvcm1hbmNlLW1vbml0b3IuanNcIik7XG4gICAgUmVjdXJ2ZS5MYXp5TG9hZCA9IHJlcXVpcmUoXCIuL2xhenktbG9hZC5qc1wiKTtcbiAgICBSZWN1cnZlLkNvb2tpZXMgPSByZXF1aXJlKFwiLi9jb29raWVzLmpzXCIpO1xuXG4gICAgd2luZG93LlJlY3VydmUgPSBSZWN1cnZlO1xufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIEFycmF5VXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9hcnJheS5qc1wiKTtcblxudmFyIGFzc2VydCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseShhcmd1bWVudHMpO1xuICAgIG1lc3NhZ2UgPSBTdHJpbmdVdGlscy5mb3JtYXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbn07XG5cbmFzc2VydCA9IE9iamVjdFV0aWxzLmV4dGVuZChhc3NlcnQsIHtcbiAgICBvazogZnVuY3Rpb24oY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBlcXVhbDogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMsIDIpO1xuICAgICAgICBhc3NlcnQuYXBwbHkodGhpcywgW2FjdHVhbCA9PSBleHBlY3RlZF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9LFxuXG4gICAgbm90RXF1YWw6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAyKTtcbiAgICAgICAgYXNzZXJ0LmFwcGx5KHRoaXMsIFthY3R1YWwgIT0gZXhwZWN0ZWRdLmNvbmNhdChhcmdzKSk7XG4gICAgfSxcblxuICAgIHN0cmljdEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbYWN0dWFsID09PSBleHBlY3RlZF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9LFxuXG4gICAgc3RyaWN0Tm90RXF1YWw6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAyKTtcbiAgICAgICAgYXNzZXJ0LmFwcGx5KHRoaXMsIFthY3R1YWwgIT09IGV4cGVjdGVkXS5jb25jYXQoYXJncykpO1xuICAgIH0sXG5cbiAgICBkZWVwRXF1YWw6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAyKTtcbiAgICAgICAgYXNzZXJ0LmFwcGx5KHRoaXMsIFtPYmplY3RVdGlscy5hcmVFcXVhbChhY3R1YWwsIGV4cGVjdGVkKV0uY29uY2F0KGFyZ3MpKTtcbiAgICB9LFxuXG4gICAgZGVlcE5vdEVxdWFsOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXlVdGlscy5hcmd1bWVudHNUb0FycmF5KGFyZ3VtZW50cywgMik7XG4gICAgICAgIGFzc2VydC5hcHBseSh0aGlzLCBbIU9iamVjdFV0aWxzLmFyZUVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpXS5jb25jYXQoYXJncykpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2VydDsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcHJvdG8uanNcIik7XG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgRGF0ZVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvZGF0ZS5qc1wiKTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKFwiLi9hc3NlcnQuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKGNvdW50TGltaXQsIHRvdGFsQ29zdExpbWl0KSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGNvdW50TGltaXQpIHtcbiAgICAgICAgICAgIGNvdW50TGltaXQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHRvdGFsQ29zdExpbWl0KSB7XG4gICAgICAgICAgICB0b3RhbENvc3RMaW1pdCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jb3VudExpbWl0ID0gY291bnRMaW1pdDtcbiAgICAgICAgdGhpcy5fdG90YWxDb3N0TGltaXQgPSB0b3RhbENvc3RMaW1pdDtcblxuICAgICAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBhc3NlcnQoa2V5LCBcImtleSBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5fY2FjaGVba2V5XTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID8gdmFsdWUudmFsdWUgOiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSwgY29zdCkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IGNvc3QpIHtcbiAgICAgICAgICAgICAgICBjb3N0ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY2FjaGVba2V5XSA9IHt2YWx1ZTogdmFsdWUsIGNvc3Q6IGNvc3R9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fY291bnRMaW1pdCB8fCAodGhpcy5fdG90YWxDb3N0TGltaXQgJiYgY29zdCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmljdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBhc3NlcnQoa2V5LCBcImtleSBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NhY2hlW2tleV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXhpc3RzOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXksIFwia2V5IG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVba2V5XSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldENvdW50TGltaXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9jb3VudExpbWl0ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9ldmljdCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvdW50TGltaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50TGltaXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0VG90YWxDb3N0TGltaXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl90b3RhbENvc3RMaW1pdCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fZXZpY3QoKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b3RhbENvc3RMaW1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxDb3N0TGltaXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9yRWFjaDogZnVuY3Rpb24oaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIGFzc2VydChpdGVyYXRvciwgXCJpdGVyYXRvciBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaCh0aGlzLl9jYWNoZSwgaXRlcmF0b3IpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jdXJyZW50VG90YWxDb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gVEJEIHNob3VsZCB3ZSBjYWNoZSB0b3RhbCBjb3N0IGFuZCBjdXJyZW50IGNvdW50P1xuICAgICAgICAgICAgLy8gLi4uIGFueSBwZXJmb3JtYW5jZSB3b3JyaWVzIGZvciBwb3RlbnRpYWxseSBodWdlIGNhY2hlcz8/XG4gICAgICAgICAgICB2YXIgdG90YWxDb3N0ID0gMDtcblxuICAgICAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaCh0aGlzLl9jYWNoZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgIHRvdGFsQ29zdCArPSB2YWx1ZS5jb3N0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0b3RhbENvc3Q7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2N1cnJlbnRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0VXRpbHMua2V5Q291bnQodGhpcy5fY2FjaGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9ldmljdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3Nob3VsZEV2aWN0KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2V2aWN0TW9zdENvc3RseSgpO1xuICAgICAgICAgICAgdGhpcy5fZXZpY3QoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfc2hvdWxkRXZpY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50TGltaXQgPCB0aGlzLl9jdXJyZW50Q291bnQoKSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuX3RvdGFsQ29zdExpbWl0IDwgdGhpcy5fY3VycmVudFRvdGFsQ29zdCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9ldmljdE1vc3RDb3N0bHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG1heENvc3QgPSAwO1xuICAgICAgICAgICAgdmFyIG1heEtleTtcblxuICAgICAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaCh0aGlzLl9jYWNoZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgIGlmICghbWF4S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heEtleSA9IGtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobWF4Q29zdCA8IHZhbHVlLmNvc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4S2V5ID0ga2V5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAtIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKG1heEtleSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgICAvLyBTbWFsbGVyIHRoZSBjb3N0IGZvciBuZXdlclxuICAgICAgICBpbnZlcnNlQ3VycmVudFRpbWVDb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAxIC8gRGF0ZVV0aWxzLm5vdygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFNtYWxsZXIgdGhlIGNvc3QgZm9yIG9sZGVyXG4gICAgICAgIGN1cnJlbnRUaW1lQ29zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gRGF0ZVV0aWxzLm5vdygpO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2RhdGUuanNcIik7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZShcIi4vYXNzZXJ0LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBhc3NlcnQoa2V5LCBcImtleSBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xuXG4gICAgICAgIGZvckVhY2hDb29raWUoZnVuY3Rpb24oY29va2llLCBuYW1lKXtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSBrZXkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmF3VmFsdWUgPSBTdHJpbmdVdGlscy5hZnRlclNlcGFyYXRvcihjb29raWUsIFwiPVwiKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlKHJhd1ZhbHVlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gb3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzTnVtYmVyKG9wdGlvbnMuZXhwaXJlcykpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IERhdGVVdGlscy5hZGREYXlzRnJvbU5vdyhvcHRpb25zLmV4cGlyZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvb2tpZSA9IGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBzZXJpYWxpemUodmFsdWUpO1xuXG4gICAgICAgIGlmIChPYmplY3RVdGlscy5pc0RhdGUob3B0aW9ucy5leHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llICs9ICBcIjsgZXhwaXJlcz1cIiArIG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZG9tYWluKSB7XG4gICAgICAgICAgICBjb29raWUgKz0gXCI7IGRvbWFpbj1cIiArIG9wdGlvbnMuZG9tYWluO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucGF0aCkge1xuICAgICAgICAgICAgY29va2llICs9IFwiOyBwYXRoPVwiICsgb3B0aW9ucy5wYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuc2VjdXJlKSB7XG4gICAgICAgICAgICBjb29raWUgKz0gXCI7IHNlY3VyZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llO1xuICAgIH0sXG5cbiAgICByZW1vdmU6IGZ1bmN0aW9uKGtleSwgb3B0aW9ucykge1xuICAgICAgICBhc3NlcnQoa2V5LCBcImtleSBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZXhpc3RzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1cGRhdGVkID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVRcIjtcblxuICAgICAgICBpZiAob3B0aW9ucy5kb21haW4pIHtcbiAgICAgICAgICAgIHVwZGF0ZWQgKz0gXCI7IGRvbWFpbj1cIiArIG9wdGlvbnMuZG9tYWluO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucGF0aCkge1xuICAgICAgICAgICAgdXBkYXRlZCArPSBcIjsgcGF0aD1cIiArIG9wdGlvbnMucGF0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHVwZGF0ZWQ7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGV4aXN0czogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBleGlzdHMgPSBmYWxzZTtcblxuICAgICAgICBmb3JFYWNoQ29va2llKGZ1bmN0aW9uKGNvb2tpZSwgbmFtZSl7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgZXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBleGlzdHM7XG4gICAgfSxcblxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGl0ZXJhdG9yKSB7XG4gICAgICAgIGFzc2VydChpdGVyYXRvciwgXCJpdGVyYXRvciBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICBmb3JFYWNoQ29va2llKGZ1bmN0aW9uKGNvb2tpZSwgbmFtZSl7XG4gICAgICAgICAgICB2YXIgcmF3VmFsdWUgPSBTdHJpbmdVdGlscy5hZnRlclNlcGFyYXRvcihjb29raWUsIFwiPVwiKTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlKHJhd1ZhbHVlKTtcblxuICAgICAgICAgICAgaXRlcmF0b3IodmFsdWUsIG5hbWUsIGNvb2tpZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuZnVuY3Rpb24gZm9yRWFjaENvb2tpZShpdGVyYXRvcikge1xuICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKSA6IFtdO1xuXG4gICAgT2JqZWN0VXRpbHMuZm9yRWFjaChjb29raWVzLCBmdW5jdGlvbihjb29raWUpIHtcbiAgICAgICAgY29va2llID0gY29va2llLnRyaW0oKTtcbiAgICAgICAgdmFyIG5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoU3RyaW5nVXRpbHMuYmVmb3JlU2VwYXJhdG9yKGNvb2tpZSwgXCI9XCIpKTtcbiAgICAgICAgaXRlcmF0b3IoY29va2llLCBuYW1lKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplKHZhbHVlKSB7XG4gICAgdmFyIHN0cmluZyA9IE9iamVjdFV0aWxzLmlzT2JqZWN0KHZhbHVlKSA/IEpTT04uc3RyaW5naWZ5KHZhbHVlKSA6IFN0cmluZyh2YWx1ZSk7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmcpO1xufVxuXG5mdW5jdGlvbiBwYXJzZSh2YWx1ZSkge1xuICAgIGlmICghT2JqZWN0VXRpbHMuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIHF1b3RlZCBjb29raWUsIHVuZXNjYXBlXG4gICAgaWYgKDAgPT09IHZhbHVlLmluZGV4T2YoJ1wiJykpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSkucmVwbGFjZSgvXFxcXFwiL2csICdcIicpLnJlcGxhY2UoL1xcXFxcXFxcL2csICdcXFxcJyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgfVxuICAgIGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcHJvdG8uanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9zdHJpbmcuanNcIik7XG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL2FycmF5LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG5cbiAgICAvKipcbiAgICAgKiBOT1RFLCBJZiB5b3VyIEpTIGlzIGhvc3RlZCBvbiBhIENETiB0aGVuIHRoZSBicm93c2VyIHdpbGwgc2FuaXRpemUgYW5kIGV4Y2x1ZGUgYWxsIGVycm9yIG91dHB1dFxuICAgICAqIHVubGVzcyBleHBsaWNpdGx5IGVuYWJsZWQuIFNlZSBUT0RPIFRCRCB0dXRvcmlhbCBsaW5rXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb25FcnJvciwgY2FsbGJhY2sgZGVjbGFyYXRpb246IG9uRXJyb3IoZGVzY3JpcHRpb24sIGVycm9yKSwgZXJyb3Igd2lsbCBiZSB1bmRlZmluZWQgaWYgbm90IHN1cHBvcnRlZCBieSBicm93c2VyXG4gICAgICogQHBhcmFtIGVuYWJsZWQsIGRlZmF1bHQgdHJ1ZVxuICAgICAqIEBwYXJhbSBwcmV2ZW50QnJvd3NlckhhbmRsZSwgZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgIGZ1bmN0aW9uIGN0b3Iob25FcnJvciwgZW5hYmxlZCwgcHJldmVudEJyb3dzZXJIYW5kbGUpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gZW5hYmxlZCkge1xuICAgICAgICAgICAgZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBwcmV2ZW50QnJvd3NlckhhbmRsZSkge1xuICAgICAgICAgICAgcHJldmVudEJyb3dzZXJIYW5kbGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlID0gcHJldmVudEJyb3dzZXJIYW5kbGU7XG4gICAgICAgIHRoaXMuX29uRXJyb3IgPSBvbkVycm9yO1xuXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gdGhpcy5fZXJyb3JIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXAgbWV0aG9kIGluIHRyeS4uY2F0Y2ggYW5kIGhhbmRsZSBlcnJvciB3aXRob3V0IHJhaXNpbmcgdW5jYXVnaHQgZXJyb3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZFxuICAgICAgICAgKiBAcGFyYW0gWywgYXJnMiwgLi4uLCBhcmdOXSwgbGlzdCBvZiBhcmd1bWVudHMgZm9yIG1ldGhvZFxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkSW52b2tlOiBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheVV0aWxzLmFyZ3VtZW50c1RvQXJyYXkoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICBtZXRob2QuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaWJlRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlIGVycm9yIGFzIHdvdWxkIGJlIGRvbmUgZm9yIHVuY2F1Z2h0IGdsb2JhbCBlcnJvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXJyb3IsIGFueSB0eXBlIG9mIGVycm9yIChzdHJpbmcsIG9iamVjdCwgRXJyb3IpXG4gICAgICAgICAqIEBwYXJhbSBkZXNjcmlwdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKGVycm9yLCBkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX29uRXJyb3IpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25FcnJvcihlcnJvciwgZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJldmVudEJyb3dzZXJIYW5kbGU7XG4gICAgICAgIH0sXG5cblxuICAgICAgICBkZXNjcmliZUVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb247XG5cbiAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc1N0cmluZyhlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoT2JqZWN0VXRpbHMuaXNFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yLm1lc3NhZ2UgKyBcIlxcblwiICsgZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChPYmplY3RVdGlscy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVycm9yLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXJyb3JIYW5kbGVyOiBmdW5jdGlvbihtZXNzYWdlLCBmaWxlbmFtZSwgbGluZSwgY29sdW1uLCBlcnJvcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBTdHJpbmdVdGlscy5mb3JtYXQoXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlOiB7MH0sIGZpbGU6IHsxfSwgbGluZTogezJ9XCIsIG1lc3NhZ2UsIGZpbGVuYW1lLCBsaW5lKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9IFN0cmluZ1V0aWxzLmZvcm1hdChcIiwgc3RhY2s6IHswfVwiLCBlcnJvci5zdGFjayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vbkVycm9yKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uRXJyb3IoZXJyb3IsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXZlbnRCcm93c2VySGFuZGxlO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIFByb3RvID0gcmVxdWlyZShcIi4uL3Byb3RvLmpzXCIpO1xuXG52YXIgcmVxdWVzdElkID0gMDtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Iob3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gZGVmZXJyZWQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVxdWVzdElkKys7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB0aGlzLl9vcHRpb25zLnVybDtcbiAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEVycm9ySGFuZGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIFwiZXJyb3JcIiA9PT0gZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9kZWZlcnJlZC5yZWplY3Qoe3N0YXR1czogNDA0LCBjYW5jZWxlZDogdGhhdC5fY2FuY2VsZWR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2RlZmVycmVkLnJlc29sdmUoe3N0YXR1czogMjAwLCBjYW5jZWxlZDogdGhhdC5fY2FuY2VsZWR9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRPRE8gVEJEIGlmIGdvaW5nIHRvIHN1cHBvcnQgSUU4IHRoZW4gbmVlZCB0byBjaGVjayBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGFzIHdlbGxcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9waWVpc2dvb2Qub3JnL3Rlc3Qvc2NyaXB0LWxpbmstZXZlbnRzL1xuICAgICAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNpZ25hbCA9IHJlcXVpcmUoXCIuLi9zaWduYWwuanNcIik7XG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi4vcHJvdG8uanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9zdWNjZWVkZWQgPSBuZXcgU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuX2Vycm9yZWQgPSBuZXcgU2lnbmFsKCk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcmVzb2x2ZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC50cmlnZ2VyKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuVXAoKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWplY3Q6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLl9lcnJvcmVkLnRyaWdnZXIocmVzcG9uc2UpO1xuICAgICAgICAgICAgdGhpcy5fY2xlYW5VcCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByb21pc2U6IHtcbiAgICAgICAgICAgIHRoZW46IGZ1bmN0aW9uKG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRlZC5hZGRPbmNlKG9uU3VjY2Vzcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5hZGRPbmNlKG9uRXJyb3IpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ob25TdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLmFkZE9uY2UoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmhlYWRlcnMsIHJlc3BvbnNlLm9wdGlvbnMsIHJlc3BvbnNlLmNhbmNlbGVkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5hZGRPbmNlKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IocmVzcG9uc2UuZGF0YSwgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdCAmJiB0aGlzLnJlcXVlc3QuY2FuY2VsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NsZWFuVXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkLnJlbW92ZUFsbCgpO1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VlZGVkID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5fZXJyb3JlZC5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIFVybFV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL3VybC5qc1wiKTtcbnZhciBQcm90byA9IHJlcXVpcmUoXCIuLi9wcm90by5qc1wiKTtcblxudmFyIHJlcXVlc3RJZCA9IDA7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKG9wdGlvbnMsIGRlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLl9kZWZlcnJlZCA9IGRlZmVycmVkO1xuICAgICAgICB0aGlzLl9pZCA9IHJlcXVlc3RJZCsrO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrSWQgPSBcIlJlY3VydmVKc29uUENhbGxiYWNrXCIgKyB0aGlzLl9pZDtcbiAgICAgICAgICAgIHZhciB1cmwgPSBVcmxVdGlscy5yZW1vdmVQYXJhbWV0ZXJGcm9tVXJsKHRoaXMuX29wdGlvbnMudXJsLCBcImNhbGxiYWNrXCIpO1xuICAgICAgICAgICAgdXJsID0gVXJsVXRpbHMuYWRkUGFyYW1ldGVyc1RvVXJsKHVybCwge2NhbGxiYWNrOiBjYWxsYmFja0lkfSk7XG5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICAgICAgICAgIHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBjYWxsZWQ7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxiYWNrSGFuZGxlcihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGF0Ll9jYW5jZWxlZCAmJiB0aGF0Ll9vcHRpb25zLmVycm9yT25DYW5jZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2NvbXBsZXRlKHRydWUsIGRhdGEsIDIwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2FkRXJyb3JIYW5kbGVyIChldmVudCkge1xuICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkRXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgd2luZG93W2NhbGxiYWNrSWRdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIFwibG9hZFwiID09PSBldmVudC50eXBlICYmICFjYWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY29tcGxldGUoZmFsc2UsIG51bGwsIDQwNCwgXCJqc29ucCBjYWxsYmFjayBub3QgY2FsbGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVE9ETyBUQkQgaWYgZ29pbmcgdG8gc3VwcG9ydCBJRTggdGhlbiBuZWVkIHRvIGNoZWNrIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgYXMgd2VsbFxuICAgICAgICAgICAgLy8gaHR0cDovL3BpZWlzZ29vZC5vcmcvdGVzdC9zY3JpcHQtbGluay1ldmVudHMvXG4gICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbG9hZEVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGxvYWRFcnJvckhhbmRsZXIpO1xuXG4gICAgICAgICAgICB3aW5kb3dbY2FsbGJhY2tJZF0gPSBjYWxsYmFja0hhbmRsZXI7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jb21wbGV0ZTogZnVuY3Rpb24oc3VjY2VzcywgZGF0YSwgc3RhdHVzLCBzdGF0dXNUZXh0KSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiBzdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMuX29wdGlvbnMsXG4gICAgICAgICAgICAgICAgY2FuY2VsZWQ6IHRoaXMuX2NhbmNlbGVkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgT2JqZWN0VXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvb2JqZWN0LmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL3N0cmluZy5qc1wiKTtcbnZhciBXaW5kb3dVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy93aW5kb3cuanNcIik7XG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi4vcHJvdG8uanNcIik7XG5cbnZhciByZXF1ZXN0SWQgPSAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcihvcHRpb25zLCBkZWZlcnJlZCkge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5fZGVmZXJyZWQgPSBkZWZlcnJlZDtcbiAgICAgICAgdGhpcy5faWQgPSByZXF1ZXN0SWQrKztcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBzZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl94aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlJlY3VydmUgb25seSBzdXBwb3J0cyBJRTgrXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jb25maWcoKTtcblxuICAgICAgICAgICAgdGhpcy5feGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9XG4gICAgICAgICAgICAgICAgT2JqZWN0VXRpbHMuYmluZCh0aGlzLl9zdGF0ZUNoYW5nZUhhbmRsZXIsIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLl94aHIub3Blbih0aGlzLl9vcHRpb25zLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCB0aGlzLl9vcHRpb25zLnVybCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJlZm9yZVNlbmQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vcHRpb25zLmJlZm9yZVNlbmQodGhpcy5feGhyLCB0aGlzLl9vcHRpb25zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5feGhyLnNlbmQodGhpcy5fb3B0aW9ucy5kYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5feGhyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feGhyLmFib3J0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbmZpZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9hZGRIZWFkZXJzKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLndpdGhDcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3hoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5feGhyLnRpbWVvdXQgPSB0aGlzLl9vcHRpb25zLnRpbWVvdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnJlc3BvbnNlVHlwZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3hoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9vcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD03MzY0OFxuICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgd2lsbCB0aHJvdyBlcnJvciBmb3IgXCJqc29uXCIgbWV0aG9kLCBpZ25vcmUgdGhpcyBzaW5jZVxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gaGFuZGxlIGl0XG4gICAgICAgICAgICAgICAgICAgIGlmICghU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJqc29uXCIsIHRoaXMuX29wdGlvbnMubWV0aG9kKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2FkZEhlYWRlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgT2JqZWN0VXRpbHMuZm9yRWFjaCh0aGlzLl9vcHRpb25zLmhlYWRlcnMsIGZ1bmN0aW9uKHZhbHVlLCBoZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICBfc3RhdGVDaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICg0ICE9PSB0aGlzLl94aHIucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzU3VjY2VzcygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlU3VjY2VzcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfaXNTdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYW5jZWxlZCAmJiB0aGlzLl9vcHRpb25zLmVycm9yT25DYW5jZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSB0aGlzLl94aHIuc3RhdHVzO1xuXG4gICAgICAgICAgICByZXR1cm4gKDIwMCA8PSBzdGF0dXMgJiYgMzAwID4gc3RhdHVzKSB8fFxuICAgICAgICAgICAgICAgIDMwNCA9PT0gc3RhdHVzIHx8XG4gICAgICAgICAgICAgICAgKDAgPT09IHN0YXR1cyAmJiBXaW5kb3dVdGlscy5pc0ZpbGVQcm90b2NvbCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfaGFuZGxlU3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGE7XG5cbiAgICAgICAgICAgIGlmIChTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInNjcmlwdFwiLCB0aGlzLl9vcHRpb25zLmRhdGFUeXBlKSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9yZXF1ZXN0LnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBXaW5kb3dVdGlscy5nbG9iYWxFdmFsKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX3BhcnNlUmVzcG9uc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKFwidW5hYmxlIHRvIHBhcnNlIHJlc3BvbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZSh0cnVlLCBkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlKGZhbHNlLCBudWxsLCBzdGF0dXNUZXh0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBfY29tcGxldGU6IGZ1bmN0aW9uKHN1Y2Nlc3MsIGRhdGEsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHN0YXR1cyA6IHRoaXMuX3hoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgc3RhdHVzVGV4dCA6IHN0YXR1c1RleHQgPyBzdGF0dXNUZXh0IDogdGhpcy5feGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgaGVhZGVycyA6IHRoaXMuX3hoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSxcbiAgICAgICAgICAgICAgICBvcHRpb25zIDogdGhpcy5fb3B0aW9ucyxcbiAgICAgICAgICAgICAgICBjYW5jZWxlZCA6IHRoaXMuX2NhbmNlbGVkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfcGFyc2VSZXNwb25zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYWNjZXB0ID0gIHRoaXMuX29wdGlvbnMuaGVhZGVycyAmJiB0aGlzLl9vcHRpb25zLmhlYWRlcnMuQWNjZXB0O1xuICAgICAgICAgICAgaWYgKCFhY2NlcHQpIHtcbiAgICAgICAgICAgICAgICBhY2NlcHQgPSB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YTtcblxuICAgICAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzRnVuY3Rpb24odGhpcy5fb3B0aW9ucy5zZXJpYWxpemVyKSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9vcHRpb25zLnBhcnNlcih0aGlzLl94aHIpLCBhY2NlcHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBPYmplY3RVdGlscy5mb3JFYWNoKHRoaXMuX29wdGlvbnMucGFyc2VyLCBmdW5jdGlvbihwYXJzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHBhcnNlcih0aGlzLl94aHIsIGFjY2VwdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuXSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9vYmplY3QuanNcIik7XG52YXIgU3RyaW5nVXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9kYXRlLmpzXCIpO1xudmFyIFVybFV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL3VybC5qc1wiKTtcblxudmFyIFhociA9IHJlcXVpcmUoXCIuL2h0dHAteGhyLmpzXCIpO1xudmFyIEpzb25wUmVxdWVzdCA9IHJlcXVpcmUoXCIuL2h0dHAtanNvbnAuanNcIik7XG52YXIgQ3Jvc3NEb21haW5TY3JpcHRSZXF1ZXN0ID0gcmVxdWlyZShcIi4vaHR0cC1jb3JzLXNjcmlwdC5qc1wiKTtcbnZhciBIdHRwRGVmZXJyZWQgPSByZXF1aXJlKFwiLi9odHRwLWRlZmVycmVkLmpzXCIpO1xuXG52YXIgSHR0cCA9IHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBhbGw6IHt9LFxuXG4gICAgICAgICAgICBnZXQ6IHt9LFxuICAgICAgICAgICAgcG9zdDoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCIgOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHB1dDoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCIgOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWQ6IHt9LFxuICAgICAgICAgICAgXCJkZWxldGVcIjoge30sXG4gICAgICAgICAgICBqc29ucDoge30sXG4gICAgICAgICAgICBzY3JpcHQ6IHt9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWV0aG9kOiBcImdldFwiLFxuICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG5cbiAgICAgICAgY2FjaGU6IHRydWUsXG5cbiAgICAgICAgc2VyaWFsaXplciA6IFtkZWZhdWx0U2VyaWFsaXplcl0sXG4gICAgICAgIHBhcnNlciA6IFtkZWZhdWx0UGFyc2VyXSxcblxuICAgICAgICByZXF1ZXN0RmFjdG9yeTogRGVmYXVsdFJlcXVlc3RGYWN0b3J5LFxuICAgICAgICBkZWZlcnJlZEZhY3Rvcnk6IERlZmF1bHREZWZlcnJlZEZhY3RvcnksXG5cbiAgICAgICAgZXJyb3JPbkNhbmNlbDogdHJ1ZSxcbiAgICAgICAgZW11bGF0ZUh0dHA6IGZhbHNlXG4gICAgfSxcblxuICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHdpdGhEZWZhdWx0cyA9IGNyZWF0ZU9wdGlvbnNXaXRoRGVmYXVsdHMob3B0aW9ucywgSHR0cC5kZWZhdWx0cyk7XG5cbiAgICAgICAgdXBkYXRlVXJsKHdpdGhEZWZhdWx0cyk7XG4gICAgICAgIHVwZGF0ZUhlYWRlcnMod2l0aERlZmF1bHRzKTtcbiAgICAgICAgdXBkYXRlRGF0YSh3aXRoRGVmYXVsdHMpO1xuICAgICAgICBzZXJpYWxpemVEYXRhKHdpdGhEZWZhdWx0cyk7XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gd2l0aERlZmF1bHRzLmRlZmVycmVkRmFjdG9yeSh3aXRoRGVmYXVsdHMpO1xuICAgICAgICB2YXIgcmVxdWVzdCA9IHdpdGhEZWZhdWx0cy5yZXF1ZXN0RmFjdG9yeSh3aXRoRGVmYXVsdHMsIGRlZmVycmVkKTtcblxuICAgICAgICBkZWZlcnJlZC5yZXF1ZXN0ID0gZGVmZXJyZWQ7XG4gICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwiZ2V0XCIsIHVybDogdXJsfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIHBvc3Q6IGZ1bmN0aW9uKHVybCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwicG9zdFwiLCB1cmw6IHVybCwgZGF0YTogZGF0YX0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBqc29ucDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJqc29ucFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBkZWxldGU6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwiZGVsZXRlXCIsIHVybDogdXJsfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGhlYWQ6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwiaGVhZFwiLCB1cmw6IHVybH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBwdXQ6IGZ1bmN0aW9uKHVybCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0VXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHttZXRob2Q6IFwicHV0XCIsIHVybDogdXJsLCBkYXRhOiBkYXRhfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIHBhdGNoOiBmdW5jdGlvbih1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCB7bWV0aG9kOiBcInBhdGNoXCIsIHVybDogdXJsLCBkYXRhOiBkYXRhfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGdldFNjcmlwdDogZnVuY3Rpb24odXJsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3RVdGlscy5leHRlbmQob3B0aW9ucywge21ldGhvZDogXCJzY3JpcHRcIiwgdXJsOiB1cmx9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG59O1xuXG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXJpYWxpemVyKGRhdGEsIGNvbnRlbnRUeXBlKSB7XG4gICAgdmFyIGlnbm9yZUNhc2UgPSB0cnVlO1xuXG4gICAgaWYgKFN0cmluZ1V0aWxzLmNvbnRhaW5zKGNvbnRlbnRUeXBlLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLCBpZ25vcmVDYXNlKSkge1xuICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNPYmplY3QoZGF0YSkgJiYgIU9iamVjdFV0aWxzLmlzRmlsZShkYXRhKSkge1xuICAgICAgICAgICAgZGF0YSA9IE9iamVjdFV0aWxzLnRvRm9ybURhdGEoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoU3RyaW5nVXRpbHMuY29udGFpbnMoY29udGVudFR5cGUsIFwiYXBwbGljYXRpb24vanNvblwiLCBpZ25vcmVDYXNlKSkge1xuICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNPYmplY3QoZGF0YSkgJiYgIU9iamVjdFV0aWxzLmlzRmlsZShkYXRhKSkge1xuICAgICAgICAgICAgZGF0YSA9IE9iamVjdFV0aWxzLnRvSnNvbihkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gZG8gbm90aGluZyAtIG5vdGhpbmcgdG8gc2VyaWFsaXplXG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbkh0dHAuc2VyaWFsaXplciA9IGRlZmF1bHRTZXJpYWxpemVyO1xuXG5cbmZ1bmN0aW9uIGRlZmF1bHRQYXJzZXIoeGhyLCBhY2NlcHQpIHtcbiAgICB2YXIgZGF0YTtcbiAgICB2YXIgaWdub3JlQ2FzZSA9IHRydWU7XG5cbiAgICBpZiAoU3RyaW5nVXRpbHMuY29udGFpbnMoYWNjZXB0LCBcImFwcGxpY2F0aW9uL3htbFwiLCBpZ25vcmVDYXNlKSB8fFxuICAgICAgICBTdHJpbmdVdGlscy5jb250YWlucyhhY2NlcHQsIFwidGV4dC94bWxcIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgZGF0YSA9IHhoci5yZXNwb25zZVhNTDtcbiAgICB9XG4gICAgZWxzZSBpZiAoU3RyaW5nVXRpbHMuY29udGFpbnMoYWNjZXB0LCBcImFwcGxpY2F0aW9uL2pzb25cIiwgaWdub3JlQ2FzZSkpIHtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEgPSBPYmplY3RVdGlscy50b0pzb24oeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRhdGEgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5IdHRwLnBhcnNlciA9IGRlZmF1bHRQYXJzZXI7XG5cblxuZnVuY3Rpb24gRGVmYXVsdFJlcXVlc3RGYWN0b3J5KG9wdGlvbnMsIGRlZmVycmVkKSB7XG4gICAgdmFyIHJlcXVlc3Q7XG5cbiAgICBpZiAoU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJqc29ucFwiLCBvcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgICAgcmVxdWVzdCA9IG5ldyBKc29ucFJlcXVlc3Qob3B0aW9ucywgZGVmZXJyZWQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChvcHRpb25zLmNyb3NzRG9tYWluICYmXG4gICAgICAgIFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwic2NyaXB0XCIsIG9wdGlvbnMubWV0aG9kKSkge1xuICAgICAgICByZXF1ZXN0ID0gbmV3IENyb3NzRG9tYWluU2NyaXB0UmVxdWVzdChvcHRpb25zLCBkZWZlcnJlZCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXF1ZXN0ID0gbmV3IFhocihvcHRpb25zLCBkZWZlcnJlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcXVlc3Q7XG59O1xuXG5IdHRwLlJlcXVlc3RGYWN0b3J5ID0gRGVmYXVsdFJlcXVlc3RGYWN0b3J5O1xuXG5cbmZ1bmN0aW9uIERlZmF1bHREZWZlcnJlZEZhY3RvcnkoKSB7XG4gICAgcmV0dXJuIG5ldyBIdHRwRGVmZXJyZWQoKTtcbn07XG5cbkh0dHAuRGVmZXJyZWRGYWN0b3J5ID0gRGVmYXVsdERlZmVycmVkRmFjdG9yeTtcblxuXG5mdW5jdGlvbiBRRGVmZXJyZWRGYWN0b3J5KCkge1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgIGRlZmVycmVkLnByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uKG9uU3VjY2Vzcykge1xuICAgICAgICBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIG9uU3VjY2VzcyhcbiAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycywgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UuY2FuY2VsZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uKG9uRXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucHJvbWlzZS50aGVuKG51bGwsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBvbkVycm9yKFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzLCByZXNwb25zZS5vcHRpb25zLCByZXNwb25zZS5jYW5jZWxlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9kZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG5cbiAgICBkZWZlcnJlZC5wcm9taXNlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWZlcnJlZC5yZXF1ZXN0LmNhbmNlbCgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmZXJyZWQ7XG59O1xuXG5IdHRwLlFEZWZlcnJlZEZhY3RvcnkgPSBRRGVmZXJyZWRGYWN0b3J5O1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZU9wdGlvbnNXaXRoRGVmYXVsdHMob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIgd2l0aERlZmF1bHRzID0gT2JqZWN0VXRpbHMuZXh0ZW5kKHt9LCBkZWZhdWx0cyk7XG5cbiAgICB3aXRoRGVmYXVsdHMuaGVhZGVycyA9IHt9O1xuICAgIG1lcmdlSGVhZGVycyhvcHRpb25zLm1ldGhvZCwgd2l0aERlZmF1bHRzLCBkZWZhdWx0cy5oZWFkZXJzKTtcblxuICAgIE9iamVjdFV0aWxzLmV4dGVuZCh3aXRoRGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHdpdGhEZWZhdWx0cztcbn1cblxuZnVuY3Rpb24gbWVyZ2VIZWFkZXJzKG1ldGhvZCwgb3B0aW9ucywgZGVmYXVsdEhlYWRlcnMpIHtcbiAgICBtZXRob2QgPSBtZXRob2QudG9Mb3dlckNhc2UoKTtcblxuICAgIE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCBkZWZhdWx0SGVhZGVycy5hbGwpO1xuICAgIE9iamVjdFV0aWxzLmV4dGVuZChvcHRpb25zLCBkZWZhdWx0SGVhZGVyc1ttZXRob2RdKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVXJsKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuY2FjaGUpIHtcbiAgICAgICAgb3B0aW9ucy5wYXJhbXMuY2FjaGUgPSBEYXRlVXRpbHMubm93KCk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy51cmwgPVxuICAgICAgICBVcmxVdGlscy5hZGRQYXJhbWV0ZXJzVG9VcmwoXG4gICAgICAgICAgICBvcHRpb25zLnVybCwgb3B0aW9ucy5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIZWFkZXJzKG9wdGlvbnMpIHtcbiAgICBhZGRBY2NlcHRIZWFkZXIob3B0aW9ucyk7XG4gICAgYWRkUmVxdWVzdGVkV2l0aEhlYWRlcihvcHRpb25zKTtcbiAgICByZW1vdmVDb250ZW50VHlwZShvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gYWRkQWNjZXB0SGVhZGVyKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzLkFjY2VwdCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFjY2VwdCA9IFwiKi8qXCI7XG4gICAgdmFyIGRhdGFUeXBlID0gb3B0aW9ucy5kYXRhVHlwZTtcblxuICAgIGlmIChkYXRhVHlwZSkge1xuICAgICAgICBkYXRhVHlwZSA9IGRhdGFUeXBlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgaWYgKFwidGV4dFwiID09PSBkYXRhVHlwZSkge1xuICAgICAgICAgICAgYWNjZXB0ID0gXCJ0ZXh0L3BsYWluLCovKjtxPTAuMDFcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcImh0bWxcIiA9PT0gZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIGFjY2VwdCA9IFwidGV4dC9odG1sLCovKjtxPTAuMDFcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcInhtbFwiID09PSBkYXRhVHlwZSkge1xuICAgICAgICAgICAgYWNjZXB0ID0gXCJhcHBsaWNhdGlvbi94bWwsdGV4dC94bWwsKi8qO3E9MC4wMVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwianNvblwiID09PSBkYXRhVHlwZSB8fCBcInNjcmlwdFwiID09PSBkYXRhVHlwZSkge1xuICAgICAgICAgICAgYWNjZXB0ID0gXCJhcHBsaWNhdGlvbi9qc29uLHRleHQvamF2YXNjcmlwdCwqLyo7cT0wLjAxXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIC0gZGVmYXVsdCB0byBhbGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wdGlvbnMuaGVhZGVycy5BY2NlcHQgPSBhY2NlcHQ7XG59XG5cbmZ1bmN0aW9uIGFkZFJlcXVlc3RlZFdpdGhIZWFkZXIob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5jcm9zc0RvbWFpbiAmJlxuICAgICAgICAhb3B0aW9ucy5oZWFkZXJzW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXSAmJlxuICAgICAgICAhU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJzY3JpcHRcIiwgb3B0aW9ucy5kYXRhVHlwZSkpIHtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXSA9IFwiWE1MSHR0cFJlcXVlc3RcIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNvbnRlbnRUeXBlKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgT2JqZWN0VXRpbHMuZm9yRWFjaChvcHRpb25zLmhlYWRlcnMsIGZ1bmN0aW9uKHZhbHVlLCBoZWFkZXIpIHtcbiAgICAgICAgaWYgKFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwiY29udGVudC10eXBlXCIsIGhlYWRlcikpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLmhlYWRlcnNbaGVhZGVyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVEYXRhKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuZW11bGF0ZUh0dHApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJwdXRcIiwgb3B0aW9ucy5tZXRob2QpIHx8XG4gICAgICAgICFTdHJpbmdVdGlscy5pc0VxdWFsSWdub3JlQ2FzZShcInBhdGNoXCIsIG9wdGlvbnMubWV0aG9kKSB8fFxuICAgICAgICAhU3RyaW5nVXRpbHMuaXNFcXVhbElnbm9yZUNhc2UoXCJkZWxldGVcIiwgb3B0aW9ucy5tZXRob2QpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvcHRpb25zLmRhdGEuX21ldGhvZCA9IG9wdGlvbnMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuICAgIGlmIChPYmplY3RVdGlscy5pc0Z1bmN0aW9uKG9wdGlvbnMuc2VyaWFsaXplcikpIHtcbiAgICAgICAgZGF0YSA9IG9wdGlvbnMuc2VyaWFsaXplcihkYXRhLCB0aGlzLl9vcHRpb25zLmNvbnRlbnRUeXBlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIE9iamVjdFV0aWxzLmZvckVhY2gob3B0aW9ucy5zZXJpYWxpemVyLCBmdW5jdGlvbihzZXJpYWxpemVyKSB7XG4gICAgICAgICAgICBkYXRhID0gc2VyaWFsaXplcihkYXRhLCBvcHRpb25zLmNvbnRlbnRUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5kYXRhID0gZGF0YTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERvbVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvZG9tLmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvc3RyaW5nLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBqczogZnVuY3Rpb24odXJsLCBvbkNvbXBsZXRlLCBvbkVycm9yKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gRG9tVXRpbHMuY3JlYXRlRWxlbWVudChcImxpbmtcIiwge3R5cGU6IFwidGV4dC9jc3NcIiwgcmVsOiBcInN0eWxlc2hlZXRcIiwgaHJlZjogdXJsfSk7XG4gICAgICAgIGxvYWQoZWxlbWVudCwgb25Db21wbGV0ZSwgb25FcnJvcik7XG4gICAgfSxcblxuICAgIGNzczogZnVuY3Rpb24odXJsLCBvbkNvbXBsZXRlLCBvbkVycm9yKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gRG9tVXRpbHMuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiLCB7dHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiwgc3JjOiB1cmx9KTtcbiAgICAgICAgbG9hZChlbGVtZW50LCBvbkNvbXBsZXRlLCBvbkVycm9yKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBsb2FkKGVsZW1lbnQsIG9uQ29tcGxldGUsIG9uRXJyb3IpIHtcbiAgICBmdW5jdGlvbiByZWFkeVN0YXRlSGFuZGxlcigpIHtcbiAgICAgICAgaWYgKFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwibG9hZGVkXCIsIGVsZW1lbnQucmVhZHlTdGF0ZSkgfHxcbiAgICAgICAgICAgIFN0cmluZ1V0aWxzLmlzRXF1YWxJZ25vcmVDYXNlKFwiY29tcGxldGVcIiwgZWxlbWVudC5yZWFkeVN0YXRlKSkge1xuICAgICAgICAgICAgbG9hZGVkSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZGVkSGFuZGxlcigpIHtcbiAgICAgICAgY2xlYXJDYWxsYmFja3MoKTtcbiAgICAgICAgb25Db21wbGV0ZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlcihldmVudCkge1xuICAgICAgICBjbGVhckNhbGxiYWNrcygpO1xuICAgICAgICBvbkVycm9yKGV2ZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckNhbGxiYWNrcygpIHtcbiAgICAgICAgZWxlbWVudC5vbmxvYWQgPSBudWxsO1xuICAgICAgICBlbGVtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgIGVsZW1lbnQub25lcnJvciA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gTWFpbnRhaW4gZXhlY3V0aW9uIG9yZGVyXG4gICAgLy8gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0R5bmFtaWNfU2NyaXB0X0V4ZWN1dGlvbl9PcmRlclxuICAgIC8vIGh0dHA6Ly93d3cubmN6b25saW5lLm5ldC9ibG9nLzIwMTAvMTIvMjEvdGhvdWdodHMtb24tc2NyaXB0LWxvYWRlcnMvXG4gICAgZWxlbWVudC5hc3luYyA9IGZhbHNlO1xuICAgIGVsZW1lbnQuZGVmZXIgPSBmYWxzZTtcblxuICAgIC8vIGh0dHA6Ly9waWVpc2dvb2Qub3JnL3Rlc3Qvc2NyaXB0LWxpbmstZXZlbnRzL1xuICAgIC8vIFRPRE8gVEJEIGxpbmsgdGFncyBkb24ndCBzdXBwb3J0IGFueSB0eXBlIG9mIGxvYWQgY2FsbGJhY2sgb24gb2xkIFdlYktpdCAoU2FmYXJpIDUpXG4gICAgLy8gVE9ETyBUQkQgaWYgbm90IGdvaW5nIHRvIHN1cHBvcnQgSUU4IHRoZW4gZG9uJ3QgbmVlZCB0byB3b3JyeSBhYm91dCBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgICBpZiAoRG9tVXRpbHMuZWxlbWVudFN1cHBvcnRzT25FdmVudChlbGVtZW50LCBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiKSkge1xuICAgICAgICBlbGVtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHJlYWR5U3RhdGVIYW5kbGVyXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBlbGVtZW50Lm9ubG9hZCA9IGxvYWRlZEhhbmRsZXI7XG4gICAgfVxuXG4gICAgZWxlbWVudC5vbmVycm9yID0gZXJyb3JIYW5kbGVyO1xuXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4uL3Byb3RvLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcigpIHtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBbLCBvYmoyLCAuLi4sIG9iak5dLCBsaXN0IG9mIG9iamVjdHMgdG8gb3V0cHV0LiBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBvZlxuICAgICAgICAgKiBlYWNoIG9mIHRoZXNlIG9iamVjdHMgYXJlIGFwcGVuZGVkIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBsaXN0ZWQgYW5kIG91dHB1dCAoc2FtZSBhcyBjb25zb2xlLmxvZylcbiAgICAgICAgICovXG4gICAgICAgIGRlYnVnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS5kZWJ1Zykge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5mby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5kZWJ1Zy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICB3YXJuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZSAmJiBjb25zb2xlLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9XG5dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi4vcHJvdG8uanNcIik7XG52YXIgQXJyYXlVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9hcnJheS5qc1wiKTtcbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9zdHJpbmcuanNcIik7XG52YXIgTG9nVGFyZ2V0ID0gcmVxdWlyZShcIi4vbG9nLWNvbnNvbGUuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHRhcmdldHMsIGFycmF5IG9mIHRhcmdldHMgdG8gbG9nIHRvIChzZWUgUmVjdXJ2ZS5Mb2dDb25zb2xlVGFyZ2V0IGFzIGV4YW1wbGUpLlxuICAgICAqIERlZmF1bHRzIHRvIFJlY3VydmUuTG9nQ29uc29sZVRhcmdldFxuICAgICAqIEBwYXJhbSBlbmFibGVkLCBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICAgZnVuY3Rpb24gY3RvcihlbmFibGVkLCB0YXJnZXRzKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGVuYWJsZWQpIHtcbiAgICAgICAgICAgIGVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdGFyZ2V0cykge1xuICAgICAgICAgICAgdGFyZ2V0cyA9IFtuZXcgTG9nVGFyZ2V0KCldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YXJnZXRzID0gdGFyZ2V0cztcbiAgICAgICAgdGhpcy5kaXNhYmxlKCFlbmFibGVkKTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogTG9nIGluZm8gdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgaW5mbzogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2luZm9EaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiaW5mb1wiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2cgZGVidWcgdG8gYWxsIHRhcmdldHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIFssIG9iajIsIC4uLiwgb2JqTl0sIGxpc3Qgb2Ygb2JqZWN0cyB0byBvdXRwdXQuIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb25zIG9mXG4gICAgICAgICAqIGVhY2ggb2YgdGhlc2Ugb2JqZWN0cyBhcmUgYXBwZW5kZWQgdG9nZXRoZXIgaW4gdGhlIG9yZGVyIGxpc3RlZCBhbmQgb3V0cHV0IChzYW1lIGFzIGNvbnNvbGUubG9nKVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWc6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZWJ1Z0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJkZWJ1Z1wiLCBtZXNzYWdlLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2cgd2FybmluZyB0byBhbGwgdGFyZ2V0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICB3YXJuOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fd2FybkRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJ3YXJuXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZyBlcnJvciB0byBhbGwgdGFyZ2V0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gWywgb2JqMiwgLi4uLCBvYmpOXSwgbGlzdCBvZiBvYmplY3RzIHRvIG91dHB1dC4gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVzZSBvYmplY3RzIGFyZSBhcHBlbmRlZCB0b2dldGhlciBpbiB0aGUgb3JkZXIgbGlzdGVkIGFuZCBvdXRwdXQgKHNhbWUgYXMgY29uc29sZS5sb2cpXG4gICAgICAgICAqL1xuICAgICAgICBlcnJvcjogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Vycm9yRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhcImVycm9yXCIsIG1lc3NhZ2UsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFyIGxvZyBmb3IgYWxsIHRhcmdldHNcbiAgICAgICAgICovXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnRhcmdldHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzW2luZGV4XS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGVidWdEaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5faW5mb0Rpc2FibGVkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl93YXJuRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yRGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHZhbHVlLCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBkZWJ1Z0Rpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGVidWdEaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGluZm9EaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2luZm9EaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIHdhcm5EaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3dhcm5EaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUsIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGVycm9yRGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9lcnJvckRpc2FibGVkID0gdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2xvZzogZnVuY3Rpb24odHlwZSwgbWVzc2FnZSwgYXJncykge1xuICAgICAgICAgICAgYXJncyA9IEFycmF5VXRpbHMuYXJndW1lbnRzVG9BcnJheShhcmdzLCAxKTtcbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHRoaXMuX2Rlc2NyaXB0aW9uKHR5cGUudG9VcHBlckNhc2UoKSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnRhcmdldHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzW2luZGV4XVt0eXBlXS5hcHBseSh0aGlzLnRhcmdldHNbaW5kZXhdLCBbZGVzY3JpcHRpb24sIG1lc3NhZ2VdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2Rlc2NyaXB0aW9uOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICB2YXIgdGltZSA9IFN0cmluZ1V0aWxzLmZvcm1hdFRpbWUobmV3IERhdGUoKSk7XG4gICAgICAgICAgICByZXR1cm4gXCJbXCIgKyB0eXBlICsgXCJdIFwiICsgdGltZTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi9wcm90by5qc1wiKTtcbnZhciBEYXRlVXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy9kYXRlLmpzXCIpO1xudmFyIExvZyA9IHJlcXVpcmUoXCIuL2xvZy9sb2cuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKGxvZywgZW5hYmxlZCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBsb2cpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZyA9IG5ldyBMb2coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IGVuYWJsZWQpIHtcbiAgICAgICAgICAgIGVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNhYmxlKCFlbmFibGVkKTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBzdGFydDogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFRpbWVyKHRoaXMuX2xvZywgbWVzc2FnZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW5kOiBmdW5jdGlvbih0aW1lciwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNhYmxlZCB8fCAhdGltZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRpbWVyLmVuZChkZXNjcmlwdGlvbik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG5cblxudmFyIFRpbWVyID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbihsb2csIG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZyA9IGxvZztcblxuICAgICAgICAgICAgaWYgKHN1cHBvcnRzQ29uc29sZVRpbWUoKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUudGltZShtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IERhdGVVdGlscy5wZXJmb3JtYW5jZU5vdygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgfSxcblxuICAgICAgICBlbmQ6IGZ1bmN0aW9uKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAoc3VwcG9ydHNDb25zb2xlVGltZSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKHRoaXMuX21lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nLmluZm8odGhpcy5fbWVzc2FnZSArIFwiOiBcIiArIChEYXRlVXRpbHMucGVyZm9ybWFuY2VOb3coKSAtIHRoaXMuX3N0YXJ0VGltZSkgKyBcIiBtc1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nLmluZm8oZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXSk7XG5cbmZ1bmN0aW9uIHN1cHBvcnRzQ29uc29sZVRpbWUoKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUgJiYgY29uc29sZS50aW1lICYmIGNvbnNvbGUudGltZUVuZDtcbn0iLCJ2YXIgZG9udEludm9rZUNvbnN0cnVjdG9yID0ge307XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiB2YWx1ZTtcbn1cblxudmFyIFByb3RvID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gZG8gbm90aGluZ1xufTtcblxuLyoqXG4gKiBDcmVhdGUgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIG9iamVjdFxuICpcbiAqIEBwYXJhbSBvcHRpb25zICAgYXJyYXkgY29uc2lzdGluZyBvZiBjb25zdHJ1Y3RvciwgcHJvdG90eXBlL1wibWVtYmVyXCIgdmFyaWFibGVzL2Z1bmN0aW9ucyxcbiAqICAgICAgICAgICAgICAgICAgYW5kIG5hbWVzcGFjZS9cInN0YXRpY1wiIHZhcmlhYmxlcy9mdW5jdGlvblxuICovXG5Qcm90by5kZWZpbmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zIHx8IDAgPT09IG9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBwb3NzaWJsZUNvbnN0cnVjdG9yID0gb3B0aW9uc1swXTtcblxuICAgIHZhciBwcm9wZXJ0aWVzO1xuICAgIHZhciBzdGF0aWNQcm9wZXJ0aWVzO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24ocG9zc2libGVDb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgcHJvcGVydGllcyA9IDEgPCBvcHRpb25zLmxlbmd0aCA/IG9wdGlvbnNbMV0gOiB7fTtcbiAgICAgICAgcHJvcGVydGllc1sgXCIkY3RvclwiIF0gPSBwb3NzaWJsZUNvbnN0cnVjdG9yO1xuXG4gICAgICAgIHN0YXRpY1Byb3BlcnRpZXMgPSBvcHRpb25zWzJdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcHJvcGVydGllcyA9IG9wdGlvbnNbMF07XG4gICAgICAgIHN0YXRpY1Byb3BlcnRpZXMgPSBvcHRpb25zWzFdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFByb3RvT2JqKHBhcmFtKVxuICAgIHtcbiAgICAgICAgaWYgKGRvbnRJbnZva2VDb25zdHJ1Y3RvciAhPSBwYXJhbSAmJlxuICAgICAgICAgICAgaXNGdW5jdGlvbih0aGlzLiRjdG9yKSkge1xuICAgICAgICAgICAgdGhpcy4kY3Rvci5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQcm90b09iai5wcm90b3R5cGUgPSBuZXcgdGhpcyhkb250SW52b2tlQ29uc3RydWN0b3IpO1xuXG4gICAgLy8gUHJvdG90eXBlL1wibWVtYmVyXCIgcHJvcGVydGllc1xuICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnRpZXNba2V5XSwgUHJvdG9PYmoucHJvdG90eXBlW2tleV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFByb3RvUHJvcGVydHkoa2V5LCBwcm9wZXJ0eSwgc3VwZXJQcm9wZXJ0eSlcbiAgICB7XG4gICAgICAgIGlmICghaXNGdW5jdGlvbihwcm9wZXJ0eSkgfHxcbiAgICAgICAgICAgICFpc0Z1bmN0aW9uKHN1cGVyUHJvcGVydHkpKSB7XG4gICAgICAgICAgICBQcm90b09iai5wcm90b3R5cGVba2V5XSA9IHByb3BlcnR5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGZ1bmN0aW9uIHdpdGggcmVmIHRvIGJhc2UgbWV0aG9kXG4gICAgICAgICAgICBQcm90b09iai5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IHN1cGVyUHJvcGVydHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUHJvdG9PYmoucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHJvdG9PYmo7XG5cbiAgICAvLyBOYW1lc3BhY2VkL1wiU3RhdGljXCIgcHJvcGVydGllc1xuICAgIFByb3RvT2JqLmV4dGVuZCA9IHRoaXMuZXh0ZW5kIHx8IHRoaXMuZGVmaW5lO1xuICAgIFByb3RvT2JqLm1peGluID0gdGhpcy5taXhpbjtcblxuICAgIGZvciAoa2V5IGluIHN0YXRpY1Byb3BlcnRpZXMpXG4gICAge1xuICAgICAgICBQcm90b09ialtrZXldID0gc3RhdGljUHJvcGVydGllc1trZXldO1xuICAgIH1cblxuICAgIHJldHVybiBQcm90b09iajtcbn07XG5cbi8qKlxuICogTWl4aW4gYSBzZXQgb2YgdmFyaWFibGVzL2Z1bmN0aW9ucyBhcyBwcm90b3R5cGVzIGZvciB0aGlzIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbiAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuICovXG5Qcm90by5taXhpbiA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbiAgICBQcm90by5taXhpbldpdGgodGhpcywgcHJvcGVydGllcyk7XG59O1xuXG4vKipcbiAqIE1peGluIGEgc2V0IG9mIHZhcmlhYmxlcy9mdW5jdGlvbnMgYXMgcHJvdG90eXBlcyBmb3IgdGhlIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbiAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuICovXG5Qcm90by5taXhpbldpdGggPSBmdW5jdGlvbihvYmosIHByb3BlcnRpZXMpIHtcbiAgICBmb3IgKGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIG9iai5wcm90b3R5cGVba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3RvOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi9wcm90by5qc1wiKTtcbnZhciBBcnJheVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvYXJyYXkuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJFeGlzdHMoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChuZXcgU2lnbmFsTGlzdGVuZXIoY2FsbGJhY2ssIGNvbnRleHQpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRPbmNlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyRXhpc3RzKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobmV3IFNpZ25hbExpc3RlbmVyKGNhbGxiYWNrLCBjb250ZXh0LCB0cnVlKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zc2libGVMaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zc2libGVMaXN0ZW5lci5pc1NhbWVDb250ZXh0KGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocG9zc2libGVMaXN0ZW5lci5pc1NhbWUoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLSBubyBtYXRjaFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBBcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbiBvbmx5IGJlIG9uZSBtYXRjaCBpZiBjYWxsYmFjayBzcGVjaWZpZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGggLSAxOyAwIDw9IGluZGV4OyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnRyaWdnZXIoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmx5T25jZSkge1xuICAgICAgICAgICAgICAgICAgICBBcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBfbGlzdGVuZXJFeGlzdHM6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGggLSAxOyAwIDw9IGluZGV4OyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5pc1NhbWUoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXSk7XG5cbnZhciBTaWduYWxMaXN0ZW5lciA9IFByb3RvLmRlZmluZShbXG4gICAgZnVuY3Rpb24gY3RvcihjYWxsYmFjaywgY29udGV4dCwgb25seU9uY2UpIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMub25seU9uY2UgPSBvbmx5T25jZTtcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBpc1NhbWU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FsbGJhY2sgPT09IGNhbGxiYWNrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FsbGJhY2sgPT09IGNhbGxiYWNrICYmIHRoaXMuX2NvbnRleHQgPT09IGNvbnRleHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNTYW1lQ29udGV4dDogZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQgPT09IGNvbnRleHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2suYXBwbHkodGhpcy5fY29udGV4dCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5dKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFN0b3JhZ2UgPSByZXF1aXJlKFwiLi9zdG9yYWdlLmpzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFN0b3JhZ2Uod2luZG93LmxvY2FsU3RvcmFnZSk7IiwidmFyIFN0b3JhZ2UgPSByZXF1aXJlKFwiLi9zdG9yYWdlLmpzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFN0b3JhZ2Uod2luZG93LnNlc3Npb25TdG9yYWdlKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9kYXRlLmpzXCIpO1xudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4uL3V0aWxzL29iamVjdC5qc1wiKTtcbnZhciBTdHJpbmdVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlscy9zdHJpbmcuanNcIik7XG52YXIgUHJvdG8gPSByZXF1aXJlKFwiLi4vcHJvdG8uanNcIik7XG52YXIgQ2FjaGUgPSByZXF1aXJlKFwiLi4vY2FjaGUuanNcIik7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZShcIi4uL2Fzc2VydC5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3Ioc3RvcmFnZSwgdXNlQ2FjaGUsIGNhY2hlKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHVzZUNhY2hlKSB7XG4gICAgICAgICAgICB1c2VDYWNoZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdG9yYWdlID0gc3RvcmFnZTtcblxuICAgICAgICBpZiAodXNlQ2FjaGUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgY2FjaGUgPSBuZXcgQ2FjaGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY2FjaGUgPSBjYWNoZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3VwcG9ydGVkID0gaXNTdXBwb3J0ZWQodGhpcy5fc3RvcmFnZSk7XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXksIFwia2V5IG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9jYWNoZS5nZXQoa2V5KTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX3N0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZSh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNlcmlhbGl6ZWQgPSBzZXJpYWxpemUodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXRJdGVtKGtleSwgc2VyaWFsaXplZCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSwgXCJrZXkgbXVzdCBiZSBzZXRcIik7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlLnJlbW92ZShrZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXhpc3RzOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXksIFwia2V5IG11c3QgYmUgc2V0XCIpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5nZXRJdGVtKGtleSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN1cHBvcnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5jbGVhcigpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFdpdGhFeHBpcmF0aW9uOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5nZXQoa2V5KTtcbiAgICAgICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZWxhcHNlZCA9IERhdGVVdGlscy5ub3coKSAtIGl0ZW0udGltZTtcbiAgICAgICAgICAgIGlmIChpdGVtLmV4cGlyeSA8IGVsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0udmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0V2l0aEV4cGlyYXRpb246IGZ1bmN0aW9uKGtleSwgdmFsdWUsIGV4cGlyeSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB7dmFsdWU6IHZhbHVlLCBleHBpcnk6IGV4cGlyeSwgdGltZTogRGF0ZVV0aWxzLm5vdygpfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9yRWFjaDogZnVuY3Rpb24oaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIGFzc2VydChpdGVyYXRvciwgXCJpdGVyYXRvciBtdXN0IGJlIHNldFwiKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnN1cHBvcnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX3N0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldChrZXkpO1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yKHZhbHVlLCBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldENhY2hlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbl0pO1xuXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWx1ZSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKHZhbHVlKSB7XG4gICAgaWYgKCFPYmplY3RVdGlscy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgIH1cbiAgICBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzU3VwcG9ydGVkKHN0b3JhZ2UpIHtcbiAgICBpZiAoIXN0b3JhZ2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFdoZW4gU2FmYXJpIGlzIGluIHByaXZhdGUgYnJvd3NpbmcgbW9kZSwgc3RvcmFnZSB3aWxsIHN0aWxsIGJlIGF2YWlsYWJsZVxuICAgIC8vIGJ1dCBpdCB3aWxsIHRocm93IGFuIGVycm9yIHdoZW4gdHJ5aW5nIHRvIHNldCBhbiBpdGVtXG4gICAgdmFyIGtleSA9IFwiX3JlY3VydmVcIiArIFN0cmluZ1V0aWxzLmdlbmVyYXRlVVVJRCgpO1xuICAgIHRyeSB7XG4gICAgICAgIHN0b3JhZ2Uuc2V0SXRlbShrZXksIFwiXCIpO1xuICAgICAgICBzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW1vdmVJdGVtOiBmdW5jdGlvbihhcnJheSwgaXRlbSkge1xuICAgICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuXG4gICAgICAgIGlmICgtMSA8IGluZGV4KSB7XG4gICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbW92ZUF0OiBmdW5jdGlvbihhcnJheSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKDAgPD0gaW5kZXggJiYgYXJyYXkubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVwbGFjZUl0ZW06IGZ1bmN0aW9uKGFycmF5LCBpdGVtKSB7XG4gICAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG5cbiAgICAgICAgaWYgKC0xIDwgaW5kZXgpIHtcbiAgICAgICAgICAgIGFycmF5W2luZGV4XSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNFbXB0eTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICF2YWx1ZSB8fCAwID09PSB2YWx1ZS5sZW5ndGg7XG4gICAgfSxcblxuICAgIGFyZ3VtZW50c1RvQXJyYXk6IGZ1bmN0aW9uKGFyZ3MsIHNsaWNlQ291bnQpIHtcbiAgICAgICAgcmV0dXJuIHNsaWNlQ291bnQgPCBhcmdzLmxlbmd0aCA/IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIHNsaWNlQ291bnQpIDogW107XG4gICAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbm93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93ID8gRGF0ZS5ub3coKSA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0sXG5cbiAgICBwZXJmb3JtYW5jZU5vdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwZXJmb3JtYW5jZSAmJiBwZXJmb3JtYW5jZS5ub3cgPyBwZXJmb3JtYW5jZS5ub3coKSA6IHRoaXMubm93KCk7XG4gICAgfSxcblxuICAgIGFkZERheXNGcm9tTm93OiBmdW5jdGlvbihkYXlzKSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgZGF5cyk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vb2JqZWN0LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbihuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcblxuICAgICAgICBPYmplY3RVdGlscy5mb3JFYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9LFxuXG4gICAgZWxlbWVudFN1cHBvcnRzT25FdmVudDogZnVuY3Rpb24oZWxlbWVudCwgbmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiBlbGVtZW50O1xuICAgIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZvckVhY2g6IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKCFvYmogfHwgIWl0ZXJhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2JqLmZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IE9iamVjdC5mb3JFYWNoKSB7XG4gICAgICAgICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc0FycmF5KG9iaikgJiYgb2JqLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IG9iai5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2luZGV4XSwgaW5kZXgsIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBrZXlzID0gdGhpcy5rZXlzKG9iaik7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwga2V5cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKGZhbHNlID09PSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXldLCBrZXksIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG5cbiAgICBrZXlzOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcblxuICAgIGtleUNvdW50OiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvdW50ID0gMDtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH0sXG5cbiAgICAvLyBib3RoIHZhbHVlcyBwYXNzIHN0cmljdCBlcXVhbGl0eSAoPT09KVxuICAgIC8vIGJvdGggb2JqZWN0cyBhcmUgc2FtZSB0eXBlIGFuZCBhbGwgcHJvcGVydGllcyBwYXNzIHN0cmljdCBlcXVhbGl0eVxuICAgIC8vIGJvdGggYXJlIE5hTlxuICAgIGFyZUVxdWFsOiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobnVsbCA9PT0gdmFsdWUgfHwgbnVsbCA9PT0gb3RoZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5hTiBpcyBOYU4hXG4gICAgICAgIGlmICh0aGlzLmlzTmFOKHZhbHVlKSAmJiB0aGlzLmlzTmFOKG90aGVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNTYW1lVHlwZSh2YWx1ZSwgb3RoZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PSBvdGhlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5hcmVFcXVhbCh2YWx1ZVtpbmRleF0sIG90aGVyW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuZ2V0VGltZSgpID09IG90aGVyLmdldFRpbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBrZXlzT2ZWYWx1ZSA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNGdW5jdGlvbih2YWx1ZVtrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYXJlRXF1YWwodmFsdWVba2V5XSwgb3RoZXJba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGtleXNPZlZhbHVlW2tleV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb3RoZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0Z1bmN0aW9uKG90aGVyW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgha2V5c09mVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgaXNOYU46IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIE5hTiBpcyBuZXZlciBlcXVhbCB0byBpdHNlbGYsIGludGVyZXN0aW5nIDopXG4gICAgICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG4gICAgfSxcblxuICAgIGlzU2FtZVR5cGU6IGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09IHR5cGVvZiBvdGhlcjtcbiAgICB9LFxuXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcgfHwgXCJzdHJpbmdcIiA9PSB0eXBlb2YgdmFsdWUpO1xuICAgIH0sXG5cbiAgICBpc0Vycm9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBFcnJvcjtcbiAgICB9LFxuXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gT2JqZWN0KHZhbHVlKTtcbiAgICB9LFxuXG4gICAgaXNBcnJheTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgfSxcblxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHZhbHVlO1xuICAgIH0sXG5cbiAgICBpc0RhdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGU7XG4gICAgfSxcblxuICAgIGlzRmlsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIFwiW29iamVjdCBGaWxlXVwiID09PSBTdHJpbmcoZGF0YSk7XG4gICAgfSxcblxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gXCJudW1iZXJcIiA9PSB0eXBlb2YgdmFsdWU7XG4gICAgfSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICAgICAgLy8gQmFzZWQgaGVhdmlseSBvbiB1bmRlcnNjb3JlL2ZpcmVmb3ggaW1wbGVtZW50YXRpb24uXG5cbiAgICAgICAgaWYgKCF0aGlzLmlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChGdW5jdGlvbi5wcm90b3R5cGUuYmluZCkge1xuICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmFwcGx5KGZ1bmMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuXG4gICAgICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmluZEN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IG5ldyBiaW5kQ3RvcigpO1xuICAgICAgICAgICAgYmluZEN0b3IucHJvdG90eXBlID0gbnVsbDtcblxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhhdCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gYm91bmQ7XG4gICAgfSxcblxuICAgIGV4dGVuZDogZnVuY3Rpb24oZGVzdCwgc3JjKSB7XG4gICAgICAgIGlmICghc3JjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH0sXG5cbiAgICB0b0pzb246IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoIXRoaXMuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGFuIG9iamVjdCB0byBjb252ZXJ0IHRvIEpTT05cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICB9LFxuXG4gICAgZnJvbUpzb246IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBpZiAoIXN0cikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xuICAgIH0sXG5cbiAgICB0b0Zvcm1EYXRhOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKFwiJlwiKTtcbiAgICB9XG59O1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vb2JqZWN0LmpzXCIpO1xudmFyIERhdGVVdGlscyA9IHJlcXVpcmUoXCIuL2RhdGUuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZvcm1hdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoYXJndW1lbnRzKTtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHNlYXJjaCA9IFwie1wiICsgaW5kZXggKyBcIn1cIjtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShzZWFyY2gsIGFyZ3VtZW50c1tpbmRleF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBmb3JtYXRXaXRoUHJvcGVydGllczogZnVuY3Rpb24odmFsdWUsIGZvcm1hdFByb3BlcnRpZXMpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBmb3JtYXRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0UHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VhcmNoID0gXCJ7XCIgKyBwcm9wZXJ0eSArIFwifVwiO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShzZWFyY2gsIGZvcm1hdFByb3BlcnRpZXNbcHJvcGVydHldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgcGFkOiBmdW5jdGlvbiggdmFsdWUsIHBhZENvdW50LCBwYWRWYWx1ZSApIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gcGFkVmFsdWUpIHtcbiAgICAgICAgICAgIHBhZFZhbHVlID0gXCIwXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IFN0cmluZyggdmFsdWUgKTtcblxuICAgICAgICB3aGlsZSAodmFsdWUubGVuZ3RoIDwgcGFkQ291bnQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFkVmFsdWUgKyB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgZm9ybWF0VGltZTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBkYXRlKSB7XG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBob3VycyA9IHRoaXMucGFkKGRhdGUuZ2V0SG91cnMoKSwgMik7XG4gICAgICAgIHZhciBtaW51dGVzID0gdGhpcy5wYWQoZGF0ZS5nZXRNaW51dGVzKCksIDIpO1xuICAgICAgICB2YXIgc2Vjb25kcyA9IHRoaXMucGFkKGRhdGUuZ2V0U2Vjb25kcygpLCAyKTtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMucGFkKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCksIDIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChcbiAgICAgICAgICAgIFwiezB9OnsxfTp7Mn06ezN9XCIsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtaWxsaXNlY29uZHMpO1xuICAgIH0sXG5cbiAgICBmb3JtYXRNb250aERheVllYXI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgaWYgKCFkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtb250aCA9IHRoaXMucGFkKGRhdGUuZ2V0TW9udGgoKSArIDEpO1xuICAgICAgICB2YXIgZGF5ID0gdGhpcy5wYWQoZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQoXG4gICAgICAgICAgICBcInswfS97MX0vezJ9XCIsIG1vbnRoLCBkYXksIHllYXIpO1xuICAgIH0sXG5cbiAgICBmb3JtYXRZZWFyUmFuZ2U6IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gXCJcIjtcblxuICAgICAgICBpZiAoc3RhcnQgJiYgZW5kKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHN0YXJ0ICsgXCIgLSBcIiArIGVuZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdGFydCkge1xuICAgICAgICAgICAgdmFsdWUgPSBzdGFydDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gZW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplRmlyc3RDaGFyYWN0ZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICArIHZhbHVlLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICBoYXNWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIDAgPCB2YWx1ZS5sZW5ndGg7XG4gICAgfSxcblxuICAgIGxpbmVzT2Y6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciBsaW5lcztcblxuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIGxpbmVzID0gdmFsdWUuc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgfSxcblxuICAgIGlzRXF1YWw6IGZ1bmN0aW9uKHN0ciwgdmFsdWUsIGlnbm9yZUNhc2UpIHtcbiAgICAgICAgaWYgKCFzdHIgfHwgIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyID09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0ciA9PSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgaXNFcXVhbElnbm9yZUNhc2U6IGZ1bmN0aW9uKHN0ciwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNFcXVhbChzdHIsIHZhbHVlLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKHN0ciwgdmFsdWUsIGlnbm9yZUNhc2UpIHtcbiAgICAgICAgaWYgKCFzdHIgfHwgIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyID09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDAgPD0gc3RyLmluZGV4T2YodmFsdWUpO1xuICAgIH0sXG5cbiAgICBiZWZvcmVTZXBhcmF0b3I6IGZ1bmN0aW9uKHN0ciwgc2VwYXJhdG9yKSB7XG4gICAgICAgIGlmICghc3RyIHx8ICFzZXBhcmF0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZGV4ID0gc3RyLmluZGV4T2Yoc2VwYXJhdG9yKTtcbiAgICAgICAgcmV0dXJuIC0xIDwgaW5kZXggPyBzdHIuc3Vic3RyaW5nKDAsIGluZGV4KSA6IG51bGw7XG4gICAgfSxcblxuICAgIGFmdGVyU2VwYXJhdG9yOiBmdW5jdGlvbihzdHIsIHNlcGFyYXRvcikge1xuICAgICAgICBpZiAoIXN0ciB8fCAhc2VwYXJhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmRleCA9IHN0ci5pbmRleE9mKHNlcGFyYXRvcik7XG4gICAgICAgIHJldHVybiAtMSA8IGluZGV4ID8gc3RyLnN1YnN0cmluZyhpbmRleCArIDEpIDogbnVsbDtcbiAgICB9LFxuXG4gICAgLy8gVE9ETyBUQkQgd2hlcmUgdG8gcHV0IHRoaXMgZnVuY3Rpb24/XG4gICAgZ2VuZXJhdGVVVUlEOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5vdyA9IERhdGVVdGlscy5ub3coKTtcbiAgICAgICAgdmFyIHV1aWQgPSAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgICAgICAgICAgdmFyIHJhbmRvbSA9IChub3cgKyBNYXRoLnJhbmRvbSgpKjE2KSUxNiB8IDA7XG4gICAgICAgICAgICBub3cgPSBNYXRoLmZsb29yKG5vdy8xNik7XG4gICAgICAgICAgICByZXR1cm4gKGNoYXJhY3Rlcj09J3gnID8gcmFuZG9tIDogKHJhbmRvbSYweDd8MHg4KSkudG9TdHJpbmcoMTYpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdXVpZDtcbiAgICB9XG59O1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE9iamVjdFV0aWxzID0gcmVxdWlyZShcIi4vb2JqZWN0LmpzXCIpO1xudmFyIFN0cmluZ1V0aWxzID0gcmVxdWlyZShcIi4vc3RyaW5nLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB1cmxMYXN0UGF0aDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNwbGl0ID0gdmFsdWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICByZXR1cm4gMCA8IHNwbGl0Lmxlbmd0aCA/IHNwbGl0W3NwbGl0Lmxlbmd0aC0xXSA6IG51bGw7XG4gICAgfSxcblxuICAgIGFkZFBhcmFtZXRlcnNUb1VybDogZnVuY3Rpb24odXJsLCBwYXJhbWV0ZXJzKSB7XG4gICAgICAgIGlmICghdXJsIHx8ICFwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VwZXJhdG9yID0gU3RyaW5nVXRpbHMuY29udGFpbnModXJsLCBcIj9cIikgPyBcIiZcIiA6IFwiP1wiO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJhbWV0ZXJzW2tleV07XG5cbiAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IE9iamVjdFV0aWxzLnRvSnNvbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cmwgKz0gc2VwZXJhdG9yICsgIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtZXRlcnNba2V5XSk7XG4gICAgICAgICAgICBzZXBlcmF0b3IgPSBcIj9cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfSxcblxuICAgIHJlbW92ZVBhcmFtZXRlckZyb21Vcmw6IGZ1bmN0aW9uKHVybCwgcGFyYW1ldGVyKSB7XG4gICAgICAgIGlmICghdXJsIHx8ICFwYXJhbWV0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWFyY2ggPSBwYXJhbWV0ZXIgKyBcIj1cIjtcbiAgICAgICAgdmFyIHN0YXJ0SW5kZXggPSB1cmwuaW5kZXhPZihzZWFyY2gpO1xuXG4gICAgICAgIGlmICgtMSA9PT0gaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbmRJbmRleCA9IHVybC5pbmRleE9mKFwiJlwiLCBzdGFydEluZGV4KTtcblxuICAgICAgICBpZiAoLTEgPCBlbmRJbmRleCkge1xuICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCBNYXRoLm1heChzdGFydEluZGV4IC0gMSwgMCkpICsgdXJsLnN1YnN0cihlbmRJbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyKDAsIE1hdGgubWF4KHN0YXJ0SW5kZXggLSAxLCAwKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzICA9IHtcbiAgICBpc0ZpbGVQcm90b2NvbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBcImZpbGU6XCIgPT09IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICB9LFxuXG4gICAgZ2xvYmFsRXZhbDogZnVuY3Rpb24oc3JjKSB7XG4gICAgICAgIGlmICghc3JjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBodHRwczovL3dlYmxvZ3MuamF2YS5uZXQvYmxvZy9kcmlzY29sbC9hcmNoaXZlLzIwMDkvMDkvMDgvZXZhbC1qYXZhc2NyaXB0LWdsb2JhbC1jb250ZXh0XG4gICAgICAgIGlmICh3aW5kb3cuZXhlY1NjcmlwdCkge1xuICAgICAgICAgICAgd2luZG93LmV4ZWNTY3JpcHQoc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB3aW5kb3cuZXZhbC5jYWxsKHdpbmRvdy5zcmMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmMoKTtcbiAgICB9XG59Il19
