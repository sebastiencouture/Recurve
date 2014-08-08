/*(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.StringUtils =
    {
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

        formatWithProperties: function(value, formatProperties) {
            if (!value) {
                return null;
            }

            for (var property in formatProperties) {
                if (formatProperties.hasOwnProperty(property)) {
                    var search = "{" + property + "}";
                    value = value.replace(search, formatProperties[property]);
                }
            }

            return value;
        },

        pad: function( value, padCount, padValue ) {
            if (undefined === padValue) {
                padValue = "0";
            }

            value = String( value );

            while (value.length < padCount) {
                value = padValue + value;
            }

            return value;
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

            var pad = Recurve.StringUtils.pad;

            var month = pad(date.getMonth() + 1);
            var day = pad(date.getDate());
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

        urlLastPath: function(value) {
            if (!value) {
                return;
            }

            var split = value.split("/");
            return 0 < split.length ? split[split.length-1] : null;
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
            return Recurve.StringUtils.isEqual(str, value, true);
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

        addParametersToUrl: function(url, parameters) {
            if (!url || !parameters) {
                return;
            }

            var seperator = Recurve.StringUtils.contains(url, "?") ? "&" : "?";

            for (var key in parameters) {
                var value = parameters[key];

                if (Recurve.ObjectUtils.isObject(value)) {
                    if (Recurve.ObjectUtils.isDate(value)) {
                        value = value.toISOString();
                    }
                    else {
                        value = Recurve.ObjectUtils.toJson(value);
                    }
                }

                url += seperator +  encodeURIComponent(key) + encodeURIComponent(parameters[key]);
                seperator = "?";
            }

            return url;
        },

        removeParameterFromUrl: function(url, parameter) {
            if (!url || !parameter) {
                return;
            }

            var search = parameter + "=";
            var startIndex = url.indexOf(search);

            if (-1 === index) {
                return;
            }

            var endIndex = url.indexOf("&", startIndex);

            if (-1 < endIndex) {
                url = url.substr(0, Math.max(startIndex - 1, 0)) + url.substr(endIndex);
            }
            else {
                url = url.substr(0, Math.max(startIndex - 1, 0));
            }

            return url;
        }
    };
})();

*/

"use strict";

var ObjectUtils = require("./recurve-object.js");

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

    formatWithProperties: function(value, formatProperties) {
        if (!value) {
            return null;
        }

        for (var property in formatProperties) {
            if (formatProperties.hasOwnProperty(property)) {
                var search = "{" + property + "}";
                value = value.replace(search, formatProperties[property]);
            }
        }

        return value;
    },

    pad: function( value, padCount, padValue ) {
        if (undefined === padValue) {
            padValue = "0";
        }

        value = String( value );

        while (value.length < padCount) {
            value = padValue + value;
        }

        return value;
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

    urlLastPath: function(value) {
        if (!value) {
            return;
        }

        var split = value.split("/");
        return 0 < split.length ? split[split.length-1] : null;
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

    addParametersToUrl: function(url, parameters) {
        if (!url || !parameters) {
            return;
        }

        var seperator = this.contains(url, "?") ? "&" : "?";

        for (var key in parameters) {
            var value = parameters[key];

            if (ObjectUtils.isObject(value)) {
                if (ObjectUtils.isDate(value)) {
                    value = value.toISOString();
                }
                else {
                    value = ObjectUtils.toJson(value);
                }
            }

            url += seperator +  encodeURIComponent(key) + encodeURIComponent(parameters[key]);
            seperator = "?";
        }

        return url;
    },

    removeParameterFromUrl: function(url, parameter) {
        if (!url || !parameter) {
            return;
        }

        var search = parameter + "=";
        var startIndex = url.indexOf(search);

        if (-1 === index) {
            return;
        }

        var endIndex = url.indexOf("&", startIndex);

        if (-1 < endIndex) {
            url = url.substr(0, Math.max(startIndex - 1, 0)) + url.substr(endIndex);
        }
        else {
            url = url.substr(0, Math.max(startIndex - 1, 0));
        }

        return url;
    }
};

