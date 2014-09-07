var ObjectUtils = require("../src/utils/object.js");

describe("Recurve.Object", function() {

    describe("Objects", function() {
        var object;

        it("should detect {}", function() {
            object = {};
            expect(ObjectUtils.isObject(object)).toBe(true);
        });

        it("should detect new Object()", function() {
            object = new Object();
            expect(ObjectUtils.isObject(object)).toBe(true);
        });

        it("should detect {} with properties", function() {
            object = {name: "Sebastien"};
            expect(ObjectUtils.isObject(object)).toBe(true);
        });

        it("should NOT detect number", function() {
            object = 123;
            expect(ObjectUtils.isObject(object)).toBe(false);
        });
    });

    describe("Errors", function() {
        var error;

        it("should detect new Error()", function() {
            error = new Error();
            expect(ObjectUtils.isError(error)).toBe(true);
        });

        it("should NOT detect number", function() {
            error = 123;
            expect(ObjectUtils.isError(error)).toBe(false);
        });
    });

    describe("Strings", function() {
        var string;

        it("should detect empty string", function() {
            string = "";
            expect(ObjectUtils.isString(string)).toBe(true);
        });

        it("should detect string", function() {
            string = "test string";
            expect(ObjectUtils.isString(string)).toBe(true);
        });

        it("should detect new String()", function() {
            string = new String("test string");
            expect(ObjectUtils.isString(string)).toBe(true);
        });

        it("should NOT detect number", function() {
            string = 123;
            expect(ObjectUtils.isString(string)).toBe(false);
        });
    });

    describe("Arrays", function() {
        var array;

        it("should detect empty array", function() {
            array = [];
            expect(ObjectUtils.isArray(array)).toBe(true);
        });

        it("should detect array with items", function() {
            array = [1, 2];
            expect(ObjectUtils.isArray(array)).toBe(true);
        });

        it("should detect new Array()", function() {
            array = new Array();
            expect(ObjectUtils.isArray(array)).toBe(true);
        });

        it("should detect new Array() with items", function() {
            array = new Array(1, 2);
            expect(ObjectUtils.isArray(array)).toBe(true);
        });

        it("should NOT detect number", function() {
            array = 123;
            expect(ObjectUtils.isArray(array)).toBe(false);
        });
    });

    describe("Functions", function() {
        var func;

        it("should detect anonymous function", function() {
            func = function(){};
            expect(ObjectUtils.isFunction(func)).toBe(true);
        });

        it("should NOT detect number", function() {
            func = 123;
            expect(ObjectUtils.isFunction(func)).toBe(false);
        });
    });
});