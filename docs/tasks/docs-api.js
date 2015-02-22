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

    var resource = generateResourceFromComments(comments);
    var outputPath = getResourceOutputPath(filePath, options);
    fileStream.outputJsonSync(outputPath, resource);

    comments.forEach(function(comment) {
        addCommentToMetadata(comment, metadata, filePath, options);
    });
}

function generateResourceFromComments(comments) {
    var output = {
        types: {}
    };

    comments.forEach(function(comment) {
        var moduleName = getModuleNameFromComment(comment);
        if (moduleName) {
            utils.extend(output, comment);
        }
        else {
            var typeName = getTypeNameFromComment(comment);
            typeName = pluralizeResourceTypesName(typeName);
            // TODO TBD disabling validation for now since everything will fail until start writing
            //validateResourceComment(comment);
            output.types[typeName] = output[typeName] || [];
            output.types[typeName].push(comment);
        }
    });

    cleanupResource(output);

    return output;
}

function pluralizeResourceTypesName(name) {
    if ("method" === name) {
        name = "methods";
    }
    else if ("property" === name) {
        name = "properties"
    }
    else if ("config" === name) {
        // do nothing
    }
    else {
       // assert(false, "un-expected resource types name", name);
    }

    return name;
}

function cleanupResource(resource) {
    if (resource.types.methods) {
        resource.types.methods.forEach(function(method) {
            method.nameWithParams = createResourceMethodNameWithParams(method);

            if (method.throws) {
                method.throws.type = method.throws.types[0];
                method.throws.types = undefined;
            }
        });
    }

    if (resource.types.properties) {
        resource.types.properties.forEach(function(property) {
            property.type = property.type[0];
        });
    }

    if (resource.types.config) {
        resource.types.config.forEach(function(config) {
            config.type = config.type[0];
        });
    }

    // Will only have one return type
    Object.keys(resource.types).forEach(function(key) {
        resource.types[key].forEach(function(type) {
            if (type.returns) {
                type.returns.type = type.returns.types[0];
                type.returns.types = undefined;
            }
        });
    });
}

function createResourceMethodNameWithParams(method) {
    var params = "";
    if (method.params) {
        params = method.params.map(function(param) {
            return param.name;
        }).join(", ");
    }

    return method.name + "(" + params + ")";
}

function validateResourceComment(comment) {
    assert(comment.name, "each resource comment must have a name", comment);
    var typeName = getTypeNameFromComment(comment);
    assert("method" === typeName || "property" === typeName || "config" === typeName, "un-expect resource comment type", typeName);
}

function addCommentToMetadata(comment, metadata, filePath, options) {
    // only care about module level comments for the metadata
    if (!getModuleNameFromComment(comment)) {
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
    var url = getResourceUrl(filePath, options);
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

    var url = getResourceUrl(filePath, options);
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

function getResourceUrl(filePath, options) {
    return options.api.baseUrl + utils.getRelativePathNoExtension(filePath, options.api.input) + ".json";
}

function getResourceOutputPath(filePath, options) {
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