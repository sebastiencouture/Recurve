/*!
recurve.js - v0.1.0
Created by Sebastien Couture on 2014-09-07.

git://github.com/sebastiencouture/Recurve.git

The MIT License (MIT)

Copyright (c) 2014 Sebastien Couture

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/

(function(window){
/*!
recurve.js - v0.1.0
Created by Sebastien Couture on 2014-09-07.

git://github.com/sebastiencouture/Recurve.git

The MIT License (MIT)

Copyright (c) 2014 Sebastien Couture

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/

(function(window){
"use strict";

var recurve = window.recurve || (window.recurve = {});

function removeItem(array, item) {
    if (!array) {
        return;
    }

    var index = array.indexOf(item);
    if (-1 < index) {
        array.splice(index, 1);
    }
}

function removeAt(array, index) {
    if (!array) {
        return;
    }

    if (0 <= index && array.length > index) {
        array.splice(index, 1);
    }
}

function replaceItem(array, item) {
    if (!array) {
        return;
    }

    var index = array.indexOf(item);
    if (-1 < index) {
        array[index] = item;
    }
}

function isEmpty(value) {
    return !value || 0 === value.length;
}

function argumentsToArray(args, sliceCount) {
    return sliceCount < args.length ? Array.prototype.slice.call(args, sliceCount) : [];
}

///

function performanceNow() {
    return performance && performance.now ? performance.now() : Date.now();
}

function addDaysFromNow(days) {
    var date = new Date();
    date.setDate(date.getDate() + days);

    return date;
}

///

function createElement(name, attributes) {
    var element = document.createElement(name);

    forEach(attributes, function(value, key) {
        element.setAttribute(key, value);
    });

    return element;
}

function addEventListener(element, event, callback) {
    // http://pieisgood.org/test/script-link-events/
    // TODO TBD link tags don't support any type of load callback on old WebKit (Safari 5)
    function readyStateHandler() {
        if (isEqualIgnoreCase("loaded", element.readyState) ||
            isEqualIgnoreCase("complete", element.readyState)) {
            callback({type: "load"});
        }
    }

    // IE8 :T
    if ("load" === event &&
        elementSupportsEvent(element, "onreadystatechange")) {
        element.onreadystatechange = readyStateHandler;
    }
    else {
        element.addEventListener(event, callback);
    }
}

function removeEventListener(element, event, callback) {
    if ("load" === event &&
        elementSupportsEvent(element, "onreadystatechange")) {
        element.onreadystatechange = null;
    }
    else {
        element.removeEventListener(event, callback);
    }
}

///

function forEach(obj, iterator, context) {
    if (!obj || !iterator) {
        return;
    }

    if (obj.forEach && obj.forEach === Object.forEach) {
        obj.forEach(iterator, context);
    }
    else if (isArray(obj)) {
        for (var index = 0; index < obj.length; index++) {
            if (false === iterator.call(context, obj[index], index, obj)) {
                return;
            }
        }
    }
    else {
        var keys = Object.keys(obj);
        for (var index = 0; index < keys.length; index++) {
            var key = keys[index];
            if (false === iterator.call(context, obj[key], key, obj)) {
                return;
            }
        }
    }

    return keys;
}

function find(obj, property, value) {
    if (!obj) {
        return;
    }

    if (isArray(obj)) {
        for (var index = 0; index < obj.length; index++) {
            var current = obj[index];

            if (property &&
                isObject(current) &&
                current[property] === value) {
                return current;
            }
            else if (current === value) {
                return current;
            }
            else {
                // do nothing
            }
        }
    }
    else {
        return value === obj[property] ? obj[property] : null;
    }

    return null;
}

// both values pass strict equality (===)
// both objects are same type and all properties pass strict equality
// both are NaN
function areEqual(value, other) {
    if (value === other) {
        return true;
    }

    if (null === value || null === other) {
        return false;
    }

    // NaN is NaN!
    if (isNaN(value) && isNaN(other)) {
        return true;
    }

    if (!isSameType(value, other)) {
        return false;
    }

    if (!isObject(value)) {
        return false;
    }

    if (isArray(value)) {
        if (value.length == other.length) {
            for (var index = 0; index < value.length; index++) {
                if (!areEqual(value[index], other[index])) {
                    return false;
                }
            }

            return true;
        }
    }
    else if(isDate(value)) {
        return value.getTime() == other.getTime();
    }
    else {
        var keysOfValue = {};
        for (var key in value) {
            if (isFunction(value[key])) {
                continue;
            }

            if (!areEqual(value[key], other[key])) {
                return false;
            }

            keysOfValue[key] = true;
        }

        for (var key in other) {
            if (isFunction(other[key])) {
                continue;
            }

            if (!keysOfValue.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    }

    return false;
}

function isNaN(value) {
    // NaN is never equal to itself, interesting :)
    return value !== value;
}

function isSameType(value, other) {
    return typeof value == typeof other;
}

function isString(value) {
    return (value instanceof String || "string" == typeof value);
}

function isError(value) {
    return value instanceof Error;
}

function isObject(value) {
    return value === Object(value);
}

function isArray(value) {
    return value instanceof Array;
}

function isFunction(value) {
    return "function" == typeof value;
}

function isDate(value) {
    return value instanceof Date;
}

function isFile(value) {
    return "[object File]" === String(value);
}

function isNumber(value) {
    return "number" == typeof value;
}

function extend(dest, src) {
    if (!dest || !src) {
        return;
    }

    for (var key in src) {
        dest[key] = src[key];
    }

    return dest;
}

// shallow clone
function clone(object) {
    if (!isObject(object)) {
        return object;
    }

    return isArray(object) ? object.splice() : extend({}, object);
}

function toJson(obj) {
    if (!isObject(obj)) {
        throw new Error("not an object to convert to JSON");
    }

    return JSON.stringify(obj);
}

function fromJson(str) {
    if (!str) {
        return null;
    }

    return JSON.parse(str);
}

function toFormData(obj) {
    if (!obj) {
        return null;
    }

    var values = [];

    forEach(obj, function(value, key) {
        values.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });

    return values.join("&");
}

///

function format(value) {
    if (!value) {
        return null;
    }

    Array.prototype.shift.apply(arguments);

    for (var index = 0; index < arguments.length; index++) {
        var search = "{" + index + "}";
        value = value.replace(search, arguments[index]);
    }

    return value;
}

function pad(value, padCount, padValue) {
    if (undefined === padValue) {
        padValue = "0";
    }

    value = String( value );

    while (value.length < padCount) {
        value = padValue + value;
    }

    return value;
}

function formatTime(date) {
    if (undefined === date) {
        date = new Date();
    }

    var hours = pad(date.getHours(), 2);
    var minutes = pad(date.getMinutes(), 2);
    var seconds = pad(date.getSeconds(), 2);
    var milliseconds = pad(date.getMilliseconds(), 2);

    return format(
        "{0}:{1}:{2}:{3}", hours, minutes, seconds, milliseconds);
}

function formatMonthDayYear(date) {
    if (!date) {
        return "";
    }

    var month = pad(date.getMonth() + 1);
    var day = pad(date.getDate());
    var year = date.getFullYear();

    return format(
        "{0}/{1}/{2}", month, day, year);
}

function formatYearRange(start, end) {
    var value = "";

    if (start && end) {
        value = start + " - " + end;
    }
    else if (start) {
        value = start;
    }
    else {
        value = end;
    }

    return value;
}

function capitalizeFirstCharacter(value) {
    if (!value) {
        return null;
    }

    return value.charAt(0).toUpperCase()  + value.slice(1);
}

function hasValue(value) {
    return value && 0 < value.length;
}

function linesOf(value) {
    var lines;

    if (value) {
        lines = value.split("\n");
    }

    return lines;
}

function isEqual(str, value, ignoreCase) {
    if (!str || !value) {
        return str == value;
    }

    if (ignoreCase) {
        str = str.toLowerCase();
        value = value.toLowerCase();
    }

    return str == value;
}

function isEqualIgnoreCase(str, value) {
    return isEqual(str, value, true);
}

function contains(str, value, ignoreCase) {
    if (!str || !value) {
        return str == value;
    }

    if (ignoreCase) {
        str = str.toLowerCase();
        value = value.toLowerCase();
    }

    return 0 <= str.indexOf(value);
}

function beforeSeparator(str, separator) {
    if (!str || !separator) {
        return null;
    }

    var index = str.indexOf(separator);
    return -1 < index ? str.substring(0, index) : null;
}

function afterSeparator(str, separator) {
    if (!str || !separator) {
        return null;
    }

    var index = str.indexOf(separator);
    return -1 < index ? str.substring(index + 1) : null;
}


function generateUUID() {
    // http://stackoverflow.com/a/8809472
    var now = Date.now();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(character) {
        var random = (now + Math.random()*16)%16 | 0;
        now = Math.floor(now/16);
        return (character=='x' ? random : (random&0x7|0x8)).toString(16);
    });

    return uuid;
}

///

function urlLastPath(value) {
    if (!value) {
        return;
    }

    var split = value.split("/");
    return 0 < split.length ? split[split.length-1] : null;
}

function addParametersToUrl(url, parameters) {
    if (!url || !parameters) {
        return;
    }

    var seperator = contains(url, "?") ? "&" : "?";

    for (var key in parameters) {
        var value = parameters[key];

        if (isObject(value)) {
            if (isDate(value)) {
                value = value.toISOString();
            }
            else {
                value = toJson(value);
            }
        }

        url += seperator +  encodeURIComponent(key) + encodeURIComponent(parameters[key]);
        seperator = "?";
    }

    return url;
}

function removeParameterFromUrl(url, parameter) {
    if (!url || !parameter) {
        return;
    }

    var search = parameter + "=";
    var startIndex = url.indexOf(search);

    if (-1 === index) {
        return;
    }

    var endIndex = url.indexOf("&", startIndex);

    if (-1 < endIndex) {
        url = url.substr(0, Math.max(startIndex - 1, 0)) + url.substr(endIndex);
    }
    else {
        url = url.substr(0, Math.max(startIndex - 1, 0));
    }

    return url;
}

///

function globalEval($window, src) {
    if (!src) {
        return;
    }

    // https://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
    if ($window.execScript) {
        $window.execScript(src);
    }

    var func = function() {
        $window.eval.call($window.src);
    };

    func();
}


///

function assert(condition, message) {
    if (condition) {
        return;
    }

    Array.prototype.shift.apply(arguments);
    message = format.apply(this, arguments);

    throw new Error(message);
};

assert = extend(assert, {
    ok: function(condition, message) {
        assert.apply(this, arguments);
    },

    equal: function(actual, expected, message) {
        var args = argumentsToArray(arguments, 2);
        assert.apply(this, [actual == expected].concat(args));
    },

    notEqual: function(actual, expected, message) {
        var args = argumentsToArray(arguments, 2);
        assert.apply(this, [actual != expected].concat(args));
    },

    strictEqual: function(actual, expected, message) {
        var args = argumentsToArray(arguments, 2);
        assert.apply(this, [actual === expected].concat(args));
    },

    strictNotEqual: function(actual, expected, message) {
        var args = argumentsToArray(arguments, 2);
        assert.apply(this, [actual !== expected].concat(args));
    },

    deepEqual: function(actual, expected, message) {
        var args = argumentsToArray(arguments, 2);
        assert.apply(this, [ObjectUtils.areEqual(actual, expected)].concat(args));
    },

    deepNotEqual: function(actual, expected, message) {
        var args = argumentsToArray(arguments, 2);
        assert.apply(this, [!ObjectUtils.areEqual(actual, expected)].concat(args));
    }
});
"use strict";

function publishApi(recurve) {
    extend(recurve, {
        forEach: forEach,
        extend: extend,
        clone: clone,
        find: find,
        areEqual: areEqual,
        isNaN: isNaN,
        isSameType: isSameType,
        isString: isString,
        isError: isError,
        isObject: isObject,
        isArray: isArray,
        isFunction: isFunction,
        isDate: isDate,
        isNumber: isNumber,
        toJson: toJson,
        fromJson: fromJson,

        assert: assert
    });

    // TODO TBD create the core module
    recurve.module = createModule();

    recurve.createModule = function(dependentModules) {
        // core module is always include, but does not need to be explicitly specified
        if (dependentModules &&
            -1 == dependentModules.indexOf(recurve.module)) {
            dependentModules.unshift(recurve.module);
        }

        return createModule(dependentModules);
    };

    recurve.createContainer = createContainer;
}

"use strict";

function createContainer(modules) {
    var instances = [];
    var services = {};
    var decorators = {};

    forEach(modules, function(module) {
        module.resolveDependencies();

        services = extend(services, module.getServices());
        decorators = extend(decorators, module.getDecorators());
    });

    function invoke(dependencies, method, context) {
        var dependencyInstances = dependencies.map(function(dependency) {
            return get(dependency);
        });

        method.apply(context, dependencyInstances);
    }

    function invokeAll() {
        forEach(services, function(service, name){
           get(name);
        });
    }

    function instantiate(dependencies, Type, additionalArgs) {
        if (undefined === additionalArgs) {
            additionalArgs = [];
        }

        var dependencyInstances = dependencies.map(function(dependency) {
            return get(dependency);
        });

        var instance = Object.create(Type.prototype);
        instance = Type.apply(instance, dependencyInstances.concat(additionalArgs)) || instance;

        return instance;
    }

    var resolving = [];

    function get(name) {
        if (instances[name]) {
            return instances[name];
        }

        var service = services[name];
        assert(service, "no service exists with the name {0}", name);

        if (0 <= resolving.indexOf(name)) {
            var dependencyStack = resolving.join(" -> ");
            resolving = [];

            assert(false, "circular dependency detected: " + dependencyStack);
        }

        resolving.push(name);

        if ("type" === service.type) {
            instances[name] = instantiate(service.dependencies, service.value);
        }
        else if ("typeFactory" === service.type) {
            instances[name] = {
                create: function() {
                    return instantiate(service.dependencies, service.value, argumentsToArray(arguments));
                }
            };
        }
        else if ("factory" === service.type) {
            instances[name] = invoke(service.dependencies, service.value);
        }
        else {
            instances[name] = service.value;
        }

        decorate(name);

        resolving.pop(name);

        return instances[name];
    }

    function decorate(name) {
        var decorator = decorators[name];
        if (!decorator) {
            return;
        }

        var dependencyInstances = decorator.dependencies.map(function(dependency) {
            return get(dependency);
        });

        instances[name] = decorator.value.apply(null, [instances[name]].concat(dependencyInstances));
    }

    return {
        invoke: invoke,
        invokeAll: invokeAll,
        instantiate: instantiate,
        get: get
    };
}
"use strict";

function createModule(dependentModules) {
    var services = {};
    var decorators = {};

    return {
        // returns getter(...)
        factory: function(name, dependencies, factory) {
            assert(name, "factory service requires a name");
            assert(isFunction(factory), "factory services requires a function provider");

            services[name] = {dependencies: dependencies, value: factory, type: "factory"};
            return this;
        },

        // returns new type(...)
        type: function(name, dependencies, Type) {
            assert(name, "type service requires a name");
            assert(isFunction(Type), "type service requires a function constructor provider");

            services[name] = {dependencies: dependencies, value: Type, type: "type"};
            return this;
        },

        // returns factory with method create(...additional args passed into constructor)
        typeFactory: function(name, dependencies, Type) {
            assert(name,  "typeFactory service requires a name");
            assert(isFunction(Type), "typeFactory service requires a function constructor provider");

            services[name] = {dependencies: dependencies, value: Type, type: "typeFactory"};
            return this;
        },

        // returns value
        value: function(name, value) {
            assert(name, "value service requires a name");

            services[name] = {value: value, type: "value"};
            return this;
        },

        // decorator for factory, type, or value
        decorator: function(name, dependencies, decorator) {
            assert(name,  "decorator service requires a name");
            assert(isFunction(decorator), "decorator service requires a function provider");

            decorators[name] = {dependencies: dependencies, value: decorator, type: "decorator"};
            return this;
        },

        // same as value
        config: function(name, config) {
            assert(name, "config service requires a name");

            this.value("config." + name , config);
            return this;
        },

        resolveDependencies: function() {
            var dependencyServices = {};
            var dependencyDecorators = {};

            forEach(dependentModules, function(module){
                forEach(module.getServices(), function(service, name){
                    dependencyServices[name] = service;
                });
                forEach(module.getDecorators(), function(decorator, name){
                    dependencyDecorators[name] = decorator;
                });
            });

            services = extend(dependencyServices, services);
            decorators = extend(dependencyDecorators, decorators);
        },

        getServices: function() {
            return services;
        },

        getDecorators: function() {
            return decorators;
        }
    };
}
publishApi(recurve);
})(window);
publishApi(recurve);
})(window);