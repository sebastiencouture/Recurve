"use strict";

describe("$globalErrorHandler", function(){
    var $globalErrorHandler;
    var $window;

    beforeEach(function(){
        // TODO TBD get rid of once implement mock $window/console
        $include(null, function($mockable) {
            $mockable.value("$window", {});
        });

        $invoke(["$globalErrorHandler", "$window"], function(globalErrorHandler, window){
            $globalErrorHandler = globalErrorHandler;
            $window = window;
        });
    });

    it("should be invokable", function(){
        expect($globalErrorHandler).toBeDefined();
        expect(isFunction($globalErrorHandler)).toEqual(false);
    });

    it("should trigger", function() {
        var called = false;
        $globalErrorHandler.errored.on(function(){
            called = true;
        });

        $window.onerror("test");

        expect(called).toEqual(true);
    });

    it("should log", function(){
        // TODO TBD once create mock for logging
    });

    describe("error description", function(){
        it("should log message", function(){
            var args;
            $globalErrorHandler.errored.on(function(){
                args = arguments;
            });

            $window.onerror("test");

            expect(args[0]).toEqual("message: test");
        });

        it("should log filename", function(){
            var args;
            $globalErrorHandler.errored.on(function(){
                args = arguments;
            });

            $window.onerror("test", "test.jpg");

            expect(args[0]).toEqual("message: test, filename: test.jpg");
        });

        it("should log line (including 0)", function(){
            var args;
            $globalErrorHandler.errored.on(function(){
                args = arguments;
            });

            $window.onerror("test", "test.jpg", 0);

            expect(args[0]).toEqual("message: test, filename: test.jpg, line: 0");
        });

        it("should log stack", function(){
            var args;
            $globalErrorHandler.errored.on(function(){
                args = arguments;
            });

            $window.onerror("test", "test.jpg", 0, 1, {stack: "stack"});

            expect(args[0]).toEqual("message: test, filename: test.jpg, line: 0, stack: stack");
        });
    });

    it("should disable", function(){
        var called = false;
        $globalErrorHandler.errored.on(function(){
            called = true;
        });

        $globalErrorHandler.disable()
        $window.onerror("test");

        expect(called).toEqual(false);
    });
});