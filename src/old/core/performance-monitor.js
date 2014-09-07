"use strict";

var Proto = require("../utils/proto.js");
var DateUtils = require("../utils/date.js");

module.exports = function(recurveModule) {
    recurveModule.configurable("$performance", function() {
        var enabled = true;

        return {
            setEnabled: function(value) {
                enabled = value;
            },

            $dependencies: ["$window", "$log"],

            $provider:  function($window, $log) {
                return new PerformanceMonitor($window, $log, enabled);
            }
        }
    });
};

var PerformanceMonitor = Proto.define([
    function ctor($window, $log, enabled) {
        this._$window = $window;
        this._$log = $log;
        this.disable(!enabled);
    },

    {
        start: function(message) {
            if (this._disabled) {
                return;
            }

            var timer = new Timer(this._$window, this._$log);
            timer.start(message);

            return timer;
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
    function ctor($window, $log) {
        this._$window = $window;
        this._$log = $log;
    },

    {
        start: function(message) {
            if (this._supportsConsoleTime()) {
                this._$window.console.time(message);
            }
            else {
                this._startTime = DateUtils.performanceNow();
            }

            this._message = message;
        },

        end: function(description) {
            if (this._supportsConsoleTime()) {
                this._$window.console.timeEnd(this._message);
            }
            else {
                this._$log.info(this._message + ": " + (DateUtils.performanceNow() - this._startTime) + " ms");
            }

            if (description) {
                this._$log.info(description);
            }
        },

        _supportsConsoleTime: function() {
            return this._$window.console && this._$window.console.time && this._$window.console.timeEnd;
        }
    }
]);