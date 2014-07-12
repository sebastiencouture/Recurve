/**
 *  Created by Sebastien Couture on 2014-7-8.
 *  Copyright (c) 2014 Sebastien Couture. All rights reserved.
 *
 *  Permission is hereby granted, free of charge, to any person
 *  obtaining a copy of this software and associated documentation
 *  files (the "Software"), to deal in the Software without
 *  restriction, including without limitation the rights to use,
 *  copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *  OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.GlobalErrorHandler = Recurve.Proto.define([

        /**
         * NOTE, If your JS is hosted on a CDN then the browser will sanitize and exclude all error output
         * unless explicitly enabled. See TODO TBD tutorial link
         *
         * @param onError, callback declaration: onError(description, error), error will be undefined if not supported by browser
         * @param enabled, default true
         * @param preventBrowserHandle, default true
         */
        function ctor(onError, enabled, preventBrowserHandle) {
            if (undefined === enabled) {
                enabled = true;
            }

            if (undefined === preventBrowserHandle) {
                preventBrowserHandle = true;
            }

            this._enabled = enabled;
            this._preventBrowserHandle = preventBrowserHandle;
            this._onError = onError;

            window.onerror = this._errorHandler.bind(this);
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
                    var args = Recurve.ArrayUtils.argumentsToArray(arguments, 1);
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

                if (Recurve.ObjectUtils.isString(error)) {
                    description = error;
                }
                else if (Recurve.ObjectUtils.isError(error)) {
                    description = error.message + "\n" + error.stack;
                }
                else if (Recurve.ObjectUtils.isObject(error)) {
                    description = JSON.stringify(error);
                }
                else
                {
                    description = error.toString();
                }

                return description;
            },

            _errorHandler: function(message, filename, line, column, error) {
                if (!this._enabled) {
                    return;
                }

                var description = Recurve.StringUtils.format(
                    "message: {0}, file: {1}, line: {2}", message, filename, line);

                if (error)
                {
                    description += Recurve.StringUtils.format(", stack: {0}", error.stack);
                }

                if (this._onError)
                {
                    this._onError(error, description);
                }

                return this._preventBrowserHandle;
            }
        }
    ]);
})();