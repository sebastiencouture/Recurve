"use strict";

module.exports = {
    forEach: function(obj, iterator, context) {
        if (!obj || !iterator) {
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
            var keys = Object.keys(obj);
            for (var index = 0; index < keys.length; index++) {
                var key = keys[index];
                if (false === iterator.call(context, obj[key], key, obj)) {
                    return;
                }
            }
        }

        return keys;
    },

    find: function(obj, property, value) {

    },

    // both values pass strict equality (===)
    // both objects are same type and all properties pass strict equality
    // both are NaN
    areEqual: function(value, other) {
        if (value === other) {
            return true;
        }

        if (null === value || null === other) {
            return false;
        }

        // NaN is NaN!
        if (this.isNaN(value) && this.isNaN(other)) {
            return true;
        }

        if (!this.isSameType(value, other)) {
            return false;
        }

        if (!this.isObject(value)) {
            return false;
        }

        if (this.isArray(value)) {
            if (value.length == other.length) {
                for (var index = 0; index < value.length; index++) {
                    if (!this.areEqual(value[index], other[index])) {
                        return false;
                    }
                }

                return true;
            }
        }
        else if(this.isDate(value)) {
            return value.getTime() == other.getTime();
        }
        else {
            var keysOfValue = {};
            for (var key in value) {
                if (this.isFunction(value[key])) {
                    continue;
                }

                if (!this.areEqual(value[key], other[key])) {
                    return false;
                }

                keysOfValue[key] = true;
            }

            for (var key in other) {
                if (this.isFunction(other[key])) {
                    continue;
                }

                if (!keysOfValue.hasOwnProperty(key)) {
                    return false;
                }
            }

            return true;
        }

        return false;
    },

    isNaN: function(value) {
        // NaN is never equal to itself, interesting :)
        return value !== value;
    },

    isSameType: function(value, other) {
        return typeof value == typeof other;
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

    isNumber: function(value) {
        return "number" == typeof value;
    },

    extend: function(dest, src) {
        if (!src) {
            return;
        }

        for (var key in src) {
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

