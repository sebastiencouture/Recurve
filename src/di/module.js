"use strict";

var ObjectUtils = require("../utils/object.js");
var Service = require("./service.js");
var assert = require("../utils/assert.js");

module.exports = Module;

function Module(name, dependencyNames) {
    assert(name, "module name must be set");

    this.name = name;
    this.services = {};
    this.decorators = {};
    this.configHandlers = [];
    this.readyhandlers = [];
    this._dependencyNames = dependencyNames || [];
}

Module.prototype = {
    /*provider: function(name, provider) {
        this.services[name] = new Service(name, provider);
        //this._register(name, null, provider, "provider");
    },*/

    // TODO TBD need to be able to specify private services
    // make it so not global the root module so dont need to pass around module names

    // returns getter(...)
    factory: function(name, dependencies, getter) {
        this._register(name, dependencies, getter);
        //this._register(name, dependencies, provider, "factory");
    },

    // maybe call it blueprint?
    // returns provider.create(...)
    type: function(name, dependencies, type) {
        this.factory(name, dependencies, function() {
            type.create.apply(null, arguments);
        });

        this._register(name, dependencies, type);
    },

    // returns value
    value: function(name, value) {
        var getter = value;
        if (!ObjectUtils.isFunction(value)) {
            getter = function() {
                return value;
            };
        }

        return this.factory(name, null, getter);
    },

    // decorator for factory, type, or value
    decorator: function(name, dependencies, decorator) {
        this.decorators[name] = new Service(name, null, decorator);
    },

    // same as value
    // and then can get as $config
    config: function(name, config) {
        this.value("$config." + name , config);
    },

    /*instance: function(name, instantiableName, provider) {
        if (provider) {
            provider.$dependencies = provider.$dependencies || [instantiableName];
            this.provider(name, provider);
        }
        else {
            this.factory(name, [instantiableName], function(Instantiable) {
                return new Instantiable();
            });
        }
    },*/

    /*value: function(name, value) {
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
    },*/

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

    _register: function(name, dependencies, provider, isPrivate, type) {
        this.services[name] = new Service(name, dependencies, provider, isPrivate, type);
    }
};