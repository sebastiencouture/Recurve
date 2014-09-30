"use strict";

function addMockAsyncService(module) {
    module.factory("$async", null, function() {
        function timeoutGroup(time, flushTime) {
            if (isUndefined(flushTime)) {
                flushTime = 0;
            }

            time += flushTime;

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
                time: time,
                flushTime: flushTime,

                add: function(id, fn) {
                    timeouts.push({id: id, fn: fn});
                },

                remove: remove,

                // Doesn't take into consideration flush, but doesn't need to since should only be called when window timeout
                // expires
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
                },

                resetFlushTime: function() {
                    this.time -= this.flushTime;
                    this.flushTime = 0;
                }
            }
        }

        var timeoutGroups = [];
        var flushTime = 0;

        function getTimeoutGroupByTime(time, flushTime) {
            if (isUndefined(flushTime)) {
                flushTime = 0;
            }

            var group = null;
            recurve.forEach(timeoutGroups, function(possibleGroup) {
                if (possibleGroup.time === time && possibleGroup.flushTime === flushTime) {
                    group = possibleGroup;
                    return false;
                }
            });

            return group;
        }

        function add(id, fn, time) {
            if (isUndefined(time)) {
                time = 0;
            }

            var group = getTimeoutGroupByTime(time, flushTime);
            if (!group) {
                group = timeoutGroup(time, flushTime);

                var added;
                recurve.forEach(timeoutGroups, function(existingGroup, index) {
                    if (existingGroup.time > time) {
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
        function invoke(id, time) {
            var group = getTimeoutGroupByTime(time);
            if (group) {
                group.invoke(id);
            }
        }

        function resetFlushTime() {
            flushTime = 0;

            recurve.forEach(timeoutGroups, function(group) {
                group.resetFlushTime();
            });

            recurve.stableSort(timeoutGroups, function defaultComparison(left, right) {
                if (left.time == right.time) {
                    return 0;
                }
                else if (left.time < right.time) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        }

        var $async = function(fn, time) {
            var id = window.setTimeout(function() {
                invoke(id, time);
            }, time);

            add(id, fn, time);

            return id;
        };

        return recurve.extend($async, {
            cancel: function(id) {
                recurve.forEach(timeoutGroups, function(group) {
                    group.remove(id);
                });
            },

            flush: function(maxTime) {
                if (0 === timeoutGroups.length) {
                    return;
                }

                flushTime = 0;

                // ensure timeouts added during invocation also get called
                while (timeoutGroups.length) {
                    var group = timeoutGroups[0];

                    if (!isUndefined(maxTime) && maxTime < group.time) {
                        timeoutGroups.unshift(group);
                        break;
                    }

                    timeoutGroups.shift();
                    flushTime = group.time;
                    group.invokeAll();
                }

                resetFlushTime();
            }
        });
    });
}