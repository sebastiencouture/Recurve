"use strict";

/*
 recurve.module("myApp").register("testService", ["dep1", "dep2", function(dep1, dep2){
 return {
 count: function() {
 return dep1.count() + dep2.count();
 },
 describe: function(message) {
 return dep1.message() + ":" + message;
 }
 }
 }], {instantiate: false});

 recurve.module("myApp").configurable("testService", function provider(){
 this.setMe = function(){

 };

 this.$get = ["dep1", function(dep1){

 }];
 });

 recurve.module("myApp").action();
 recurve.module("myApp").store();
 recurve.module("myApp").view();
 recurve.module("myApp").viewController();
 recurve.module("myApp").value();
 */

var ObjectUtils = require("../utils/object.js");
var ArrayUtils = require("../utils/array.js");
var assert = require("../utils/assert.js");

function Module(name, dependencies) {
    assert(name, "module name must be set");

    this._name = name;
    this._services = {};
    this._configHandlers = [];
    this._readyhandlers = [];

    this._loadDependencies(dependencies);
}

Module.prototype = {
    register: function(name, definition, options) {
        this._services[name] = new Service(name, definition, options, this);
    },

    configurable: function(name, definition) {
        this.register(name, definition, {configurable: true});
    },

    action: function(name, definition) {
        return this.register(name, definition);
    },

    store: function(name, definition) {
        return this.register(name, definition);
    },

    view: function(name, definition) {
        return this.register(name, definition, {instantiate: false});
    },

    viewController: function(name, definition) {
        return this.register(name, definition, {instantiate: false});
    },

    value: function(name, value) {
        assert(!ObjectUtils.isFunction(value), "{0} value cannot be a function", name);

        function getValue() {
            return value;
        }

        return this.register(name, getValue, {instantiate: false});
    },

    config: function(dependencies, onConfig) {
        this._configHandlers.push({dependencies: dependencies, callback: onConfig});
    },

    ready: function(dependencies, onReady) {
        this._readyhandlers.push({dependencies: dependencies, callback: onReady});
    },

    load: function() {
        var that = this;

        ObjectUtils.forEach(this._configHandlers, function(handler) {
            var configurables = [];
            ObjectUtils.forEach(handler.dependencies, function(name) {
                var service = that._getService(name);
                assert(service.isConfigurable(), "{0} is not configurable", name);

                configurables.push(service.configurable);
            });

            handler.callback.apply(null, configurables);
        });

        this._resolve();

        ObjectUtils.forEach(this._readyhandlers, function(handler) {
            var instances = [];
            ObjectUtils.forEach(handler.dependencies, function(name) {
                var service = that._getService(name);
                instances.push(service.instance);
            });

            handler.callback.apply(null, instances);
        });
    },

    _getService: function(name) {
        var service = this._services[name];
        assert(service, "{0} does not exist", name);

        return service;
    },

    _resolve: function() {
        ObjectUtils.forEach(this._services, function(service) {
           service.resolve();
        });
    },

    _loadDependencies: function(dependencies) {
        var that = this;
        ObjectUtils.forEach(dependencies, function(module){
            ObjectUtils.forEach(module._services, function(service, name){
               that._services[name] = service;
            });
        });
    }
};


var defaultOptions = {
    instantiate: true,
    configurable: false
};

function Service(name, definition, options, module) {
    assert(name, "service name must be set");
    assert(definition, "{0} definition must be set", name);

    var defaults = ObjectUtils.extend({}, defaultOptions);
    options = ObjectUtils.extend(defaults, options);

    this._name = name;
    this._dependencies = [];
    this._options = options;
    this._module = module;

    if (options.configurable) {
        assert(ObjectUtils.isFunction(definition), "{0} configurable definition must only provide a function", name);

        this.configurable = new definition();
        var getter = this.configurable.$get;

        assert(getter, "{0} configurable definition must include $get", name);

        if (ObjectUtils.isArray(getter)) {
            this._dependencies = allBeforeLast(getter);
            this._provider = last(getter);
        }
        else {
            this._provider = getter;
        }
    }
    else if (ObjectUtils.isArray(definition)) {
        this._dependencies = allBeforeLast(definition);
        this._provider = last(definition);
    }
    else {
        this._provider = definition;
    }

    assert(ObjectUtils.isFunction(this._provider), "{0} provider must be a function", name);
}

Service.prototype = {
    isConfigurable: function() {
        return this._options.configurable;
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

        if (this._options.configurable || !this._options.instantiate) {
            this.instance = this._provider.apply(null, instances);
        }
        else {
            this.instance = new this._provider.apply(null, instances);
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

function allBeforeLast(array) {
    return array.slice(0, -1);
}

function last(array) {
    return array[array.length-1];
}

module.exports = Module;