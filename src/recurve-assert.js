"use strict";

var StringUtils = require("./recurve-string.js");

// TODO TBD add methods such as: ok, equal, equalStrict, etc.
module.exports = function(condition, message) {
    if (condition) {
        return;
    }

    Array.prototype.shift.apply(arguments);
    message = StringUtils.format.apply(this, arguments);

    throw new Error(message);
};