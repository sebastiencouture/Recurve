"use strict";

function addMockTimeoutService(module) {
    module.factory("$timeout", ["$window"], function($window) {
        var timeoutsInProgress = {};

        function removeTimeout(id) {
            delete timeoutsInProgress[id];
            $window.clearTimeout(id);
        }

        function addTimeout(id, fn) {
            removeTimeout(id);
            timeoutsInProgress[id] = fn;
        }

        function callTimeout(id) {
            if (timeoutsInProgress.hasOwnProperty(id)) {
                timeoutsInProgress[id]();
            }
        }

        var $timeout = function(fn, time) {
            var called;
            var id = $window.setTimeout(function() {
                called = true;
                callTimeout(id);
                removeTimeout(id);
            }, time);

            // In case setTimeout is overriden and no longer async...
            // TODO TBD maybe just use window instead of $window
            if (!called) {
                addTimeout(id);
            }
        };

        return recurve.extend($timeout, {
            cancel: function(id) {
                removeTimeout(id);
            },

            flush: function() {
                // TODO TBD these need to be called in order on time, and then as tie breaker in order
                // added
                recurve.forEach(timeoutsInProgress, function(fn, id) {
                    fn();
                    removeTimeout(id);
                });
            }
        });
    });
}