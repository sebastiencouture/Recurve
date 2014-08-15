"use strict";

var Proto = require("../proto.js");
var ArrayUtils = require("../utils/array.js");
var StringUtils = require("../utils/string.js");
var LogTarget = require("./log-console.js");

module.exports = Proto.define([

    /**
     *
     * @param targets, array of targets to log to (see Recurve.LogConsoleTarget as example).
     * Defaults to Recurve.LogConsoleTarget
     * @param enabled, default true
     */
     function ctor(enabled, targets) {
        if (undefined === enabled) {
            enabled = true;
        }

        if (undefined === targets) {
            targets = [new LogTarget()];
        }

        this.targets = targets;
        this.disable(!enabled);
    },

    {
        /**
         * Log info to all targets
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        info: function(message) {
            if (this._infoDisabled) {
                return;
            }

            this._log("info", message, arguments);
        },

        /**
         * Log debug to all targets
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        debug: function(message) {
            if (this._debugDisabled) {
                return;
            }

            this._log("debug", message, arguments);
        },

        /**
         * Log warning to all targets
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        warn: function(message) {
            if (this._warnDisabled) {
                return;
            }

            this._log("warn", message, arguments);
        },

        /**
         * Log error to all targets
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        error: function(message) {
            if (this._errorDisabled) {
                return;
            }

            this._log("error", message, arguments);
        },

        /**
         * Clear log for all targets
         */
        clear: function() {
            for (var index = 0; index < this.targets.length; index++) {
                this.targets[index].clear();
            }
        },

        /**
         *
         * @param value, defaults to true
         */
        disable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._debugDisabled = value;
            this._infoDisabled = value;
            this._warnDisabled = value;
            this._errorDisabled = value;
        },

        /**
         *
         * @param value, defaults to true
         */
        debugDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._debugDisabled = value;
        },

        /**
         *
         * @param value, defaults to true
         */
        infoDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._infoDisabled = value;
        },

        /**
         *
         * @param value, defaults to true
         */
        warnDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._warnDisabled = value;
        },

        /**
         *
         * @param value, defaults to true
         */
        errorDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._errorDisabled = value;
        },

        _log: function(type, message, args) {
            args = ArrayUtils.argumentsToArray(args, 1);
            var description = this._description(type.toUpperCase());

            for (var index = 0; index < this.targets.length; index++) {
                this.targets[index][type].apply(this.targets[index], [description, message].concat(args));
            }
        },

        _description: function(type) {
            var time = StringUtils.formatTime(new Date());
            return "[" + type + "] " + time;
        }
    }
]);