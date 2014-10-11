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
        expect(isFunction($log)).toEqual(true);
    });

    describe("spy", function() {
        var spy;
        beforeEach(function() {
            spy = $log.logs.log;
        });

        describe("any", function() {
            it("should return true if any logged", function() {
                $log("a");
                expect(spy.any()).toEqual(true);
            });

            it("should return false otherwise", function() {
                expect(spy.any()).toEqual(false);
            });
        });

        describe("count", function() {
            it("should return count", function() {
                $log("a");
                $log("a");

                expect(spy.count()).toEqual(2);
            });

            it("should return 0 if none", function() {
                expect(spy.count()).toEqual(0);
            });
        });

        describe("argsFor", function() {
            it("should returns args", function() {
                $log("a");
                $log("a", "b");

                expect(spy.argsFor(0)).toEqual(["a"]);
                expect(spy.argsFor(1)).toEqual(["a", "b"]);
            });

            it("should return undefined for invalid index", function() {
                expect(spy.argsFor(0)).not.toBeDefined();
            });

            it("should return copy", function() {
                $log("a");

                var args = spy.argsFor(0);
                args.push("b");

                expect(spy.argsFor(0)).toEqual(["a"]);
            });
        });

        describe("allArgs", function() {
            it("should return all args as 2d array", function() {
                $log("a");
                $log("a", "b");

                expect(spy.allArgs()).toEqual([["a"], ["a", "b"]]);
            });

            it("should return copy", function() {
                $log("a");

                var allArgs = spy.allArgs();
                allArgs.push("b");

                expect(spy.allArgs()).toEqual([["a"]]);
            });
        });

        describe("mostRecent", function() {
            it("should return most recent", function() {
                $log("a");
                $log("b");
                $log("c");

                expect(spy.mostRecent()).toEqual(["c"]);
            });

            it("should return undefined if none", function() {
                expect(spy.mostRecent()).not.toBeDefined();
            });

            it("should return copy", function() {
                $log("a");

                var mostRecent = spy.mostRecent();
                mostRecent.push("b");

                expect(spy.mostRecent()).toEqual(["a"]);
            });
        });

        describe("first", function() {
            it("should return first", function() {
                $log("a");
                $log("b");
                $log("c");

                expect(spy.first()).toEqual(["a"]);
            });

            it("should return undefined if none", function() {
                expect(spy.first()).not.toBeDefined();
            });

            it("should return copy", function() {
                $log("a");

                var first = spy.first();
                first.push("a");

                expect(spy.first()).toEqual(["a"]);
            });
        });

        it("should clear all", function() {
            $log("a");
            $log("b");
            $log("c");

            spy.clear();

            expect(spy.any()).toEqual(false);
        });
    });

    function testLevel(level) {
        describe(level, function() {
            var log;

            beforeEach(function() {
                log = "log" === level ? $log : $log[level];
            });

            it("should log to logs", function() {
                log("a");
                expect($log.logs[level].count()).toEqual(1);
            });

            it("should log all arguments", function() {
                log("a", "b", "c");
                expect($log.logs[level].first()).toEqual(["a", "b", "c"]);
            });

            it("should log multiple", function() {
                log("a");
                log("a");

                expect($log.logs[level].count()).toEqual(2);
                expect($log.logs[level].argsFor(0)).toEqual(["a"]);
                expect($log.logs[level].argsFor(1)).toEqual(["a"]);
            });

            it("should not log if disabled", function() {
                $log[level + "Disable"]();
                log("a");

                expect($log.logs[level].count()).toEqual(0);
            });
        });
    }

    testLevel("log");
    testLevel("info");
    testLevel("debug");
    testLevel("warn");
    testLevel("error");

    it("should disable all", function() {
        $log.disable();

        $log("a");
        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        expect($log.logs.log.any()).toEqual(false);
        expect($log.logs.info.any()).toEqual(false);
        expect($log.logs.debug.any()).toEqual(false);
        expect($log.logs.warn.any()).toEqual(false);
        expect($log.logs.error.any()).toEqual(false);
    });

    it("should clear all logs", function() {
        $log("a");
        $log.info("a");
        $log.debug("a");
        $log.warn("a");
        $log.error("a");

        $log.clear();

        expect($log.logs.log.any()).toEqual(false);
        expect($log.logs.info.any()).toEqual(false);
        expect($log.logs.debug.any()).toEqual(false);
        expect($log.logs.warn.any()).toEqual(false);
        expect($log.logs.error.any()).toEqual(false);
    });
});