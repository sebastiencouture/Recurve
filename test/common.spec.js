"use strict";

describe("common", function(){
    describe("removeItem", function() {
        it("should handle null", function(){
            removeItem();
        });

        it("should remove item", function() {
            var array = ["a", "b"];
            removeItem(array, "a");

            expect(array).toEqual(["b"]);
        });

        it("should handle item doesn't exist", function(){
            var array = ["a", "b"];
            removeItem(array, "c");

            expect(array).toEqual(["a", "b"]);
        });
    });

    describe("removeAt", function() {
        it("should handle null", function(){
            removeAt();
        });

        it("should remove at", function() {
            var array = ["a", "b"];
            removeAt(array, 1);

            expect(array).toEqual(["a"]);
        });

        it("should handle invalid index", function(){
            var array = ["a", "b"];
            removeItem(array, -1);

            expect(array).toEqual(["a", "b"]);
        });
    });

    describe("isEmpty", function(){
        it("should handle null", function(){
            expect(isEmpty()).toBe(true);
        });

        it("should handle empty array", function(){
            expect(isEmpty([])).toBe(true);
        });

        it("should handle array with values", function() {
            expect(isEmpty([1])).toBe(false);
        });
    });

    describe("argumentsToArray", function(){
        var array;
        function test(){
            console.log(arguments);
            array = argumentsToArray(arguments);
        }

        beforeEach(function(){
            array = null;
        });

        it("should convert empty arguments", function(){
            test();
            expect(array).toEqual([]);
        });

        it("should convert non empty arguments", function(){
            test("a", "b");
            expect(array).toEqual(["a", "b"]);
        });

        it("should convert non empty arguments", function(){
            function testSliceFirst(){
                array = argumentsToArray(arguments, 1);
            }

            testSliceFirst("a", "b");
            expect(array).toEqual(["b"]);
        });
    });

    describe("isObject", function() {
        var object;

        it("should detect {}", function() {
            object = {};
            expect(isObject(object)).toBe(true);
        });

        it("should detect new Object()", function() {
            object = new Object();
            expect(isObject(object)).toBe(true);
        });

        it("should detect {} with properties", function() {
            object = {name: "Sebastien"};
            expect(isObject(object)).toBe(true);
        });

        it("should NOT detect number", function() {
            object = 123;
            expect(isObject(object)).toBe(false);
        });
    });

    describe("isError", function() {
        var error;

        it("should detect new Error()", function() {
            error = new Error();
            expect(isError(error)).toBe(true);
        });

        it("should NOT detect number", function() {
            error = 123;
            expect(isError(error)).toBe(false);
        });
    });

    describe("isString", function() {
        var string;

        it("should detect empty string", function() {
            string = "";
            expect(isString(string)).toBe(true);
        });

        it("should detect string", function() {
            string = "test string";
            expect(isString(string)).toBe(true);
        });

        it("should detect new String()", function() {
            string = new String("test string");
            expect(isString(string)).toBe(true);
        });

        it("should NOT detect number", function() {
            string = 123;
            expect(isString(string)).toBe(false);
        });
    });

    describe("isArray", function() {
        var array;

        it("should detect empty array", function() {
            array = [];
            expect(isArray(array)).toBe(true);
        });

        it("should detect array with items", function() {
            array = [1, 2];
            expect(isArray(array)).toBe(true);
        });

        it("should detect new Array()", function() {
            array = new Array();
            expect(isArray(array)).toBe(true);
        });

        it("should detect new Array() with items", function() {
            array = new Array(1, 2);
            expect(isArray(array)).toBe(true);
        });

        it("should NOT detect number", function() {
            array = 123;
            expect(isArray(array)).toBe(false);
        });
    });

    describe("isFunction", function() {
        var func;

        it("should detect anonymous function", function() {
            func = function(){};
            expect(isFunction(func)).toBe(true);
        });

        it("should NOT detect number", function() {
            func = 123;
            expect(isFunction(func)).toBe(false);
        });
    });
});