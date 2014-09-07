"use strict";

var recurveFiles = {
    "recurveSrc": [
        "src/common.js",
        "src/recurve.js",
        "src/di/container.js",
        "src/di/module.js"
    ],

    "recurveModules" : [
    ],

    "test": [
        "test/**/*.spec.js"
    ]
};

if (exports) {
    exports.files = recurveFiles;
}