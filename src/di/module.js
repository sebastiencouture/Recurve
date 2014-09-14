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
        var exportedServices = extend({}, services);
        var exportedDecorators = extend({}, decorators);

        // Create pseudo private services, they are still public; however,
        // there is no reasonable way to access these services outside of the module
        if (!isEmpty(exportNames)) {
            var names = privateNames();

            forEach(names, function(name) {
                updateNameForExport(name, exportedServices, exportedDecorators);
            });
        }

        return {
            services: exportedServices,
            decorators: exportedDecorators
        }
    }

    function getDependentModules() {
        return dependentModules;
    }

    function updateDependencyNames(name, dependencies){
        forEach(dependencies, function(dependency, index){
            if (0 === dependency.indexOf("$config")){
                dependencies[index] = "config." + name;
            }
        });
    }

    function privateNames() {
        var allNames = [];
        forEach(services, function(service, name){
            allNames.push(name);
        });

        // Sanity check to ensure all export names map to a service
        // (exports can't include dependent module services)
        forEach(exportNames, function(exportName){
            if (-1 === allNames.indexOf(exportName)) {
                assert(false, "export name {0} doesn't map to a service", exportName);
            }
        });

        return allNames.filter(function(name){
            return 0 > exportNames.indexOf(name);
        });
    }

    function updateNameForExport(oldName, exportedServices, exportedDecorators) {
        var newName = generateUUID();

        var service = exportedServices[oldName];
        if (service) {
            delete exportedServices[oldName];
            exportedServices[newName] = service;
        }

        var decorator = exportedDecorators[oldName];
        if (decorator) {
            delete exportedDecorators[oldName];
            exportedDecorators[newName] = decorator;
        }

        forEach(exportedServices, function(service, key){
            var cloned = updateDependencies(service);
            if (cloned) {
                exportedServices[key] = cloned;
            }
        });

        forEach(exportedDecorators, function(decorator, key){
            var cloned = updateDependencies(decorator);
            if (cloned) {
                exportedDecorators[key] = cloned;
            }
        });

        function updateDependencies(item) {
            var cloned = null;

            // Clone the service/decorator in this case since the new private name
            // is tied to the export. We don't want the dependencies altered for
            // further exports
            forEach(item.dependencies, function(dependency, index){
                if (dependency == oldName) {
                    cloned = {};
                    cloned.dependencies = clone(item.dependencies);
                    cloned.name = item.name;
                    cloned.value = item.value;
                    cloned.type = item.type;

                    cloned.dependencies[index] = newName;

                    return false;
                }
            });

            return cloned;
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
        exported: exported,
        getDependentModules: getDependentModules
    };
}