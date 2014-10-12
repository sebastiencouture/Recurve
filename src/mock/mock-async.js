"use strict";

function addMockAsyncService(module) {
    module.factory("$async", null, function() {
        function timeoutGroup(timeMs) {
            var timeouts = [];

            function remove(id) {
                var removed = false;
                recurve.forEach(timeouts, function(timeout, index) {
                    if (timeout.id !== id) {
                        return;
                    }

                    removeAtIndex(timeout.id, index);
                    removed = true;

                    return false;
                });

                return removed;
            }

            function removeAtIndex(id, index) {
                window.clearTimeout(id);
                timeouts.splice(index, 1);
            }

            return {
                timeMs: timeMs,

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
                    // ensure handle timeouts added while invoking
                    while (timeouts.length) {
                        var timeout = timeouts.shift();

                        timeout.fn();
                        window.clearTimeout(timeout.id);
                    }
                }
            };
        }

        var timeoutGroups = [];
        var elapsedTimeMs = 0;

        function getTimeoutGroupByTime(timeMs) {
            var group = null;
            recurve.forEach(timeoutGroups, function(possibleGroup) {
                if (possibleGroup.timeMs === timeMs) {
                    group = possibleGroup;
                    return false;
                }
            });

            return group;
        }

        function add(id, fn, timeMs) {
            if (recurve.isUndefined(timeMs)) {
                timeMs = 0;
            }

            timeMs += elapsedTimeMs;

            var group = getTimeoutGroupByTime(timeMs);
            if (!group) {
                group = timeoutGroup(timeMs);

                var added;
                recurve.forEach(timeoutGroups, function(existingGroup, index) {
                    if (existingGroup.timeMs > timeMs) {
                        timeoutGroups.splice(index, 0, group);
                        added = true;
                        return false;
                    }
                });

                if (!added) {
                    timeoutGroups.push(group);
                }
            }

            group.remove(id);
            group.add(id, fn);
        }

        // Doesn't take into consideration flush, but doesn't need to since should only be called when window timeout
        // expires
        function invoke(id, timeMs) {
            var group = getTimeoutGroupByTime(timeMs);
            if (group) {
                group.invoke(id);
            }
        }

        var $async = function(fn, timeMs) {
            var id = window.setTimeout(function() {
                invoke(id, timeMs);
            }, timeMs);

            add(id, fn, timeMs);

            return id;
        };

        return recurve.extend($async, {
            cancel: function(id) {
                recurve.forEach(timeoutGroups, function(group) {
                    if (group.remove(id)) {
                        return false;
                    }
                });
            },

            flush: function(timeMs) {
                var startTimeMs = elapsedTimeMs;
                var maxTimeMs = elapsedTimeMs + timeMs;

                // ensure timeouts added during invocation also get called
                while (timeoutGroups.length) {
                    var group = timeoutGroups[0];

                    if (maxTimeMs < group.timeMs) {
                        break;
                    }

                    elapsedTimeMs += group.timeMs;

                    timeoutGroups.shift();
                    group.invokeAll();
                }

                elapsedTimeMs = startTimeMs + timeMs;

                return elapsedTimeMs;
            }
        });
    });
}