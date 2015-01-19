"use strict";

var fileStream = require("fs-extra");
var assert = require("assert");
var dox = require("dox");
var utils = require("./docs-utils");
var processor = require("./docs-comments-processor");


function processFile(filePath, content, metadata, options) {
    var rawComments = dox.parseComments(content, {skipSingleStar: true});
    var processedComments = processor.processComments(rawComments, filePath, {
        input: options.api.input,
        baseUrl: options.api.baseUrl,
        examples: options.api.examples
    });

    var outputPath = getOutputPath(filePath, options);
    fileStream.outputJsonSync(outputPath, processedComments);

    processedComments.forEach(function(comment) {
        addCommentToMetadata(comment, metadata, filePath, options);
    });
}

function addCommentToMetadata(comment, metadata, filePath, options) {
    var module = comment.module;
    // only care about top level comments
    if (!module) {
        return;
    }

    var isIndex = module === comment.name;
    var url = options.api.baseUrl + utils.getRelativePathNoExtension(filePath, options.api.input) + ".json";

    assert(url, "unable to determine url for api comment", comment);

    metadata[module] = metadata[module] || {};
    metadata[module][comment.rdoc] = metadata[module][comment.rdoc] || [];

    metadata[module][comment.rdoc].push({
        name: comment.name,
        description: comment.description,
        isIndex: isIndex,
        url: url
    });
}

function getOutputPath(filePath, options) {
    return options.api.output + utils.getRelativePathNoExtension(filePath, options.api.input) + ".json";
}


module.exports = {
    generate: function(options) {
        var metadata = {};
        utils.iterateDirectory(options.api.input, "js", function(filePath, content) {
            processFile(filePath, content, metadata, options);
        });

        fileStream.outputJsonSync(options.api.metadataOutput, metadata);
    }
};