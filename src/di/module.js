"use strict";

function module(dependentModules) {
    if (!isArray(dependentModules)) {
        dependentModules = dependentModules ? [dependentModules] : [];
    }

    var services = {};
    var decorators = {};
    var exportNames = [];

    function exports(names) {
        exportNames = names;
    }

    // returns getter(...)
    function factory(name, dependencies, factory) {
        assert(name, "factory service requires a name");
        assert(isFunction(factory), "factory services requires a function provider");

        updateDependencyNames(name, dependencies);

        services[name] = {dependencies: dependencies, value: factory, type: "factory"};
        return this;
    }

    // returns new type(...)
    function type(name, dependencies, Type) {
        assert(name, "type service requires a name");
        assert(isFunction(Type), "type service requires a function constructor provider");

        updateDependencyNames(name, dependencies);

        services[name] = {dependencies: dependencies, value: Type, type: "type"};
        return this;
    }

    // returns factory with method create(...additional args passed into constructor)
    function typeFactory(name, dependencies, Type) {
        assert(name,  "typeFactory service requires a name");
        assert(isFunction(Type), "typeFactory service requires a function constructor provider");

        updateDependencyNames(name, dependencies);

        services[name] = {dependencies: dependencies, value: Type, type: "typeFactory"};
        return this;
    }

    // returns value
    function value(name, value) {
        assert(name, "value service requires a name");

        services[name] = {value: value, type: "value"};
        return this;
    }

    // decorator for factory, type, or value
    function decorator(name, dependencies, decorator) {
        assert(name,  "decorator service requires a name");
        assert(isFunction(decorator), "decorator service requires a function provider");

        updateDependencyNames(name, dependencies);

        decorators[name] = {dependencies: dependencies, value: decorator, type: "decorator"};
        return this;
    }

    // Same as value
    function config(name, config) {
        assert(name, "config service requires a name");

        this.value("config." + name , config);
        return this;
    }

    function exported() {
        var exportedServices = {};
        var exportedDecorators = {};

        forEach(dependentModules, function(module) {
            var exported = module.exported();

            exportedServices = extend(exportedServices, exported.services);
            exportedDecorators = extend(exportedDecorators, exported.decorators);
        });

        exportedServices = extend(exportedServices, services);
        exportedDecorators = extend(exportedDecorators, decorators);

        // Create pseudo private services, they are still public; however,
        // there is no reasonable way to access these services outside of the module
        if (!isEmpty(exportNames)) {
            var names = privateNames(exportedServices, exportedDecorators);

            forEach(names, function(name) {
                var uuid = generateUUID();
                updateName(uuid, name, exportedServices, exportedDecorators);
            });
        }

        return {
            services: exportedServices,
            decorators: exportedDecorators
        }
    }

    function updateDependencyNames(name, dependencies){
        forEach(dependencies, function(dependency, index){
            if (0 === dependency.indexOf("$config")){
                dependencies[index] = "config." + name;
            }
        });
    }

    function privateNames(exportedServices, exportedDecorators) {
        var allNames = [];
        forEach(exportedServices, function(service, name){
            allNames.push(name);
        });

        forEach(exportedDecorators, function(decorator, name) {
            if(0 > allNames.indexOf(name)) {
                allNames.push(name);
            }
        });

        return allNames.filter(function(name){
            return 0 > exportNames.indexOf(name);
        });
    }

    function updateName(newName, oldName, exportedServices, exportedDecorators) {
        var service = exportedServices[oldName];
        if (service) {
            delete exportedServices[oldName];
            exportedServices[newName] = service;
            updateDependencies(service);
        }

        var decorator = exportedDecorators[oldName];
        if (decorator) {
            delete exportedDecorators[oldName];
            exportedDecorators[newName] = decorator;
            updateDependencies(decorator);
        }

        function updateDependencies(item) {
            item.dependencies = clone(item.dependencies);

            forEach(item.dependencies, function(dependency, index){
                if (dependency == oldName) {
                    item.dependencies[index] = newName;
                }
            });
        }
    }

    return {
        exports: exports,
        factory: factory,
        type: type,
        typeFactory: typeFactory,
        value: value,
        decorator: decorator,
        config: config,
        exported: exported
    };
}