"use strict";

module.exports = {
    performanceNow: function() {
        return performance && performance.now ? performance.now() : this.now();
    },

    addDaysFromNow: function(days) {
        var date = new Date();
        date.setDate(date.getDate() + days);

        return date;
    }
};