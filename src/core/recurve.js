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
 addHttpService,
 addRouterService
 */
"use strict";

function createApi(recurve, version) {
    var versionSplit = version.split(".");
    recurve.$version = {
        full: version,
        major: versionSplit[0],
        minor: versionSplit[1],
        patch: versionSplit[2]
    };

    extend(recurve, {
        forEach: forEach,
        extend: extend,
        clone: clone,
        format: format,
        contains: contains,
        addEvent: addEvent,
        removeEvent: removeEvent,
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
    addRouterService(recurveModule);

    recurveModule.exports([
        "$document", "$window", "$timeout", "$signal",
        "$eventEmitter", "$cache", "$log", "$logConsole",
        "$errorHandler", "$uncaughtErrorHandler", "$performance",
        "$cookies", "$promise", "$http", "$router"
    ]);

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
