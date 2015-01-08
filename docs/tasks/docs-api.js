"use strict";

var fileStream = require("fs-extra");
var dox = require("dox");
var utils = require("./docs-utils");
var processor = require("./docs-comments-processor");


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
    if ("js" !== utils.getFileExtension(filePath)) {
        return;
    }

    var content = fileStream.readFileSync(filePath, "utf8");
    var rawComments = dox.parseComments(content, {skipSingleStar: true});
    var processedComments = processor.processComments(rawComments, filePath, {
        input: options.api.input,
        baseUrl: options.api.baseUrl,
        examples: options.api.examples
    });

    var outputPath = getOutputPath(filePath, options);
    fileStream.outputJsonSync(outputPath, processedComments);
}

function getOutputPath(filePath, options) {
    var noRoot = filePath.split(options.api.input)[1];
    var noExtension = noRoot.split(".")[0];

    return options.api.output + noExtension + ".json";
}


module.exports = {
    generate: function(options) {
        generateDirectory(options.api.input, options);
    }
};