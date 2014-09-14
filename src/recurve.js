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
    recurve.$module = module();

    addSignalService(recurve.$module);

    recurve.module = function(dependentModules) {
        // TODO TBD core module is always include, but does not need to be explicitly specified
        // maybe require to be specified
        dependentModules = dependentModules || [];

        if (-1 === dependentModules.indexOf(recurve.$module)) {
            dependentModules.unshift(recurve.$module);
        }

        return module(dependentModules);
    };

    recurve.container = container;
}
