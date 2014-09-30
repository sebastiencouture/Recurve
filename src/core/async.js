"use strict";

function addAsyncService(module) {
    module.factory("$async", null, function() {
        var $async = function(fn, time) {
            return window.setTimeout(fn, time);
        };

        return extend($async, {
            cancel: function(id) {
                window.clearTimeout(id);
            }
        });
    });
}