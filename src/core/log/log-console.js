"use strict";

function addLogConsoleService(module) {
    module.factory("$logConsole", ["$window"], function($window) {
        function log(type) {
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

        return {
            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            info: log("info"),

            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            debug: log("debug"),

            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            warn: log("warn"),

            /**
             *
             * @param message
             * @param [, obj2, ..., objN], list of objects to output. The string representations of
             * each of these objects are appended together in the order listed and output (same as console.log)
             */
            error: log("error"),

            clear: function() {
                $window.console && $window.console.clear && $window.console.clear();
            }
        }
    });
}