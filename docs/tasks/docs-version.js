"use strict";

var fileStream = require("fs-extra");

module.exports = {
    generate: function(options) {
        var content = fileStream.readJsonSync(options.version.input, "utf8");
        fileStream.outputJsonSync(options.version.output, {
            version: content.version
        });
    }
};