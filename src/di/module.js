"use strict";

var ObjectUtils = require("../utils/object.js");
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
    register: function(name, dependencies, constructor, options) {
        this._services[name] = new Service(name, dependencies, constructor, options, this);
    },

    configurable: function(name, constructor) {
        this.register(name, null, constructor, {configurable: true});
    },

    action: function(name, dependencies, constructor) {
        return this.register(name, dependencies, constructor, {instantiate: true});
    },

    store: function(name, dependencies, constructor) {
        return this.register(name, dependencies, constructor, {instantiate: true});
    },

    view: function(name, dependencies, constructor) {
        return this.register(name, dependencies, constructor);
    },

    viewController: function(name, dependencies, constructor) {
        return this.register(name, dependencies, constructor);
    },

    value: function(name, value) {
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
    instantiate: false,
    configurable: false
};

function Service(name, dependencies, constructor, options, module) {
    assert(name, "service name must be set");
    assert(definition, "{0} definition must be set", name);

    var defaults = ObjectUtils.extend({}, defaultOptions);
    options = ObjectUtils.extend(defaults, options);

    this._name = name;
    this._dependencies = [];
    this._options = options;
    this._module = module;

    if (options.configurable) {
        assert(ObjectUtils.isFunction(constructor), "{0} configurable constructor must only provide a function", name);

        this.configurable = new constructor();
        var getter = this.configurable.$get;

        assert(getter, "{0} configurable constructor must include $get", name);

        if (ObjectUtils.isFunction(getter)) {
            this._constructor = getter;
        }
        else {
            this._dependencies = getter.dependencies;
            this._contructor = getter.constructor;
        }
    }
    else {
        this._dependencies = dependencies;
        this._contructor = constructor;
    }

    assert(ObjectUtils.isFunction(this._contructor), "{0} constructor must be a function", name);
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
            this.instance = this._contructor.apply(null, instances);
        }
        else {
            this.instance = new this._contructor.apply(null, instances);
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