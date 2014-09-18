"use strict";

function publishApi(recurve) {
    extend(recurve, {
        forEach: forEach,
        extend: extend,
        clone: clone,
        find: find,
        protectedInvoke: protectedInvoke,
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
    var recurveModule = recurve.$module = module();

    addSignalService(recurveModule);
    addEventEmitterService(recurveModule);
    addWindowService(recurveModule);
    addCacheService(recurveModule);
    addLogService(recurveModule);
    addLogConsoleService(recurveModule);
    addGlobalErrorHandlerService(recurveModule);

    recurve.module = function(dependentModules) {
        // TODO TBD core module is always include, but does not need to be explicitly specified
        // maybe require to be specified
        dependentModules = dependentModules || [];

        if (-1 === dependentModules.indexOf(recurveModule)) {
            dependentModules.unshift(recurveModule);
        }

        return module(dependentModules);
    };

    recurve.container = container;
}
