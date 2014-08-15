"use strict";

module.exports = {
    now: function() {
        return Date.now ? Date.now() : new Date().getTime();
    },

    performanceNow: function() {
        return performance && performance.now ? performance.now() : this.now();
    }
};