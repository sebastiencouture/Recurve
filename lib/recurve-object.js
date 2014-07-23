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

    var bindCtor = function() {};

    Recurve.ObjectUtils =
    {
        forEach: function(obj, iterator, context) {
            if (!obj) {
                return;
            }

            if (obj.forEach && obj.forEach === Object.forEach) {
                obj.forEach(iterator, context);
            }
            else if (Recurve.ObjectUtils.isArray(obj) && obj.length) {
                for (var index = 0; index < obj.length; index++) {
                    if (false === iterator.call(context, obj[index], index, obj)) {
                        return;
                    }
                }
            }
            else {
                var keys = Recurve.ObjectUtils.keys(obj);
                for (var index = 0; index < keys.length; index++) {
                    if (false === iterator.call(context, obj[keys[index]], keys[index], obj)) {
                        return;
                    }
                }
            }

            return keys;
        },

        keys: function(obj) {
            if (!Recurve.ObjectUtils.isObject(obj)) {
                return [];
            }

            if (Object.keys) {
                return Object.keys(obj);
            }

            var keys = [];

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            return keys;
        }

        isString: function(value) {
            return (value instanceof String || "string" == typeof value);
        },

        isError: function(value) {
            return value instanceof Error;
        },

        isObject: function(value) {
            return value === Object(value);
        },

        isArray: function(value) {
            return value instanceof Array;
        },

        isFunction: function(value) {
            return "function" == typeof value;
        },

        isDate: function(value) {
            return value instanceof Date;
        },

        isFile: function(value) {
            return "[object File]" === String(data);
        },

        bind: function(func, context) {
            // Based heavily on underscore/firefox implementation. TODO TBD make underscore.js dependency of
            // this library instead?

            if (!Recurve.ObjectUtils.isFunction(func)) {
                throw new TypeError("not a function");
            }

            if (Function.prototype.bind) {
                return Function.prototype.bind.apply(func, Array.prototype.slice.call(arguments, 1));
            }

            var args = Array.prototype.slice.call(arguments, 2);

            var bound = function() {
                if (!(this instanceof bound)) {
                    return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
                }

                bindCtor.prototype = func.prototype;
                var that = new bindCtor();
                bindCtor.prototype = null;

                var result = func.apply(that, args.concat(Array.prototype.slice.call(arguments)));
                if (Object(result) === result) {
                    return result;
                }

                return that;
            };

            return bound;
        },

        extend: function(dest, src) {
            if (!src) {
                return;
            }

            for (key in src) {
                dest[key] = src[key];
            }

            return dest;
        },

        toJson: function(obj) {
            if (!Recurve.ObjectUtils.isObject(obj)) {
                throw new Error("not an object to convert to JSON");
            }

            return JSON.stringify(obj);
        },

        fromJson: function(str) {
            if (!str) {
                return null;
            }

            return JSON.parse(str);
        },

        toFormData: function(obj) {
            if (!obj) {
                return null;
            }

            var values = [];

            Recurve.ObjectUtils.forEach(obj, function(value, key) {
                values.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            });

            return values.join("&");
        }
    };


})();