"use strict";

var Proto =
module.exports = function(mockModule) {
    mockModule.constructor("$log", null, Log);
};

var Log = recurve.define([
    function ctor() {
        this.clear();
        this.disable(false);
    },

    {
        info: function(message) {
            if (this._infoDisabled) {
                return;
            }

            this.infoLogs.push(message);
        },

        debug: function(message) {
            if (this._debugDisabled) {
                return;
            }

            this.debugLogs.push(message);
        },

        warn: function(message) {
            if (this._warnDisabled) {
                return;
            }

            this.warnLogs.push(message);
        },

        error: function(message) {
            if (this._errorDisabled) {
                return;
            }

            this.errorLogs.push(message);
        },

        clear: function() {
            this.infoLogs = [];
            this.debugLogs = [];
            this.warnLogs = [];
            this.errorLogs = [];
        },

        disable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._debugDisabled = value;
            this._infoDisabled = value;
            this._warnDisabled = value;
            this._errorDisabled = value;
        },

        debugDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._debugDisabled = value;
        },

        infoDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._infoDisabled = value;
        },

        warnDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._warnDisabled = value;
        },

        errorDisable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._errorDisabled = value;
        }
    }
]);