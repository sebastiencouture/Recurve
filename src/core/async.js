/*global window: false */

/**
 * @rdoc service
 * @name $async
 * @module core
 * @example async-demo.js this is example 1
 * @example async-demo-2.js this is example 2
 * @description
 * this is the description for $async!!
 ```
    function test() {
    };
 ```
 * [inline link](www.google.com)
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
             * @module core
             * @service $async
             * @name cancel
             *
             * @param {String} id
             * @param {Object} test
             * @return {String} test @{core.$promise#all promise something}
             * @description
             * test
             */
            cancel: function(id) {
                window.clearTimeout(id);
            }
        });
    });
}