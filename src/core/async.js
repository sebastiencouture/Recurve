"use strict";

function addAsyncService(module) {
    module.factory("$async", null, function() {
        var $async = function(fn, timeMs) {
            return window.setTimeout(fn, timeMs);
        };

        return extend($async, {
            cancel: function(id) {
                window.clearTimeout(id);
            }
        });
    });
}