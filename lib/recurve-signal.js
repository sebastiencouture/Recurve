/**
 *  Created by Sebastien Couture on 2014-7-11.
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

    Recurve.Signal = Recurve.Proto.define([
        function ctor() {
            this._listeners = [];
        },

        {
            add: function(callback, context) {
                if (!callback) {
                    return;
                }

                this._listeners.push(new SignalListener(callback, context));
            },

            addOnce: function(callback, context) {
                if (!callback) {
                    return;
                }

                this._listeners.push(new SignalListener(callback, context, true));
            },

            remove: function(callback) {
                if (!callback) {
                    return;
                }

                for (var index = 0; index < this._listeners.length; index++) {
                    var possibleListener = this._listeners[index];

                    if (possibleListener.isSame(callback)) {
                        Recurve.ArrayUtils.removeAt(this._listeners, index)
                        return;
                    }
                }
            },

            removeAll: function() {
                this._listeners = [];
            },

            trigger: function() {
                if (this._disabled) {
                    return;
                }

                for (var index = this._listeners.length - 1; 0 <= index; index--) {
                    var listener = this._listeners[index];

                    listener.trigger(arguments);

                    if (listener.onlyOnce) {
                        Recurve.ArrayUtils.removeAt(this._listeners, index);
                    }
                }

            },

            disable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                this._disabled = value;
            }
        }
    ]);

    var SignalListener = Recurve.Proto.define([
        function ctor(callback, context, onlyOnce) {
           this._callback = callback;
           this._context = context;
           this.onlyOnce = onlyOnce;
        },

        {
            isSame: function(callback) {
                return this._callback === callback;
            },

            trigger: function(args) {
                this._callback.apply(this._context, args);
            }
        }
    ]);

})();