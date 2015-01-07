"use strict";

var fileStream = require("fs-extra");
var path = require("path");
var dox = require("dox");
var markdown = require("marked");


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
    var processedComments = processComments(rawComments, filePath, options);

    var outputPath = getOutputPath(filePath, options);
    fileStream.outputJsonSync(outputPath, processedComments);
}

function processComments(comments, filePath, options) {
    var processed = [];
    comments.forEach(function(comment) {
        var processedComment = {};
        processedComment.description = processInternalLinks(comment.description, options.api.baseUrl);
        processedComment.line = comment.line;
        processedComment.codeStart = comment.codeStart;

        processTags(processedComment, comment.tags, filePath, options);

        processed.push(processedComment);
    });

    return processed;
}

function processTags(processedComment, tags, filePath, options) {
    var baseUrl = options.api.baseUrl;

    tags.forEach(function(tag) {
        switch (tag.type) {
            case "rdoc":
            case "name":
            case "module":
            case "kind":
                processedComment[tag.type] = tag.string;
                break;
            case "require":
                processedComment.requires = processedComment.requires || [];
                processedComment.requires.push(tag.string);
                break;
            case "example":
                processedComment.examples = processedComment.examples || [];
                var path = getExamplePath(tag.string, filePath, options);
                var code = fileStream.readFileSync(path, "utf8");
                processedComment.examples.push({
                    path: path,
                    code: code
                });
                break;
            case "description":
                processedComment.description = markdown(tag.string);
                processedComment.description = processInternalLinks(processedComment.description, baseUrl);
                break;
            case "param":
                processedComment.params = processedComment.params || [];
                processedComment.params.push({
                    name: tag.name,
                    description: processInternalLinks(tag.description, baseUrl),
                    types: tag.types
                });
                break;
            case "throws":
                processedComment.throws = {
                    description: processInternalLinks(tag.description, baseUrl),
                    types: tag.types
                };
                break;
            case "return":
            case "returns":
                processedComment.returns = {
                    description: processInternalLinks(tag.description, baseUrl),
                    types: tag.types
                };
                break;
            case "private":
                processedComment.isPrivate = true;
                break;
            default:
                processedComment.tags = processedComment.tags || [];
                processedComment.tags.push({
                    type: tag.type,
                    name: tag.name,
                    description: processInternalLinks(tag.description, baseUrl),
                    types: tag.types
                });
                break;
        }
    });
}

function processInternalLinks(description, baseUrl) {
    if (!description) {
        return description;
    }

    // input:
    // 1. {@link module.name description}
    // 2. {@link module.name}
    // 3. {@link module description}
    // 4. {@link module}
    // output:
    // <a href="baseUrl + /module/name">description</a>

    var processedDescription = description;
    var regExp = /\{@link(.*?)\}/g;
    var match;

    while (match = regExp.exec(description)) {
        var original = match[0];
        var linkSplit = match[1].trim().split(" ");
        var path = linkSplit.shift();
        var pathSplit = path.split(".");
        var module = pathSplit[0];
        var name = pathSplit[1];
        var description = linkSplit.join(" ") || path;

        var anchor = '<a href="' + baseUrl + "/" + module + "/" + name + '">' + description + "</a>";
        processedDescription = processedDescription.replace(original, anchor);
    }

    return processedDescription;
}

function getFileExtension(filePath) {
    return path.basename(filePath).split(".")[1];
}

function getOutputPath(filePath, options) {
    var noRoot = filePath.split(options.input)[1];
    var noExtension = noRoot.split(".")[0];

    return options.api.output + noExtension + ".json";
}

function getExamplePath(examplePath, filePath, options) {
    var noRoot = filePath.split(options.input)[1];
    var noExtension = noRoot.split(".")[0];

    return options.api.examples + noExtension + "/" + examplePath;
}


module.exports = {
    generate: function(options) {
        generateDirectory(options.input, options);
    }
};