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
},{}]},{},[1,2,3,4,5,11,14,15,16]);