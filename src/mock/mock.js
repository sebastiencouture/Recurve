(function() {
    "use strict";

    var ArrayUtils = require("../utils/array.js");
    var Module = require("../di/module.js");
    var assert = require("../utils/assert.js");

    recurve.mock = {};

    // TODO TBD override services such as $window, $log, $storage, $httpProvider, $cookies
    var mockModule = recurve.createModule("rcMock");

    if (window.jasmine || window.mocha) {
        var currentSpec;

        (window.beforeEach || window.setup)(function(){
            currentSpec = this;
        });

        (window.afterEach || window.teardown)(function(){
            currentSpec = null;
        });

        window.$include = recurve.mock.include = function(name) {
            assert(currentSpec, "expected a current spec to exist");

            currentSpec.$modules = currentSpec.modules || [];

            // Make sure keep module ordering as specified with the includes
            ArrayUtils.removeItem(currentSpec.modules, recurve.module(name));
            currentSpec.$modules.push(recurve.module(name));
        };

        window.$specModule = recurve.mock.specModule = function() {
            assert(currentSpec, "expected a current spec to exist");

            if (!currentSpec.$specModule) {
                currentSpec.$specModule = new Module("rcTestModule", currentSpec.$modules);
                currentSpec.$specModule.ready = undefined;
            }

            return currentSpec.$specModule;
        },

        window.$inject = recurve.mock.inject = function(serviceNames, callback) {
            assert(currentSpec, "expected a current spec to exist");
            assert(!currentSpec.$container, "spec can only be injected once");

            var modules = currentSpec.$modules.slice();
            if (currentSpec.$specModule) {
                modules.push(currentSpec.$specModule);
            }

            currentSpec.$container = new Container(modules);
            currentSpec.$container.inject(serviceNames);

            if (callback) {
                var services = [];
                ObjectUtils.forEach(serviceNames, function(name) {
                    services.push(currentSpec.$container.get(name));
                })

                callback.apply(null, services);
            }
        };
    }

})();