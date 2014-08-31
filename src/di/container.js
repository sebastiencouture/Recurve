"use strict";

var ObjectUtils = require("../utils/object.js");
var assert = require("../utils/assert.js");

module.exports = Container;

function Container() {
    this._instances = {};
}

Container.prototype = {
    inject: function(modules) {
        var services = getServices(modules);

        callConfigHandlers(modules, services);

        ObjectUtils.forEach(services, function(service) {
            service.resolve(services, this._instances);
        }, this);

        callReadyHandlers(modules, this._instances);
    },

    injectOnly: function(modules, serviceNames) {
        var services = getServices(modules);

        callConfigHandlers(modules, services);

        ObjectUtils.forEach(serviceNames, function(name) {
            var service = services[name];
            assert(service, "{0} is not a known service", name);

            service.resolve(services, this._instances);
        }, this);

        callReadyHandlers(modules, this._instances);
    },

    get: function(serviceName) {
        var instance = this._instances[serviceName];
        assert(instance, "no service instance for {0} exists in the container", serviceName);

        return instance;
    }
};

function getServices(modules) {
    var services = {};

    ObjectUtils.forEach(modules, function(module) {
        services = ObjectUtils.extend(services, module.services);
    });

    return services;
}

function callConfigHandlers(modules, services) {
    ObjectUtils.forEach(modules, function(module) {
        ObjectUtils.forEach(module.configHandlers, function(handler) {
            var configurables = [];

            ObjectUtils.forEach(handler.dependencies, function(name) {
                var service = services[name];
                assert(service, "{0} is not a known service", name);
                assert(service.isConfigurable(), "{0} is not a configurable service", name);

                configurables.push(service.configurable);
            });

            handler.callback.apply(null, configurables);
        });
    });
}

function callReadyHandlers(modules, instances) {
    ObjectUtils.forEach(modules, function(module) {
        ObjectUtils.forEach(module.readyHandlers, function(handler) {
            var handlerInstances = [];

            ObjectUtils.forEach(handler.dependencies, function(name) {
                // Could be null if explicitly only injected certain services through injectOnly(...)
                handlerInstances.push(instances[name]);
            });

            handler.callback.apply(null, handlerInstances);
        });
    });
}