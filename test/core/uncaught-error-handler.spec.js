"use strict";

describe("$uncaughtErrorHandler", function() {
    var $window;
    var $log;
    var $errorHandler;
    var $uncaughtErrorHandler;

    beforeEach(function() {
        $invoke(["$window", "$log", "$errorHandler", "$uncaughtErrorHandler"], function(window, log, errorHandler, uncaughtErrorHandler) {
            $window = window;
            $log = log;
            $errorHandler = errorHandler;
            $uncaughtErrorHandler = uncaughtErrorHandler;
        });
    });

    it("should be invokable", function() {
        expect($uncaughtErrorHandler).toBeDefined();
        expect(isFunction($uncaughtErrorHandler)).toEqual(false);
    });

    it("should invoke $errorHandler", function() {
        $include(null, function($mockable) {
            $mockable.value("$errorHandler", jasmine.createSpy("$errorHandler"));
            $mockable.decorator("$errorHandler", null, function($delegate) {
                return $delegate;
            })
        });

        $invoke(["$window", "$errorHandler", "$uncaughtErrorHandler"], function(window, errorHandler, uncaughtErrorHandler) {
            $window = window;
            $errorHandler = errorHandler;
            $uncaughtErrorHandler = uncaughtErrorHandler;
        });

        $window.onerror("a");
        expect($errorHandler).toHaveBeenCalledWith(new Error("a"));
    })

    describe("error", function() {
        function getError() {
            return $errorHandler.errors[0];
        }

        it("should include message", function() {
            $window.onerror("a");
            expect(getError().message).toEqual("a");
        });

        it("should include file name", function() {
            $window.onerror("a", "a.jpg");
            expect(getError().fileName).toEqual("a.jpg");
        });

        it("should include line number", function() {
            $window.onerror("a", "a.jpg", 0);
            expect(getError().lineNumber).toEqual(0);
        });

        it("should default line number to undefined if not included", function() {
            $window.onerror("a");
            expect(getError().lineNumber).toEqual(undefined);
        });

        it("should include column number", function() {
            $window.onerror("a", "a.jpg", 0, 0);
            expect(getError().columnNumber).toEqual(0);
        });

        it("should default column number to undefined if not included", function() {
            $window.onerror("a");
            expect(getError().columnNumber).toEqual(undefined);
        });

        it("should include stack", function() {
            $window.onerror("a", "a.jpg", 0, 0, {stack: "stack"});
            expect(getError().stack).toEqual("stack");
        });

        it("should default stack to undefined if not included", function() {
            $window.onerror("a");
            expect(getError().stack).toEqual(undefined);
        });
    });

    describe("errored", function() {
        var callback;

        beforeEach(function() {
            callback = jasmine.createSpy("callback");

            $uncaughtErrorHandler.errored.on(callback);
            $window.onerror("a");
        });

        it("should trigger", function() {
            expect(callback).toHaveBeenCalled();
        });

        it("should include the error", function() {
            expect(callback).toHaveBeenCalledWith(new Error("a"));
        });
    });

    it("should set default warning message if no error information available due to CORS", function() {
        $window.onerror();
        expect($errorHandler.errors[0].message).toEqual("Due to CORS, no uncaught error info is available.");
    });

    it("should not add callback to window.onerror if disabled", function() {
        $window.onerror = null;

        $include(null, function($mockable) {
            $mockable.config("$uncaughtErrorHandler", {
                enable: false
            });
        });

        $invoke(["$window", "$uncaughtErrorHandler"], function(window, uncaughtErrorHandler) {
            $window = window;
            $uncaughtErrorHandler = uncaughtErrorHandler;
        });

        expect($window.onerror).toEqual(null);
    });
});