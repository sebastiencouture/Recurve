"use strict";

var recurveFiles = {
    "recurveSrc": [
        "src/common.js",
        "src/recurve.js",
        "src/di/container.js",
        "src/di/module.js",
        "src/core/window.js",
        "src/core/document.js",
        "src/core/async.js",
        "src/core/timeout.js",
        "src/core/signal.js",
        "src/core/event-emitter.js",
        "src/core/cache.js",
        "src/core/log/log.js",
        "src/core/log/log-console.js",
        "src/core/global-error-handler.js",
        "src/core/performance.js",
        "src/core/cookies.js",
        "src/core/storage.js",
        "src/core/promise.js",
        "src/core/http/http.js",
        "src/core/http/http-provider.js",
        "src/core/http/http-xhr.js",
        "src/core/http/http-jsonp.js",
        "src/core/http/http-deferred.js"
    ],

    "recurveModules" : {
        "mock" : [
            "src/mock/mock-async.js",
            "src/mock/mock-timeout-decorator.js",
            "src/mock/mock-log.js",
            "src/mock/mock-cookies.js",
            "src/mock/mock-http-provider.js",
            "src/mock/mock-global-error-handler.js",
            "src/mock/mock.js"
        ]
    },

    "test": [
        "test/**/*.spec.js"
    ]
};

if (exports) {
    exports.files = recurveFiles;
}