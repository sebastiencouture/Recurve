(function() {
    "use strict";

    var ArrayUtils = require("../utils/array.js");
    var assert = require("../utils/assert.js");

    var mockModule = recurve.createModule("rcMock");

    if (window.jasmine || window.mocha) {
        var currentSpec = null;

        (window.beforeEach || window.setup)(function(){
            currentSpec = this
        });

        // TODO TBD remove modules
        (window.afterEach || window.teardown)(function(){

        });

        window.$include = function(name) {
            assert(currentSpec, "there is no current spec");

            // TODO TBD should there only be one module?
            currentSpec.modules = currentSpec.modules || [];

            ArrayUtils.removeItem(currentSpec.modules, name);
            currentSpec.modules.push(name);
        };

        window.$mockModule = function() {

        },

        window.$inject = function() {
            assert(currentSpec, "there is no current spec");

            // TODO TBD just create a mock module that will get added to the container
        };

        window.$get = function(serviceNames, callback) {

        };
    }

})();