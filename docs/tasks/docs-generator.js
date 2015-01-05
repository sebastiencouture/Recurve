"use strict";

var version = require("./docs-version");
var api = require("./docs-api");
var rdoc = require("./docs-rdoc");
var metadata = require("./docs-metadata");
var fileStream = require("fs-extra");

module.exports = function(grunt) {
    grunt.registerMultiTask("docs", "generate docs", function() {
        var inputDirectoryPath = this.data.src;
        var outputDirectoryPath = this.data.dest;

        fileStream.removeSync(outputDirectoryPath);

        grunt.log.writeln("generating version docs");
        version.generate(inputDirectoryPath, outputDirectoryPath);

        grunt.log.writeln("generating api docs");
        api.generate(inputDirectoryPath, outputDirectoryPath);

        grunt.log.writeln("generating rdoc docs");
        rdoc.generate(inputDirectoryPath, outputDirectoryPath);

        grunt.log.writeln("generating metadata docs");
        metadata.generate(inputDirectoryPath, outputDirectoryPath);
    });
}