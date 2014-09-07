"use strict";

function createContainer() {
    var instances = [];

    function getServices(modules) {
        var services = {};

        forEach(modules, function(module) {
            services = extend(services, module.services);
        });

        return services;
    }

    return {
        inject: function(modules) {
            var services = getServices(modules);

            forEach(services, function(service) {
                service.resolve(services, instances);
            }, this);
        },

        injectOnly: function(modules, serviceNames) {
            var services = getServices(modules);

            forEach(serviceNames, function(name) {
                var service = services[name];
                assert(service, "{0} is not a known service", name);

                service.resolve(services, instances);
            }, this);
        },

        get: function(serviceName) {
            var instance = instances[serviceName];
            assert(instance, "no service instance for {0} exists in the container", serviceName);

            return instance;
        }
    };
}