"use strict";

function addLogConsoleService(module) {
    module.factory("$logConsole", ["$window"], function($window) {
        function logType(type) {
            if (!$window.console) {
                return function(){
                    // do nothing - can't log
                };
            }

            var logger = $window.console[type] || $window.console.log || function(){};
            var hasApply = false;

            // IE 8/9
            try {
                hasApply = !!logger.apply;
            }
            catch (error) {
                // do nothing
            }

            if (hasApply) {
                return function() {
                    logger.apply($window.console, arguments);
                };
            }

            // No apply available, so just handle up to 3 arguments
            return function(description, message, obj) {
                if (message && obj) {
                    logger(description, message, obj);
                }
                else if (message) {
                    logger(description, message);
                }
                else {
                    logger(description);
                }
            }
        }

        /**
         *
         * @param message
         * @param [, obj2, ..., objN], list of objects to output. The string representations of
         * each of these objects are appended together in the order listed and output (same as console.log)
         */
        var log = logType("log");

        return extend(log, {
            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            info: logType("info"),

            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            debug: logType("debug"),

            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            warn: logType("warn"),

            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            error: logType("error"),

            clear: function() {
                $window.console && $window.console.clear && $window.console.clear();
            }
        });
    });
}