"use strict";

function addMockTimeoutDecorator(module) {
    module.decorator("$timeout", ["$async"], function($delegate, $async) {
         $delegate.flush = function(timeMs) {
             return $async.flush(timeMs);
         };

        return $delegate;
    });
}