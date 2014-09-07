"use strict";

module.exports = function(mockModule) {
    mockModule.constructor("$globalErrorHandler", ["$window"], constructor);
};

function constructor($window) {
    return recurve.define([
        function ctor(){
            $window.onerror = this.handleError.bind(this);
        },

        {
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
        }
    ]);
}