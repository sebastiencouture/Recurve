"use strict";

function addCookiesService(module) {
    module.factory("$cookies", null, function() {
        function forEachCookie(iterator) {
            var cookies = document.cookie ? document.cookie.split(";") : [];

            forEach(cookies, function(cookie) {
                cookie = cookie.trim();
                var name = decodeURIComponent(beforeSeparator(cookie, "="));
                iterator(cookie, name);
            });
        }

        function serialize(value) {
            var string = isObject(value) ? toJson(value) : String(value);
            return encodeURIComponent(string);
        }

        function parse(value) {
            if (!isString(value)) {
                return null;
            }

            // quoted cookie, unescape
            if (0 === value.indexOf('"')) {
                value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }

            try {
                value = decodeURIComponent(value);
                return fromJson(value);
            }
            catch(e) {
                return value;
            }
        }

        return {
            get: function(key) {
                var value = null;

                forEachCookie(function(cookie, name){
                    if (name === key) {
                        var rawValue = afterSeparator(cookie, "=");
                        value = parse(rawValue);

                        return false;
                    }
                });

                return value;
            },

            set: function(key, value, options) {
                if (isUndefined(options)) {
                    options = {};
                }

                if (isNumber(options.expires)) {
                    options.expires = addDaysFromNow(options.expires);
                }

                var cookie = encodeURIComponent(key) + "=" + serialize(value);

                if (isDate(options.expires)) {
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


               // console.log(cookie);
                document.cookie = cookie;
                return cookie;
            },

            remove: function(key, options) {
                if (isUndefined(options)) {
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

            // NOTE, will only clear cookies that can be cleared (same path/domain)
            clear: function() {
                var cookies = document.cookie.split(";");

                forEach(cookies, function(cookie) {
                    deleteCookie(cookie.split("=")[0]);
                });

                function deleteCookie(name) {
                    var pathSplit = location.pathname.split('/');
                    var pathCurrent = ' path=';

                    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

                    forEach(pathSplit, function(pathPart) {
                        pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathPart;
                        document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';

                    });
                }
            },

            forEach: function(iterator) {
                assert(iterator, "iterator must be set");

                forEachCookie(function(cookie, name){
                    var rawValue = afterSeparator(cookie, "=");
                    var value = parse(rawValue);

                    iterator(value, name);
                });
            }
        };
    });
}