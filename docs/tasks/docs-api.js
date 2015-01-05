"use strict";

var fileStream = require("fs-extra");
var path = require("path");
var dox = require("dox");

function generateDirectory(directoryPath, inputDirectoryPath, outputDirectoryPath) {
    var files = fileStream.readdirSync(directoryPath);
    files.forEach(function(fileName) {
        var filePath = directoryPath + "/" + fileName;
        if (fileStream.statSync(filePath).isDirectory()) {
            generateDirectory(filePath, inputDirectoryPath, outputDirectoryPath);
        }
        else {
            generateFile(filePath, inputDirectoryPath, outputDirectoryPath);
        }
    });
}

function generateFile(filePath, inputDirectoryPath, outputDirectoryPath) {
    if ("js" !== getFileExtension(filePath)) {
        return;
    }

    var content = fileStream.readFileSync(filePath, "utf8");
    var parsedComments = dox.parseComments(content, {skipSingleStar: true});


    var outputPath = getOutputPath(filePath, inputDirectoryPath, outputDirectoryPath);
    fileStream.outputJsonSync(outputPath, parsedComments);
}

function getFileExtension(filePath) {
    return path.basename(filePath).split(".")[1];
}

function getOutputPath(filePath, inputDirectoryPath, outputDirectoryPath) {
    var noRoot = filePath.split(inputDirectoryPath)[1];
    var noExtension = noRoot.split(".")[0];

    return outputDirectoryPath + noExtension + ".json";
}


module.exports = {
    generate: function(inputDirectoryPath, outputDirectoryPath) {
        outputDirectoryPath = outputDirectoryPath + "/api";
        generateDirectory(inputDirectoryPath, inputDirectoryPath, outputDirectoryPath);
    }
};