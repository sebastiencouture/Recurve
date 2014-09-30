(function() {
    recurve.mock = {};

    addMockModules();
    setupForJasmineMocha();

    function addMockModules(){
        var mockModule = recurve.mock.$module = recurve.module();

        addMockAsyncService(mockModule);
        addMockTimeoutDecorator(mockModule);
        addMockLogService(mockModule);
        addMockCookiesService(mockModule);
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

        // TODO TBD maybe make it so if first argument is callback then just create a module
        // instead of needing to do $include(null, callback);
        window.$include = recurve.mock.include = function(module, callback) {
            recurve.assert(currentSpec, "expected a current spec to exist");

            module = module || recurve.module();

            var mockModule = recurve.module([module]);
            currentSpec.includeModules.push(mockModule);

            if (callback) {
                callback(mockModule);
            }
        };

        window.$invoke = recurve.mock.invoke = function(dependencies, callback) {
            recurve.assert(currentSpec, "expected a current spec to exist");

            currentSpec.container = recurve.container(currentSpec.includeModules);
            currentSpec.container.invoke(dependencies, callback);
        };
    }
})();