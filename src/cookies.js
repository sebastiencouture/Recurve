"use strict";

var ObjectUtils = require("./utils/object.js");
var StringUtils = require("./utils/string.js");
var DateUtils = require("./utils/date.js");
var assert = require("./assert.js");

module.exports = {
    get: function(key) {
        assert(key, "key must be set");

        var value = null;

        forEachCookie(function(cookie, name){
            if (name === key) {
                var rawValue = StringUtils.afterSeparator(cookie, "=");
                value = parse(rawValue);

                return false;
            }
        });

        return value;
    },

    set: function(key, value, options) {
        assert(key, "key must be set");

        if (undefined === options) {
            options = {};
        }

        if (ObjectUtils.isNumber(options.expires)) {
            options.expires = DateUtils.addDaysFromNow(options.expires);
        }

        var cookie = encodeURIComponent(key) + "=" + serialize(value);

        if (ObjectUtils.isDate(options.expires)) {
            cookie +=  "; expires=" + options.expires.toUTCString();
        }

        if (options.domain) {
            cookie += "; domain=" + options.domain;
        }

        if (options.path) {
            cookie += "; path=" + options.path;
        }

        if (options.secure) {
            cookie += "; secure";
        }

        document.cookie = cookie;
    },

    remove: function(key, options) {
        assert(key, "key must be set");

        if (undefined === options) {
            options = {};
        }

        if (!this.exists(key)) {
            return false;
        }

        var updated = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        if (options.domain) {
            updated += "; domain=" + options.domain;
        }

        if (options.path) {
            updated += "; path=" + options.path;
        }

        document.cookie = updated;

        return true;
    },

    exists: function(key) {
        var exists = false;

        forEachCookie(function(cookie, name){
            if (name === key) {
                exists = true;
                return false;
            }
        });

        return exists;
    },

    forEach: function(iterator) {
        assert(iterator, "iterator must be set");

        forEachCookie(function(cookie, name){
            var rawValue = StringUtils.afterSeparator(cookie, "=");
            var value = parse(rawValue);

            iterator(value, name, cookie);
        });
    }
};


function forEachCookie(iterator) {
    var cookies = document.cookie ? document.cookie.split(";") : [];

    ObjectUtils.forEach(cookies, function(cookie) {
        cookie = cookie.trim();
        var name = decodeURIComponent(StringUtils.beforeSeparator(cookie, "="));
        iterator(cookie, name);
    });
}

function serialize(value) {
    var string = ObjectUtils.isObject(value) ? JSON.stringify(value) : String(value);
    return encodeURIComponent(string);
}

function parse(value) {
    if (!ObjectUtils.isString(value)) {
        return null;
    }

    // quoted cookie, unescape
    if (0 === value.indexOf('"')) {
        value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
        value = decodeURIComponent(value);
        return JSON.parse(value);
    }
    catch(e) {
        return value;
    }
}