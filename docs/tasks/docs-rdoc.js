"use strict";

var assert = require('assert');
var fileStream = require("fs-extra");
var markdown = require("marked");
var dox = require("dox");
var utils = require("./docs-utils");
var processor = require("./docs-comments-processor");

function processFile(filePath, content, metadata, options) {
    var rawComments = dox.parseComments(content, {skipSingleStar: true});
    var comments = processor.processComments(rawComments, filePath, {
        input: options.api.input,
        baseUrl: options.api.baseUrl,
        examples: options.api.examples
    });

    assert(1 === comments.length, "expected only one comment block per rdoc");
    var comment = comments[0];

    prepareComment(comment, filePath, options);
    addCommentToMetadata(comment, metadata, filePath);

    var description = processDescription(content, comment);
    var outputPath = getOutputPath(filePath, options);
    fileStream.outputFileSync(outputPath, description);
}

function processDescription(content, comment) {
    var description = "";
    if (0 < comment.codeStart) {
        description = content.split("\n").slice(comment.codeStart - 1).join("\n");
    }

    return markdown(description);
}

function addCommentToMetadata(comment, metadata, filePath) {
    var directory = utils.getDirectory(filePath);
    metadata[directory] = metadata[directory] || [];
    metadata[directory].push(comment);
}

function prepareComment(comment, filePath, options) {
    delete comment.codeStart;
    delete comment.line;

    comment.isIndex = "index" === utils.getFileName(filePath);
    comment.url = options.rdoc.baseUrl + utils.getRelativePathNoExtension(filePath, options.rdoc.input) + ".html";

    assert(comment.url, "unable to determine url for rdoc comment", comment);
}

function getOutputPath(filePath, options) {
    return options.rdoc.output + utils.getRelativePathNoExtension(filePath, options.rdoc.input) + ".html";
}

module.exports = {
    generate: function(options) {
        var metadata = {};
        utils.iterateDirectory(options.rdoc.input, "rdoc", function(filePath, content) {
            processFile(filePath, content, metadata, options);
        });

        fileStream.outputJsonSync(options.rdoc.metadataOutput, metadata);
    }
};