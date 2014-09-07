"use strict";

var Proto = require("../utils/proto.js");
var StringUtils = require("../utils/string.js");
var ObjectUtils = require("../utils/object.js");
var ArrayUtils = require("../utils/array.js");

module.exports = function(recurveModule) {
    recurveModule.factory("$GlobalErrorHandler", ["$window"], constructor);
    recurveModule.instance("$globalErrorHandler", "$GlobalErrorHandler", function() {
        var onError;
        var enabled = true;
        var preventBrowserHandle = true;

        return {
            setOnError: function(value) {
                onError = value;
            },

            setEnabled: function(value) {
                enabled = value;
            },

            setPreventBrowserHandler: function(value) {
                preventBrowserHandle = value;
            },

            $constructor: function($GlobalErrorHandler) {
                return new $GlobalErrorHandler(onError, enabled, preventBrowserHandle);
            }
        };
    });

    recurveModule.configurable("$globalErrorHandler", function() {
        var onError;
        var enabled = true;
        var preventBrowserHandle = true;

        return {
            setOnError: function(value) {
                onError = value;
            },

            setEnabled: function(value) {
                enabled = value;
            },

            setPreventBrowserHandler: function(value) {
                preventBrowserHandle = value;
            },

            $dependencies: [$window],

            $provider: function($window) {
                return new constructor($window)(onError, enabled, preventBrowserHandle);
            }
        }
    });
};

function constructor($window){
    return Proto.define([
        /**
         * NOTE, If your JS is hosted on a CDN then the browser will sanitize and exclude all error output
         * unless explicitly enabled. See TODO TBD tutorial link
         *
         * @param onError, callback declaration: onError(description, error), error will be undefined if not supported by browser
         * @param enabled, default true
         * @param preventBrowserHandle, default true
         */
         function ctor(onError, enabled, preventBrowserHandle) {
            this._enabled = enabled;
            this._preventBrowserHandle = preventBrowserHandle;
            this._onError = onError;

            $window.onerror = this._errorHandler.bind(this);
        },

        {
            /**
             * Wrap method in try..catch and handle error without raising uncaught error
             *
             * @param method
             * @param [, arg2, ..., argN], list of arguments for method
             */
            protectedInvoke: function(method) {
                try {
                    var args = ArrayUtils.argumentsToArray(arguments, 1);
                    method.apply(null, args);
                }
                catch (error) {
                    var description = this.describeError(error);
                    this.handleError(error, description);
                }
            },

            /**
             * Handle error as would be done for uncaught global error
             *
             * @param error, any type of error (string, object, Error)
             * @param description
             */
            handleError: function(error, description) {
                if (this._onError)
                {
                    this._onError(error, description);
                }

                return this._preventBrowserHandle;
            },


            describeError: function(error) {
                if (!error) {
                    return null;
                }

                var description;

                if (ObjectUtils.isString(error)) {
                    description = error;
                }
                else if (ObjectUtils.isError(error)) {
                    description = error.message + "\n" + error.stack;
                }
                else if (ObjectUtils.isObject(error)) {
                    description = JSON.stringify(error);
                }
                else
                {
                    description = error.toString();
                }

                return description;
            },

            setOnError: function(value) {
                this._onError = value;
            },

            _errorHandler: function(message, filename, line, column, error) {
                if (!this._enabled) {
                    return;
                }

                var description = StringUtils.format(
                    "message: {0}, file: {1}, line: {2}", message, filename, line);

                if (error)
                {
                    description += StringUtils.format(", stack: {0}", error.stack);
                }

                if (this._onError)
                {
                    this._onError(error, description);
                }

                return this._preventBrowserHandle;
            }
        }
    ]);
}