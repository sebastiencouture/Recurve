"use strict";

function addMockErrorHandlerDecorator(module) {
    module.decorator("$errorHandler", ["$log"], function($delegate, $log) {
        var logErrors = true;
        var errors = [];

        function errorHandler(error) {
            errors.push(error);

            if (logErrors) {
                $log.error(error);
            }
            else {
                throw error;
            }
        }

        errorHandler.protectedInvoke = $delegate.protectedInvoke;

        errorHandler.errors = errors;

        errorHandler.logErrors = function() {
            logErrors = true;
        };

        errorHandler.throwErrors = function() {
            logErrors = false;
        };

        return errorHandler;
    });
}