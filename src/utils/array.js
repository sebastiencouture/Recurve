"use strict";

module.exports = {
    removeItem: function(array, item) {
        if (!array) {
            return;
        }

        var index = array.indexOf(item);
        if (-1 < index) {
            array.splice(index, 1);
        }
    },

    removeAt: function(array, index) {
        if (!array) {
            return;
        }

        if (0 <= index && array.length > index) {
            array.splice(index, 1);
        }
    },

    replaceItem: function(array, item) {
        if (!array) {
            return;
        }

        var index = array.indexOf(item);
        if (-1 < index) {
            array[index] = item;
        }
    },

    isEmpty: function(value) {
        return !value || 0 === value.length;
    },

    argumentsToArray: function(args, sliceCount) {
        return sliceCount < args.length ? Array.prototype.slice.call(args, sliceCount) : [];
    }
};