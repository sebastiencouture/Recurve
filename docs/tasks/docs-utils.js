"use strict";

var path = require("path");

module.exports = {
    getFileExtension: function(filePath) {
        return path.basename(filePath).split(".")[1];
    }
};