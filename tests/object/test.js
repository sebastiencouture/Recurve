/**
 *  Created by Sebastien Couture on 2014-7-8.
 *  Copyright (c) 2014 Sebastien Couture. All rights reserved.
 *
 *  Permission is hereby granted, free of charge, to any person
 *  obtaining a copy of this software and associated documentation
 *  files (the "Software"), to deal in the Software without
 *  restriction, including without limitation the rights to use,
 *  copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *  OTHER DEALINGS IN THE SOFTWARE.
 */

(function()
{
    var assert = Recurve.assert;

    QUnit.test("objects", function(assert) {
        var object = {};
        assert.ok(Recurve.ObjectUtils.isObject(object), "{} should be an object");

        object = new Object();
        assert.ok(Recurve.ObjectUtils.isObject(object), "new Object() should be an object");

        object = {name: "Sebastien"};
        assert.ok(Recurve.ObjectUtils.isObject(object), "'Sebastien' should be an object");

        var number = 123;
        assert.ok(!Recurve.ObjectUtils.isObject(number), "123 should not be an object");
    });

    QUnit.test("errors", function(assert) {
        var error = new Error("test error");
        assert.ok(Recurve.ObjectUtils.isError(error), "new Error() should be an error");

        var number = 123;
        assert.ok(!Recurve.ObjectUtils.isError(number), "123 should not be an error");
    });

    QUnit.test("strings", function(assert) {
        var string = "";
        assert.ok(Recurve.ObjectUtils.isString(string), "'' should be a string");

        string = "test string";
        assert.ok(Recurve.ObjectUtils.isString(string), "'test string'should be a string");

        string = new String("test string");
        assert.ok(Recurve.ObjectUtils.isString(string), "new String('test string') should be a string");

        var number = 123;
        assert.ok(!Recurve.ObjectUtils.isString(number), "123 should not be a string");
    });

    QUnit.test("arrays", function(assert) {
        var array = [];
        assert.ok(Recurve.ObjectUtils.isArray(array), "[] should be an array");

        array = [1, 2];
        assert.ok(Recurve.ObjectUtils.isArray(array), "[1, 2] should be an array");

        array = new Array();
        assert.ok(Recurve.ObjectUtils.isArray(array), "new Array() should be an array");

        array = new Array(1, 2);
        assert.ok(Recurve.ObjectUtils.isArray(array), "new Array(1, 2) should be an array");

        var number = 123;
        assert.ok(!Recurve.ObjectUtils.isArray(number), "123 should not be an array");
    });

    QUnit.test("functions", function(assert) {
        var test = function(){};
        assert.ok(Recurve.ObjectUtils.isFunction(test), "function(){} should be a function");

        var number = 123;
        assert.ok(!Recurve.ObjectUtils.isFunction(number), "123 should not be a function");
    });
})();