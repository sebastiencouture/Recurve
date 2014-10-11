"use strict";

describe("$log-console", function() {
    var $logConsole;
    var logs = [];
    var log;
    var info;
    var warn;
    var debug;
    var error;
    var clear;

    beforeEach(function() {
        logs = [];

        log = function() {
            logs.push("log");
        };
        info = function() {
            logs.push("info");
        };
        warn = function() {
            logs.push("warn");
        };
        debug = function() {
            logs.push("debug");
        };
        error = function() {
            logs.push("error");
        };
        clear = function() {
            logs = []
        };

        $include(null, function($mockable) {
            $mockable.value("$window", {
                console: {
                    log: log,
                    info: info,
                    warn: warn,
                    debug: debug,
                    error: error,
                    clear: clear
                }
            });
        });

        $invoke(["$logConsole"], function(logConsole) {
            $logConsole = logConsole;
        });
    });

    it("should be invokable", function() {
        expect($logConsole).toBeDefined();
        expect(isFunction($logConsole)).toEqual(true);
    });

    it("should use console if present", function() {
        $logConsole("a");
        $logConsole.info("a");
        $logConsole.debug("a");
        $logConsole.warn("a");
        $logConsole.error("a");

        expect(logs).toEqual(["log", "info", "debug", "warn", "error"]);
    });

    it("should use console.log if others are not present", function() {
        $include(null, function($mockable){
            $mockable.value("$window", {
                console: {
                    log: log
                }
            });
        });

        $invoke(["$logConsole"], function(logConsole){
            $logConsole = logConsole;
        });

        $logConsole("a");
        $logConsole.info("a");
        $logConsole.debug("a");
        $logConsole.warn("a");
        $logConsole.error("a");

        expect(logs).toEqual(["log", "log", "log", "log", "log"]);
    });

    it("should do nothing if no console", function(){
        $include(null, function($mockable){
            $mockable.value("$window", {
                console: {}
            });
        });

        $invoke(["$logConsole"], function(logConsole){
            $logConsole = logConsole;
        });

        $logConsole("a");
        $logConsole.info("a");
        $logConsole.debug("a");
        $logConsole.warn("a");
        $logConsole.error("a");

        expect(logs.length).toEqual(0);
    });

    it("should clear if available", function() {
        $logConsole("a");
        $logConsole.info("a");
        $logConsole.debug("a");
        $logConsole.warn("a");
        $logConsole.error("a");

        $logConsole.clear();

        expect(logs.length).toEqual(0);
    });

    it("should not clear if clear not available", function() {
        $include(null, function($mockable) {
            $mockable.value("$window", {
                console: {
                    log: log,
                    info: info,
                    warn: warn,
                    debug: debug,
                    error: error
                }
            });
        });

        $invoke(["$logConsole"], function(logConsole) {
            $logConsole = logConsole;
        });

        $logConsole("a")
        $logConsole.info("a");
        $logConsole.debug("a");
        $logConsole.warn("a");
        $logConsole.error("a");

        $logConsole.clear();

        expect(logs).toEqual(["log", "info", "debug", "warn", "error"]);
    });

    describe("IE apply", function() {
        beforeEach(function(){
            function logger(type) {
                return function(){
                    logs.push(type + ";" + argumentsToArray(arguments).join(";"));
                }
            };

            log = logger("log");
            info = logger("info");
            warn = logger("warn");
            debug = logger("debug");
            error = logger("error");

            log.apply = log.call = null;
            info.apply = info.call = null;
            warn.apply = warn.call = null;
            debug.apply = debug.call = null;
            error.apply = error.call = null;

            $include(recurve.module(), function($mockable) {
                $mockable.value("$window", {
                    console: {
                        log: log,
                        info: info,
                        warn: warn,
                        debug: debug,
                        error: error,
                        clear: clear
                    }
                });
            });

            $invoke(["$logConsole"], function(logConsole) {
                $logConsole = logConsole;
            });
        });

        it("should log first argument (description)", function() {
            $logConsole("a");
            $logConsole.info("a");
            $logConsole.debug("a");
            $logConsole.warn("a");
            $logConsole.error("a");

            expect(logs).toEqual(["log;a", "info;a", "debug;a", "warn;a", "error;a"]);
        });

        it("should log second argument (message) if included", function() {
            $logConsole("a", 1);
            $logConsole.info("a", 1);
            $logConsole.debug("a", 1);
            $logConsole.warn("a", 1);
            $logConsole.error("a", 1);

            expect(logs).toEqual(["log;a;1", "info;a;1", "debug;a;1", "warn;a;1", "error;a;1"]);
        });

        it("should log third argument (first additional arg) if included", function() {
            $logConsole("a", 1, 2);
            $logConsole.info("a", 1, 2);
            $logConsole.debug("a", 1, 2);
            $logConsole.warn("a", 1, 2);
            $logConsole.error("a", 1, 2);

            expect(logs).toEqual(["log;a;1;2", "info;a;1;2", "debug;a;1;2", "warn;a;1;2", "error;a;1;2"]);
        });
    });
});
