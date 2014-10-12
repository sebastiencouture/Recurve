"use strict";

function addErrorHandlerService(module) {
    module.factory("$errorHandler", ["$log"], function($log) {
        function errorHandler(error) {
            $log.error(error);
        }

        errorHandler.protectedInvoke = function(fn) {
            try {
                fn();
            }
            catch (error) {
                this(error);
            }
        };

        return errorHandler;
    });
}