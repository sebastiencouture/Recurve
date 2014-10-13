/* global container: true */

"use strict";

function container(modules) {
    assert(modules, "no modules specified for container");

    if (!isArray(modules)) {
        modules = [modules];
    }

    assert(modules.length, "no modules specified for container");

    var instances = [];
    var services = {};
    var decorators = {};

    loadModules();

    function loadModules() {
        // Only load each module once
        var allModules = [];
        getAllModules(modules, allModules);
        allModules = uniqueModules(allModules);

        forEach(allModules, function(module) {
            var exported = module.exported();

            services = extend(services, exported.services);
            decorators = extend(decorators, exported.decorators);
        });
    }

    function getAllModules(modules, all) {
        forEach(modules, function(module){
            getAllModules(module.getDependentModules(), all);
            all.push(module);
        });
    }

    function uniqueModules(modules) {
        var unique = [];
        forEach(modules, function(module) {
           if (-1 === unique.indexOf(module)) {
               unique.push(module);
           }
        });

        return unique;
    }

    function load() {
        forEach(services, function(service, name){
            get(name);
        });
    }

    function invoke(dependencies, method, context) {
        var dependencyInstances = getDependencyInstances(dependencies);
        return method.apply(context, dependencyInstances);
    }

    var resolving = [];

    function get(name) {
        if (instances[name]) {
            return instances[name];
        }

        var service = services[name];
        assert(service, "no service exists with the name {0}", name);

        if (0 <= resolving.indexOf(name)) {
            var dependencyStack = resolving.join(" -> ");
            resolving = [];

            assert(false, "circular dependency detected: " + dependencyStack);
        }

        resolving.push(name);

        var instance = invoke(service.dependencies, service.value);

        instances[name] = decorate(name, instance);
        assert(undefined !== instances[name], "decorator {0} must return an instance", name);

        resolving.pop();

        return instances[name];
    }

    function decorate(name, instance) {
        var decorator = decorators[name];
        if (!decorator) {
            return instance;
        }

        var dependencyInstances = getDependencyInstances(decorator.dependencies);

        return decorator.value.apply(null, [instance].concat(dependencyInstances));
    }

    function getDependencyInstances(dependencies) {
        var instances = [];
        if (dependencies){
            instances = dependencies.map(function(dependency) {
                return get(dependency);
            });
        }

        return instances;
    }

    return {
        load: load,
        invoke: invoke,
        get: get
    };
}