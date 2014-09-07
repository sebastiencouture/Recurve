describe("common", function(){
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