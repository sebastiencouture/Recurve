"use strict";

function addUncaughtErrorHandlerService(module){
    module.factory("$uncaughtErrorHandler", ["$window", "$signal", "$errorHandler", "$config"], function($window, $signal, $errorHandler, $config) {

        function sanitizedByCors(message, fileName) {
            return !message && !fileName;
        }

        function createError(message, fileName, lineNumber, columnNumber, errorObj) {
            // errorObj and column number are only returned on newer browsers
            // errorObj will only include fileName, lineNumber, and columnNumber on FF
            var error = new Error(message);

            error.fileName = fileName;
            error.lineNumber = lineNumber;
            error.columnNumber = columnNumber;
            if (errorObj) {
                error.stack = errorObj.stack;
            }

            return error;
        }

        function uncaughtErrorHandler(message, fileName, lineNumber, columnNumber, errorObj) {
            var preventBrowserHandle = $config.preventBrowserHandle;

            // CORS, will sanitize and return no information. In this case, we always want to allow
            // the browser to handle and display the error in the console
            if (sanitizedByCors(message, fileName)) {
                message = "Due to CORS, no uncaught error info is available.";
                preventBrowserHandle = false;
            }

            var error = createError(message, fileName, lineNumber, columnNumber, errorObj);
            globalErrorHandler.handle(error);

            return preventBrowserHandle;
        }

        var errored = $signal();

        if ($config.enable) {
            $window.onerror = uncaughtErrorHandler;
        }

        var globalErrorHandler = {
            handle: function(error) {
                errored.trigger(error);
                $errorHandler(error);
            },

            errored: errored
        };

        return globalErrorHandler;
    });

    module.config("$uncaughtErrorHandler", {
        enable: true,
        preventBrowserHandle: true
    });
}