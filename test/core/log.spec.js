"use strict";

describe("$log", function() {
    var logs = [];
    function log(message) {
        logs.push(message);
    }

    var logTarget = {
        info: log,
        debug: log,
        warn: log,
        error: log,
        clear: function(){
            logs = [];
        }
    };

    it("should be invokable", function(){
        $invoke(["$log"], function($log){
            expect($log).toBeDefined();
            expect(isFunction($log)).toEqual(false);
        })
    });

    it("should be configurable", function(){
        var module = recurve.module()
        module.value("config.$log", {targets: []})
    });

    describe("info", function(){
        it("should log", function(){

        });

        it("should skip if disabled", function(){

        });
    });

    describe("debug", function(){
        it("should log", function(){

        });

        it("should skip if disabled", function(){

        });
    });

    describe("warn", function(){
        it("should log", function(){

        });

        it("should skip if disabled", function(){

        });
    });

    describe("error", function(){
        it("should log", function(){

        });

        it("should pass error if does not have trace", function(){

        });

        it("should print stack", function(){

        });

        it("should print line", function(){

        });

        it("should skip if disabled", function(){

        });
    });

    it("should log with additional parameters", function(){

    });

    it("should log to all targets", function(){

    });

    it("should disable all: info, debug, warn, and error", function(){

    });

    it("should clear all targets", function(){

    });
});