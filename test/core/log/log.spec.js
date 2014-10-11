"use strict";

describe("$log", function() {
    var targetTimestamps = [];
    var targetMessages = [];
    var consoleLogs = [];

    var $log;

    function logTarget(timestamp) {
        targetTimestamps.push(timestamp);
        targetMessages.push(argumentsToArray(arguments, 1));
    };

    extend(logTarget, {
        info: logTarget,
        debug: logTarget,
        warn: logTarget,
        error: logTarget,

        clear: function() {
            targetTimestamps = [];
            targetMessages = [];
        }
    });

    function setup(includeTimestamp) {
        targetTimestamps = [];
        targetMessages = [];
        consoleLogs = [];

        $include(null, function($mockable) {
            addLogService($mockable);

            $mockable.value("$window", {
                console: {
                    log: function(){
                        consoleLogs.push("log");
                    },
                    info: function(){
                        consoleLogs.push("info");
                    },
                    warn: function(){
                        consoleLogs.push("warn");
                    },
                    debug: function(){
                        consoleLogs.push("debug");
                    },
                    error: function(){
                        consoleLogs.push("error");
                    },
                    clear: function(){
                        consoleLogs = [];
                    }
                }
            });

            $mockable.factory("config.$log", ["$logConsole"], function($logConsole) {
                return {
                    targets: [$logConsole, logTarget],
                    includeTimestamp: includeTimestamp
                };
            });
        });

        $invoke(["$log"], function(log) {
            $log = log;
        });
    }

    beforeEach(function() {
        setup(false);
    });

    it("should be invokable", function() {
        expect($log).toBeDefined();
        expect(isFunction($log)).toEqual(true);
    });

    function testLevel(level) {
        describe(level, function() {
            var log;

            beforeEach(function() {
               log = "log" === level ? $log : $log[level];
            });

            it("should log message", function() {
                log("a");

                expect(targetMessages[0]).toEqual(["a"]);
            });

            it("should not if disabled", function() {
                $log[level + "Disable"]();
                log("a");

                expect(targetMessages.length).toEqual(0);
            });

            it("should log to target", function() {
                log("a");
                expect(consoleLogs).toEqual([level]);
            });

            it("should not log timestamp if disabled", function() {
                log("a");
                expect(targetTimestamps[0].length).toEqual(0);
            });

            it("should log timestamp if enabled", function() {
                setup(true);
                log = "log" === level ? $log : $log[level];

                log("a");
                expect(targetTimestamps[0]).toMatch(/[0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2,3}/);
            });
        });
    }

    testLevel("log");
    testLevel("info");
    testLevel("debug");
    testLevel("warn");
    testLevel("error");

    it("should log with additional parameters", function() {
        $log("a", 1, 2, 3);

        expect(targetMessages[0]).toEqual(["a", 1, 2, 3]);
    });

    it("should log to all targets", function() {
        $log("a");
        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        expect(targetMessages).toEqual([["a"], ["a"], ["a"], ["a"], ["a"]]);
        expect(consoleLogs).toEqual(["log", "info", "debug", "warn", "error"]);
    });

    it("should disable all: log, info, debug, warn, and error", function() {
        $log.disable();

        $log("a");
        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        expect(targetMessages.length).toEqual(0);
        expect(consoleLogs.length).toEqual(0);
    });

    it("should clear all targets", function() {
        $log("a");
        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        $log.clear();

        expect(targetMessages.length).toEqual(0);
        expect(consoleLogs.length).toEqual(0);
    });
});