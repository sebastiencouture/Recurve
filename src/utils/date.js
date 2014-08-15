"use strict";

module.exports = {
    now: function() {
        return new Date().getTime();
    },

    performanceNow: function() {
        return performance && performance.now ? performance.now() : this.now();
    }
};