"use strict";

describe("$performance", function(){
    var $performance;
    var $log;
    var logs = {};
    var timer;

    function time(){
        logs.time.push(argumentsToArray(arguments));
    }

    function timeEnd(){
        logs.timeEnd.push(argumentsToArray(arguments));
    }

    var performance = {
        now: function() {
            logs.performance.push(logs.performance.length);
            return 0;
        }
    }

    beforeEach(function(){
        logs.time = [];
        logs.timeEnd = [];
        logs.performance = [];

        timer = null;

        $include(null, function($mockable){
            $mockable.value("$window", {
                console: {
                    time: time,
                    timeEnd: timeEnd
                },
                performance: performance
            })
        });

        $invoke(["$performance", "$log"], function(performance, log){
            $performance = performance;
            $log = log;
        });
    });

    it("should be invokable", function(){
        expect($performance).toBeDefined();
        expect(isFunction($performance)).toEqual(false);
    });

    it("should use console.time if available", function(){
        timer = $performance.start("a");
        $performance.end(timer);

        expect(logs.time.shift()).toEqual(["a"]);
        expect(logs.timeEnd.shift()).toEqual(["a"]);
    });

    it("should use $log.info with performance.now as backup", function(){
        $include(null, function($mockable){
            $mockable.value("$window", {
                console: {},
                performance: performance
            })
        });

        $invoke(["$performance", "$log"], function(performance, log){
            $performance = performance;
            $log = log;
        });

        timer = $performance.start("a");
        $performance.end(timer);

        expect($log.logs.info.first()).toEqual(["a: 0 ms"]);
        expect(logs.performance).toEqual([0, 1]);
    });

    it("should use $log.info with new Date() as last resort", function(){
        $include(null, function($mockable){
            $mockable.value("$window", {
                console: {}
            })
        });

        $invoke(["$performance", "$log"], function(performance, log){
            $performance = performance;
            $log = log;
        });

        timer = $performance.start("a");
        $performance.end(timer);

        expect(startsWith($log.logs.info.first()[0], "a:")).toEqual(true);
        expect(logs.performance.length).toEqual(0);
    });

    it("should not override timer with same message", function(){
        timer = $performance.start("a");
        var timerB = $performance.start("a");

        $performance.end(timer);
        $performance.end(timerB);

        expect(timer).not.toBe(timerB);
        expect(logs.time).toEqual([["a"],["a"]]);
        expect(logs.timeEnd).toEqual([["a"],["a"]]);
    });

    it("should log description to console.info", function(){
        timer = $performance.start("a");
        $performance.end(timer, "b");

        expect($log.logs.info.first()).toEqual(["b"]);
    });

    describe("end", function(){
        it("should do nothing for null timer", function(){
            $performance.end(null);
            expect(logs.timeEnd.length).toEqual(0);
        });

        it("should do nothing if disabled", function(){
            timer = $performance.start("a");

            $performance.disable();
            $performance.end(timer);

            expect(logs.time.length).toEqual(1);
            expect(logs.timeEnd.length).toEqual(0);
        });
    });
});