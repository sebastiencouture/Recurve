"use strict";

function addPerformanceService(module) {
    module.factory("$performance", ["$window", "$log", "$config"], function($window, $log, $config) {
        var disabled = $config.disabled;

        function timer() {
            var startTime;
            var message;

            return {
                start: function(msg) {
                    if (supportsConsoleTime()) {
                        $window.console.time(msg);
                    }
                    else {
                        startTime = performanceNow();
                    }

                    message = msg;
                },

                end: function(description) {
                    if (supportsConsoleTime()) {
                        $window.console.timeEnd(message);
                    }
                    else {
                        $log.info(message + ": " + (performanceNow() - startTime) + " ms");
                    }

                    if (description) {
                        $log.info(description);
                    }
                }
            };
        }

        function performanceNow() {
            return $window.performance && $window.performance.now ? $window.performance.now() : Date.now();
        }

        function supportsConsoleTime() {
            return $window.console && $window.console.time && $window.console.timeEnd;
        }

        return {
            start: function(message) {
                if (disabled) {
                    return;
                }

                var instance = timer();
                instance.start(message);

                return instance;
            },

            end: function(timer, description) {
                if (disabled || !timer) {
                    return;
                }

                timer.end(description);
            },

            disable: function(value) {
                if (undefined === value) {
                    value = true;
                }

                disabled = value;
            }
        };
    });

    module.config("$performance", {
        disabled: false
    });
}