"use strict";

var Proto = require("../../utils/proto.js");

module.exports = function($window) {
    return Proto.define([
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
                $window.console && $window.console.log.apply($window.console, arguments);
            },

            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            debug: function() {
                if (!$window.console || !$window.console.debug) {
                    this.info.apply(this, arguments);
                    return;
                }

                $window.console.debug.apply($window.console, arguments);
            },

            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            warn: function() {
                if (!$window.console || !$window.console.warn) {
                    this.info.apply(this, arguments);
                    return;
                }

                $window.console.warn.apply($window.console, arguments);
            },

            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            error: function() {
                if (!$window.console || !$window.console.error) {
                    this.info.apply(this, arguments);
                    return;
                }

                $window.console.error.apply($window.console, arguments);
            },

            clear: function() {
                $window.console && $window.console.clear();
            }
        }
    ]);
};
