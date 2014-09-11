"use strict";

function container(modules) {
    var instances = [];
    var services = {};
    var decorators = {};

    forEach(modules, function(module) {
        var exported = module.exported();

        services = extend(services, exported.services);
        decorators = extend(decorators, exported.decorator);
    });

    function load() {
        forEach(services, function(service, name){
            get(name);
        });
    }

    function invoke(dependencies, method, context) {
        var dependencyInstances = dependencies.map(function(dependency) {
            return get(dependency);
        });

        method.apply(context, dependencyInstances);
    }

    function instantiate(dependencies, Type, additionalArgs) {
        if (undefined === additionalArgs) {
            additionalArgs = [];
        }

        var dependencyInstances = dependencies.map(function(dependency) {
            return get(dependency);
        });

        var instance = Object.create(Type.prototype);
        instance = Type.apply(instance, dependencyInstances.concat(additionalArgs)) || instance;

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

        var instance;
        if ("type" === service.type) {
            instance = instantiate(service.dependencies, service.value);
        }
        else if ("typeFactory" === service.type) {
            instance = {
                create: function() {
                    return instantiate(service.dependencies, service.value, argumentsToArray(arguments));
                }
            };
        }
        else if ("factory" === service.type) {
            instance = invoke(service.dependencies, service.value);
        }
        else {
            instance = service.value;
        }

        instances[name] = decorate(name, instance);

        resolving.pop(name);

        return instances[name];
    }

    function decorate(name, instance) {
        var decorator = decorators[name];
        if (!decorator) {
            return;
        }

        var dependencyInstances = decorator.dependencies.map(function(dependency) {
            return get(dependency);
        });

        return decorator.value.apply(null, [instance].concat(dependencyInstances));
    }

    return {
        load: load,
        invoke: invoke,
        instantiate: instantiate,
        get: get
    };
}