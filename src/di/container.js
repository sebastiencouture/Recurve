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
var assert = require("../assert.js");

function Container(name, dependencies) {
    assert(name, "container name must be set");

    this._name = name;
    this._providers = {};
    this._configHandlers = [];
    this._readyhandlers = [];

    this._loadDependencies(dependencies);
}

Container.prototype = {
    register: function(name, definition, options) {
        this._providers[name] = new Provider(name, definition, options, this);
    },

    configurable: function(name, definition) {
        this.register(name, definition, {configurable: true});
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
                var provider = that._getProvider(name);
                assert(provider.isConfigurable(), "{0} is not configurable", name);

                configurables.push(provider.configurable);
            });

            handler.callback.apply(null, configurables);
        });

        this._resolve();

        ObjectUtils.forEach(this._readyhandlers, function(handler) {
            var instances = [];
            ObjectUtils.forEach(handler.dependencies, function(name) {
                var provider = that._getProvider(name);
                instances.push(provider.instance);
            });

            handler.callback.apply(null, instances);
        });
    },

    _getProvider: function(name) {
        var provider = this._providers[name];
        assert(provider, "{0} does not exist", name);

        return provider;
    },

    _resolve: function() {
        ObjectUtils.forEach(this._providers, function(provider) {
           provider.resolve();
        });
    },

    _loadDependencies: function(dependencies) {
        var that = this;
        ObjectUtils.forEach(dependencies, function(container){
            ObjectUtils.forEach(container._providers, function(provider, name){
               that._providers[name] = provider;
            });
        });
    }
};


var defaultOptions = {
    instantiate: true,
    configurable: false
};

function Provider(name, definition, options, container) {
    assert(name, "provider name must be set");
    assert(definition, "{0} definition must be set", name);

    var defaults = ObjectUtils.extend({}, defaultOptions);
    options = ObjectUtils.extend(defaults, options);

    this._name = name;
    this._dependencies = [];
    this._options = options;
    this._container = container;

    if (options.configurable) {
        assert(ObjectUtils.isFunction(definition), "{0} configurable definition must only provide a function", name);

        this.configurable = new definition();
        var getter = this.configurable.$get;

        assert(getter, "{0} configurable definition must include $get", name);

        if (ObjectUtils.isArray(getter)) {
            this._dependencies = allBeforeLast(getter);
            this._value = last(getter);
        }
        else {
            this._value = getter;
        }
    }
    else if (ObjectUtils.isArray(definition)) {
        this._dependencies = allBeforeLast(definition);
        this._value = last(definition);
    }
    else {
        this._value = definition;
    }

    assert(ObjectUtils.isFunction(this._value), "{0} value must be a function", name);
}

Provider.prototype = {
    isConfigurable: function() {
        return this._options.configurable;
    },

    resolve: function() {
        if (this._resolved) {
            return;
        }

        this._detectCircularReference();

        var instances = [];
        this._forEachDependentProvider(function(provider) {
            provider.resolve();
            instances.push(provider.instance);
        });

        if (this._options.configurable || !this._options.instantiate) {
            this.instance = this._value.apply(null, instances);
        }
        else {
            this.instance = new this._value.apply(null, instances);
        }

        this._resolved = true;
    },

    // TODO TBD could this be improved?
    _detectCircularReference: function() {
        var that = this;

        this._forEachDependentProvider(function(provider) {
            provider._detectCircularReferenceFor(that);
        });
    },

    _detectCircularReferenceFor: function(provider) {
        this._forEachDependentProvider(function(possibleProvider) {
            if (provider === possibleProvider) {
                assert(false, "{0} contains a circular reference", provider._name);
            }

            possibleProvider._detectCircularReferenceFor(provider);
        });
    },

    _forEachDependentProvider: function(iterator) {
        var that = this;

        ObjectUtils.forEach(this._dependencies, function(name) {
            var provider = that._container[name];
            assert(provider, "{0} does not exist", name);

            iterator(provider);
        });
    }
};

function allBeforeLast(array) {
    return array.slice(0, -1);
}

function last(array) {
    return array[array.length-1];
}

module.exports = Container;