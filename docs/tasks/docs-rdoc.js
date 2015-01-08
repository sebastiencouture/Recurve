"use strict";

var assert = require('assert');
var fileStream = require("fs-extra");
var markdown = require("marked");
var dox = require("dox");
var utils = require("./docs-utils");
var processor = require("./docs-comments-processor");

// TODO TBD move common functionality between api and rdoc with iterating directories/files

function generateDirectory(directoryPath, metadata, options) {
    var files = fileStream.readdirSync(directoryPath);
    files.forEach(function(fileName) {
        var filePath = directoryPath + "/" + fileName;
        if (fileStream.statSync(filePath).isDirectory()) {
            generateDirectory(filePath, metadata, options);
        }
        else {
            generateFile(filePath, metadata, options);
        }
    });
}

function generateFile(filePath, metadata, options) {
    if ("rdoc" !== utils.getFileExtension(filePath)) {
        return;
    }

    var content = fileStream.readFileSync(filePath, "utf8");
    var rawComments = dox.parseComments(content, {skipSingleStar: true});
    var comments = processor.processComments(rawComments, filePath, {
        input: options.api.input,
        baseUrl: options.api.baseUrl,
        examples: options.api.examples
    });

    assert(1 === comments.length, "expected only one comment block per rdoc");
    var comment = comments[0];

    addCommentToMetadata(comment, metadata, options);

    var description = processDescription(content, comment);
    var outputPath = getOutputPath(filePath, options);
    fileStream.outputFileSync(outputPath, description);
}

function getOutputPath(filePath, options) {
    var noRoot = filePath.split(options.rdoc.input)[1];
    var noExtension = noRoot.split(".")[0];

    return options.rdoc.output + noExtension + ".html";
}

function processDescription(content, comment) {
    var description = "";
    if (0 < comment.codeStart) {
        description = content.split("\n").slice(comment.codeStart - 1).join("\n");
    }

    return markdown(description);
}

function addCommentToMetadata(comment, metadata, options) {
    prepareComment(comment, options);

    // TODO TBD
    // should be nested
    // tutorial overview => docs array => tutorial steps
    metadata.push(comment);
}

function prepareComment(comment, options) {
    delete comment.description;
    delete comment.codeStart;
    delete comment.line;

    // TODO TBD
    comment.url = "TODO";
}


module.exports = {
    generate: function(options) {
        var metadata = [];
        generateDirectory(options.rdoc.input, metadata, options);

        var metadataPath = options.rdoc.output + "/metadata.json";
        fileStream.outputJsonSync(metadataPath, metadata);
    }
};