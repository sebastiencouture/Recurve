(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = {
    removeItem: function(array, item) {
        if (!array) {
            return;
        }

        var index = array.indexOf(item);

        if (-1 < index) {
            array.splice(index, 1);
        }
    },

    removeAt: function(array, index) {
        if (!array) {
            return;
        }

        if (0 <= index && array.length > index) {
            array.splice(index, 1);
        }
    },

    replaceItem: function(array, item) {
        if (!array) {
            return;
        }

        var index = array.indexOf(item);

        if (-1 < index) {
            array[index] = item;
        }
    },

    isEmpty: function(value) {
        return !value || 0 === value.length;
    },

    argumentsToArray: function(args, sliceCount) {
        return sliceCount < args.length ? Array.prototype.slice.call(args, sliceCount) : [];
    }
};
},{}],2:[function(require,module,exports){
/*
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
*/

"use strict";

module.exports = {
    forEach: function(obj, iterator, context) {
        if (!obj) {
            return;
        }

        if (obj.forEach && obj.forEach === Object.forEach) {
            obj.forEach(iterator, context);
        }
        else if (this.isArray(obj) && obj.length) {
            for (var index = 0; index < obj.length; index++) {
                if (false === iterator.call(context, obj[index], index, obj)) {
                    return;
                }
            }
        }
        else {
            var keys = this.keys(obj);
            for (var index = 0; index < keys.length; index++) {
                if (false === iterator.call(context, obj[keys[index]], keys[index], obj)) {
                    return;
                }
            }
        }

        return keys;
    },

    keys: function(obj) {
        if (!this.isObject(obj)) {
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
    },

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
        // Based heavily on underscore/firefox implementation.

        if (!this.isFunction(func)) {
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
        if (!this.isObject(obj)) {
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

        this.forEach(obj, function(value, key) {
            values.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        });

        return values.join("&");
    }
};


},{}],3:[function(require,module,exports){
//(function() {
//    var Recurve = window.Recurve = window.Recurve || {};
//
//    var dontInvokeConstructor = {};
//
//    function isFunction(value) {
//        return value && "function" == typeof value;
//    }
//
//    Recurve.Proto = function() {
//        // do nothing
//    };
//
//    /**
//     * Create object that inherits from this object
//     *
//     * @param options   array consisting of constructor, prototype/"member" variables/functions,
//     *                  and namespace/"static" variables/function
//     */
//    Recurve.Proto.define = function(options) {
//        if (!options || 0 === options.length) {
//            return this;
//        }
//
//        var possibleConstructor = options[0];
//
//        var properties;
//        var staticProperties;
//
//        if (isFunction(possibleConstructor)) {
//            properties = 1 < options.length ? options[1] : {};
//            properties[ "$ctor" ] = possibleConstructor;
//
//            staticProperties = options[2];
//        }
//        else {
//            properties = options[0];
//            staticProperties = options[1];
//        }
//
//        function ProtoObj(param)
//        {
//            if (dontInvokeConstructor != param &&
//                isFunction(this.$ctor)) {
//                this.$ctor.apply( this, arguments );
//            }
//        };
//
//        ProtoObj.prototype = new this(dontInvokeConstructor);
//
//        // Prototype/"member" properties
//        for (key in properties) {
//            addProtoProperty(key, properties[key], ProtoObj.prototype[key]);
//        }
//
//        function addProtoProperty(key, property, superProperty)
//        {
//            if (!isFunction(property) ||
//                !isFunction(superProperty)) {
//                ProtoObj.prototype[key] = property;
//            }
//            else
//            {
//                // Create function with ref to base method
//                ProtoObj.prototype[key] = function()
//                {
//                    this._super = superProperty;
//                    return property.apply(this, arguments);
//                };
//            }
//        }
//
//        ProtoObj.prototype.constructor = ProtoObj;
//
//        // Namespaced/"Static" properties
//        ProtoObj.extend = this.extend || this.define;
//        ProtoObj.mixin = this.mixin;
//
//        for (key in staticProperties)
//        {
//            ProtoObj[key] = staticProperties[key];
//        }
//
//        return ProtoObj;
//    };
//
//    /**
//     * Mixin a set of variables/functions as prototypes for this object. Any variables/functions
//     * that already exist with the same name will be overridden.
//     *
//     * @param properties    variables/functions to mixin with this object
//     */
//    Recurve.Proto.mixin = function(properties) {
//        Recurve.Proto.mixinWith(this, properties);
//    };
//
//    /**
//     * Mixin a set of variables/functions as prototypes for the object. Any variables/functions
//     * that already exist with the same name will be overridden.
//     *
//     * @param properties    variables/functions to mixin with this object
//     */
//    Recurve.Proto.mixinWith = function(obj, properties) {
//        for (key in properties) {
//            obj.prototype[key] = properties[key];
//        }
//    };
//})();

var dontInvokeConstructor = {};

function isFunction(value) {
    return value && "function" == typeof value;
}

var Proto = function() {
    // do nothing
};

/**
 * Create object that inherits from this object
 *
 * @param options   array consisting of constructor, prototype/"member" variables/functions,
 *                  and namespace/"static" variables/function
 */
Proto.define = function(options) {
    if (!options || 0 === options.length) {
        return this;
    }

    var possibleConstructor = options[0];

    var properties;
    var staticProperties;

    if (isFunction(possibleConstructor)) {
        properties = 1 < options.length ? options[1] : {};
        properties[ "$ctor" ] = possibleConstructor;

        staticProperties = options[2];
    }
    else {
        properties = options[0];
        staticProperties = options[1];
    }

    function ProtoObj(param)
    {
        if (dontInvokeConstructor != param &&
            isFunction(this.$ctor)) {
            this.$ctor.apply( this, arguments );
        }
    }

    ProtoObj.prototype = new this(dontInvokeConstructor);

    // Prototype/"member" properties
    for (key in properties) {
        addProtoProperty(key, properties[key], ProtoObj.prototype[key]);
    }

    function addProtoProperty(key, property, superProperty)
    {
        if (!isFunction(property) ||
            !isFunction(superProperty)) {
            ProtoObj.prototype[key] = property;
        }
        else
        {
            // Create function with ref to base method
            ProtoObj.prototype[key] = function()
            {
                this._super = superProperty;
                return property.apply(this, arguments);
            };
        }
    }

    ProtoObj.prototype.constructor = ProtoObj;

    // Namespaced/"Static" properties
    ProtoObj.extend = this.extend || this.define;
    ProtoObj.mixin = this.mixin;

    for (key in staticProperties)
    {
        ProtoObj[key] = staticProperties[key];
    }

    return ProtoObj;
};

/**
 * Mixin a set of variables/functions as prototypes for this object. Any variables/functions
 * that already exist with the same name will be overridden.
 *
 * @param properties    variables/functions to mixin with this object
 */
Proto.mixin = function(properties) {
    Proto.mixinWith(this, properties);
};

/**
 * Mixin a set of variables/functions as prototypes for the object. Any variables/functions
 * that already exist with the same name will be overridden.
 *
 * @param properties    variables/functions to mixin with this object
 */
Proto.mixinWith = function(obj, properties) {
    for (key in properties) {
        obj.prototype[key] = properties[key];
    }
};

module.exports = Proto;
},{}],4:[function(require,module,exports){
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
},{"./recurve-array.js":1,"./recurve-proto.js":3}],5:[function(require,module,exports){
var ObjectUtils = require("../src/recurve-object.js");

describe("Recurve.Object", function() {

    describe("Objects", function() {
        var object;

        it("should detect {}", function() {
            object = {};
            expect(ObjectUtils.isObject(object)).toBe(true);
        });

        it("should detect new Object()", function() {
            object = new Object();
            expect(ObjectUtils.isObject(object)).toBe(true);
        });

        it("should detect {} with properties", function() {
            object = {name: "Sebastien"};
            expect(ObjectUtils.isObject(object)).toBe(true);
        });

        it("should NOT detect number", function() {
            object = 123;
            expect(ObjectUtils.isObject(object)).toBe(false);
        });
    });

    describe("Errors", function() {
        var error;

        it("should detect new Error()", function() {
            error = new Error();
            expect(ObjectUtils.isError(error)).toBe(true);
        });

        it("should NOT detect number", function() {
            error = 123;
            expect(ObjectUtils.isError(error)).toBe(false);
        });
    });

    describe("Strings", function() {
        var string;

        it("should detect empty string", function() {
            string = "";
            expect(ObjectUtils.isString(string)).toBe(true);
        });

        it("should detect string", function() {
            string = "test string";
            expect(ObjectUtils.isString(string)).toBe(true);
        });

        it("should detect new String()", function() {
            string = new String("test string");
            expect(ObjectUtils.isString(string)).toBe(true);
        });

        it("should NOT detect number", function() {
            string = 123;
            expect(ObjectUtils.isString(string)).toBe(false);
        });
    });

    describe("Arrays", function() {
        var array;

        it("should detect empty array", function() {
            array = [];
            expect(ObjectUtils.isArray(array)).toBe(true);
        });

        it("should detect array with items", function() {
            array = [1, 2];
            expect(ObjectUtils.isArray(array)).toBe(true);
        });

        it("should detect new Array()", function() {
            array = new Array();
            expect(ObjectUtils.isArray(array)).toBe(true);
        });

        it("should detect new Array() with items", function() {
            array = new Array(1, 2);
            expect(ObjectUtils.isArray(array)).toBe(true);
        });

        it("should NOT detect number", function() {
            array = 123;
            expect(ObjectUtils.isArray(array)).toBe(false);
        });
    });

    describe("Functions", function() {
        var func;

        it("should detect anonymous function", function() {
            func = function(){};
            expect(ObjectUtils.isFunction(func)).toBe(true);
        });

        it("should NOT detect number", function() {
            func = 123;
            expect(ObjectUtils.isFunction(func)).toBe(false);
        });
    });
});
},{"../src/recurve-object.js":2}],6:[function(require,module,exports){
var Signal = require("../src/recurve-signal.js");

describe("Recurve.Signal", function() {
    var signal;
    var triggered;
    var triggerCount;

    beforeEach(function() {
        signal = new Signal();
        triggered = false;
        triggerCount = 0;
    });

    it("should add with no arguments", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.trigger();

        expect(triggered).toBe(true);
    });

    it("should add with arguments", function() {
        function onTrigger(name, location) {
            expect(arguments.length).toEqual(2);
            expect(name).toMatch("Sebastien");
            expect(location).toMatch("New Westminster");

            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.trigger("Sebastien", "New Westminster");

        expect(triggered).toBe(true);
    });

    it("should add once", function() {
        function onTrigger() {
            triggerCount++;
        }

        signal.addOnce(onTrigger, this);
        signal.trigger();
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should add multiple", function() {
        var firstTriggered;
        var secondTriggered;

        function onTriggerFirst() {
            triggerCount++;
            firstTriggered = true;
        }

        function onTriggerSecond() {
            secondTriggered = true;
            triggerCount++;
        }

        signal.add(onTriggerFirst, this);
        signal.add(onTriggerSecond, this);
        signal.trigger();

        expect(firstTriggered).toBe(true);
        expect(secondTriggered).toBe(true);
        expect(triggerCount).toEqual(2);
    });

    it("should ignore duplicate callbacks", function() {
        function onTrigger() {
            triggerCount++;
        }

        signal.add(onTrigger, this);
        signal.add(onTrigger, this);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should handle null callbacks", function() {
        signal.add(null, this);
        signal.trigger();

        expect(triggered).toBe(false);
    });

    it("should remove", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.remove(onTrigger);
        signal.trigger();

        expect(triggered).toBe(false);
    });

    it("should remove all", function() {
        function onTriggerFirst() {
            triggerCount++;
        }

        function onTriggerSecond() {
            triggerCount++;
        }

        signal.add(onTriggerFirst, this);
        signal.add(onTriggerSecond, this);
        signal.removeAll();
        signal.trigger();

        expect(triggerCount).toEqual(0);
    });

    it("should remove only second", function() {
        function onTriggerFirst() {
            triggerCount++;
        }

        function onTriggerSecond() {
            triggerCount++;
        }

        signal.add(onTriggerFirst, this);
        signal.add(onTriggerSecond, this);
        signal.remove(onTriggerSecond);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should only remove all with same context", function() {
        function onTriggerFirst() {
            triggerCount++;
        }

        function onTriggerSecond() {
            triggerCount++;
        }

        function onTriggerThird() {
            triggerCount++;
        }

        signal.add(onTriggerFirst, this);
        signal.add(onTriggerSecond, this);
        signal.add(onTriggerThird, {});
        signal.remove(null, this);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should remove none if no callback, or context", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.remove();
        signal.trigger();

        expect(triggered).toBe(true);
    });

    it("should disable", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.disable();
        signal.trigger();

        expect(triggered).toBe(false);
    });

    it("should use correct context on callback", function() {
        var that = this;

        function onTrigger() {
            expect(this).toBe(that);
        }

        signal.add(onTrigger, this);
        signal.trigger();
    });
});
},{"../src/recurve-signal.js":4}]},{},[5,6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3JlY3VydmUtYXJyYXkuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLW9iamVjdC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvc3JjL3JlY3VydmUtcHJvdG8uanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3NyYy9yZWN1cnZlLXNpZ25hbC5qcyIsIi9Vc2Vycy9zZWJhc3RpZW5jb3V0dXJlL0RvY3VtZW50cy9zdm4vcGVyc29uYWwvanMvUHJvZHVjdHMvTGlicmFyaWVzL1JlY3VydmUvdGVzdHMvb2JqZWN0LnRlc3QuanMiLCIvVXNlcnMvc2ViYXN0aWVuY291dHVyZS9Eb2N1bWVudHMvc3ZuL3BlcnNvbmFsL2pzL1Byb2R1Y3RzL0xpYnJhcmllcy9SZWN1cnZlL3Rlc3RzL3NpZ25hbC50ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbW92ZUl0ZW06IGZ1bmN0aW9uKGFycmF5LCBpdGVtKSB7XG4gICAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG5cbiAgICAgICAgaWYgKC0xIDwgaW5kZXgpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlQXQ6IGZ1bmN0aW9uKGFycmF5LCBpbmRleCkge1xuICAgICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoMCA8PSBpbmRleCAmJiBhcnJheS5sZW5ndGggPiBpbmRleCkge1xuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXBsYWNlSXRlbTogZnVuY3Rpb24oYXJyYXksIGl0ZW0pIHtcbiAgICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblxuICAgICAgICBpZiAoLTEgPCBpbmRleCkge1xuICAgICAgICAgICAgYXJyYXlbaW5kZXhdID0gaXRlbTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gIXZhbHVlIHx8IDAgPT09IHZhbHVlLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgYXJndW1lbnRzVG9BcnJheTogZnVuY3Rpb24oYXJncywgc2xpY2VDb3VudCkge1xuICAgICAgICByZXR1cm4gc2xpY2VDb3VudCA8IGFyZ3MubGVuZ3RoID8gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgc2xpY2VDb3VudCkgOiBbXTtcbiAgICB9XG59OyIsIi8qXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlID0gd2luZG93LlJlY3VydmUgfHwge307XG5cbiAgICB2YXIgYmluZEN0b3IgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgUmVjdXJ2ZS5PYmplY3RVdGlscyA9XG4gICAge1xuICAgICAgICBmb3JFYWNoOiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9iai5mb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBPYmplY3QuZm9yRWFjaCkge1xuICAgICAgICAgICAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKFJlY3VydmUuT2JqZWN0VXRpbHMuaXNBcnJheShvYmopICYmIG9iai5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgb2JqLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2luZGV4XSwgaW5kZXgsIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gUmVjdXJ2ZS5PYmplY3RVdGlscy5rZXlzKG9iaik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmYWxzZSA9PT0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5c1tpbmRleF1dLCBrZXlzW2luZGV4XSwgb2JqKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgfSxcblxuICAgICAgICBrZXlzOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgIGlmICghUmVjdXJ2ZS5PYmplY3RVdGlscy5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8IFwic3RyaW5nXCIgPT0gdHlwZW9mIHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0Vycm9yOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRXJyb3I7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNPYmplY3Q6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IE9iamVjdCh2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNBcnJheTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJmdW5jdGlvblwiID09IHR5cGVvZiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0RhdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzRmlsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBcIltvYmplY3QgRmlsZV1cIiA9PT0gU3RyaW5nKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGJpbmQ6IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIEJhc2VkIGhlYXZpbHkgb24gdW5kZXJzY29yZS9maXJlZm94IGltcGxlbWVudGF0aW9uLiBUT0RPIFRCRCBtYWtlIHVuZGVyc2NvcmUuanMgZGVwZW5kZW5jeSBvZlxuICAgICAgICAgICAgLy8gdGhpcyBsaWJyYXJ5IGluc3RlYWQ/XG5cbiAgICAgICAgICAgIGlmICghUmVjdXJ2ZS5PYmplY3RVdGlscy5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoZnVuYywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcblxuICAgICAgICAgICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYmluZEN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSBuZXcgYmluZEN0b3IoKTtcbiAgICAgICAgICAgICAgICBiaW5kQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhhdCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gYm91bmQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0ZW5kOiBmdW5jdGlvbihkZXN0LCBzcmMpIHtcbiAgICAgICAgICAgIGlmICghc3JjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9Kc29uOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgIGlmICghUmVjdXJ2ZS5PYmplY3RVdGlscy5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGFuIG9iamVjdCB0byBjb252ZXJ0IHRvIEpTT05cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZyb21Kc29uOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIGlmICghc3RyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHN0cik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9Gb3JtRGF0YTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICAgICAgICAgIFJlY3VydmUuT2JqZWN0VXRpbHMuZm9yRWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKFwiJlwiKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxufSkoKTtcbiovXG5cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2JqLmZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IE9iamVjdC5mb3JFYWNoKSB7XG4gICAgICAgICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc0FycmF5KG9iaikgJiYgb2JqLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IG9iai5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2luZGV4XSwgaW5kZXgsIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBrZXlzID0gdGhpcy5rZXlzKG9iaik7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwga2V5cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleXNbaW5kZXhdXSwga2V5c1tpbmRleF0sIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG5cbiAgICBrZXlzOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8IFwic3RyaW5nXCIgPT0gdHlwZW9mIHZhbHVlKTtcbiAgICB9LFxuXG4gICAgaXNFcnJvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRXJyb3I7XG4gICAgfSxcblxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IE9iamVjdCh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5O1xuICAgIH0sXG5cbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gXCJmdW5jdGlvblwiID09IHR5cGVvZiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgaXNEYXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICBpc0ZpbGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBcIltvYmplY3QgRmlsZV1cIiA9PT0gU3RyaW5nKGRhdGEpO1xuICAgIH0sXG5cbiAgICBiaW5kOiBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgICAgIC8vIEJhc2VkIGhlYXZpbHkgb24gdW5kZXJzY29yZS9maXJlZm94IGltcGxlbWVudGF0aW9uLlxuXG4gICAgICAgIGlmICghdGhpcy5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseShmdW5jLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcblxuICAgICAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJpbmRDdG9yLnByb3RvdHlwZSA9IGZ1bmMucHJvdG90eXBlO1xuICAgICAgICAgICAgdmFyIHRoYXQgPSBuZXcgYmluZEN0b3IoKTtcbiAgICAgICAgICAgIGJpbmRDdG9yLnByb3RvdHlwZSA9IG51bGw7XG5cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoYXQsIGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGJvdW5kO1xuICAgIH0sXG5cbiAgICBleHRlbmQ6IGZ1bmN0aW9uKGRlc3QsIHNyYykge1xuICAgICAgICBpZiAoIXNyYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH0sXG5cbiAgICB0b0pzb246IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoIXRoaXMuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGFuIG9iamVjdCB0byBjb252ZXJ0IHRvIEpTT05cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICB9LFxuXG4gICAgZnJvbUpzb246IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBpZiAoIXN0cikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xuICAgIH0sXG5cbiAgICB0b0Zvcm1EYXRhOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKFwiJlwiKTtcbiAgICB9XG59O1xuXG4iLCIvLyhmdW5jdGlvbigpIHtcbi8vICAgIHZhciBSZWN1cnZlID0gd2luZG93LlJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSB8fCB7fTtcbi8vXG4vLyAgICB2YXIgZG9udEludm9rZUNvbnN0cnVjdG9yID0ge307XG4vL1xuLy8gICAgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuLy8gICAgICAgIHJldHVybiB2YWx1ZSAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHZhbHVlO1xuLy8gICAgfVxuLy9cbi8vICAgIFJlY3VydmUuUHJvdG8gPSBmdW5jdGlvbigpIHtcbi8vICAgICAgICAvLyBkbyBub3RoaW5nXG4vLyAgICB9O1xuLy9cbi8vICAgIC8qKlxuLy8gICAgICogQ3JlYXRlIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhpcyBvYmplY3Rcbi8vICAgICAqXG4vLyAgICAgKiBAcGFyYW0gb3B0aW9ucyAgIGFycmF5IGNvbnNpc3Rpbmcgb2YgY29uc3RydWN0b3IsIHByb3RvdHlwZS9cIm1lbWJlclwiIHZhcmlhYmxlcy9mdW5jdGlvbnMsXG4vLyAgICAgKiAgICAgICAgICAgICAgICAgIGFuZCBuYW1lc3BhY2UvXCJzdGF0aWNcIiB2YXJpYWJsZXMvZnVuY3Rpb25cbi8vICAgICAqL1xuLy8gICAgUmVjdXJ2ZS5Qcm90by5kZWZpbmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4vLyAgICAgICAgaWYgKCFvcHRpb25zIHx8IDAgPT09IG9wdGlvbnMubGVuZ3RoKSB7XG4vLyAgICAgICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgdmFyIHBvc3NpYmxlQ29uc3RydWN0b3IgPSBvcHRpb25zWzBdO1xuLy9cbi8vICAgICAgICB2YXIgcHJvcGVydGllcztcbi8vICAgICAgICB2YXIgc3RhdGljUHJvcGVydGllcztcbi8vXG4vLyAgICAgICAgaWYgKGlzRnVuY3Rpb24ocG9zc2libGVDb25zdHJ1Y3RvcikpIHtcbi8vICAgICAgICAgICAgcHJvcGVydGllcyA9IDEgPCBvcHRpb25zLmxlbmd0aCA/IG9wdGlvbnNbMV0gOiB7fTtcbi8vICAgICAgICAgICAgcHJvcGVydGllc1sgXCIkY3RvclwiIF0gPSBwb3NzaWJsZUNvbnN0cnVjdG9yO1xuLy9cbi8vICAgICAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMl07XG4vLyAgICAgICAgfVxuLy8gICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICBwcm9wZXJ0aWVzID0gb3B0aW9uc1swXTtcbi8vICAgICAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMV07XG4vLyAgICAgICAgfVxuLy9cbi8vICAgICAgICBmdW5jdGlvbiBQcm90b09iaihwYXJhbSlcbi8vICAgICAgICB7XG4vLyAgICAgICAgICAgIGlmIChkb250SW52b2tlQ29uc3RydWN0b3IgIT0gcGFyYW0gJiZcbi8vICAgICAgICAgICAgICAgIGlzRnVuY3Rpb24odGhpcy4kY3RvcikpIHtcbi8vICAgICAgICAgICAgICAgIHRoaXMuJGN0b3IuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgfTtcbi8vXG4vLyAgICAgICAgUHJvdG9PYmoucHJvdG90eXBlID0gbmV3IHRoaXMoZG9udEludm9rZUNvbnN0cnVjdG9yKTtcbi8vXG4vLyAgICAgICAgLy8gUHJvdG90eXBlL1wibWVtYmVyXCIgcHJvcGVydGllc1xuLy8gICAgICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbi8vICAgICAgICAgICAgYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnRpZXNba2V5XSwgUHJvdG9PYmoucHJvdG90eXBlW2tleV0pO1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgZnVuY3Rpb24gYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnR5LCBzdXBlclByb3BlcnR5KVxuLy8gICAgICAgIHtcbi8vICAgICAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHByb3BlcnR5KSB8fFxuLy8gICAgICAgICAgICAgICAgIWlzRnVuY3Rpb24oc3VwZXJQcm9wZXJ0eSkpIHtcbi8vICAgICAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydHk7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgZWxzZVxuLy8gICAgICAgICAgICB7XG4vLyAgICAgICAgICAgICAgICAvLyBDcmVhdGUgZnVuY3Rpb24gd2l0aCByZWYgdG8gYmFzZSBtZXRob2Rcbi8vICAgICAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24oKVxuLy8gICAgICAgICAgICAgICAge1xuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gc3VwZXJQcm9wZXJ0eTtcbi8vICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbi8vICAgICAgICAgICAgICAgIH07XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIFByb3RvT2JqLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFByb3RvT2JqO1xuLy9cbi8vICAgICAgICAvLyBOYW1lc3BhY2VkL1wiU3RhdGljXCIgcHJvcGVydGllc1xuLy8gICAgICAgIFByb3RvT2JqLmV4dGVuZCA9IHRoaXMuZXh0ZW5kIHx8IHRoaXMuZGVmaW5lO1xuLy8gICAgICAgIFByb3RvT2JqLm1peGluID0gdGhpcy5taXhpbjtcbi8vXG4vLyAgICAgICAgZm9yIChrZXkgaW4gc3RhdGljUHJvcGVydGllcylcbi8vICAgICAgICB7XG4vLyAgICAgICAgICAgIFByb3RvT2JqW2tleV0gPSBzdGF0aWNQcm9wZXJ0aWVzW2tleV07XG4vLyAgICAgICAgfVxuLy9cbi8vICAgICAgICByZXR1cm4gUHJvdG9PYmo7XG4vLyAgICB9O1xuLy9cbi8vICAgIC8qKlxuLy8gICAgICogTWl4aW4gYSBzZXQgb2YgdmFyaWFibGVzL2Z1bmN0aW9ucyBhcyBwcm90b3R5cGVzIGZvciB0aGlzIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbi8vICAgICAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuLy8gICAgICpcbi8vICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuLy8gICAgICovXG4vLyAgICBSZWN1cnZlLlByb3RvLm1peGluID0gZnVuY3Rpb24ocHJvcGVydGllcykge1xuLy8gICAgICAgIFJlY3VydmUuUHJvdG8ubWl4aW5XaXRoKHRoaXMsIHByb3BlcnRpZXMpO1xuLy8gICAgfTtcbi8vXG4vLyAgICAvKipcbi8vICAgICAqIE1peGluIGEgc2V0IG9mIHZhcmlhYmxlcy9mdW5jdGlvbnMgYXMgcHJvdG90eXBlcyBmb3IgdGhlIG9iamVjdC4gQW55IHZhcmlhYmxlcy9mdW5jdGlvbnNcbi8vICAgICAqIHRoYXQgYWxyZWFkeSBleGlzdCB3aXRoIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBvdmVycmlkZGVuLlxuLy8gICAgICpcbi8vICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgIHZhcmlhYmxlcy9mdW5jdGlvbnMgdG8gbWl4aW4gd2l0aCB0aGlzIG9iamVjdFxuLy8gICAgICovXG4vLyAgICBSZWN1cnZlLlByb3RvLm1peGluV2l0aCA9IGZ1bmN0aW9uKG9iaiwgcHJvcGVydGllcykge1xuLy8gICAgICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbi8vICAgICAgICAgICAgb2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuLy8gICAgICAgIH1cbi8vICAgIH07XG4vL30pKCk7XG5cbnZhciBkb250SW52b2tlQ29uc3RydWN0b3IgPSB7fTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHZhbHVlO1xufVxuXG52YXIgUHJvdG8gPSBmdW5jdGlvbigpIHtcbiAgICAvLyBkbyBub3RoaW5nXG59O1xuXG4vKipcbiAqIENyZWF0ZSBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIG9wdGlvbnMgICBhcnJheSBjb25zaXN0aW5nIG9mIGNvbnN0cnVjdG9yLCBwcm90b3R5cGUvXCJtZW1iZXJcIiB2YXJpYWJsZXMvZnVuY3Rpb25zLFxuICogICAgICAgICAgICAgICAgICBhbmQgbmFtZXNwYWNlL1wic3RhdGljXCIgdmFyaWFibGVzL2Z1bmN0aW9uXG4gKi9cblByb3RvLmRlZmluZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMgfHwgMCA9PT0gb3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIHBvc3NpYmxlQ29uc3RydWN0b3IgPSBvcHRpb25zWzBdO1xuXG4gICAgdmFyIHByb3BlcnRpZXM7XG4gICAgdmFyIHN0YXRpY1Byb3BlcnRpZXM7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihwb3NzaWJsZUNvbnN0cnVjdG9yKSkge1xuICAgICAgICBwcm9wZXJ0aWVzID0gMSA8IG9wdGlvbnMubGVuZ3RoID8gb3B0aW9uc1sxXSA6IHt9O1xuICAgICAgICBwcm9wZXJ0aWVzWyBcIiRjdG9yXCIgXSA9IHBvc3NpYmxlQ29uc3RydWN0b3I7XG5cbiAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcm9wZXJ0aWVzID0gb3B0aW9uc1swXTtcbiAgICAgICAgc3RhdGljUHJvcGVydGllcyA9IG9wdGlvbnNbMV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUHJvdG9PYmoocGFyYW0pXG4gICAge1xuICAgICAgICBpZiAoZG9udEludm9rZUNvbnN0cnVjdG9yICE9IHBhcmFtICYmXG4gICAgICAgICAgICBpc0Z1bmN0aW9uKHRoaXMuJGN0b3IpKSB7XG4gICAgICAgICAgICB0aGlzLiRjdG9yLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFByb3RvT2JqLnByb3RvdHlwZSA9IG5ldyB0aGlzKGRvbnRJbnZva2VDb25zdHJ1Y3Rvcik7XG5cbiAgICAvLyBQcm90b3R5cGUvXCJtZW1iZXJcIiBwcm9wZXJ0aWVzXG4gICAgZm9yIChrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgICBhZGRQcm90b1Byb3BlcnR5KGtleSwgcHJvcGVydGllc1trZXldLCBQcm90b09iai5wcm90b3R5cGVba2V5XSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkUHJvdG9Qcm9wZXJ0eShrZXksIHByb3BlcnR5LCBzdXBlclByb3BlcnR5KVxuICAgIHtcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHByb3BlcnR5KSB8fFxuICAgICAgICAgICAgIWlzRnVuY3Rpb24oc3VwZXJQcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydHk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgZnVuY3Rpb24gd2l0aCByZWYgdG8gYmFzZSBtZXRob2RcbiAgICAgICAgICAgIFByb3RvT2JqLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gc3VwZXJQcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQcm90b09iai5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQcm90b09iajtcblxuICAgIC8vIE5hbWVzcGFjZWQvXCJTdGF0aWNcIiBwcm9wZXJ0aWVzXG4gICAgUHJvdG9PYmouZXh0ZW5kID0gdGhpcy5leHRlbmQgfHwgdGhpcy5kZWZpbmU7XG4gICAgUHJvdG9PYmoubWl4aW4gPSB0aGlzLm1peGluO1xuXG4gICAgZm9yIChrZXkgaW4gc3RhdGljUHJvcGVydGllcylcbiAgICB7XG4gICAgICAgIFByb3RvT2JqW2tleV0gPSBzdGF0aWNQcm9wZXJ0aWVzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb3RvT2JqO1xufTtcblxuLyoqXG4gKiBNaXhpbiBhIHNldCBvZiB2YXJpYWJsZXMvZnVuY3Rpb25zIGFzIHByb3RvdHlwZXMgZm9yIHRoaXMgb2JqZWN0LiBBbnkgdmFyaWFibGVzL2Z1bmN0aW9uc1xuICogdGhhdCBhbHJlYWR5IGV4aXN0IHdpdGggdGhlIHNhbWUgbmFtZSB3aWxsIGJlIG92ZXJyaWRkZW4uXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgICAgdmFyaWFibGVzL2Z1bmN0aW9ucyB0byBtaXhpbiB3aXRoIHRoaXMgb2JqZWN0XG4gKi9cblByb3RvLm1peGluID0gZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgIFByb3RvLm1peGluV2l0aCh0aGlzLCBwcm9wZXJ0aWVzKTtcbn07XG5cbi8qKlxuICogTWl4aW4gYSBzZXQgb2YgdmFyaWFibGVzL2Z1bmN0aW9ucyBhcyBwcm90b3R5cGVzIGZvciB0aGUgb2JqZWN0LiBBbnkgdmFyaWFibGVzL2Z1bmN0aW9uc1xuICogdGhhdCBhbHJlYWR5IGV4aXN0IHdpdGggdGhlIHNhbWUgbmFtZSB3aWxsIGJlIG92ZXJyaWRkZW4uXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgICAgdmFyaWFibGVzL2Z1bmN0aW9ucyB0byBtaXhpbiB3aXRoIHRoaXMgb2JqZWN0XG4gKi9cblByb3RvLm1peGluV2l0aCA9IGZ1bmN0aW9uKG9iaiwgcHJvcGVydGllcykge1xuICAgIGZvciAoa2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgb2JqLnByb3RvdHlwZVtrZXldID0gcHJvcGVydGllc1trZXldO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG87IiwiLypcbihmdW5jdGlvbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFJlY3VydmUgPSB3aW5kb3cuUmVjdXJ2ZSA9IHdpbmRvdy5SZWN1cnZlIHx8IHt9O1xuXG4gICAgUmVjdXJ2ZS5TaWduYWwgPSBSZWN1cnZlLlByb3RvLmRlZmluZShbXG4gICAgICAgIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyRXhpc3RzKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobmV3IFNpZ25hbExpc3RlbmVyKGNhbGxiYWNrLCBjb250ZXh0KSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBhZGRPbmNlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lckV4aXN0cyhjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKG5ldyBTaWduYWxMaXN0ZW5lcihjYWxsYmFjaywgY29udGV4dCwgdHJ1ZSkpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NzaWJsZUxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZUxpc3RlbmVyLmlzU2FtZUNvbnRleHQoY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocG9zc2libGVMaXN0ZW5lci5pc1NhbWUoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nIC0gbm8gbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVjdXJ2ZS5BcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW4gb25seSBiZSBvbmUgbWF0Y2ggaWYgY2FsbGJhY2sgc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICByZW1vdmVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGggLSAxOyAwIDw9IGluZGV4OyBpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpbmRleF07XG5cbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIudHJpZ2dlcihhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmx5T25jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVjdXJ2ZS5BcnJheVV0aWxzLnJlbW92ZUF0KHRoaXMuX2xpc3RlbmVycywgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgX2xpc3RlbmVyRXhpc3RzOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCAtIDE7IDAgPD0gaW5kZXg7IGluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuaXNTYW1lKGNhbGxiYWNrLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBdKTtcblxuICAgIHZhciBTaWduYWxMaXN0ZW5lciA9IFJlY3VydmUuUHJvdG8uZGVmaW5lKFtcbiAgICAgICAgZnVuY3Rpb24gY3RvcihjYWxsYmFjaywgY29udGV4dCwgb25seU9uY2UpIHtcbiAgICAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgIHRoaXMub25seU9uY2UgPSBvbmx5T25jZTtcbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICBpc1NhbWU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjayA9PT0gY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrID09PSBjYWxsYmFjayAmJiB0aGlzLl9jb250ZXh0ID09PSBjb250ZXh0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNTYW1lQ29udGV4dDogZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0ID09PSBjb250ZXh0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrLmFwcGx5KHRoaXMuX2NvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXSk7XG5cbn0pKCk7XG4qL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFByb3RvID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1wcm90by5qc1wiKTtcbnZhciBBcnJheVV0aWxzID0gcmVxdWlyZShcIi4vcmVjdXJ2ZS1hcnJheS5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90by5kZWZpbmUoW1xuICAgIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGFkZDogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lckV4aXN0cyhjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKG5ldyBTaWduYWxMaXN0ZW5lcihjYWxsYmFjaywgY29udGV4dCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZE9uY2U6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJFeGlzdHMoY2FsbGJhY2ssIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChuZXcgU2lnbmFsTGlzdGVuZXIoY2FsbGJhY2ssIGNvbnRleHQsIHRydWUpKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHZhciBwb3NzaWJsZUxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZUxpc3RlbmVyLmlzU2FtZUNvbnRleHQoY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwb3NzaWJsZUxpc3RlbmVyLmlzU2FtZShjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAtIG5vIG1hdGNoXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5VXRpbHMucmVtb3ZlQXQodGhpcy5fbGlzdGVuZXJzLCBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgb25lIG1hdGNoIGlmIGNhbGxiYWNrIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCAtIDE7IDAgPD0gaW5kZXg7IGluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIudHJpZ2dlcihhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9ubHlPbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5VXRpbHMucmVtb3ZlQXQodGhpcy5fbGlzdGVuZXJzLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9saXN0ZW5lckV4aXN0czogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCAtIDE7IDAgPD0gaW5kZXg7IGluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLmlzU2FtZShjYWxsYmFjaywgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5dKTtcblxudmFyIFNpZ25hbExpc3RlbmVyID0gUHJvdG8uZGVmaW5lKFtcbiAgICBmdW5jdGlvbiBjdG9yKGNhbGxiYWNrLCBjb250ZXh0LCBvbmx5T25jZSkge1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5vbmx5T25jZSA9IG9ubHlPbmNlO1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGlzU2FtZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjayA9PT0gY2FsbGJhY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjayA9PT0gY2FsbGJhY2sgJiYgdGhpcy5fY29udGV4dCA9PT0gY29udGV4dDtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1NhbWVDb250ZXh0OiBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dCA9PT0gY29udGV4dDtcbiAgICAgICAgfSxcblxuICAgICAgICB0cmlnZ2VyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5hcHBseSh0aGlzLl9jb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbl0pOyIsInZhciBPYmplY3RVdGlscyA9IHJlcXVpcmUoXCIuLi9zcmMvcmVjdXJ2ZS1vYmplY3QuanNcIik7XG5cbmRlc2NyaWJlKFwiUmVjdXJ2ZS5PYmplY3RcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICBkZXNjcmliZShcIk9iamVjdHNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvYmplY3Q7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgZGV0ZWN0IHt9XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgb2JqZWN0ID0ge307XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0VXRpbHMuaXNPYmplY3Qob2JqZWN0KSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgZGV0ZWN0IG5ldyBPYmplY3QoKVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG9iamVjdCA9IG5ldyBPYmplY3QoKTtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3RVdGlscy5pc09iamVjdChvYmplY3QpKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBkZXRlY3Qge30gd2l0aCBwcm9wZXJ0aWVzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgb2JqZWN0ID0ge25hbWU6IFwiU2ViYXN0aWVuXCJ9O1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdFV0aWxzLmlzT2JqZWN0KG9iamVjdCkpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIE5PVCBkZXRlY3QgbnVtYmVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgb2JqZWN0ID0gMTIzO1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdFV0aWxzLmlzT2JqZWN0KG9iamVjdCkpLnRvQmUoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiRXJyb3JzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZXJyb3I7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgZGV0ZWN0IG5ldyBFcnJvcigpXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3RVdGlscy5pc0Vycm9yKGVycm9yKSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgTk9UIGRldGVjdCBudW1iZXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlcnJvciA9IDEyMztcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3RVdGlscy5pc0Vycm9yKGVycm9yKSkudG9CZShmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJTdHJpbmdzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RyaW5nO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGRldGVjdCBlbXB0eSBzdHJpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdFV0aWxzLmlzU3RyaW5nKHN0cmluZykpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGRldGVjdCBzdHJpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzdHJpbmcgPSBcInRlc3Qgc3RyaW5nXCI7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0VXRpbHMuaXNTdHJpbmcoc3RyaW5nKSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgZGV0ZWN0IG5ldyBTdHJpbmcoKVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHN0cmluZyA9IG5ldyBTdHJpbmcoXCJ0ZXN0IHN0cmluZ1wiKTtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3RVdGlscy5pc1N0cmluZyhzdHJpbmcpKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBOT1QgZGV0ZWN0IG51bWJlclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHN0cmluZyA9IDEyMztcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3RVdGlscy5pc1N0cmluZyhzdHJpbmcpKS50b0JlKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIkFycmF5c1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFycmF5O1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGRldGVjdCBlbXB0eSBhcnJheVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFycmF5ID0gW107XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0VXRpbHMuaXNBcnJheShhcnJheSkpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGRldGVjdCBhcnJheSB3aXRoIGl0ZW1zXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXJyYXkgPSBbMSwgMl07XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0VXRpbHMuaXNBcnJheShhcnJheSkpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGRldGVjdCBuZXcgQXJyYXkoKVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFycmF5ID0gbmV3IEFycmF5KCk7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0VXRpbHMuaXNBcnJheShhcnJheSkpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGRldGVjdCBuZXcgQXJyYXkoKSB3aXRoIGl0ZW1zXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXJyYXkgPSBuZXcgQXJyYXkoMSwgMik7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0VXRpbHMuaXNBcnJheShhcnJheSkpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIE5PVCBkZXRlY3QgbnVtYmVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXJyYXkgPSAxMjM7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0VXRpbHMuaXNBcnJheShhcnJheSkpLnRvQmUoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiRnVuY3Rpb25zXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZnVuYztcblxuICAgICAgICBpdChcInNob3VsZCBkZXRlY3QgYW5vbnltb3VzIGZ1bmN0aW9uXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3RVdGlscy5pc0Z1bmN0aW9uKGZ1bmMpKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBOT1QgZGV0ZWN0IG51bWJlclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZ1bmMgPSAxMjM7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0VXRpbHMuaXNGdW5jdGlvbihmdW5jKSkudG9CZShmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7IiwidmFyIFNpZ25hbCA9IHJlcXVpcmUoXCIuLi9zcmMvcmVjdXJ2ZS1zaWduYWwuanNcIik7XG5cbmRlc2NyaWJlKFwiUmVjdXJ2ZS5TaWduYWxcIiwgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNpZ25hbDtcbiAgICB2YXIgdHJpZ2dlcmVkO1xuICAgIHZhciB0cmlnZ2VyQ291bnQ7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBzaWduYWwgPSBuZXcgU2lnbmFsKCk7XG4gICAgICAgIHRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICB0cmlnZ2VyQ291bnQgPSAwO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgYWRkIHdpdGggbm8gYXJndW1lbnRzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiBvblRyaWdnZXIoKSB7XG4gICAgICAgICAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgc2lnbmFsLmFkZChvblRyaWdnZXIsIHRoaXMpO1xuICAgICAgICBzaWduYWwudHJpZ2dlcigpO1xuXG4gICAgICAgIGV4cGVjdCh0cmlnZ2VyZWQpLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNob3VsZCBhZGQgd2l0aCBhcmd1bWVudHNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uVHJpZ2dlcihuYW1lLCBsb2NhdGlvbikge1xuICAgICAgICAgICAgZXhwZWN0KGFyZ3VtZW50cy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgICAgICBleHBlY3QobmFtZSkudG9NYXRjaChcIlNlYmFzdGllblwiKTtcbiAgICAgICAgICAgIGV4cGVjdChsb2NhdGlvbikudG9NYXRjaChcIk5ldyBXZXN0bWluc3RlclwiKTtcblxuICAgICAgICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ25hbC5hZGQob25UcmlnZ2VyLCB0aGlzKTtcbiAgICAgICAgc2lnbmFsLnRyaWdnZXIoXCJTZWJhc3RpZW5cIiwgXCJOZXcgV2VzdG1pbnN0ZXJcIik7XG5cbiAgICAgICAgZXhwZWN0KHRyaWdnZXJlZCkudG9CZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIGFkZCBvbmNlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiBvblRyaWdnZXIoKSB7XG4gICAgICAgICAgICB0cmlnZ2VyQ291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ25hbC5hZGRPbmNlKG9uVHJpZ2dlciwgdGhpcyk7XG4gICAgICAgIHNpZ25hbC50cmlnZ2VyKCk7XG4gICAgICAgIHNpZ25hbC50cmlnZ2VyKCk7XG5cbiAgICAgICAgZXhwZWN0KHRyaWdnZXJDb3VudCkudG9FcXVhbCgxKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIGFkZCBtdWx0aXBsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpcnN0VHJpZ2dlcmVkO1xuICAgICAgICB2YXIgc2Vjb25kVHJpZ2dlcmVkO1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uVHJpZ2dlckZpcnN0KCkge1xuICAgICAgICAgICAgdHJpZ2dlckNvdW50Kys7XG4gICAgICAgICAgICBmaXJzdFRyaWdnZXJlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvblRyaWdnZXJTZWNvbmQoKSB7XG4gICAgICAgICAgICBzZWNvbmRUcmlnZ2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgdHJpZ2dlckNvdW50Kys7XG4gICAgICAgIH1cblxuICAgICAgICBzaWduYWwuYWRkKG9uVHJpZ2dlckZpcnN0LCB0aGlzKTtcbiAgICAgICAgc2lnbmFsLmFkZChvblRyaWdnZXJTZWNvbmQsIHRoaXMpO1xuICAgICAgICBzaWduYWwudHJpZ2dlcigpO1xuXG4gICAgICAgIGV4cGVjdChmaXJzdFRyaWdnZXJlZCkudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KHNlY29uZFRyaWdnZXJlZCkudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KHRyaWdnZXJDb3VudCkudG9FcXVhbCgyKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIGlnbm9yZSBkdXBsaWNhdGUgY2FsbGJhY2tzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiBvblRyaWdnZXIoKSB7XG4gICAgICAgICAgICB0cmlnZ2VyQ291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ25hbC5hZGQob25UcmlnZ2VyLCB0aGlzKTtcbiAgICAgICAgc2lnbmFsLmFkZChvblRyaWdnZXIsIHRoaXMpO1xuICAgICAgICBzaWduYWwudHJpZ2dlcigpO1xuXG4gICAgICAgIGV4cGVjdCh0cmlnZ2VyQ291bnQpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNob3VsZCBoYW5kbGUgbnVsbCBjYWxsYmFja3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNpZ25hbC5hZGQobnVsbCwgdGhpcyk7XG4gICAgICAgIHNpZ25hbC50cmlnZ2VyKCk7XG5cbiAgICAgICAgZXhwZWN0KHRyaWdnZXJlZCkudG9CZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNob3VsZCByZW1vdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uVHJpZ2dlcigpIHtcbiAgICAgICAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBzaWduYWwuYWRkKG9uVHJpZ2dlciwgdGhpcyk7XG4gICAgICAgIHNpZ25hbC5yZW1vdmUob25UcmlnZ2VyKTtcbiAgICAgICAgc2lnbmFsLnRyaWdnZXIoKTtcblxuICAgICAgICBleHBlY3QodHJpZ2dlcmVkKS50b0JlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIHJlbW92ZSBhbGxcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uVHJpZ2dlckZpcnN0KCkge1xuICAgICAgICAgICAgdHJpZ2dlckNvdW50Kys7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvblRyaWdnZXJTZWNvbmQoKSB7XG4gICAgICAgICAgICB0cmlnZ2VyQ291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ25hbC5hZGQob25UcmlnZ2VyRmlyc3QsIHRoaXMpO1xuICAgICAgICBzaWduYWwuYWRkKG9uVHJpZ2dlclNlY29uZCwgdGhpcyk7XG4gICAgICAgIHNpZ25hbC5yZW1vdmVBbGwoKTtcbiAgICAgICAgc2lnbmFsLnRyaWdnZXIoKTtcblxuICAgICAgICBleHBlY3QodHJpZ2dlckNvdW50KS50b0VxdWFsKDApO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgcmVtb3ZlIG9ubHkgc2Vjb25kXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiBvblRyaWdnZXJGaXJzdCgpIHtcbiAgICAgICAgICAgIHRyaWdnZXJDb3VudCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25UcmlnZ2VyU2Vjb25kKCkge1xuICAgICAgICAgICAgdHJpZ2dlckNvdW50Kys7XG4gICAgICAgIH1cblxuICAgICAgICBzaWduYWwuYWRkKG9uVHJpZ2dlckZpcnN0LCB0aGlzKTtcbiAgICAgICAgc2lnbmFsLmFkZChvblRyaWdnZXJTZWNvbmQsIHRoaXMpO1xuICAgICAgICBzaWduYWwucmVtb3ZlKG9uVHJpZ2dlclNlY29uZCk7XG4gICAgICAgIHNpZ25hbC50cmlnZ2VyKCk7XG5cbiAgICAgICAgZXhwZWN0KHRyaWdnZXJDb3VudCkudG9FcXVhbCgxKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIG9ubHkgcmVtb3ZlIGFsbCB3aXRoIHNhbWUgY29udGV4dFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gb25UcmlnZ2VyRmlyc3QoKSB7XG4gICAgICAgICAgICB0cmlnZ2VyQ291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uVHJpZ2dlclNlY29uZCgpIHtcbiAgICAgICAgICAgIHRyaWdnZXJDb3VudCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25UcmlnZ2VyVGhpcmQoKSB7XG4gICAgICAgICAgICB0cmlnZ2VyQ291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ25hbC5hZGQob25UcmlnZ2VyRmlyc3QsIHRoaXMpO1xuICAgICAgICBzaWduYWwuYWRkKG9uVHJpZ2dlclNlY29uZCwgdGhpcyk7XG4gICAgICAgIHNpZ25hbC5hZGQob25UcmlnZ2VyVGhpcmQsIHt9KTtcbiAgICAgICAgc2lnbmFsLnJlbW92ZShudWxsLCB0aGlzKTtcbiAgICAgICAgc2lnbmFsLnRyaWdnZXIoKTtcblxuICAgICAgICBleHBlY3QodHJpZ2dlckNvdW50KS50b0VxdWFsKDEpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgcmVtb3ZlIG5vbmUgaWYgbm8gY2FsbGJhY2ssIG9yIGNvbnRleHRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uVHJpZ2dlcigpIHtcbiAgICAgICAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBzaWduYWwuYWRkKG9uVHJpZ2dlciwgdGhpcyk7XG4gICAgICAgIHNpZ25hbC5yZW1vdmUoKTtcbiAgICAgICAgc2lnbmFsLnRyaWdnZXIoKTtcblxuICAgICAgICBleHBlY3QodHJpZ2dlcmVkKS50b0JlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgZGlzYWJsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gb25UcmlnZ2VyKCkge1xuICAgICAgICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ25hbC5hZGQob25UcmlnZ2VyLCB0aGlzKTtcbiAgICAgICAgc2lnbmFsLmRpc2FibGUoKTtcbiAgICAgICAgc2lnbmFsLnRyaWdnZXIoKTtcblxuICAgICAgICBleHBlY3QodHJpZ2dlcmVkKS50b0JlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIHVzZSBjb3JyZWN0IGNvbnRleHQgb24gY2FsbGJhY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBmdW5jdGlvbiBvblRyaWdnZXIoKSB7XG4gICAgICAgICAgICBleHBlY3QodGhpcykudG9CZSh0aGF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ25hbC5hZGQob25UcmlnZ2VyLCB0aGlzKTtcbiAgICAgICAgc2lnbmFsLnRyaWdnZXIoKTtcbiAgICB9KTtcbn0pOyJdfQ==
