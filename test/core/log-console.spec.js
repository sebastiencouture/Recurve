"use strict";

describe("$log-console", function(){
    var logConsole;
    var logs = [];

    beforeEach(function() {
        logs = [];

        $include(recurve.module(), function($mockable){
            $mockable.value("$window", {
                console: {
                    log: function() {
                        logs.push("log");
                    },
                    info: function() {
                        logs.push("info");
                    },
                    warn: function() {
                        logs.push("warn");
                    },
                    debug: function() {
                        logs.push("debug");
                    },
                    error: function() {
                        logs.push("error");
                    }
                }
            });
        });

        $invoke(["$logConsole"], function($logConsole){
            logConsole = $logConsole;
        });
    });

    it("should be invokable", function(){
        expect(logConsole).toBeDefined();
        expect(isFunction(logConsole)).toEqual(false);
    });

    it("should use console if present", function(){
        logConsole.info("a");
        logConsole.debug("a");
        logConsole.warn("a");
        logConsole.error("a");

        expect(logs).toEqual(["info", "debug", "warn", "error"]);
    });

    it("should use console.log if others are not present", function(){
        $include(recurve.module(), function($mockable){
            $mockable.value("$window", {
                console: {
                    log: function() {
                        logs.push("log");
                    }
                }
            });
        });

        $invoke(["$logConsole"], function($logConsole){
            logConsole = $logConsole;
        });

        logConsole.info("a");
        logConsole.debug("a");
        logConsole.warn("a");
        logConsole.error("a");

        expect(logs).toEqual(["log", "log", "log", "log"]);
    });

    it("should do nothing if no console", function(){

    });

    it("should clear if available", function(){

    });

    it("should work in IE when console doesn't have an apply method", function(){

    });
});
