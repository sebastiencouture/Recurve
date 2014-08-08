/*
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

                if (this._listenerExists(callback, context)) {
                    return;
                }

                this._listeners.push(new SignalListener(callback, context));
            },

            addOnce: function(callback, context) {
                if (!callback) {
                    return;
                }

                if (this._listenerExists(callback, context)) {
                    return;
                }

                this._listeners.push(new SignalListener(callback, context, true));
            },

            remove: function(callback, context) {
                for (var index = 0; index < this._listeners.length; index++) {
                    var possibleListener = this._listeners[index];
                    var match;

                    if (!callback) {
                        if (possibleListener.isSameContext(context)) {
                            match = true;
                        }
                    }
                    else if (possibleListener.isSame(callback, context)) {
                        match = true;
                    }
                    else {
                        // do nothing - no match
                    }

                    if (match) {
                        Recurve.ArrayUtils.removeAt(this._listeners, index);

                        // can only be one match if callback specified
                        if (callback) {
                            return;
                        }
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
            },

            _listenerExists: function(callback, context) {
                for (var index = this._listeners.length - 1; 0 <= index; index--) {
                    var listener = this._listeners[index];

                    if (listener.isSame(callback, context)) {
                        return true;
                    }
                }

                return false;
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
            isSame: function(callback, context) {
                if (!context) {
                    return this._callback === callback;
                }

                return this._callback === callback && this._context === context;
            },

            isSameContext: function(context) {
                return this._context === context;
            },

            trigger: function(args) {
                this._callback.apply(this._context, args);
            }
        }
    ]);

})();
*/

"use strict";

var Proto = require("./recurve-proto.js");
var ArrayUtils = require("./recurve-array.js");

module.exports = Proto.define([
    function ctor() {
        this._listeners = [];
    },

    {
        add: function(callback, context) {
            if (!callback) {
                return;
            }

            if (this._listenerExists(callback, context)) {
                return;
            }

            this._listeners.push(new SignalListener(callback, context));
        },

        addOnce: function(callback, context) {
            if (!callback) {
                return;
            }

            if (this._listenerExists(callback, context)) {
                return;
            }

            this._listeners.push(new SignalListener(callback, context, true));
        },

        remove: function(callback, context) {
            for (var index = 0; index < this._listeners.length; index++) {
                var possibleListener = this._listeners[index];
                var match;

                if (!callback) {
                    if (possibleListener.isSameContext(context)) {
                        match = true;
                    }
                }
                else if (possibleListener.isSame(callback, context)) {
                    match = true;
                }
                else {
                    // do nothing - no match
                }

                if (match) {
                    ArrayUtils.removeAt(this._listeners, index);

                    // can only be one match if callback specified
                    if (callback) {
                        return;
                    }
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
                    ArrayUtils.removeAt(this._listeners, index);
                }
            }

        },

        disable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._disabled = value;
        },

        _listenerExists: function(callback, context) {
            for (var index = this._listeners.length - 1; 0 <= index; index--) {
                var listener = this._listeners[index];

                if (listener.isSame(callback, context)) {
                    return true;
                }
            }

            return false;
        }
    }
]);

var SignalListener = Proto.define([
    function ctor(callback, context, onlyOnce) {
        this._callback = callback;
        this._context = context;
        this.onlyOnce = onlyOnce;
    },

    {
        isSame: function(callback, context) {
            if (!context) {
                return this._callback === callback;
            }

            return this._callback === callback && this._context === context;
        },

        isSameContext: function(context) {
            return this._context === context;
        },

        trigger: function(args) {
            this._callback.apply(this._context, args);
        }
    }
]);