(function() {
    "use strict";

    var Module = require("./di/module.js");
    var Container = require("./di/container.js");
    var ObjectUtils = require("./utils/object.js");
    var Proto = require("./utils/proto.js");
    var assert = require("./utils/assert.js");

    var modules = [];

    var recurve = window.recurve = {
        module: function(name) {
            var knownModule = ObjectUtils.find(modules, "name", name);
            assert(knownModule, "module {0} does not exist", name);

            return knownModule;
        },

        createModule: function(name, dependencyNames) {
            // core module is always included, but does not need to be explicitly specified
            if (!ObjectUtils.find(dependencyNames, null, "rc")) {
                dependencyNames.unshift("rc");
            }

            var module = new Module(name, dependencyNames);
            modules.push(module);

            return module;
        },

        createContainer: function(moduleNames) {
            ObjectUtils.forEach(moduleNames, function(name) {
                var module = this.module[name];

                module.resolveDependencies(modules);
                modules.push(module);
            }, this);


            return new Container(modules);
        },

        define: Proto.define,
        mixin: Proto.mixin,

        forEach: ObjectUtils.forEach,
        find: ObjectUtils.find,
        areEqual: ObjectUtils.areEqual,
        isNaN: ObjectUtils.isNaN,
        isSameType: ObjectUtils.isSameType,
        isString: ObjectUtils.isString,
        isError: ObjectUtils.isError,
        isObject: ObjectUtils.isObject,
        isArray: ObjectUtils.isArray,
        isFunction: ObjectUtils.isFunction,
        isDate: ObjectUtils.isDate,
        isNumber: ObjectUtils.isNumber,
        toJson: ObjectUtils.toJson,
        fromJson: ObjectUtils.fromJson,

        assert: assert
    };

    var coreModule = recurve.module("rc");

    require("./core/window.js")(coreModule);
    require("./core/promise.js")(coreModule);
    require("./core/signal.js")(coreModule);
    require("./core/event-emitter.js")(coreModule);
    require("./core/cache.js")(coreModule);
    require("./core/cache-factory.js")(coreModule);
    require("./core/log-console.js")(coreModule);
    require("./core/log.js")(coreModule);
    require("./core/cookies.js")(coreModule);
    require("./core/local-storage.js")(coreModule);
    require("./core/session-storage.js")(coreModule);
    require("./core/global-error-handler.js")(coreModule);
    require("./core/performance-monitor.js")(coreModule);
})();
