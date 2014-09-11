"use strict";

describe("common", function(){

    describe("forEach", function(){
        it("should not throw error for null/undefined parameters", function(){
            forEach();
            forEach({});
        });

        it("should iterate items in array", function(){
            var array = [1,2,3];
            var items = [];
            var indices = [];

            forEach(array, function(item, index, iterated) {
                items.push(item);
                indices.push(index);

                expect(array).toBe(iterated);
            });

            expect(array).toEqual(items);
            expect(indices).toEqual([0,1,2]);
        });

        it("should iterate keys in object", function(){
            var obj = {"a": 1, "b": 2, "c": null};
            var keys = [];
            var values = [];

            forEach(obj, function(value, key, iterated){
                values.push(value);
                keys.push(key);

                expect(obj).toBe(iterated);
            });

            expect(keys).toEqual(["a", "b", "c"]);
            expect(values).toEqual([1,2, null]);
        });

        it("should break from iteration of an array", function(){
            var array = [1,2,3];
            var items = [];

            forEach(array, function(item) {
                items.push(item);
                return false;
            });

            expect(items).toEqual([1]);
        });

        it("should break from iteration of an object", function(){
            var obj = {"a": 1, "b": 2, "c": null};
            var values = [];

            forEach(obj, function(value) {
                values.push(value);
                return false;
            });

            expect(values).toEqual([1]);
        });
    });

    describe("find", function(){
        it("should not thrown an error for null/undefined parameters", function(){
            find();
            find({});
            find({}, "a");
        });

        it("should find property with value in an object", function(){
            var obj = {"a": 1, "b": 2, "c": 3};
            var found = find(obj, "a", 1);

            expect(found).toEqual(1);
        });

        it("should find property with value in an array", function() {
            var array = [1,2,3,4,5];
            var found = find(array, null, 2);

            expect(found).toEqual(2);
        });

        it("should find first object with property, value in an array of objects", function(){
            var array = [];
            array.push({"a": 1, "b": 2});
            array.push({"c": 3, "d": 6});
            array.push({"c": 4});

            var found = find(array, "c", 3);
            expect(found).toEqual({"c": 3, "d": 6});
        });

        it("should return null if not found", function(){
            var array = [1,2,3,4,5];
            var found = find(array, null, 99);

            expect(found).toEqual(null);
        });

        it("should only find with strict equality", function(){
            var array = [1,2,3,4,5];
            var found = find(array, null, "1");

            expect(found).toEqual(null);
        });
    });

    describe("areEqual", function(){
        var equal;

        it("should detect strict equality", function(){
            equal = areEqual(1,1);
            expect(equal).toBe(true);

            equal = areEqual("1", "1");
            expect(equal).toBe(true);
        });

        it("should not detect ==", function(){
            equal = areEqual(1, "1");
            expect(equal).toBe(false);
        });

        it("should detect arrays with all values passing strict equality", function(){
            equal = areEqual(["a", "b", "c"], ["a", "b", "c"]);
            expect(equal).toBe(true);
        });

        it("should not detect arrays with different lengths", function(){
            equal = areEqual(["a"], ["a", "b"]);
            expect(equal).toBe(false);
        });

        it("should detect objects with all keys passing strict equality", function(){
            var a = {a:1,b:2,c:3};
            var b = {a:1,b:2,c:3};

            equal = areEqual(a, b);
            expect(equal).toBe(true);
        });

        it("should not detect objects with same keys but different values", function(){
            var a = {a:1,b:2,c:99};
            var b = {a:1,b:2,c:3};

            equal = areEqual(a, b);
            expect(equal).toBe(false);
        });

        it("should detect equal dates", function(){
            var a = new Date(2014, 9, 10);
            var b = new Date(2014, 9, 10);

            equal = areEqual(a, b);
            expect(equal).toBe(true);
        });

        it("should not detect different dates", function(){
            var a = new Date(2015, 9, 10);
            var b = new Date(2014, 9, 10);

            equal = areEqual(a, b);
            expect(equal).toBe(false);
        })

        it("should detect both are NaN", function(){
            equal = areEqual(NaN, NaN);
            expect(equal).toBe(true);
        });
    });

    describe("isEmpty", function(){
        it("should detect empty array", function(){
            expect(isEmpty([])).toEqual(true);
        });

        it("should not detect array with values", function() {
            expect(isEmpty([1])).toEqual(false);
        });

        it("should detect null", function(){
            expect(isEmpty()).toEqual(true);
        });

        it("should detect empty object", function(){
            expect(isEmpty({})).toEqual(true);
        });

        it("should detect undefined", function(){
            expect(isEmpty(undefined)).toEqual(true);
        });

        it("should detect empty string", function(){
            expect(isEmpty("")).toEqual(true);
        });

        it("should not detect non empty string", function(){
            expect(isEmpty("sebastien")).toEqual(false);
        });

        it("should detect empty function arguments", function(){
            function test(){
                expect(isEmpty(arguments)).toEqual(true);
            }

            test();
        });

        it("should not detect function arguments", function(){
            function test(){
                expect(isEmpty(arguments)).toEqual(false);
            }

            test("1");
        });
    });

    describe("isNaN", function(){
        it("should detect NaN", function(){
            expect(isNaN(NaN)).toEqual(true);
        });

        it("should not detect undefined", function(){
            expect(isNaN(undefined)).toEqual(false);
        });

        it("should not detect null", function(){
            expect(isNaN(null)).toEqual(false);
        });

        it("should not detect 0", function(){
            expect(isNaN(0)).toEqual(false);
        });
    });

    describe("isSameType", function(){
        it("should detect same typeof objects", function(){
            expect(isSameType("a", "b")).toEqual(true);
        });

        it("should not detect of different types", function(){
           expect(isSameType("1", 1)).toEqual(false);
        });

        it("should not detect string literal same as new String", function(){
           expect(isSameType("1", new String("1"))).toEqual(false);
        });
    });

    describe("isObject", function() {
        var object;

        it("should detect {}", function() {
            object = {};
            expect(isObject(object)).toEqual(true);
        });

        it("should detect new Object()", function() {
            object = new Object();
            expect(isObject(object)).toEqual(true);
        });

        it("should detect {} with properties", function() {
            object = {name: "Sebastien"};
            expect(isObject(object)).toEqual(true);
        });

        it("should detect arrays", function(){
            object = [1,2,3];
            expect(isObject(object)).toEqual(true);
        });

        it("should detect function arguments", function(){
            function test(){
                expect(isObject(arguments)).toEqual(true);
            }

            test();
        });

        it("should detect functions", function(){
            object = function(){};
            expect(isObject(object)).toEqual(true);
        });

        it("should not detect undefined", function() {
            expect(isObject(undefined)).toEqual(false);
        });

        it("should not detect null", function(){
            expect(isObject(null)).toEqual(false);
        });

        it("should not detect literal string", function(){
           expect(isObject("sebastien")).toEqual(false);
        });

        it("should detect new String()", function(){
           expect(isObject(new String("sebastien"))).toEqual(true);
        });

        it("should not detect number", function(){
           expect(isObject(1)).toEqual(false);
        });

        it("should not detect boolean", function(){
            expect(isObject(true)).toEqual(false);
        })
    });

    describe("isError", function() {
        var error;

        it("should detect new Error()", function() {
            error = new Error();
            expect(isError(error)).toBe(true);
        });

        it("should not detect different type", function() {
            error = 123;
            expect(isError(error)).toBe(false);
        });
    });

    describe("isString", function() {
        var string;

        it("should detect empty string", function() {
            string = "";
            expect(isString(string)).toEqual(true);
        });

        it("should detect string", function() {
            string = "test string";
            expect(isString(string)).toEqual(true);
        });

        it("should detect new String()", function() {
            string = new String("test string");
            expect(isString(string)).toEqual(true);
        });

        it("should not detect numbers", function() {
            expect(isString(123)).toEqual(false);
        });
    });

    describe("isArray", function() {
        var array;

        it("should detect empty array", function() {
            array = [];
            expect(isArray(array)).toEqual(true);
        });

        it("should detect array with items", function() {
            array = [1, 2];
            expect(isArray(array)).toEqual(true);
        });

        it("should detect new Array()", function() {
            array = new Array();
            expect(isArray(array)).toEqual(true);
        });

        it("should not detect undefined", function() {
            expect(isArray(undefined)).toEqual(false);
        });

        it("should not detect function arguments", function(){
            function test(){
                expect(isArray(arguments)).toEqual(false);
            }

            test();
        })
    });

    describe("isFunction", function() {
        it("should detect functions", function(){
            expect(isFunction(describe)).toEqual(true);
        });

        it("should detect anonymous function", function() {
            expect(isFunction(function(){})).toEqual(true);
        });

        it("should not detect undefined", function() {
            expect(isFunction(undefined)).toEqual(false);
        });

        it("should not detect arrays", function(){
            expect(isFunction([1,2])).toEqual(false);
        });

        it("should not detect strings", function(){
            expect(isFunction("sebastien")).toEqual(false);
        });
    });

    describe("isDate", function(){
        it("should detect date instance", function(){
            expect(isDate(new Date())).toEqual(true);
        });

        it("should not detect numbers", function(){
           expect(isDate(123)).toEqual(false);
        });

        it("should not detect objects", function(){
           expect(isDate({})).toEqual(false);
        });
    });

    describe("isFile", function(){
        // TODO TBD anyway to test this without a form?
    });

    describe("isNumber", function(){
        it("should detect number", function() {
           expect(isNumber(1)).toEqual(true);
        });

        it("should not detect numeric strings", function(){
            expect(isNumber("1")).toEqual(false);
        });

        it("should not detect undefined as number", function(){
            expect(isNumber()).toEqual(false);
        });

        it("should detect NaN as number", function(){
            expect(isNumber(NaN)).toEqual(true);
        });

        it("should detect infinity as number", function(){
            expect(isNumber(Number.POSITIVE_INFINITY)).toEqual(true);
        });
    });

    describe("extend", function(){
        it("should extend existing object with set of properties", function(){
            var a = {a:1, b:2};
            var b = {c:3};

            extend(a, b);
            expect(a).toEqual({a:1, b:2, c:3});
        });

        it("should override existing properties", function(){
            var a = {a:1, b:2};
            var b = {a:4, c:3};

            extend(a, b);
            expect(a).toEqual({a:4, b:2, c:3});
        });

        it("should not create a new object", function(){
            var a = {a:1, b:2};
            var b = {c:3};

            var c = extend(a, b);
            expect(a).toBe(c);
        });

        it("should not throw an error for null/undefined", function(){
            extend();
            extend({});
        });

        it("extending null/undefined returns null/undefined", function(){
            var result = extend();
            expect(result).toBe(undefined);

            result = extend(null);
            expect(result).toBe(null);
        })
    });

    describe("clone", function(){
        var cloned;

        it("should shallow clone an array", function(){
            var array = [1, "2", 3];
            cloned = clone(array);

            expect(cloned).toEqual([1, "2", 3]);
            expect(cloned).not.toBe(array);
        });

        it("should shallow clone an object", function(){
            var obj = {a: 1, b: "2", c:3};
            cloned = clone(obj);

            expect(cloned).toEqual({a:1, b:"2", c:3});
            expect(cloned).not.toBe(obj);
        });

        it("changes to shallow attributes should not affect the original", function(){
            var obj = {a: 1};
            cloned = clone(obj);

            cloned.a = 2;
            expect(obj.a).toEqual(1);
        });

        it("changes to deep attributes are shared", function(){
           var obj = {a: [1,2]};
            cloned = clone(obj);

            cloned.a.push(3);
            expect(cloned.a).toEqual([1,2,3]);
            expect(cloned.a).toEqual([1,2,3]);
            expect(cloned.a).toBe(cloned.a);
        });

        it("should not throw an error for null/undefined", function(){
            clone();
        });
    });

    describe("toJson", function(){
        it("should stringify valid object", function(){
            var obj = {a: 1, b: 2};
            var json = toJson(obj);

            expect(json).toEqual('{"a":1,"b":2}');
        });

        it("should throw an error for numbers", function(){

        });

        it("should throw an error for string literals", function(){

        });
    });


    describe("removeItem", function() {
        var array;
        beforeEach(function(){
            array = ["a", "b"];
        });

        it("should remove item in array", function() {
            removeItem(array, "b");
            expect(array).toEqual(["a"]);
        });

        it("should not remove any items if not in array", function(){
            removeItem(array, "c");
            expect(array).toEqual(["a", "b"]);
        });

        it("should not remove any items for undefined item", function(){
            removeItem(array, undefined);
            expect(array).toEqual(["a", "b"]);
        });

        it("should not remove any items for null item", function(){
            removeItem(array, null);
            expect(array).toEqual(["a", "b"]);
        });

        it("should not throw error for null/undefined array", function(){
            removeItem(undefined);
            removeItem(null);
        });
    });

    describe("removeAt", function() {
        var array;
        beforeEach(function(){
            array = ["a", "b"];
        });

        it("should remove at index", function() {
            removeAt(array, 1);
            expect(array).toEqual(["a"]);
        });

        it("should remove nothing for invalid index", function(){
            removeAt(array, -1);
            expect(array).toEqual(["a", "b"]);
        });

        it("should remove nothing for undefined index", function(){
            removeAt(array, undefined);
            expect(array).toEqual(["a", "b"]);
        });

        it("should remove nothing for null index", function(){
            removeAt(array, null);
            expect(array).toEqual(["a", "b"]);
        });

        it("should not throw error for undefined/null array", function(){
            removeAt(undefined);
            removeAt(null);
        });
    });

    describe("argumentsToArray", function(){
        var array;
        function test(){
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

    describe("createElement", function(){
        it("should create element with attributes", function(){
            var element = createElement("BUTTON", {"onclick": function(){}});

            expect(element.tagName).toBe("BUTTON");
            expect(element.hasAttribute("onclick")).toBe(true);
        });
    });
});