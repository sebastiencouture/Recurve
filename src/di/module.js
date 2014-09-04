"use strict";

var ObjectUtils = require("../utils/object.js");
var Service = require("./service.js");
var assert = require("../utils/assert.js");

module.exports = Module;

function Module(name, dependencyNames) {
    assert(name, "module name must be set");

    this.name = name;
    this.services = {};
    this.configHandlers = [];
    this.readyhandlers = [];
    this._dependencyNames = dependencyNames || [];
}

Module.prototype = {
    factory: function(name, dependencies, provider) {
        this._register(name, dependencies, provider, "factory");
    },

    value: function(name, value) {
        var provider = value;

        if (!ObjectUtils.isFunction(value)) {
            provider = function() {
                return value;
            };
        }

        this._register(name, null, provider, "value");
    },

    instance: function(name, instantiableName, configuration) {
        if (configuration) {
            this.instanceConfig(name, configuration);
            this.factory(name, [instantiableName, name + "Config"], function(instantiable, config){
                return config.$constructor(instantiable);
            });
        }
        else {
            this.factory(name, [instantiableName], function(instantiable) {
                return new instantiable();
            });
        }
    },

    instanceConfig: function(name, configuration) {
        this._register(name + "Config", null, configuration, "config");
    },

    // TODO TBD No need for this anymore
    constructor: function(name, dependencies, provider) {
        this._register(name, dependencies, provider, "constructor");
    },

    // TODO TBD No need for this anymore
    configurable: function(name, provider) {
        this._register(name, null, provider, "configurable");
    },

    action: function(name, dependencies, provider) {
        this.constructor(name, dependencies, provider);
    },

    store: function(name, dependencies, provider) {
        this.constructor(name, dependencies, provider);
    },

    view: function(name, dependencies, provider) {
        this.factory(name, dependencies, provider);
    },

    viewController: function(name, dependencies, provider) {
        this.factory(name, dependencies, provider);
    },

    config: function(dependencies, onConfig) {
        this.configHandlers.push({dependencies: dependencies, callback: onConfig});
    },

    ready: function(dependencies, onReady) {
        this.readyhandlers.push({dependencies: dependencies, callback: onReady});
    },

    resolveDependencies: function(modules) {
        var dependencyServices = {};

        ObjectUtils.forEach(this._dependencyNames, function(name){
            var module = ObjectUtils.find(modules, "name", name);
            assert(module, "dependent module {0} does not exist", name);

            ObjectUtils.forEach(module.services, function(service, name){
                dependencyServices[name] = service;
            });
        }, this);

        this.services = ObjectUtils.extend(dependencyServices, this.services);
    },

    _register: function(name, dependencies, provider, type) {
        this.services[name] = new Service(name, dependencies, provider, type);
    }
};