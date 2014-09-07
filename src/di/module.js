"use strict";

function createModule(dependentModules) {
    var services = {};
    var decorators = {};

    return {
        exports: function(names) {

        },

        // returns getter(...)
        factory: function(name, dependencies, factory) {
            services[name] = {dependencies: dependencies, value: factory, type: "factory"};
        },

        // returns new type(...)
        type: function(name, dependencies, type) {
            services[name] = {dependencies: dependencies, value: type, type: "type"};
        },

        // returns value
        value: function(name, value) {
            services[name] = {value: value, type: "value"};
        },

        // decorator for factory, type, or value
        decorator: function(name, dependencies, decorator) {
            decorators[name] = {dependencies: dependencies, value: decorator};
        },

        // same as value
        config: function(name, config) {
            this.value("config." + name , config);
        },

        resolveDependencies: function() {
            var dependencyServices = {};
            var dependencyDecorators = {};

            forEach(dependentModules, function(module){
                forEach(module.getServices(), function(service, name){
                    dependencyServices[name] = service;
                });
                forEach(module.getDecorators(), function(decorator, name){
                    dependencyDecorators[name] = decorator;
                });
            });

            services = extend(dependencyServices, services);
            decorators = extend(dependencyDecorators, decorators);
        },

        getServices: function() {
            return services;
        },

        getDecorators: function() {
            return decorators;
        }
    };
}