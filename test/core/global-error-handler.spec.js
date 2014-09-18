"use strict";

describe("$globalErrorHandler", function(){
    var $globalErrorHandler;
    var $window;

    beforeEach(function(){
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
        var args;

        $globalErrorHandler.errored.on(function(){
            called = true;
            args = arguments;
        })

        $globalErrorHandler.handleError(new Error("test"));

        expect(args).toEqual("");
        expect(called).toEqual(true);
    });

    it("should log", function(){

    });

    describe("error description", function(){

    });

    describe("browser handle", function(){
        it("should prevent", function(){

        });

        it("should allow", function(){

        });
    });

    it("should disable", function(){

    });

    describe("handleError", function(){

    });
});