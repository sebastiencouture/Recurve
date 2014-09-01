"use strict";

module.exports = function(mockModule) {
    mockModule.constructor("$globalErrorHandler", ["$window"], GlobalErrorHandler);
};

function GlobalErrorHandler($window) {
    $window.onerror = this.handleError.bind(this);
}

GlobalErrorHandler.prototype = {
    protectedInvoke: function(method) {
        var args = Array.prototype.slice.call(arguments, 1);
        method.apply(null, args);
    },

    handleError: function(error) {
        throw error;
    },

    describeError: function(error) {
        return error;
    },

    setOnError: function(value) {
        // do nothing
    }
};