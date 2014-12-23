/* global forEach: true,
 find: true,
 areEqual: true,
 isEmpty: true,
 isNaN: true,
 isSameType: true,
 isString: true,
 isUndefined: true,
 isError: true,
 isObject: true,
 isArray: true,
 isArguments: true,
 isFunction: true,
 isDate: true,
 isFile: true,
 isNumber: true,
 isBlob: true,
 isRegExp: true,
 extend: true,
 clone: true,
 toJson: true,
 fromJson: true,
 toFormData: true,
 format: true,
 pad: true,
 startsWith: true,
 endsWith: true,
 formatTime: true,
 formatMonthDayYear: true,
 isEqualIgnoreCase: true,
 contains: true,
 beforeSeparator: true,
 afterSeparator: true,
 generateUUID: true,
 removeItem: true,
 removeAt: true,
 argumentsToArray: true,
 createElement: true,
 addEvent: true,
 removeEvent: true,
 supportsEvent: true,
 addParamsToUrl: true,
 removeParamFromUrl: true,
 getParamsOfUrl: true,
 assert: true
*/

"use strict";

function forEach(obj, iterator, context) {
    if (!obj) {
        return obj;
    }

    var index;

    if (obj.forEach && obj.forEach === Object.forEach) {
        obj.forEach(iterator, context);
    }
    else if (isArray(obj)) {
        for (index = 0; index < obj.length; index++) {
            if (false === iterator.call(context, obj[index], index, obj)) {
                break;
            }
        }
    }
    else {
        var keys = Object.keys(obj);
        for (index = 0; index < keys.length; index++) {
            var key = keys[index];
            if (false === iterator.call(context, obj[key], key, obj)) {
                break;
            }
        }
    }

    return obj;
}

function find(obj, property, value) {
    if (!obj) {
        return null;
    }

    if (isArray(obj)) {
        for (var index = 0; index < obj.length; index++) {
            var current = obj[index];

            if (property &&
                isObject(current) &&
                current[property] === value) {
                return current;
            }
            else if (current === value) {
                return current;
            }
            else {
                // do nothing
            }
        }
    }
    else {
        return value === obj[property] ? obj[property] : null;
    }

    return null;
}

// both values pass strict equality (===)
// both objects are same type and all properties pass strict equality
// both are NaN
function areEqual(value, other) {
    if (value === other) {
        return true;
    }

    if (null === value || null === other) {
        return false;
    }

    // NaN is NaN!
    if (isNaN(value) && isNaN(other)) {
        return true;
    }

    if (!isSameType(value, other)) {
        return false;
    }

    if (!isObject(value)) {
        return false;
    }


    if (isArray(value)) {
        if (value.length == other.length) {
            for (var index = 0; index < value.length; index++) {
                if (!areEqual(value[index], other[index])) {
                    return false;
                }
            }

            return true;
        }
    }
    else if (isDate(value)) {
        return value.getTime() == other.getTime();
    }
    else if (isRegExp(value)) {
        return value.toString() == other.toString();
    }
    else {
        var keysOfValue = {};
        for (var key in value) {
            if (isFunction(value[key])) {
                continue;
            }

            if (!areEqual(value[key], other[key])) {
                return false;
            }

            keysOfValue[key] = true;
        }

        for (key in other) {
            if (isFunction(other[key])) {
                continue;
            }

            if (!keysOfValue.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    }

    return false;
}

function isEmpty(value) {
    if(!value) {
        return true;
    }

    if(isArray(value) || isString(value) || isArguments(value)) {
        return 0 === value.length;
    }

    for (var key in value) {
        if (value.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}

function isNaN(value) {
    // NaN is never equal to itself, interesting :)
    return value !== value;
}

function isSameType(value, other) {
    return typeof value == typeof other;
}

function isString(value) {
    return (value instanceof String || "string" == typeof value);
}

function isUndefined(value) {
    return value === void 0;
}

function isError(value) {
    return value instanceof Error;
}

function isObject(value) {
    return value === Object(value) || isFunction(value);
}

function isArray(value) {
    return value instanceof Array;
}

function isArguments(value) {
    return value && value.hasOwnProperty("callee") && value.hasOwnProperty("length");
}

function isFunction(value) {
    return "[object Function]" === Object.prototype.toString.call(value);
}

function isDate(value) {
    return "[object Date]" === Object.prototype.toString.call(value);
}

function isFile(value) {
    return "[object File]" === Object.prototype.toString.call(value);
}

function isNumber(value) {
    return "[object Number]" === Object.prototype.toString.call(value);
}

function isBlob(value) {
    return "[object Blob]" === Object.prototype.toString.call(value);
}

function isRegExp(value) {
    return "[object RegExp]" === Object.prototype.toString.call(value);
}

function extend(dest, src) {
    if (!dest || !src) {
        return dest;
    }

    for (var key in src) {
        dest[key] = src[key];
    }

    return dest;
}

// shallow clone
function clone(object) {
    if (!isObject(object)) {
        return object;
    }

    return isArray(object) ? object.slice() : extend({}, object);
}

function toJson(obj) {
    if (isUndefined(obj)) {
        return undefined;
    }

    return JSON.stringify(obj);
}

function fromJson(str) {
    return isString(str) ? JSON.parse(str) : str;
}

function toFormData(obj) {
    if (!isObject(obj) || isArray(obj)) {
        return null;
    }

    var values = [];
    forEach(obj, function(value, key) {
        values.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });

    return values.join("&");
}

///

function format(value) {
    if (!value) {
        return null;
    }

    var args = argumentsToArray(arguments, 1);
    return value.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}

function pad(value, padCount, padValue) {
    if (!value && 0 !== value) {
        return null;
    }

    if (undefined === padValue) {
        padValue = "0";
    }

    value = String( value );

    while (value.length < padCount) {
        value = padValue + value;
    }

    return value;
}

function startsWith(str, value) {
    return str && 0 === str.indexOf(value);
}

function endsWith(str, value) {
    if (!str || !value) {
        return false;
    }

    return str.length >= value.length && value == str.substr(str.length - value.length);
}

function formatTime(date) {
    if (undefined === date) {
        date = new Date();
    }

    if (!isDate(date)) {
        return null;
    }

    var hours = pad(date.getHours(), 2);
    var minutes = pad(date.getMinutes(), 2);
    var seconds = pad(date.getSeconds(), 2);
    var milliseconds = pad(date.getMilliseconds(), 2);

    return format(
        "{0}:{1}:{2}:{3}", hours, minutes, seconds, milliseconds);
}

function formatMonthDayYear(date) {
    if (undefined === date) {
        date = new Date();
    }

    if (!isDate(date)) {
        return null;
    }

    var month = pad(date.getMonth() + 1);
    var day = pad(date.getDate());
    var year = date.getFullYear();

    return format(
        "{0}/{1}/{2}", month, day, year);
}

// Only intended to be used with strings
function isEqualIgnoreCase(value, other) {
    if (!value || !other) {
        return value === other;
    }

    value = value.toLowerCase();
    other = other.toLowerCase();

    return value === other;
}

// Only intended to be used with strings
function contains(value, other, ignoreCase) {
    if (!value || !other) {
        return value === other;
    }

    if (ignoreCase) {
        value = value.toLowerCase();
        other = other.toLowerCase();
    }

    return 0 <= value.indexOf(other);
}

// Only intended to be used with strings
function beforeSeparator(str, separator) {
    if (!str || !separator) {
        return null;
    }

    var index = str.indexOf(separator);
    return -1 < index ? str.substring(0, index) : null;
}

// Only intended to be used with strings
function afterSeparator(str, separator) {
    if (!str || !separator) {
        return null;
    }

    var index = str.indexOf(separator);
    return -1 < index ? str.substring(index + 1) : null;
}

// RFC4122 version 4 compliant
function generateUUID() {
    // http://stackoverflow.com/a/8809472
    var now = Date.now();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(character) {
        // jshint bitwise: false
        var random = (now + Math.random()*16)%16 | 0;
        now = Math.floor(now/16);
        // jshint bitwise: false
        return (character=='x' ? random : (random&0x3|0x8)).toString(16);
    });

    return uuid;
}

///

function removeItem(array, item) {
    if (!array || !item) {
        return;
    }

    var index = array.indexOf(item);
    if (-1 < index) {
        array.splice(index, 1);
    }
}

function removeAt(array, index) {
    if (!array || null === index) {
        return;
    }
    if (0 <= index && array.length > index) {
        array.splice(index, 1);
    }
}

function argumentsToArray(args, sliceCount) {
    if (undefined === sliceCount) {
        sliceCount = 0;
    }

    return sliceCount < args.length ? Array.prototype.slice.call(args, sliceCount) : [];
}


///

function createElement(name, attributes) {
    var element = window.document.createElement(name);

    forEach(attributes, function(value, key) {
        element.setAttribute(key, value);
    });

    return element;
}

function addEvent(obj, event, callback) {
    // IE8 :T
    if (isFunction(obj.addEventListener)) {
        obj.addEventListener(event, callback);
    }
    else {
        obj.attachEvent("on" + event, callback);
    }
}

function removeEvent(obj, event, callback) {
    // IE8 :T
    if (isFunction(obj.removeEventListener)) {
        obj.removeEventListener(event, callback);
    }
    else {
        obj.detachEvent("on" + event, callback);
    }
}

function supportsEvent(obj, name) {
    return name in obj;
}

////

function addParamsToUrl(url, params) {
    if (!url || !params) {
        return url;
    }

    var seperator = contains(url, "?") ? "&" : "?";

    for (var key in params) {
        var value = params[key];

        if (isObject(value)) {
            if (isDate(value)) {
                value = value.toISOString();
            }
            else {
                value = toJson(value);
            }
        }

        url += seperator +  encodeURIComponent(key) + "=" + encodeURIComponent(value);
        seperator = "&";
    }

    return url;
}

function removeParamFromUrl(url, param) {
    if (!url || !param) {
        return url;
    }

    var search = encodeURIComponent(param) + "=";
    var startIndex = url.indexOf(search);

    if (-1 === startIndex) {
        return url;
    }

    var endIndex = url.indexOf("&", startIndex);

    if (-1 < endIndex) {
        url = url.substr(0, Math.max(startIndex - 1, 0)) + url.substr(endIndex);
    }
    else {
        url = url.substr(0, Math.max(startIndex - 1, 0));
    }

    if (!contains(url, "?")) {
        url = url.replace("&", "?");
    }

    return url;
}

// No support for decoding values
function getParamsOfUrl(url) {
    var params = {};
    if (!url) {
        return params;
    }

    var startIndex = url.indexOf("?") + 1;
    if (startIndex === url.length) {
        return params;
    }

    while (0 < startIndex) {
        var endIndex = url.indexOf("&", startIndex);
        if (-1 === endIndex) {
            endIndex = undefined;
        }

        var keyValue = url.slice(startIndex, endIndex);

        var split = keyValue.split("=");
        var key = decodeURIComponent(split[0]);
        // No support for decoding value, too difficult. No need yet for this either
        var value = 1 < split.length ? split[1] : null;

        params[key] = value;

        startIndex = endIndex + 1;
    }

    return params;
}


///

function assert(condition, message) {
    if (!!condition) {
        return;
    }

    Array.prototype.shift.apply(arguments);
    message = format.apply(null, arguments) || "";

    throw new Error(message);
}