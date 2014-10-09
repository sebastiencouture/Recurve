"use strict";

describe("$errorHandler", function() {
    var $errorHandler;
    var $log;

    beforeEach(function() {
        $include(null, function($mockable) {
            $mockable.decorator("$errorHandler", null, function($delegate) {
                return $delegate;
            });
        });

        $invoke(["$log", "$errorHandler"], function(log, errorHandler) {
            $log = log;
            $errorHandler = errorHandler;
        });
    });

    it("should be invokable", function() {
        expect($errorHandler).toBeDefined();
        expect(isFunction($errorHandler)).toEqual(true);
    });

    it("should log to log.error", function() {
        $errorHandler(new Error("a"));
        expect($log.logs.error[0][0]).toEqual(new Error("a"));
    });

    describe("protectedInvoke", function() {
        it("should invoke the function", function() {
            var fn = jasmine.createSpy("fn");
            $errorHandler.protectedInvoke(fn);

            expect(fn).toHaveBeenCalled();
        });

        it("should log error if function throws", function() {
            $errorHandler.protectedInvoke(function() {
                throw new Error("a");
            });

            expect($log.logs.error[0][0]).toEqual(new Error("a"));
        });
    });
});