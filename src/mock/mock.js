"use strict";

var Module = require("../di/module.js");
var Container = require("../di/container.js");

(function() {
    recurve.mock = {};

    addMockModules();
    setupForJasmineMocha();
})();

function addMockModules() {
    // TODO TBD override $httpProvider, $history once implemented
    var mockModule = recurve.createModule("rcMock");

    require("./mock-cookies.js")(mockModule);
    require("./mock-global-error-handler.js")(mockModule);
    require("./mock-log.js")(mockModule);
    require("./mock-storage.js")(mockModule);
}

function setupForJasmineMocha() {
    if (!window.jasmine && !window.mocha) {
        return;
    }

    var currentSpec;

    (window.beforeEach || window.setup)(function(){
        currentSpec = this;
        currentSpec.$modules = [];
    });

    (window.afterEach || window.teardown)(function(){
        currentSpec = null;
    });

    window.$include = recurve.mock.include = function(moduleName, callback) {
        recurve.assert(currentSpec, "expected a current spec to exist");

        // Make sure to keep module ordering as specified with the includes
        var index = currentSpec.$modules.indexOf(recurve.module(moduleName));
        if (0 < index) {
            currentSpec.$modules.splice(index, 1);
        }

        currentSpec.$modules.push(recurve.module(moduleName));

        if (callback) {
            callback(specModule());
        }
    };

    window.$inject = recurve.mock.inject = function(serviceNames, callback) {
        recurve.assert(currentSpec, "expected a current spec to exist");
        recurve.assert(!currentSpec.$container, "spec can only be injected once");

        var modules = currentSpec.$modules.slice();

        modules.push(recurve.module("rcMock"));

        if (currentSpec.$specModule) {
            modules.push(currentSpec.$specModule);
        }

        currentSpec.$container = new Container();
        currentSpec.$container.injectOnly(modules, serviceNames);

        if (callback) {
            var services = [];
            recurve.forEach(serviceNames, function(name) {
                services.push(currentSpec.$container.get(name));
            })

            callback.apply(null, services);
        }
    };

    function specModule() {
        recurve.assert(currentSpec, "expected a current spec to exist");

        if (!currentSpec.$specModule) {
            currentSpec.$specModule = new Module("rcSpecModule");
            currentSpec.$specModule.config = undefined;
            currentSpec.$specModule.ready = undefined;
        }

        return currentSpec.$specModule;
    }
}