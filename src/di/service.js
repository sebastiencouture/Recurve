"use strict";

var ObjectUtils = require("../utils/object.js");
var assert = require("../utils/assert.js");

module.exports = Service;

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
        this._forEachDependentService(services, function(service) {
            service._detectCircularReferenceFor(this);
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
        ObjectUtils.forEach(this._dependencies, function(name) {
            var service = services[name];
            assert(service, "{0} does not exist as dependency for {1}", name, this._name);

            iterator.call(this, service);
        }, this);
    }
};