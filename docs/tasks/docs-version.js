"use strict";

var fileStream = require("fs-extra");

module.exports = {
    generate: function(options) {
        var content = fileStream.readFileSync(options.version.input, "utf8");
        content = JSON.parse(content);

        fileStream.outputJsonSync(options.version.output, {
            version: content.version
        });
    }
};