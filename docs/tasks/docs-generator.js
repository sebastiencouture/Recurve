"use strict";

var version = require("./docs-version");
var api = require("./docs-api");
var rdoc = require("./docs-rdoc");
var metadata = require("./docs-metadata");
var fileStream = require("fs-extra");

module.exports = function(grunt) {
    grunt.registerMultiTask("docs", "generate docs", function() {
        var options = {
            input: this.data.src,
            output: this.data.dest,
            docs: this.data.docs
        }

        fileStream.removeSync(options.output);

        grunt.log.writeln("generating version docs");
        version.generate(options);

        grunt.log.writeln("generating api docs");
        api.generate(options);

        grunt.log.writeln("generating rdoc docs");
        rdoc.generate(options);

        grunt.log.writeln("generating metadata docs");
        metadata.generate(options);
    });
}