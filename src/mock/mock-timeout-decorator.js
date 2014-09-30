"use strict";

function addMockTimeoutDecorator(module) {
    module.decorator("$timeout", ["$async"], function($delegate, $async) {
         $delegate.flush = function(maxTime) {
             $async.flush(maxTime);
         };

        return $delegate;
    });
}