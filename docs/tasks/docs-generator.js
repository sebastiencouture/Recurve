"use strict";

var version = require("./docs-version");
var api = require("./docs-api");
var rdoc = require("./docs-rdoc");
var metadata = require("./docs-metadata");
var fileStream = require("fs-extra");

module.exports = function(grunt) {
    grunt.registerMultiTask("docs", "generate docs", function() {
        fileStream.removeSync(this.data.output);

        grunt.log.writeln("generating version docs");
        version.generate(this.data);

        grunt.log.writeln("generating api docs");
        api.generate(this.data);

        grunt.log.writeln("generating rdoc docs");
        rdoc.generate(this.data);

        grunt.log.writeln("generating metadata docs");
        metadata.generate(this.data);
    });
}