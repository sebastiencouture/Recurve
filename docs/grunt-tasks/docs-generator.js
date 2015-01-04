"use strict";

module.exports = function(grunt) {
    var version = require("./docs-version");
    var api = require("./docs-api");
    var rdoc = require("./docs-rdoc");
    var metadata = require("./docs-metadata");

    grunt.registerMultiTask("docs", "generate docs", function() {
        version.generate(grunt);
        api.generate(grunt);
        rdoc.generate(grunt);
        metadata.generate(grunt);
    });
}