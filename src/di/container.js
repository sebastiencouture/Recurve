"use strict";

var ObjectUtils = require("../utils/object.js");
var assert = require("../utils/assert.js");

module.exports = Container;

function Container(modules) {
    this._modules = modules;
    this._instances = {};
}

Container.prototype = {
    inject: function(serviceNames) {
        var moduleServices = this._getServices();

        this._callConfigHandlers(moduleServices);
        this._resolve(moduleServices, serviceNames);

        // If only explicitly injecting certain services then we can't call the ready handlers since not all
        // service instances will exist. This is fine since injecting only certain services is intended
        // to only be used by unit tests
        if (!serviceNames) {
            this._callReadyHandlers();
        }
    },

    get: function(serviceName) {
        var instance = this._instances[serviceName];
        assert(instance, "no service instance for {0} exists in the container", serviceName);

        return instance;
    },

    _resolve: function(moduleServices, serviceNames) {
        if (serviceNames) {
            ObjectUtils.forEach(serviceNames, function(name) {
                var service = moduleServices[name];
                assert(service, "{0} is not a known service", name);

                service.resolve(moduleServices, this._instances);
            }, this);
        }
        else {
            ObjectUtils.forEach(moduleServices, function(service) {
                service.resolve(services, this._instances);
            }, this);
        }
    },

    _callConfigHandlers: function(moduleServices) {
        ObjectUtils.forEach(this._modules, function(module) {
            ObjectUtils.forEach(module.configHandlers, function(handler) {
                var configurables = [];

                ObjectUtils.forEach(handler.dependencies, function(name) {
                    var service = moduleServices[name];
                    assert(service, "{0} is not a known service", name);
                    assert(service.isConfigurable(), "{0} is not a configurable service", name);

                    configurables.push(service.configurable);
                });

                handler.callback.apply(null, configurables);
            });
        });
    },

    _callReadyHandlers: function() {
        ObjectUtils.forEach(this._modules, function(module) {
            ObjectUtils.forEach(module.readyHandlers, function(handler) {
                var instances = [];

                ObjectUtils.forEach(handler.dependencies, function(name) {
                    instances.push(this.get(name));
                }, this);

                handler.callback.apply(null, instances);
            }, this);
        }, this);
    },

    _getServices: function() {
        var services = {};

        ObjectUtils.forEach(this._modules, function(module) {
            services = ObjectUtils.extend(services, module.services);
        });

        return services;
    }
};