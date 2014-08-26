"use strict";

var Proto = require("../../utils/proto.js");

module.exports = Proto.define([
    function ctor($window) {
        this.$window = $window;
    },

    {
        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        info: function() {
            this.$window.console && this.$window.console.log.apply(this.$window.console, arguments);
        },

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        debug: function() {
            if (!this.$window.console || !this.$window.console.debug) {
                this.info.apply(this, arguments);
                return;
            }

            this.$window.console.debug.apply(this.$window.console, arguments);
        },

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        warn: function() {
            if (!this.$window.console || !this.$window.console.warn) {
                this.info.apply(this, arguments);
                return;
            }

            this.$window.console.warn.apply(this.$window.console, arguments);
        },

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        error: function() {
            if (!this.$window.console || !this.$window.console.error) {
                this.info.apply(this, arguments);
                return;
            }

            this.$window.console.error.apply(this.$window.console, arguments);
        },

        clear: function() {
            this.$window.console && this.$window.console.clear();
        }
    }
]);
