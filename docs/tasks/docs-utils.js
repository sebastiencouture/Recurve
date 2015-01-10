"use strict";

var path = require("path");
var fileStream = require("fs");

module.exports = {
    getFileExtension: function(filePath) {
        return path.basename(filePath).split(".")[1];
    },

    getFileName: function(filePath) {
        return path.basename(filePath).split(".")[0];
    },

    getDirectory: function(filePath) {
        var split = filePath.split(path.sep);
        return 1 < split.length ? split[split.length - 2] : "";
    },

    iterateDirectory: function(root, extension, onFile) {
        var files = fileStream.readdirSync(root);
        files.forEach(function(fileName) {
            var filePath = root + "/" + fileName;
            if (fileStream.statSync(filePath).isDirectory()) {
                this.iterateDirectory(filePath, extension, onFile);
            }
            else if (extension === this.getFileExtension(filePath)) {
                var content = fileStream.readFileSync(filePath, "utf8");
                onFile(filePath, content);
            }
            else {
                // do nothing - ignore the file
            }
        }, this);
    }
};