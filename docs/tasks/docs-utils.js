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

    getRelativePathNoExtension: function (filePath, ignorePath) {
        var noRoot = filePath.split(ignorePath)[1];
        var noExtension = noRoot.split(".")[0];

        return noExtension;
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
    },

    extend: function(dest, src) {
        if (!dest || !src) {
            return dest;
        }

        for (var key in src) {
            dest[key] = src[key];
        }

        return dest;
    }
};