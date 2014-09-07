"use strict";

function createModule(name, dependentModules) {
    return {
        name: name,

        exports: function(names) {

        },

        // returns getter(...)
        factory: function(name, dependencies, factory) {
            this._register(name, dependencies, factory);
        },

        // returns new type(...)
        type: function(name, dependencies, type) {
            this.factory(name, dependencies, function() {
                return new type.apply(null, arguments);
            });

            this._register(name, dependencies, type);
        },

        // returns value
        value: function(name, value) {
            var getter = value;
            if (!isFunction(value)) {
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
            this.value("config." + name , config);
        },

        resolveDependencies: function() {
            var dependencyServices = {};

            forEach(dependentModules, function(module){
                forEach(module.services, function(service, name){
                    dependencyServices[name] = service;
                });
            }, this);

            this.services = extend(dependencyServices, this.services);
        },

        _register: function(name, dependencies, provider, isPrivate, type) {
            this.services[name] = new Service(name, dependencies, provider, isPrivate, type);
        }
    };
}