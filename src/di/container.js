"use strict";

function createContainer(modules) {
    var instances = [];
    var services = {};
    var decorators = {};

    forEach(modules, function(module) {
        module.resolveDependencies();

        services = extend(services, module.getServices());
        decorators = extend(decorators, module.getDecorators());
    });

    function invoke(dependencies, method, context) {
        var dependencyInstances = dependencies.map(function(dependency) {
            return get(dependency);
        });

        method.apply(context, dependencyInstances);
    }

    function invokeAll() {
        forEach(services, function(service, name){
           get(name);
        });
    }

    function instantiate(dependencies, Type) {
        var dependencyInstances = dependencies.map(function(dependency) {
            return get(dependency);
        });

        var instance = Object.create(Type.prototype);
        instance = Type.apply(instance, dependencyInstances) || instance;

        return instance;
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

        if ("type" === service.type) {
            instances[name] = instantiate(service.dependencies, service.value);
        }
        else if ("factory" === service.type) {
            instances[name] = invoke(service.dependencies, service.value);
        }
        else {
            instances[name] = service.value;
        }

        decorate(name);

        resolving.pop(name);

        return instances[name];
    }

    function decorate(name) {
        var decorator = decorators[name];
        if (!decorator) {
            return;
        }

        var dependencyInstances = decorator.dependencies.map(function(dependency) {
            return get(dependency);
        });

        instances[name] = decorator.value.apply(null, [instances[name]].concat(dependencyInstances));
    }

    return {
        invoke: invoke,
        invokeAll: invokeAll,
        instantiate: instantiate,
        get: get
    };
}