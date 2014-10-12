"use strict";

function addMockLogService(module) {
    module.factory("$log", null, function() {
        var logDisabled;
        var debugDisabled;
        var infoDisabled;
        var warnDisabled;
        var errorDisabled;

        function spy() {
            var calls = [];

            return {
                add: function() {
                    calls.push(Array.prototype.slice.call(arguments, 0));
                },

                any: function() {
                    return 0 < calls.length;
                },

                count: function() {
                    return calls.length;
                },

                argsFor: function(index) {
                    return 0 <= index && index < this.count() ? calls[index].slice() : undefined;
                },

                allArgs: function() {
                    return calls.slice();
                },

                mostRecent: function() {
                    return this.argsFor(calls.length - 1);
                },

                first: function() {
                    return this.argsFor(0);
                },

                clear: function() {
                    calls = [];
                }
            };
        }

        function log() {
            if (!logDisabled) {
                logs.log.add.apply(logs.log, arguments);
            }
        }

        var logs = {
            log: spy(),
            info: spy(),
            debug: spy(),
            warn: spy(),
            error: spy()
        };

        return recurve.extend(log, {
            logs: logs,

            info: function() {
                if (!infoDisabled) {
                    logs.info.add.apply(logs.info, arguments);
                }
            },

            debug: function() {
                if (!debugDisabled) {
                    logs.debug.add.apply(logs.debug, arguments);
                }
            },

            warn: function() {
                if (!warnDisabled) {
                    logs.warn.add.apply(logs.warn, arguments);
                }
            },

            error: function() {
                if (!errorDisabled) {
                    logs.error.add.apply(logs.error, arguments);
                }
            },

            clear: function() {
                logs.log.clear();
                logs.info.clear();
                logs.debug.clear();
                logs.warn.clear();
                logs.error.clear();
            },

            disable: function(value) {
                if (recurve.isUndefined(value)) {
                    value = true;
                }

                logDisabled = value;
                debugDisabled = value;
                infoDisabled = value;
                warnDisabled = value;
                errorDisabled = value;
            },

            logDisable: function(value) {
                if (recurve.isUndefined(value)) {
                    value = true;
                }

                logDisabled = value;
            },

            debugDisable: function(value) {
                if (recurve.isUndefined(value)) {
                    value = true;
                }

                debugDisabled = value;
            },

            infoDisable: function(value) {
                if (recurve.isUndefined(value)) {
                    value = true;
                }

                infoDisabled = value;
            },

            warnDisable: function(value) {
                if (recurve.isUndefined(value)) {
                    value = true;
                }

                warnDisabled = value;
            },

            errorDisable: function(value) {
                if (recurve.isUndefined(value)) {
                    value = true;
                }

                errorDisabled = value;
            }
        });
    });
}
