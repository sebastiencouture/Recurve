"use strict";

describe("recurveMock-$log", function() {
    var $log;

    beforeEach(function() {
        $invoke(["$log"], function(log) {
            $log = log;
        });
    });

    it("should be invokable", function() {
        expect($log).toBeDefined();
        expect(isFunction($log)).toEqual(false);
    });

    function testType(name) {
        describe(name, function() {
            it("should log to logs", function() {
                $log[name]("a");
                expect($log.logs[name].length).toEqual(1);
            });

            it("should log all arguments to array", function() {
                $log[name]("a", "b", "c");

                var log = $log.logs[name][0];
                expect(log[0]).toEqual("a");
                expect(log[1]).toEqual("b");
                expect(log[2]).toEqual("c");
            });

            it("should log multiple", function() {
                $log[name]("a");
                $log[name]("a");

                expect($log.logs[name].length).toEqual(2);
                expect($log.logs[name][0][0]).toEqual("a");
                expect($log.logs[name][1][0]).toEqual("a");
            });

            it("should not log if disabled", function() {
                $log[name + "Disable"]();
                $log[name]("a");

                expect($log.logs[name].length).toEqual(0);
            });
        });
    }

    testType("info");
    testType("debug");
    testType("warn");
    testType("error");

    it("should disable all", function() {
        $log.disable();

        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        expect($log.logs.info.length).toEqual(0);
        expect($log.logs.debug.length).toEqual(0);
        expect($log.logs.warn.length).toEqual(0);
        expect($log.logs.error.length).toEqual(0);
    });

    it("should clear all logs", function() {
        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        $log.clear();

        expect($log.logs.info.length).toEqual(0);
        expect($log.logs.debug.length).toEqual(0);
        expect($log.logs.warn.length).toEqual(0);
        expect($log.logs.error.length).toEqual(0);
    });
});