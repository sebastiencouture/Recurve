"use strict";

var fileStream = require("fs-extra");
var path = require("path");
var dox = require("dox");
var processor = require("./docs-api-processor");


function generateDirectory(directoryPath, options) {
    var files = fileStream.readdirSync(directoryPath);
    files.forEach(function(fileName) {
        var filePath = directoryPath + "/" + fileName;
        if (fileStream.statSync(filePath).isDirectory()) {
            generateDirectory(filePath, options);
        }
        else {
            generateFile(filePath, options);
        }
    });
}

function generateFile(filePath, options) {
    if ("js" !== getFileExtension(filePath)) {
        return;
    }

    var content = fileStream.readFileSync(filePath, "utf8");
    var rawComments = dox.parseComments(content, {skipSingleStar: true});
    var processedComments = processor.processComments(rawComments, filePath, options);

    var outputPath = getOutputPath(filePath, options);
    fileStream.outputJsonSync(outputPath, processedComments);
}

function getFileExtension(filePath) {
    return path.basename(filePath).split(".")[1];
}

function getOutputPath(filePath, options) {
    var noRoot = filePath.split(options.input)[1];
    var noExtension = noRoot.split(".")[0];

    return options.api.output + noExtension + ".json";
}


module.exports = {
    generate: function(options) {
        generateDirectory(options.input, options);
    }
};