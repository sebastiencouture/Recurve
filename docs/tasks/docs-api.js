"use strict";

var fileStream = require("fs-extra");
var assert = require("assert");
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

    validateComments(comments);

    var outputPath = getOutputPath(filePath, options);
    fileStream.outputJsonSync(outputPath, comments);

    comments.forEach(function(comment) {
        addCommentToMetadata(comment, metadata, filePath, options);
    });
}

function validateComments(comments) {
    // TODO TBD enable this once have comments setup in all source files
    /*comments.forEach(function(comment) {
        assert(comment.module, "expected api comment to have a module", comment);
        assert(comment.type, "expected api comment to have a type", comment);
        assert(comment.name, "expected comment to have a name", comment);
    });*/
}

function addCommentToMetadata(comment, metadata, filePath, options) {
    // only add comments whose parent is a module, for now that is any comment that doesn't belong to a service
    if (comment.service) {
        return;
    }

    // TODO TBD remove this once enable validation
    if (!comment.module) {
        return;
    }

    var module = addModuleToMetadata(comment, metadata, options);
    var typeName = getTypeNameFromComment(comment);
    if ("module" === typeName) {
        addModuleMetadata(comment, module, filePath, options);
    }
    else {
        var type = addTypeToModuleMetadata(comment, module, options);
        addResourceToTypeMetadata(comment, type, filePath, options);
    }
}

function addModuleToMetadata(comment, metadata, options) {
    var moduleName = getModuleNameFromComment(comment);

    if (!metadata[moduleName]) {
        metadata[moduleName] = {
            href: getAppHref(moduleName, null, null, options),
            children: {}
        };
    }

    return metadata[moduleName];
}

function addModuleMetadata(comment, module, filePath, options) {
    var url = getUrl(filePath, options);
    assert(url, "unable to determine url for api comment", comment);

    utils.extend(module, {
        description: comment.description,
        url: url
    });
}

function addTypeToModuleMetadata(comment, module, options) {
    var moduleName = getModuleNameFromComment(comment);
    var typeName = getTypeNameFromComment(comment);

    if (!module.children[typeName]) {
        module.children[typeName] = {
            href: getAppHref(moduleName, typeName, null, options),
            children: []
        };
    }

    return module.children[typeName];
}

function addResourceToTypeMetadata(comment, type, filePath, options) {
    var moduleName = getModuleNameFromComment(comment);
    var typeName = getTypeNameFromComment(comment);
    var resourceName = comment.name;
    var href = getAppHref(moduleName, typeName, resourceName, options);

    var url = getUrl(filePath, options);
    assert(url, "unable to determine url for api comment", comment);

    type.children.push({
        name: resourceName,
        description: comment.description,
        url: url,
        href: href
    });
}

function getModuleNameFromComment(comment) {
    return comment.module;
}

function getTypeNameFromComment(comment) {
    return comment.rdoc;
}

function getAppHref(moduleName, typeName, serviceName, options) {
    var href = options.api.baseHref;

    if (moduleName) {
        href += "/" + moduleName;
    }
    if (typeName) {
        href += "/" + typeName;
    }
    if (serviceName) {
        href += "/" + serviceName;
    }

    return href;
}

function getUrl(filePath, options) {
    return options.api.baseUrl + utils.getRelativePathNoExtension(filePath, options.api.input) + ".json";
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