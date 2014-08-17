"use strict";

var ObjectUtils = require("./object.js");
var DateUtils = require("./date.js");

module.exports = {
    format: function(value) {
        if (!value) {
            return null;
        }

        Array.prototype.shift.apply(arguments);

        for (var index = 0; index < arguments.length; index++) {
            var search = "{" + index + "}";
            value = value.replace(search, arguments[index]);
        }

        return value;
    },

    formatWithObject: function(value, obj) {
        if (!value) {
            return null;
        }

        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                var search = "{" + property + "}";
                value = value.replace(search, obj[property]);
            }
        }

        return value;
    },

    pad: function(value, padCount, padValue) {
        if (undefined === padValue) {
            padValue = "0";
        }

        value = String( value );

        while (value.length < padCount) {
            value = padValue + value;
        }

        return value;
    },

    trim: function(value) {
        if (!value) {
            return null;
        }

        // IE8 no support :T, but native trim() is much faster, so use it
        // when available
        if (String.prototype.trim) {
            return value.trim();
        }

        return value.replace(/^\s+|\s+$/g, '');
    },

    formatTime: function(date) {
        if (undefined === date) {
            date = new Date();
        }

        var hours = this.pad(date.getHours(), 2);
        var minutes = this.pad(date.getMinutes(), 2);
        var seconds = this.pad(date.getSeconds(), 2);
        var milliseconds = this.pad(date.getMilliseconds(), 2);

        return this.format(
            "{0}:{1}:{2}:{3}", hours, minutes, seconds, milliseconds);
    },

    formatMonthDayYear: function(date) {
        if (!date) {
            return "";
        }

        var month = this.pad(date.getMonth() + 1);
        var day = this.pad(date.getDate());
        var year = date.getFullYear();

        return this.format(
            "{0}/{1}/{2}", month, day, year);
    },

    formatYearRange: function(start, end) {
        var value = "";

        if (start && end) {
            value = start + " - " + end;
        }
        else if (start) {
            value = start;
        }
        else {
            value = end;
        }

        return value;
    },

    capitalizeFirstCharacter: function(value) {
        if (!value) {
            return null;
        }

        return value.charAt(0).toUpperCase()  + value.slice(1);
    },

    hasValue: function(value) {
        return value && 0 < value.length;
    },

    linesOf: function(value) {
        var lines;

        if (value) {
            lines = value.split("\n");
        }

        return lines;
    },

    isEqual: function(str, value, ignoreCase) {
        if (!str || !value) {
            return str == value;
        }

        if (ignoreCase) {
            str = str.toLowerCase();
            value = value.toLowerCase();
        }

        return str == value;
    },

    isEqualIgnoreCase: function(str, value) {
        return this.isEqual(str, value, true);
    },

    contains: function(str, value, ignoreCase) {
        if (!str || !value) {
            return str == value;
        }

        if (ignoreCase) {
            str = str.toLowerCase();
            value = value.toLowerCase();
        }

        return 0 <= str.indexOf(value);
    },

    beforeSeparator: function(str, separator) {
        if (!str || !separator) {
            return null;
        }

        var index = str.indexOf(separator);
        return -1 < index ? str.substring(0, index) : null;
    },

    afterSeparator: function(str, separator) {
        if (!str || !separator) {
            return null;
        }

        var index = str.indexOf(separator);
        return -1 < index ? str.substring(index + 1) : null;
    },

    // TODO TBD where to put this function?
    generateUUID: function() {
        // http://stackoverflow.com/a/8809472
        var now = DateUtils.now();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(character) {
            var random = (now + Math.random()*16)%16 | 0;
            now = Math.floor(now/16);
            return (character=='x' ? random : (random&0x7|0x8)).toString(16);
        });

        return uuid;
    }
};

