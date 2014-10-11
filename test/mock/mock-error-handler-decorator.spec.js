"use strict";

describe("recurveMock-$errorHandler decorator", function() {
    var $log;
    var $errorHandler;

    function getLoggedError() {
        return $log.logs.error.first()[0];
    }

    beforeEach(function() {
        $invoke(["$log", "$errorHandler"], function(log, errorHandler) {
            $log = log;
            $errorHandler = errorHandler;
        });
    });

    it("should be invokable", function() {
        expect($errorHandler).toBeDefined();
        expect(isFunction($errorHandler)).toEqual(true);
    });

    describe("logErrors", function() {
        it("should log error", function() {
            $errorHandler(new Error("a"));
            expect(getLoggedError()).toEqual(new Error("a"));
        });

        it("should log error for protectedInvoke(..)", function() {
            $errorHandler.protectedInvoke(function() {
                throw new Error("a");
            });

            expect(getLoggedError()).toEqual(new Error("a"));
        });

        it("should store all errors", function() {
            $errorHandler(new Error("a"));
            $errorHandler(new Error("b"));

            expect($errorHandler.errors.length).toEqual(2);
            expect($errorHandler.errors[0]).toEqual(new Error("a"));
            expect($errorHandler.errors[1]).toEqual(new Error("b"));
        });
    });

    describe("throwErrors", function() {
        beforeEach(function() {
            $errorHandler.throwErrors();
        });

        it("should re-throw error", function() {
            expect(function() {
                $errorHandler(new Error("a"));
            }).toThrow(new Error("a"));
        });

        it("should throw error for protectedInvoke(..)", function() {
            expect(function() {
                $errorHandler.protectedInvoke(function() {
                    throw new Error("a");
                });
            }).toThrow(new Error("a"));
        });

        it("should store all errors", function() {
            $errorHandler.throwErrors();

            expect(function() {
                $errorHandler(new Error("a"));
            }).toThrow();
            expect(function() {
                $errorHandler(new Error("b"));
            }).toThrow();

            expect($errorHandler.errors.length).toEqual(2);
            expect($errorHandler.errors[0]).toEqual(new Error("a"));
            expect($errorHandler.errors[1]).toEqual(new Error("b"));
        });
    });

    it("should allow to switch between logging and re-throwing errors", function() {
        $errorHandler(new Error("a"));
        expect($log.logs.error.mostRecent()[0]).toEqual(new Error("a"));
        expect($errorHandler.errors[0]).toEqual(new Error("a"));

        $errorHandler.throwErrors();

        expect(function() {
            $errorHandler(new Error("b"));
        }).toThrow(new Error("b"));
        expect($errorHandler.errors[1]).toEqual(new Error("b"));

        $errorHandler.logErrors();

        $errorHandler(new Error("c"));
        expect($log.logs.error.mostRecent()[0]).toEqual(new Error("c"));
        expect($errorHandler.errors[2]).toEqual(new Error("c"));
    });
});