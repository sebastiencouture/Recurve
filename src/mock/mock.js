(function() {
    recurve.mock = {};

    addMockModules();
    setupForJasmineMocha();

    function addMockModules(){
        recurve.mock.$module = recurve.module();
    }

    function setupForJasmineMocha() {
        if (!window.jasmine && !window.mocha) {
            return;
        }

        var currentSpec;

        (window.beforeEach || window.setup)(function(){
            currentSpec = {};
            currentSpec.includeModules = [recurve.mock.$module];
        });

        (window.afterEach || window.teardown)(function(){
            currentSpec = null;
        });

        window.$include = recurve.mock.include = function(module, callback) {
            recurve.assert(currentSpec, "expected a current spec to exist");

            var mockModule = recurve.module([module]);
            currentSpec.includeModules.push(mockModule);

            if (callback) {
                callback(mockModule);
            }
        };

        window.$invoke = recurve.mock.invoke = function(dependencies, callback) {
            recurve.assert(currentSpec, "expected a current spec to exist");

            // TODO TBD
            /*if (!currentSpec.container) {
                currentSpec.container = recurve.container(currentSpec.includeModules);
            }*/

            currentSpec.container = recurve.container(currentSpec.includeModules);
            currentSpec.container.invoke(dependencies, callback);
        };
    }
})();