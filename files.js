"use strict";

var recurveFiles = {
    "recurveSrc": [
        "src/common.js",
        "src/recurve.js",
        "src/di/container.js",
        "src/di/module.js",
        "src/core/signalFactory.js"
    ],

    "recurveModules" : {
        "mock" : [
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