/*global window: false */

/**
 * #WOWOW
 * @rdoc module
 * @name $async
 * @module core
 * @example async-demo.js
 * @example async-demo-2.js
 * @require something
 * @require something2
 */

"use strict";

function addAsyncService(module) {
    module.factory("$async", null, function() {
        var $async = function(fn, timeMs) {
            return window.setTimeout(function() {
                fn();
            }, timeMs);
        };

        return extend($async, {
            /**
             * blah blah blah
             *
             * @param {String} id this is a value :)
             * @returns {String} some value [inline link](www.google.com)
             * @throws {Error} nothing!
             */
            cancel: function(id) {
                window.clearTimeout(id);
            }
        });
    });
}