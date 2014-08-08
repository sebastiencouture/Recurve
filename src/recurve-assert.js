/*
(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.assert = function(condition, message) {
        if (condition) {
            return;
        }

        Array.prototype.shift.apply(arguments);
        message = Recurve.StringUtils.format.apply(this, arguments);

        throw new Error(message);
    };
})();
*/

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