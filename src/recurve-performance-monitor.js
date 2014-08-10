"use strict";

var Proto = require("./recurve-proto.js");
var DateUtils = require("./recurve-date.js");
var Log = require("./recurve-log.js");

module.exports = Proto.define([
    function ctor(log, enabled) {
        if (undefined === log) {
            this._log = new Log();
        }

        if (undefined === enabled) {
            enabled = true;
        }

        this.disable(!enabled);
    },

    {
        start: function(message) {
            if (this._disabled) {
                return;
            }

            return new Timer(this._log, message);
        },

        end: function(timer, description) {
            if (this._disabled || !timer) {
                return;
            }

            timer.end(description);
        },

        disable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._disabled = value;
        }
    }
]);


var Timer = Proto.define([
    function ctor() {
    },

    {
        start: function(log, message) {
            this._log = log;

            if (supportsConsoleTime()) {
                console.time(message);
            }
            else {
                this._startTime = DateUtils.performanceNow();
            }

            this._message = message;
        },

        end: function(description) {
            if (supportsConsoleTime()) {
                console.timeEnd(this._message);
            }
            else {
                this._log.info(this._message + ": " + (DateUtils.performanceNow() - this._startTime) + " ms");
            }

            if (description) {
                this._log.info(description);
            }
        }
    }
]);

function supportsConsoleTime() {
    return console && console.time && console.timeEnd;
}