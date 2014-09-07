"use strict";

var recurveFiles = {
    "recurveSrc": [
        "src/common.js",
        "src/recurve.js",
        "src/di/container.js",
        "src/di/module.js",
        "src/di/service.js",
    ],

    "recurveModules" : [
    ],

    "test": [
        "test/*Spec.js"
    ]
};

if (exports) {
    exports.files = recurveFiles;
}