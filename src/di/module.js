"use strict";

function createModule(dependentModules) {
    if (!isArray(dependentModules)) {
        dependentModules = [dependentModules];
    }

    var services = {};
    var decorators = {};

    return {
        // returns getter(...)
        factory: function(name, dependencies, factory) {
            assert(name, "factory service requires a name");
            assert(isFunction(factory), "factory services requires a function provider");

            services[name] = {dependencies: dependencies, value: factory, type: "factory"};
            return this;
        },

        // returns new type(...)
        type: function(name, dependencies, Type) {
            assert(name, "type service requires a name");
            assert(isFunction(Type), "type service requires a function constructor provider");

            services[name] = {dependencies: dependencies, value: Type, type: "type"};
            return this;
        },

        // returns factory with method create(...additional args passed into constructor)
        typeFactory: function(name, dependencies, Type) {
            assert(name,  "typeFactory service requires a name");
            assert(isFunction(Type), "typeFactory service requires a function constructor provider");

            services[name] = {dependencies: dependencies, value: Type, type: "typeFactory"};
            return this;
        },

        // returns value
        value: function(name, value) {
            assert(name, "value service requires a name");

            services[name] = {value: value, type: "value"};
            return this;
        },

        // decorator for factory, type, or value
        decorator: function(name, dependencies, decorator) {
            assert(name,  "decorator service requires a name");
            assert(isFunction(decorator), "decorator service requires a function provider");

            decorators[name] = {dependencies: dependencies, value: decorator, type: "decorator"};
            return this;
        },

        // same as value
        config: function(name, config) {
            assert(name, "config service requires a name");

            this.value("config." + name , config);
            return this;
        },

        resolveDependencies: function() {
            var dependencyServices = {};
            var dependencyDecorators = {};

            forEach(dependentModules, function(module) {
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