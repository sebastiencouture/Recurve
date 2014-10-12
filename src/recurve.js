/* global addDocumentService,
 addWindowService,
 addAsyncService,
 addTimeoutService,
 addSignalService,
 addEventEmitterService,
 addCacheService,
 addLogService,
 addLogConsoleService,
 addErrorHandlerService,
 addUncaughtErrorHandlerService,
 addPerformanceService,
 addCookiesService,
 addStorageServices,
 addPromiseService,
 addHttpXhrService,
 addHttpJsonpService,
 addHttpDeferredService,
 addHttpProviderService,
 addHttpService
 */
"use strict";

function createApi(recurve) {
    extend(recurve, {
        forEach: forEach,
        extend: extend,
        clone: clone,
        format: format,
        areEqual: areEqual,
        isNaN: isNaN,
        isSameType: isSameType,
        isString: isString,
        isUndefined: isUndefined,
        isError: isError,
        isObject: isObject,
        isArray: isArray,
        isFunction: isFunction,
        isDate: isDate,
        isNumber: isNumber,
        isRegExp: isRegExp,
        toJson: toJson,
        fromJson: fromJson,

        assert: assert
    });

    var recurveModule = recurve.$module = module();

    addDocumentService(recurveModule);
    addWindowService(recurveModule);
    addAsyncService(recurveModule);
    addTimeoutService(recurveModule);
    addSignalService(recurveModule);
    addEventEmitterService(recurveModule);
    addCacheService(recurveModule);
    addLogService(recurveModule);
    addLogConsoleService(recurveModule);
    addErrorHandlerService(recurveModule);
    addUncaughtErrorHandlerService(recurveModule);
    addPerformanceService(recurveModule);
    addCookiesService(recurveModule);
    addStorageServices(recurveModule);
    addPromiseService(recurveModule);
    addHttpXhrService(recurveModule);
    addHttpJsonpService(recurveModule);
    addHttpDeferredService(recurveModule);
    addHttpProviderService(recurveModule);
    addHttpService(recurveModule);

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
