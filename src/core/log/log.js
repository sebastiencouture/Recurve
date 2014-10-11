"use strict";

function addLogService(module) {
    module.factory("$log", ["$config"], function($config) {
        var targets = $config.targets;
        var includeTimestamp = $config.includeTimestamp;

        var logDisabled = $config.disabled;
        var debugDisabled = $config.disabled;
        var infoDisabled = $config.disabled;
        var warnDisabled = $config.disabled;
        var errorDisabled = $config.disabled;

        function logType(type, message, args) {
            args = argumentsToArray(args, 1);
            var description = describe();

            forEach(targets, function(target) {
                var targetForType = type ? target[type] : target;
                var contextForType = type ? target : null;

                if (targetForType) {
                    targetForType.apply(contextForType, [description, message].concat(args));
                }
            });
        }

        function describe() {
            return includeTimestamp ? formatTime(new Date()) : "";
        }

        /**
         * Log to all targets
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        function log(message) {
            if (logDisabled) {
                return;
            }

            logType(null, message, arguments);
        }

        return extend(log, {
            /**
             * Log info to all targets
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            info: function(message) {
                if (infoDisabled) {
                    return;
                }

                logType("info", message, arguments);
            },

            /**
             * Log debug to all targets
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            debug: function(message) {
                if (debugDisabled) {
                    return;
                }

                logType("debug", message, arguments);
            },

            /**
             * Log warning to all targets
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            warn: function(message) {
                if (warnDisabled) {
                    return;
                }

                logType("warn", message, arguments);
            },

            /**
             * Log error to all targets
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            error: function(message) {
                if (errorDisabled) {
                    return;
                }

                logType("error", message, arguments);
            },

            /**
             * Clear log for all targets
             */
            clear: function() {
                forEach(targets, function(target){
                    target.clear();
                });
            },

            /**
             *
             * @param value, defaults to true
             */
            disable: function(value) {
                if (isUndefined(value)) {
                    value = true;
                }

                logDisabled = value;
                debugDisabled = value;
                infoDisabled = value;
                warnDisabled = value;
                errorDisabled = value;
            },

            logDisable: function(value) {
                if (isUndefined(value)) {
                    value = true;
                }

                logDisabled = value;
            },

            /**
             *
             * @param value, defaults to true
             */
            debugDisable: function(value) {
                if (isUndefined(value)) {
                    value = true;
                }

                debugDisabled = value;
            },

            /**
             *
             * @param value, defaults to true
             */
            infoDisable: function(value) {
                if (isUndefined(value)) {
                    value = true;
                }

                infoDisabled = value;
            },

            /**
             *
             * @param value, defaults to true
             */
            warnDisable: function(value) {
                if (isUndefined(value)) {
                    value = true;
                }

                warnDisabled = value;
            },

            /**
             *
             * @param value, defaults to true
             */
            errorDisable: function(value) {
                if (isUndefined(value)) {
                    value = true;
                }

                errorDisabled = value;
            }
        });
    });

    module.factory("config.$log", ["$logConsole"], function($logConsole) {
        return {
            disabled: false,
            includeTimestamp: false,
            targets: [$logConsole]
        };
    });
}