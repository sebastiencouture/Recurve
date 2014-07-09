/**
 *  Created by Sebastien Couture on 2014-6-29.
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

    Recurve.Log = Recurve.Proto.define([
        function ctor(enabled) {
            if (undefined === enabled) {
                enabled = true;
            }

            this.disabled(!enabled);
        },

        {
            debug: function(message) {
                if (this._debugDisabled) {
                    return;
                }

                var args = Recurve.ArrayUtils.argumentsToArray(arguments, 1);
                var description = this._description("DEBUG");

                console.log.apply(console, [description, message].concat(args));
            },

            info: function(message) {
                if (this._infoDisabled) {
                    return;
                }

                var args = Recurve.ArrayUtils.argumentsToArray(arguments, 1);
                var description = this._description("INFO");

                console.log.apply(console, [description, message].concat(args));
            },

            warn: function(message) {
                if (this._warnDisabled) {
                    return;
                }

                var args = Recurve.ArrayUtils.argumentsToArray(arguments, 1);
                var description = this._description("WARN");

                console.warn.apply(console, [description, message].concat(args));
            },

            error: function(message) {
                if (this._errorDisabled) {
                    return;
                }

                var args = Recurve.ArrayUtils.argumentsToArray(arguments, 1);
                var description = this._description("ERROR");

                console.error.apply(console, [description, message].concat(args));
            },

            disabled: function(value) {
                if (undefined === value) {
                    value = true;
                }

                this._debugDisabled = value;
                this._infoDisabled = value;
                this._warnDisabled = value;
                this._errorDisabled = value;
            },

            debugDisabled: function(value) {
                if (undefined === value) {
                    value = true;
                }

                this._debugDisabled = value;
            },

            infoDisabled: function(value) {
                if (undefined === value) {
                    value = true;
                }

                this._infoDisabled = value;
            },

            warnDisabled: function(value) {
                if (undefined === value) {
                    value = true;
                }

                this._warnDisabled = value;
            },

            errorDisabled: function(value) {
                if (undefined === value) {
                    value = true;
                }

                this._errorDisabled = value;
            },

            _description: function(type) {
                var time = Recurve.StringUtils.formatTime(new Date());
                return "[" + type + "] " + time;
            }
        }

    ]);
})();