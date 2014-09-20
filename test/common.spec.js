"use strict";

describe("common", function(){

    describe("forEach", function(){
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

        it("should return obj", function() {
            var obj = {};
            expect(forEach(obj, function(){})).toBe(obj);
        });

        it("should not throw error for null object", function(){
            forEach(null);
        });

        it("should not throw error for undefined object", function() {
            forEach(undefined);
        })

        it("should throw error for null iterator", function() {
            expect(function() {
                forEach({a: 1, b: 2}, null);
            }).toThrow();
        });

        it("should throw error for undefined iterator", function() {
            expect(function() {
                forEach({a: 1, b: 2}, undefined);
            }).toThrow();
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

    describe("isUndefined", function() {
        it("should detect undefined", function() {
            expect(isUndefined(undefined)).toEqual(true);
        });

        it("should detect undefined as no argument", function() {
            expect(isUndefined()).toEqual(true);
        });

        it("should not detect number", function() {
            expect(isUndefined(0)).toEqual(false);
        });

        it("should not detect boolean", function() {
            expect(isUndefined(false)).toEqual(false);

        });

        it("should not detect NaN", function() {
            expect(isUndefined(NaN)).toEqual(false);

        });
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
            expect(function(){toJson(1)}).toThrow(new Error("not an object to convert to JSON"));
        });

        it("should throw an error for string literals", function(){
            expect(function(){toJson("1")}).toThrow(new Error("not an object to convert to JSON"));
        });
    });

    describe("fromJson", function(){
        it("should parse string", function(){
            var str = '{"a":1,"b":2}';
            var obj = fromJson(str);

            expect(obj).toEqual({a:1, b:2});
        });

        it("should return same value for number", function(){
            expect(fromJson(1)).toEqual(1);
        });

        it("should return same value for array", function(){
            expect(fromJson([1, 2])).toEqual([1, 2]);
        });

        it("should return same value for object", function(){
            expect(fromJson({a:1, b:2})).toEqual({a:1, b:2});
        });

        it("should return null for null", function(){
            expect(fromJson(null)).toEqual(null);
        });

        it("should return undefined for undefined", function(){
            expect(fromJson(undefined)).toEqual(undefined);
        });

        it("should throw error for invalid string", function(){
            var str = "{a:b";
            expect(function(){fromJson(str)}).toThrow();
        })
    });

    describe("toFromData", function(){
        it("should convert string", function(){
            var obj = {a:1, b:2, c:3};
            expect(toFormData(obj)).toEqual("a=1&b=2&c=3");
        });

        it("should encode object keys", function(){
            var obj = {"#":1, "%":2, c:3};
            expect(toFormData(obj)).toEqual("%23=1&%25=2&c=3");
        });

        it("should encode object values", function(){
            var obj = {a:"#", b:"%", c:3};
            expect(toFormData(obj)).toEqual("a=%23&b=%25&c=3");
        });

        it("should encode spaces", function(){
            var obj = {a:"z x"};
            expect(toFormData(obj)).toEqual("a=z%20x");
        });

        it("should not encode -,_,.,!,~,*,',(,)", function(){
            var obj = {a:"-_.!~*'()"};
            expect(toFormData(obj)).toEqual("a=-_.!~*'()");
        });

        it("should return null for number", function(){
            expect(toFormData(1)).toEqual(null);
        });

        it("should return null for array", function(){
            expect(toFormData([1, 2])).toEqual(null);
        });

        it("should return null for null", function(){
            expect(toFormData(null)).toEqual(null);
        });

        it("should return null for undefined", function(){
            expect(toFormData()).toEqual(null);
        });
    });

    describe("format", function(){
        it("should format single argument", function(){
            expect(format("test {0}", "wow")).toEqual("test wow");
        });

        it("should format multiple arguments", function(){
            expect(format("test {0}:{1}", "wow", 1)).toEqual("test wow:1");
        });

        it("should format out of order", function(){
            expect(format("test {1}:{0}", "wow", 1)).toEqual("test 1:wow");
        });

        it("should do nothing if doesn't include format identifiers", function(){
            expect(format("test")).toEqual("test");
        });

        it("should return same string if no values provides", function(){
            expect(format("test {0}:{1}")).toEqual("test {0}:{1}");
        });

        it("should not replace for invalid indices", function(){
            expect(format("test {5}", "wow")).toEqual("test {5}");
        });

        it("should return null for null", function(){
            expect(format(null)).toEqual(null);
        });

        it("should return null for undefined", function(){
            expect(format()).toEqual(null);
        })
    });

    describe("pad", function(){
        it("should pad string with count and value", function(){
            expect(pad("1", 3, "4")).toEqual("441");
        });

        it("should pad numbers", function(){
            expect(pad(1, 3, "4")).toEqual("441");
        });

        it("should pad with pad value as number", function(){
            expect(pad(1, 3, 4)).toEqual("441");
        });

        it("should pad with 0 by default", function(){
            expect(pad(1, 3)).toEqual("001");
        });

        it("should pad 0", function(){
            expect(pad(0, 2, 1)).toEqual("10");
        });

        it("should not pad if already at correct length", function(){
            expect(pad(111, 3, 4)).toEqual("111");
        });

        // TODO TBD how to handle negative pad values?
        it("should include '-' for negative numbers in pad count", function(){
            expect(pad(1, 2, -1)).toEqual("-11");
        });

        it("should return same value for negative pad count", function(){
            expect(pad(1, -2, 4)).toEqual("1");
        });

        it("should return null for null", function(){
            expect(pad(null, 3, 4)).toEqual(null);
        });

        it("should return null for undefined", function(){
            expect(pad(undefined, 3, 4)).toEqual(null);
        });
    });

    describe("startsWith", function(){
        it("should return true if does", function(){
            expect(startsWith("test string", "test")).toEqual(true);
        });

        it("should be case sensitive", function(){
            expect(startsWith("Test string", "test")).toEqual(false);
        });

        it("should include spaces in check", function(){
            expect(startsWith("test string", "test s")).toEqual(true);
            expect(startsWith("test string", "test  s")).toEqual(false);
        });

        it("should return false if doesn't", function(){
            expect(startsWith("test string", "tt")).toEqual(false);
        });

        it("should return false for null", function(){
            expect(startsWith("test string", null)).toEqual(false);
        });

        it("should return false for undefined", function(){
            expect(startsWith("test string")).toEqual(false);

        });
    });

    describe("endsWith", function(){
        it("should return true if does", function(){
            expect(endsWith("test string", "ing")).toEqual(true);
        });

        it("should be case sensitive", function(){
            expect(endsWith("test striNg", "ing")).toEqual(false);
        });

        it("should include spaces in check", function(){
            expect(endsWith("test string", "t string")).toEqual(true);
            expect(endsWith("test string", "test  s")).toEqual(false);
        });

        it("should return false if doesn't", function(){
            expect(endsWith("test string", "t string t")).toEqual(false);
        });

        it("should return false for null", function(){
            expect(endsWith("test string", null)).toEqual(false);
        });

        it("should return false for undefined", function(){
            expect(endsWith("test string")).toEqual(false);

        });
    });

    describe("formatTime", function(){
        it("should format with Date", function(){
            var date = new Date(2014, 9, 2, 0, 30, 1, 1);
            expect(formatTime(date)).toEqual("00:30:01:01");
        });

        it("should format current date for undefined", function(){
            var now = new Date();
            expect(formatTime()).toEqual(formatTime(now));
        });

        it("should not format number", function(){
            expect(formatTime(2)).toEqual(null);
        });

        it("should not format non date object", function(){
            expect(formatTime({a:1})).toEqual(null);
        });

        it("should not format null", function(){
            expect(formatTime(null)).toEqual(null);
        });
    });

    describe("formatMonthDayYear", function(){
        it("should format with Date", function(){
            var date = new Date(2014, 2, 15);
            expect(formatMonthDayYear(date)).toEqual("3/15/2014");
        });

        it("should format current date for undefined", function(){
            var now = new Date();
            expect(formatMonthDayYear()).toEqual(formatMonthDayYear(now));
        });

        it("should not format number", function(){
            expect(formatMonthDayYear(1)).toEqual(null);
        });

        it("should not format non date object", function(){
            expect(formatMonthDayYear({a:1})).toEqual(null);
        });

        it("should not format null", function(){
            expect(formatMonthDayYear(null)).toEqual(null);
        });
    });

    // Internal method only intended to be used with strings
    describe("isEqualIgnoreCase", function(){
        if("should be equal with different case", function(){
            expect(isEqualIgnoreCase("example", "eXamPle")).toEqual(true);
        });

        it("should not be equal if one null", function(){
            expect(isEqualIgnoreCase("a", null)).toEqual(false);
        });

        it("should not be equal if one undefined", function(){
            expect(isEqualIgnoreCase("a", undefined)).toEqual(false);
        });

        it("should be equal if both null", function(){
            expect(isEqualIgnoreCase(null, null)).toEqual(true);
        });

        it("should be equal if both undefined", function(){
            expect(isEqualIgnoreCase()).toEqual(true);
        });
    });

    // Internal method only intended to be used with strings
    describe("contains", function(){
        it("should contain with matching case", function(){
            expect(contains("example Test str", "Test")).toEqual(true);
        });

        it("should not contain if case doesn't match", function(){
            expect(contains("example test str", "Test")).toEqual(false);
        })

        it("should contain ignoring case", function(){
            expect(contains("example test str", "Test", true)).toEqual(true);
        });

        it("should not contain for null", function(){
            expect(contains(null, "a")).toEqual(false);
        });

        it("should not contain for undefined", function(){
            expect(contains(undefined, "a")).toEqual(false);
        });

        it("should not contain for null search value", function(){
            expect(contains("a", null)).toEqual(false);
        });

        it("should not contain for undefined search value", function(){
            expect(contains("a")).toEqual(false);
        });
    });

    // Internal method only intended to be used with strings
    describe("beforeSeparator", function(){
        it("should find before string separator", function(){
            expect(beforeSeparator("example=2", "=")).toEqual("example");
        });

        it("should find before first separator", function(){
            expect(beforeSeparator("example=2&test=3", "=")).toEqual("example");
        });

        it("should find before number separator", function(){
            expect(beforeSeparator("example2test", 2)).toEqual("example");
        });

        it("should not find for null separator", function(){
            expect(beforeSeparator("example=2", null)).toEqual(null);
        });

        it("should not find for undefined separator", function(){
            expect(beforeSeparator("example=2", undefined)).toEqual(null);
        });

        it("should not find for null string", function(){
            expect(beforeSeparator(null, "=")).toEqual(null);
        });

        it("should not find for undefined string", function(){
            expect(beforeSeparator(undefined, "=")).toEqual(null);
        });
    });

    // Internal method only intended to be used with strings
    describe("afterSeparator", function(){
        it("should find after string separator", function(){
            expect(afterSeparator("example=2", "=")).toEqual("2");
        });

        it("should find after first separator", function(){
            expect(afterSeparator("example=2&test=3", "=")).toEqual("2&test=3");
        });

        it("should find after number separator", function(){
            expect(afterSeparator("example2test", 2)).toEqual("test");
        });

        it("should not find for null separator", function(){
            expect(afterSeparator("example=2", null)).toEqual(null);
        });

        it("should not find for undefined separator", function(){
            expect(afterSeparator("example=2", undefined)).toEqual(null);
        });

        it("should not find for null string", function(){
            expect(afterSeparator(null, "=")).toEqual(null);
        });

        it("should not find for undefined string", function(){
            expect(afterSeparator(undefined, "=")).toEqual(null);
        });
    });

    describe("generateUUID", function(){
        it("should have form 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'", function(){
            expect(generateUUID()).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/);
        });

        // Not much of a test :)
        it("should not produce identical UUIDs", function(){
            var a = generateUUID();
            var b = generateUUID();

            expect(a).not.toEqual(b);
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

        it("should not throw error for undefined array", function(){
            removeAt(undefined);
        });

        it("should not throw error for null array", function(){
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

    describe("addParametersToUrl", function(){
        it("should separate the first parameter with ?", function(){
            expect(addParametersToUrl("www.test.com", {a:1})).toEqual("www.test.com?a=1");
        });

        it("should separate others with &", function(){
            expect(addParametersToUrl("www.test.com?a=1", {b:2, c:3})).toEqual("www.test.com?a=1&b=2&c=3");
        });

        it("should encode parameter keys", function(){
            expect(addParametersToUrl("www.test.com", {"$":1})).toEqual("www.test.com?%24=1");
        });

        it("should encode parameter values", function(){
            expect(addParametersToUrl("www.test.com", {a: "$"})).toEqual("www.test.com?a=%24");
        });

        it("should encode ?/& in key and values", function(){
            expect(addParametersToUrl("www.test.com", {"?&": "&?", a: 2})).toEqual("www.test.com?%3F%26=%26%3F&a=2");
        });

        it("should convert date parameter to ISO", function(){
            expect(addParametersToUrl("www.test.com", {a:new Date(2014,1,1)})).toEqual("www.test.com?a=2014-02-01T08%3A00%3A00.000Z");
        });

        it("should convert object to JSON", function(){
            expect(addParametersToUrl("www.test.com", {a: {b:2}})).toEqual("www.test.com?a=%7B%22b%22%3A2%7D");
        });

        it("should add none for non object key/values", function(){
            expect(addParametersToUrl("www.test.com", 1)).toEqual("www.test.com");
        });

        it("should add none for null", function(){
            expect(addParametersToUrl("www.test.com", null)).toEqual("www.test.com");
        });

        it("should add none for undefined", function(){
            expect(addParametersToUrl("www.test.com", undefined)).toEqual("www.test.com");
        });
    });

    describe("removeParameterFromUrl", function(){
        it("should remove parameter", function(){
            expect(removeParameterFromUrl("www.test.com?b=2", "b")).toEqual("www.test.com");
        });

        it("should only remove that parameter", function(){
            expect(removeParameterFromUrl("www.test.com?a=1&b=2&c=3", "b")).toEqual("www.test.com?a=1&c=3");
        });

        it("should remove with encoded parameter", function(){
            expect(removeParameterFromUrl("www.test.com?%24=1", "$")).toEqual("www.test.com");
        });

        it("should change & to ? upon removing first parameter", function(){
            expect(removeParameterFromUrl("www.test.com?a=1&b=2&c=3", "a")).toEqual("www.test.com?b=2&c=3");

        });

        it("should do nothing if doesn't exist", function(){
            expect(removeParameterFromUrl("www.test.com?c=1&d=2", "a")).toEqual("www.test.com?c=1&d=2");
        });

        it("should do nothing for null", function(){
            expect(removeParameterFromUrl("www.test.com?c=1&d=2", null)).toEqual("www.test.com?c=1&d=2");
        });

        it("should do nothing for undefined", function(){
            expect(removeParameterFromUrl("www.test.com?c=1&d=2", undefined)).toEqual("www.test.com?c=1&d=2");
        });
    });

    describe("assert", function(){
        it("should throw for false", function(){
            expect(function(){assert(false)}).toThrow();
        });

        it("should throw for null", function(){
            expect(function(){assert(null)}).toThrow();
        });

        it("should throw for undefined", function(){
            expect(function(){assert(undefined)}).toThrow();
        });

        it("should throw for 0", function(){
            expect(function(){assert(0)}).toThrow();
        });

        it("should throw for an empty string", function(){
            expect(function(){assert("")}).toThrow();
        });

        it("should not throw for true", function(){
            assert(true);
        });

        it("should not throw for an object", function(){
            assert({a:1});
        });

        it("should not throw for an empty object", function(){
           assert({});
        });

        it("should throw an error", function(){
            expect(function(){assert(false)}).toThrow(new Error(null));
        });

        it("should include message", function(){
            expect(function(){assert(false, "message")}).toThrow(new Error("message"));
        });

        it("should format message", function(){
            expect(function(){assert(false, "message: {0} {1}", "a", 1)}).toThrow(new Error("message: a 1"));
        });
    });

    describe("protectedInvoke", function(){
       it("should not throw an error", function(){
            expect(function(){
                protectedInvoke(function(){
                    throw new Error("a");
                });
            }).not.toThrow();
       })
    });
});