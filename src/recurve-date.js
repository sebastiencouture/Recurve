/*(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.DateUtils =
    {
        now: function() {
            return new Date();
        },

        startYearFromRange: function(range) {
            if (!range) {
                return "";
            }

            var split = range.split("-");
            return 0 < split.length ? split[0] : "";
        },

        endYearFromRange: function(range) {
            if (!range) {
                return "";
            }

            var split = range.split("-");
            return 2 < split.length ? split[2] : "";
        }
    };
})();*/

"use strict";

module.exports = {
    now: function() {
        return new Date();
    },

    startYearFromRange: function(range) {
        if (!range) {
            return "";
        }

        var split = range.split("-");
        return 0 < split.length ? split[0] : "";
    },

    endYearFromRange: function(range) {
        if (!range) {
            return "";
        }

        var split = range.split("-");
        return 2 < split.length ? split[2] : "";
    }
};