"use strict";

function addGlobalErrorHandlerService(module){
    module.factory("$globalErrorHandler", ["$window", "$signal", "$log", "$config"], function($window, $signal, $log, $config){
        var disabled = $config.disabled;
        var preventBrowserHandle = $config.preventBrowserHandle;
        var errored = $signal();

        $window.onerror = errorHandler;

        function describe(error) {
            if (!error) {
                return null;
            }

            var description;

            if (isString(error)) {
                description = error;
            }
            else if (isError(error)) {
                description = error.message + "\n" + (error.stack ? error.stack : "");
            }
            else if (isObject(error)) {
                description = toJson(error);
            }
            else
            {
                description = error.toString();
            }

            return description;
        }

        function log(error, description) {
            if (error) {
                $log.error(error, description);
            }
            else {
                $log.error(description);
            }
        }

        function errorHandler(message, filename, line, column, error) {
            if (disabled) {
                return;
            }

            var description = format("message: {0}, file: {1}, line: {2}", message, filename ? filename : "", line ? line : "");
            if (error) {
                description += format(", stack: {0}", error.stack);
            }

            log(error, description);
            errored.trigger(error, description);

            return preventBrowserHandle;
        }

        return {
            disable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                disabled = value;
            },

            /**
             * Handle error as would be done for uncaught global error
             *
             * @param error, any type of error (string, object, Error)
             */
            handleError: function(error) {
                if (disabled) {
                    return;
                }

                var description = describe(error);

                log(error, description);
                errored.trigger(error, description);
            },

            errored: errored
        }
    });

    module.config("$globalErrorHandler", {
        disabled: false,
        preventBrowserHandle: true
    });
}