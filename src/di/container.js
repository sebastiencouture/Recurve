"use strict";

var ObjectUtils = require("../utils/object.js");
var assert = require("../utils/assert.js");

function Container(modules) {
    this._modules = modules;
    this._instances = {};
}

Container.prototype = {
    // TODO TBD for mock need to support only injecting set of provided services and their dependencies
    inject: function(serviceNames) {
        var moduleServices = this._getServices();

        ObjectUtils.forEach(this._modules, function(module) {
            ObjectUtils.forEach(module.configHandlers, function(handler) {
                var configurables = [];

                ObjectUtils.forEach(handler.dependencies, function(name) {
                    var service = moduleServices(name);
                    assert(service, "{0} is not a known service", name)
                    assert(service.isConfigurable(), "{0} is not a configurable service", name);

                    configurables.push(service.configurable);
                });

                handler.callback.apply(null, configurables);
            });
        });

        this._resolve(moduleServices);

        var that = this;

        ObjectUtils.forEach(this._modules, function(module) {
            ObjectUtils.forEach(module.readyHandlers, function(handler) {
                var instances = [];

                ObjectUtils.forEach(handler.dependencies, function(name) {
                    instances.push(that.get(name));
                });

                handler.callback.apply(null, instances);
            });
        });
    },

    get: function(serviceName) {
        var instance = this._instances[serviceName];
        assert(instance, "no service instance for {0} exists in the container", serviceName);

        return instance;
    },

    _resolve: function(services) {
        var that = this;

        ObjectUtils.forEach(services, function(service) {
            service.resolve(services, that._instances);
        });
    },

    _getServices: function() {
        var services = {};

        ObjectUtils.forEach(this._modules, function(module) {
            ObjectUtils.forEach(module.dependencies, function(dependency){

            });

            services = ObjectUtils.extend(services, module.services);
        });

        return services;
    }
};

module.exports = Container;