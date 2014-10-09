"use strict";

function addMockLogService(module) {
    module.factory("$log", null, function() {
        var debugDisabled;
        var infoDisabled;
        var warnDisabled;
        var errorDisabled;

        return {
            logs: {
                info: [],
                debug: [],
                warn: [],
                error: []
            },

            info: function() {
                if (!infoDisabled) {
                    this.logs.info.push(Array.prototype.slice.call(arguments));
                }
            },

            debug: function() {
                if (!debugDisabled) {
                    this.logs.debug.push(Array.prototype.slice.call(arguments));
                }
            },

            warn: function() {
                if (!warnDisabled) {
                    this.logs.warn.push(Array.prototype.slice.call(arguments));

                }
            },

            error: function() {
                if (!errorDisabled) {
                    this.logs.error.push(Array.prototype.slice.call(arguments));
                }
            },

            clear: function() {
                this.logs.info = [];
                this.logs.debug = [];
                this.logs.warn = [];
                this.logs.error = [];
            },

            disable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                debugDisabled = value;
                infoDisabled = value;
                warnDisabled = value;
                errorDisabled = value;
            },

            debugDisable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                debugDisabled = value;
            },

            infoDisable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                infoDisabled = value;
            },

            warnDisable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                warnDisabled = value;
            },

            errorDisable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                errorDisabled = value;
            }
        };
    });
}
