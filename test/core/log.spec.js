"use strict";

describe("$log", function() {
    var targetDescriptions = [];
    var targetMessages = [];
    var consoleLogs = [];

    var $log;

    function targetLog(description) {
        targetDescriptions.push(description);
        targetMessages.push(argumentsToArray(arguments, 1));
    }

    var logTarget = {
        info: targetLog,
        debug: targetLog,
        warn: targetLog,
        error: targetLog,
        clear: function(){
            targetDescriptions = [];
            targetMessages = [];
        }
    };

    beforeEach(function(){
        targetDescriptions = [];
        targetMessages = [];
        consoleLogs = [];

        $include(null, function($mockable){
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

            $mockable.factory("config.$log", ["$logConsole"], function($logConsole){
                return {
                    targets: [$logConsole, logTarget]
                };
            });
        });

        $invoke(["$log"], function(log){
            $log = log;
        });
    });

    it("should be invokable", function(){
        expect($log).toBeDefined();
        expect(isFunction($log)).toEqual(false);
    });

    describe("info", function(){
        it("should log message", function(){
            $log.info("a");

            expect(startsWith(targetDescriptions[0], "[INFO]")).toEqual(true);
            expect(targetMessages[0]).toEqual(["a"]);
        });

        it("should skip if disabled", function(){
            $log.infoDisable();
            $log.info("a");

            expect(targetDescriptions.length).toEqual(0);
            expect(targetMessages.length).toEqual(0);
        });
    });

    describe("debug", function(){
        it("should log message", function(){
            $log.debug("a");

            expect(startsWith(targetDescriptions[0], "[DEBUG]")).toEqual(true);
            expect(targetMessages[0]).toEqual(["a"]);
        });

        it("should skip if disabled", function(){
            $log.debugDisable();
            $log.debug("a");

            expect(targetDescriptions.length).toEqual(0);
            expect(targetMessages.length).toEqual(0);
        });
    });

    describe("warn", function(){
        it("should log message", function(){
            $log.warn("a");

            expect(startsWith(targetDescriptions[0], "[WARN]")).toEqual(true);
            expect(targetMessages[0]).toEqual(["a"]);
        });

        it("should skip if disabled", function(){
            $log.warnDisable();
            $log.warn("a");

            expect(targetDescriptions.length).toEqual(0);
            expect(targetMessages.length).toEqual(0);
        });
    });

    describe("error", function(){
        it("should log", function(){
            $log.error("a");

            expect(startsWith(targetDescriptions[0], "[ERROR]")).toEqual(true);
            expect(targetMessages[0]).toEqual(["a"]);
        });

        it("should skip if disabled", function(){
            $log.errorDisable();
            $log.error("a");

            expect(targetDescriptions.length).toEqual(0);
            expect(targetMessages.length).toEqual(0);
        });
    });

    it("should log with additional parameters", function(){
        $log.info("a", 1, 2, 3);

        expect(targetMessages[0]).toEqual(["a", 1, 2, 3]);
    });

    it("should log to all targets", function(){
        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        expect(targetMessages).toEqual([["a"], ["a"], ["a"], ["a"]]);
        expect(consoleLogs).toEqual(["info", "debug", "warn", "error"]);
    });

    it("should disable all: info, debug, warn, and error", function(){
        $log.disable();

        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        expect(targetMessages.length).toEqual(0);
        expect(consoleLogs.length).toEqual(0);
    });

    it("should clear all targets", function(){
        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        $log.clear();

        expect(targetMessages.length).toEqual(0);
        expect(consoleLogs.length).toEqual(0);
    });
});