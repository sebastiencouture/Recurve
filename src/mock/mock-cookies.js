"use strict";

function addMockCookiesService(module) {
    module.factory("$cookies", ["$document"], function($document) {
        var cookies = {};

        function differentDomainPath(options) {
            if (!options) {
                return false;
            }

            return (options.domain && options.domain != $document.location.host) ||
                (options.path && "/" != options.path && "" != options.path);
        }

        function addDaysFromNow(days) {
            var date = new Date();
            date.setDate(date.getDate() + days);

            return date;
        }

        return {
            get: function(key) {
                if (!this.exists(key)) {
                    return null;
                }

                var expires = cookies[key].expires;
                if (expires &&
                    expires < new Date()) {
                    delete cookies[key];
                    return null;
                }

                return cookies[key].value;
            },

            set: function(key, value, options) {
                // This is only for consistency with browser cookies
                if (recurve.isUndefined(value)) {
                    value = "undefined";
                }

                if (!differentDomainPath(options)) {
                    var expires = options ? options.expires : null;
                    if (recurve.isNumber(expires)) {
                        expires = addDaysFromNow(expires);
                    }

                    cookies[key] = {value: value, expires: expires};
                }
            },

            remove: function(key, options) {
                if (!this.exists(key) || differentDomainPath(options)) {
                    return false;
                }

                delete cookies[key];
                return true;
            },

            exists: function(key) {
                return cookies.hasOwnProperty(key);
            },

            forEach: function(iterator, context) {
                recurve.forEach(cookies, function(obj, key) {
                    var value = this.get(key);
                    if (value) {
                        iterator.apply(context, [value, key]);
                    }
                }, this);
            },

            clear: function() {
                cookies = [];
            }
       }
    });
}