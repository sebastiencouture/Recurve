"use strict";

var recurveFiles = {
    "recurveSrc": [
        "src/core/common.js",
        "src/core/recurve.js",
        "src/core/di/container.js",
        "src/core/di/module.js",
        "src/core/window.js",
        "src/core/document.js",
        "src/core/async.js",
        "src/core/timeout.js",
        "src/core/signal.js",
        "src/core/event-emitter.js",
        "src/core/cache.js",
        "src/core/log/log.js",
        "src/core/log/log-console.js",
        "src/core/error-handler.js",
        "src/core/uncaught-error-handler.js",
        "src/core/performance.js",
        "src/core/cookies.js",
        "src/core/storage.js",
        "src/core/promise.js",
        "src/core/http/http.js",
        "src/core/http/http-provider.js",
        "src/core/http/http-xhr.js",
        "src/core/http/http-jsonp.js",
        "src/core/http/http-deferred.js",
        "src/core/router.js"
    ],

    "recurveModules" : {
        "mock" : [
            "src/mock/mock-async.js",
            "src/mock/mock-timeout-decorator.js",
            "src/mock/mock-log.js",
            "src/mock/mock-cookies.js",
            "src/mock/mock-storage.js",
            "src/mock/mock-http-provider.js",
            "src/mock/mock-error-handler-decorator.js",
            "src/mock/mock.js"
        ],

        "flux": [
            "src/flux/action.js",
            "src/flux/action-group.js",
            "src/flux/store.js",
            "src/flux/rest-action-emitter.js",
            "src/flux/state-action-emitter.js",
            "src/flux/flux.js"
        ],

        "fluxRest": [
            "src/flux-rest/flux-rest.js"
        ],

        "fluxReact": [
            "src/flux-react/state/state.js",
            "src/flux-react/state/state-config.js",
            "src/flux-react/state/state-config-collection.js",
            "src/flux-react/state/state-router.js",
            "src/flux-react/state/state-store.js",
            "src/flux-react/state/state-transition.js",
            "src/flux-react/state/state-mixin.js",
            "src/flux-react/state/state-navigation-mixin.js",
            "src/flux-react/state/state-scroll-mixin.js",
            "src/flux-react/state/components/state.js",
            "src/flux-react/state/components/state-root.js",
            "src/flux-react/state/components/state-link.js",
            "src/flux-react/flux-react.js"
        ]
    },

    "docs": {
        js: [
            "docs/app/src/**/*.js"
        ],
        jsx: [
            "docs/app/src/**/*.jsx"
        ],
        scss: [
            "docs/app/assets/**/*.scss"
        ],
        tasks: [
            "docs/tasks/*.js"
        ]
    },

    "test": [
        "test/**/*.spec.js"
    ]
};

if (exports) {
    exports.files = recurveFiles;
}