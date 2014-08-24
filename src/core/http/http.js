"use strict";

var ObjectUtils = require("../../utils/object.js");
var StringUtils = require("../../utils/string.js");
var UrlUtils = require("../../utils/url.js");

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

        deferred.request = request;
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

    "delete": function(url, options) {
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
        options.params.cache = Date.now();
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