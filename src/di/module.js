"use strict";

var ObjectUtils = require("../utils/object.js");
var assert = require("../utils/assert.js");

function Module(name, dependencies) {
    assert(name, "module name must be set");

    this.name = name;
    this.services = {};
    this.configHandlers = [];
    this.readyhandlers = [];

    this._loadDependencies(dependencies);
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
        this.register(name, null, provider, {configurable: true});
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

    load: function() {
        var that = this;

        ObjectUtils.forEach(this.configHandlers, function(handler) {
            var configurables = [];
            ObjectUtils.forEach(handler.dependencies, function(name) {
                var service = that._getService(name);
                assert(service.isConfigurable(), "{0} is not configurable", name);

                configurables.push(service.configurable);
            });

            handler.callback.apply(null, configurables);
        });

        this._resolve();

        ObjectUtils.forEach(this.readyhandlers, function(handler) {
            var instances = [];
            ObjectUtils.forEach(handler.dependencies, function(name) {
                var service = that._getService(name);
                instances.push(service.instance);
            });

            handler.callback.apply(null, instances);
        });
    },

    _register: function(name, dependencies, provider, type) {
        this.services[name] = new Service(name, dependencies, provider, type, this);
    },

    _getService: function(name) {
        var service = this.services[name];
        assert(service, "{0} does not exist", name);

        return service;
    },

    _resolve: function() {
        ObjectUtils.forEach(this.services, function(service) {
           service.resolve();
        });
    },

    _loadDependencies: function(dependencies) {
        var that = this;
        ObjectUtils.forEach(dependencies, function(module){
            ObjectUtils.forEach(module.services, function(service, name){
               that.services[name] = service;
            });
        });
    }
};

function Service(name, dependencies, provider, type, module) {
    assert(name, "service name must be set");
    assert(provider, "{0} provider must be set", name);
    assert(type, "{0} type must be set", name);

    this._name = name;
    this._dependencies = [];
    this._type = type;
    this._module = module;

    if (this._isConfigurable()) {
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

    resolve: function() {
        if (this._resolved) {
            return;
        }

        this._detectCircularReference();

        var instances = [];
        this._forEachDependentService(function(service) {
            service.resolve();
            instances.push(service.instance);
        });

        if (this.isConstructor()) {
            this.instance = new this._provider.apply(null, instances);
        }
        else {
            this.instance = this._provider.apply(null, instances);
        }

        this._resolved = true;
    },

    // TODO TBD could this be improved?
    _detectCircularReference: function() {
        var that = this;

        this._forEachDependentService(function(service) {
            service._detectCircularReferenceFor(that);
        });
    },

    _detectCircularReferenceFor: function(service) {
        this._forEachDependentProvider(function(possibleService) {
            if (service === possibleService) {
                assert(false, "{0} contains a circular reference", service._name);
            }

            possibleService._detectCircularReferenceFor(service);
        });
    },

    _forEachDependentService: function(iterator) {
        var that = this;

        ObjectUtils.forEach(this._dependencies, function(name) {
            var service = that._module[name];
            assert(service, "{0} does not exist", name);

            iterator(service);
        });
    }
};

module.exports = Module;