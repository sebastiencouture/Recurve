"use strict";

var recurve = window.recurve || (window.recurve = {});


function forEach(obj, iterator, context) {
    if (!obj || !iterator) {
        return;
    }

    if (obj.forEach && obj.forEach === Object.forEach) {
        obj.forEach(iterator, context);
    }
    else if (isArray(obj)) {
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
    else if(isDate(value)) {
        return value.getTime() == other.getTime();
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

        for (var key in other) {
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
    return "[object Function]" === toString.call(value);
}

function isDate(value) {
    return "[object Date]" === toString.call(value);
}

function isFile(value) {
    return "[object File]" === toString.call(value);
}

function isNumber(value) {
    return "[object Number]" === toString.call(value);
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
    if (!isObject(obj)) {
        throw new Error("not an object to convert to JSON");
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

    Array.prototype.shift.apply(arguments);

    for (var index = 0; index < arguments.length; index++) {
        var search = "{" + index + "}";
        value = value.replace(search, arguments[index]);
    }

    return value;
}

// TODO TBD how to handle negative pad values? probably doesn't matter
function pad(value, padCount, padValue) {
    if (!value && 0 != value) {
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

    value = str.toLowerCase();
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
        var random = (now + Math.random()*16)%16 | 0;
        now = Math.floor(now/16);
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
    if (!array || !index) {
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
    var element = document.createElement(name);

    forEach(attributes, function(value, key) {
        element.setAttribute(key, value);
    });

    return element;
}

function addEventListener(element, event, callback) {
    // http://pieisgood.org/test/script-link-events/
    // TODO TBD link tags don't support any type of load callback on old WebKit (Safari 5)
    function readyStateHandler() {
        if (isEqualIgnoreCase("loaded", element.readyState) ||
            isEqualIgnoreCase("complete", element.readyState)) {
            callback({type: "load"});
        }
    }

    // IE8 :T
    if ("load" === event &&
        elementSupportsEvent(element, "onreadystatechange")) {
        element.onreadystatechange = readyStateHandler;
    }
    else {
        element.addEventListener(event, callback);
    }
}

function removeEventListener(element, event, callback) {
    if ("load" === event &&
        elementSupportsEvent(element, "onreadystatechange")) {
        element.onreadystatechange = null;
    }
    else {
        element.removeEventListener(event, callback);
    }
}

////

function addParametersToUrl(url, parameters) {
    if (!url || !parameters) {
        return url;
    }

    var seperator = contains(url, "?") ? "&" : "?";

    for (var key in parameters) {
        var value = parameters[key];

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

function removeParameterFromUrl(url, parameter) {
    if (!url || !parameter) {
        return url;
    }

    var search = encodeURIComponent(parameter) + "=";
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


///

function assert(condition, message) {
    if (!!condition) {
        return;
    }

    Array.prototype.shift.apply(arguments);
    message = format.apply(this, arguments);

    throw new Error(message);
};