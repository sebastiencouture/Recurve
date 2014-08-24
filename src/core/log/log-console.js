"use strict";

var Proto = require("../../utils/proto.js");

module.exports = Proto.define([
    function ctor() {
    },

    {
        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        info: function() {
            console && console.log.apply(console, arguments);
        },

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        debug: function() {
            if (!console || !console.debug) {
                this.info.apply(this, arguments);
                return;
            }

            console.debug.apply(console, arguments);
        },

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        warn: function() {
            if (!console || !console.warn) {
                this.info.apply(this, arguments);
                return;
            }

            console.warn.apply(console, arguments);
        },

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        error: function() {
            if (!console || !console.error) {
                this.info.apply(this, arguments);
                return;
            }

            console.error.apply(console, arguments);
        },

        clear: function() {
            console && console.clear();
        }
    }
]);
