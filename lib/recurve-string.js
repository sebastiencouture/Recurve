/**
 *  Created by Sebastien Couture on 2014-6-29.
 *  Copyright (c) 2014 Sebastien Couture. All rights reserved.
 *
 *  Permission is hereby granted, free of charge, to any person
 *  obtaining a copy of this software and associated documentation
 *  files (the "Software"), to deal in the Software without
 *  restriction, including without limitation the rights to use,
 *  copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *  OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
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
        }
    };
})();