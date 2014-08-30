"use strict";

var ObjectUtils = require("../utils/object.js");
var assert = require("../utils/assert.js");

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

    constructor: function(name, dependencies, provider) {
        this._register(name, dependencies, provider, "constructor");
    },

    value: function(name, value) {
        var provider = value;

        if (!ObjectUtils.isFunction(value)) {
            provider = function() {
                return value;
            }
        }

        this._register(name, null, provider, "value");
    },

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
            var module = getModule(modules, name);

            ObjectUtils.forEach(module.services, function(service, name){
                dependencyServices[name] = service;
            });
        }, this);

        this.services = ObjectUtils.extend(dependencyServices, this.services);

        function getModule(modules, name) {
            var knownModule = null;

            ObjectUtils.forEach(modules, function(module) {
                if (module.name === name) {
                    knownModule = module;
                    return false;
                }
            });

            assert(knownModule, "dependent module {0} does not exist", name);
            return knownModule;
        }
    },

    _register: function(name, dependencies, provider, type) {
        this.services[name] = new Service(name, dependencies, provider, type);
    }
};

function Service(name, dependencies, provider, type) {
    assert(name, "service name must be set");
    assert(provider, "{0} provider must be set", name);
    assert(type, "{0} type must be set", name);

    this._name = name;
    this._dependencies = [];
    this._type = type;

    if (this.isConfigurable()) {
        assert(ObjectUtils.isFunction(provider), "{0} configurable provider must only provide a function", name);

        this.configurable = new provider();
        this._dependencies = this.configurable.$dependencies;
        this._provider = this.configurable.$provider;
    }
    else {
        this._dependencies = dependencies;
        this._provider = provider;
    }

    assert(ObjectUtils.isFunction(this._provider), "{0} provider must be a function", name);
}

Service.prototype = {
    isFactory: function() {
        return "factory" === this._type;
    },

    isConstructor: function() {
        return "value" === this._type;
    },

    isValue: function() {
        return "value" === this._type;
    },

    isConfigurable: function() {
        return "configurable" === this._type;
    },

    resolve: function(services, instances) {
        if (instances[this._name]) {
            return;
        }

        this._detectCircularReference(services);

        var instances = [];
        this._forEachDependentService(services, function(service) {
            service.resolve(services, instances);
            instances.push(service.instance);
        });

        if (this.isConstructor()) {
            instances[this.name] = new this._provider.apply(null, instances);
        }
        else {
            instances[this.name] = this._provider.apply(null, instances);
        }
    },

    // TODO TBD could this be improved?
    _detectCircularReference: function(services) {
        var that = this;

        this._forEachDependentService(services, function(service) {
            service._detectCircularReferenceFor(that);
        });
    },

    _detectCircularReferenceFor: function(services, service) {
        this._forEachDependentService(services, function(possibleService) {
            if (service === possibleService) {
                assert(false, "{0} contains a circular reference", service._name);
            }

            possibleService._detectCircularReferenceFor(services, service);
        });
    },

    _forEachDependentService: function(services, iterator) {
        var that = this;

        ObjectUtils.forEach(this._dependencies, function(name) {
            var service = services[name];
            assert(service, "{0} does not exist as dependency for {1}", name, that._name);

            iterator(service);
        });
    }
};

module.exports = Module;