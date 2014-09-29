"use strict";

function addMockTimeoutService(module) {
    module.factory("$timeout", null, function() {
        function timeoutGroup(time) {
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

        var timeoutGroups = [];

        function getTimeoutGroupByTime(time) {
            var group = null;
            recurve.forEach(timeoutGroups, function(possibleGroup) {
                if (possibleGroup.time === time) {
                    group = possibleGroup;
                    return false;
                }
            });

            return group;
        }

        function add(id, fn, time) {
            var group = getTimeoutGroupByTime(time);
            if (!group) {
                group = timeoutGroup(time);

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

        function invoke(id, time) {
            var group = getTimeoutGroupByTime(time);
            if (group) {
                group.invoke(id);
            }
        }

        var $timeout = function(fn, time) {
            var id = window.setTimeout(function() {
                invoke(id, time);
            }, time);

            add(id, fn, time);

            return id;
        };

        return recurve.extend($timeout, {
            cancel: function(id) {
                recurve.forEach(timeoutGroups, function(group) {
                    group.remove(id);
                });
            },

            flush: function(maxTime) {
                var maxIndex = undefined;
                forEach(timeoutGroups, function(group, index) {
                    if (maxTime < group.time) {
                        return;
                    }

                    group.invokeAll();
                    maxIndex = index;
                });

                if (!recurve.isUndefined(maxIndex)) {
                    timeoutGroups.splice(0, maxIndex + 1);
                }
            }
        });
    });
}