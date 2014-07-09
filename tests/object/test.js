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

    var testObject = function() {
        var object = {};
        assert(Recurve.ObjectUtils.isObject(object), "{0} is an object", object);

        object = new Object();
        assert(Recurve.ObjectUtils.isObject(object), "{0} is an object", object);

        object = {name: "Sebastien"};
        assert(Recurve.ObjectUtils.isObject(object), "{0} is an object", object);

        var number = 123;
        assert(!Recurve.ObjectUtils.isObject(number), "{0} is NOT an object", number);
    };

    var testError = function() {
        var error = new Error("test error");
        assert(Recurve.ObjectUtils.isError(error), "{0} is an error", error);

        var number = 123;
        assert(!Recurve.ObjectUtils.isError(number), "{0} is NOT an error", number);
    };

    var testString = function() {
        var string = "";
        assert(Recurve.ObjectUtils.isString(string), "{0} is a string", string);

        string = "test string";
        assert(Recurve.ObjectUtils.isString(string), "{0} is a string", string);

        string = new String("test string");
        assert(Recurve.ObjectUtils.isString(string), "{0} is a string", string);

        var number = 123;
        assert(!Recurve.ObjectUtils.isString(number), "{0} is NOT a string", number);
    };

    var testArray = function() {
        var array = [];
        assert(Recurve.ObjectUtils.isArray(array), "{0} is an array", array);

        array = [1, 2];
        assert(Recurve.ObjectUtils.isArray(array), "{0} is an array", array);

        array = new Array();
        assert(Recurve.ObjectUtils.isArray(array), "{0} is an array", array);

        array = new Array(1, 2);
        assert(Recurve.ObjectUtils.isArray(array), "{0} is an array", array);

        var number = 123;
        assert(!Recurve.ObjectUtils.isArray(number), "{0} is NOT an array", number);
    };

    var testFunction = function() {
        var func = function(){};
        assert(Recurve.ObjectUtils.isFunction(func), "{0} is a function", func);

        var number = 123;
        assert(!Recurve.ObjectUtils.isFunction(number), "{0} is NOT a function", number);
    }


    console.log("Test Recurve.Object - START");

    testObject();
    testError();
    testString();
    testArray();
    testFunction();

    console.log("Test Recurve.Object - END");
})();