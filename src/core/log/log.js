"use strict";

function addLogService(module) {
    module.factory("$log", ["$config"], function($config) {
        var targets = $config.targets;
        var debugDisabled = $config.disabled;
        var infoDisabled = $config.disabled;
        var warnDisabled = $config.disabled;
        var errorDisabled = $config.disabled;

        function log(type, message, args) {
            args = argumentsToArray(args, 1);
            var description = describe(type.toUpperCase());

            forEach(targets, function(target) {
                var targetForType = target[type];
                if (targetForType) {
                    targetForType.apply(target, [description, message].concat(args));
                }
            });
        }

        function describe(type) {
            var time = formatTime(new Date());
            return "[" + type + "] " + time;
        }

        return {
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

                log("info", message, arguments);
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

                log("debug", message, arguments);
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

                log("warn", message, arguments);
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

                log("error", message, arguments);
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
                if (undefined === value) {
                    value = true;
                }

                debugDisabled = value;
                infoDisabled = value;
                warnDisabled = value;
                errorDisabled = value;
            },

            /**
             *
             * @param value, defaults to true
             */
            debugDisable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                debugDisabled = value;
            },

            /**
             *
             * @param value, defaults to true
             */
            infoDisable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                infoDisabled = value;
            },

            /**
             *
             * @param value, defaults to true
             */
            warnDisable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                warnDisabled = value;
            },

            /**
             *
             * @param value, defaults to true
             */
            errorDisable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                errorDisabled = value;
            }
        };
    });

    module.factory("config.$log", ["$logConsole"], function($logConsole) {
        return {
            disabled: false,
            targets: [$logConsole]
        };
    });
}