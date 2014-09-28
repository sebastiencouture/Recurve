"use strict";

function addMockTimeoutService(module) {
    module.factory("$timeout", null, function() {
        function timeoutGroup() {
            var timeouts = [];

            function remove(id) {
                recurve.forEach(timeouts, function(timeout, index) {
                    if (timeout.id !== id) {
                        return;
                    }

                    removeAtIndex(timeout.id, index);
                    return false;
                });
            }

            function removeAtIndex(id, index) {
                window.clearTimeout(id);
                timeouts.splice(index, 1);
            }

            return {
                add: function(id, fn) {
                    timeouts.push({id: id, fn: fn});
                },

                remove: remove,

                invoke: function(id) {
                    recurve.forEach(timeouts, function(timeout, index) {
                        if (timeout.id !== id) {
                            return;
                        }

                        timeout.fn();
                        removeAtIndex(timeout.id, index);

                        return false;
                    });
                },

                invokeAll: function() {
                    recurve.forEach(timeouts, function(timeout) {
                        timeout.fn();
                        window.clearTimeout(timeout.id);
                    });

                    timeouts = [];
                }
            }
        }

        var timeoutGroupByTime = {};

        function add(id, fn, time) {
            var group = timeoutGroupByTime[time];
            if (!group) {
                group = timeoutGroup();
                timeoutGroupByTime[time] = group;
            }

            group.remove(id);
            group.add(id, fn);
        }

        function invoke(id, time) {
            var group = timeoutGroupByTime[time];
            if (group) {
                group.invoke(id);
            }
        }

        var $timeout = function(fn, time) {
            var id = window.setTimeout(function() {
                invoke(id, time);
            }, time);

            add(id, fn, time);
        };

        return recurve.extend($timeout, {
            cancel: function(id) {
                recurve.forEach(timeoutGroupByTime, function(group) {
                    group.remove(id);
                });
            },

            flush: function(maxTime) {
                recurve.forEach(timeoutGroupByTime, function(group, time) {
                    if (maxTime <= time) {
                        return false;
                    }

                    group.invokeAll();
                    delete timeoutGroupByTime[time];
                });
            }
        });
    });
}