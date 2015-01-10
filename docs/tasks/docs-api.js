"use strict";

var fileStream = require("fs-extra");
var dox = require("dox");
var utils = require("./docs-utils");
var processor = require("./docs-comments-processor");


function processFile(filePath, content, options) {
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
        utils.iterateDirectory(options.api.input, "js", function(filePath, content) {
            processFile(filePath, content, options);
        });
    }
};