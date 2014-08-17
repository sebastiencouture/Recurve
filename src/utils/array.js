"use strict";

// TODO TBD need to add indexOf method? not supported on IE8?
// other methods: map, reduce, filter, lastIndexOf
// TODO TBD maybe just make as requirement to include es5-shim similiar if want to support IE8

module.exports = {
    indexOf: function(array, search, fromIndex) {
        if (!array) {
            return -1;
        }

        // IE8 no support :T
        if (Array.prototype.indexOf) {
            return array.index(search, fromIndex);
        }

        if (undefined === fromIndex) {
            fromIndex = 0;
        }

        var length = array.length;

        if (0 === length) {
            return -1;
        }

        if (0 > fromIndex) {
            fromIndex = Math.max(0, length + fromIndex);
        }

        if (length <= fromIndex) {
            return -1;
        }

        for (var index = fromIndex; index < length; index++) {
            if (array[index] === search) {
                return index;
            }
        }

        return -1;
    },

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