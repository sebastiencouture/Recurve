/*global window: false */

/**
 * @rdoc service
 * @name $async
 * @module core
 * @example async-demo.js
 * @example async-demo-2.js
 * @require something
 * @require something2
 * @description
 * this is the description for $async!!
 * [inline link](www.google.com)
 * @require something 3
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
             * @rdoc method
             * @name cancel
             * @kind function
             *
             * @param {String} id this is a value :)
             * @param {object} test not here!
             * @return {String} some value [inline link](www.google.com) @{core.$promise#all promise something}
             * @throws {Error} nothing!
             * @private
             * @description test
             *
             * description
             */
            cancel: function(id) {
                window.clearTimeout(id);
            }

            /**
             * @rdoc config
             * @name something
             * @description blah
             * @type {string}
             */

            /**
             * @rdoc property
             * @name something
             * @description wee
             * @type {string}
             */
        });
    });
}