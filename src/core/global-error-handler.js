"use strict";

function addGlobalErrorHandlerService(module){
    module.factory("$globalErrorHandler", ["$window", "$signal", "$log", "$config"], function($window, $signal, $log, $config){
        var disabled = $config.disabled;
        var preventBrowserHandle = $config.preventBrowserHandle;
        var errored = $signal();

        $window.onerror = errorHandler;

        function log(description, error) {
            if (error) {
                $log.error(description, error);
            }
            else {
                $log.error(description);
            }
        }

        function describe(message, filename, line, error) {
            var description = "";

            if (message) {
                description = "message: " + message;
            }
            if (filename) {
                description += ", filename: " + filename;
            }
            if (0 <= line) {
                description += ", line: " + line;
            }
            if (error) {
                if (error.stack) {
                    description += ", stack: " + error.stack;
                }
                if (!description) {
                    description = error.toString();
                }
            }

            return description;
        }

        function errorHandler(message, filename, line, column, error) {
            if (disabled) {
                return;
            }

            var description = describe(message, filename, line, error);

            log(description, error);
            errored.trigger(description, error);

            return preventBrowserHandle;
        }

        return {
            disable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                disabled = value;
            },

            handle: function(error) {
                errorHandler(null, null, null, null, error);
            },

            errored: errored
        }
    });

    module.config("$globalErrorHandler", {
        disabled: false,
        preventBrowserHandle: true
    });
}