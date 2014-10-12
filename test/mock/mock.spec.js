"use strict";

describe("recurveMock", function() {

    it("should provide global shortcut methods for invoke and include", function() {
        expect($include).toBeDefined();
        expect($include).toBe(recurve.mock.include);

        expect($invoke).toBeDefined();
        expect($invoke).toBe(recurve.mock.invoke);
    });

    it("should instantiate core services", function() {
        $invoke(["$window", "$promise"], function($window, $promise) {
            expect($window).toBeDefined();
            expect($promise).toBeDefined();
        })
    });

    it("should instantiate services of included module", function() {
        var module = recurve.module();
        module.value("$a", 1);

        $include(module);
        $invoke(["$a"], function($a) {
            expect($a).toEqual(1);
        });
    });

    it("should throw error if service doesn't exist", function() {
        var module = recurve.module();
        $include(module);

        expect(function() {
            $invoke(["$a"], function() {});
        }).toThrow();
    });

    it("should include multiple modules", function() {
        var module = recurve.module();
        module.value("$a", 1);

        var module2 = recurve.module();
        module.value("$b", 2);

        $include(module);
        $include(module2);

        $invoke(["$a", "$b"], function($a, $b) {
            expect($a).toEqual(1);
            expect($b).toEqual(2);
        });
    });

    it("should include modules in order so expected override rules are applied", function() {
        var module = recurve.module();
        module.value("$a", 1);

        var module2 = recurve.module();
        module.value("$a", 2);

        $include(module);
        $include(module2);

        $invoke(["$a"], function($a) {
            expect($a).toEqual(2);
        });
    });

    it("should only instantiate defined services and dependent services", function() {
        var module = recurve.module();
        module.value("$a", 1);

        var serviceProvider = jasmine.createSpy("serviceProvider");
        module.factory("$b", null, serviceProvider);

        $include(module);
        $invoke(["$a"], function($a) {
            expect(serviceProvider).not.toHaveBeenCalled();
        });
    });

    it("should re-instantiate all services if $invoke called again", function() {
        var module = recurve.module();
        var serviceProvider = jasmine.createSpy("serviceProvider").and.returnValue(1);
        module.factory("$a", null, serviceProvider);

        $include(module);
        $invoke(["$a"], function() {
            expect(serviceProvider).toHaveBeenCalled();
        });
        $invoke(["$a"], function() {
            expect(serviceProvider.calls.count()).toEqual(2);
        });
    });

    it("should allow to override services/decorators in module", function() {
        var module = recurve.module();
        module.value("$a", 1);

        $include(module, function($mockable) {
            $mockable.value("$a", 2);
        });

        $invoke(["$a"], function($a) {
            expect($a).toEqual(2);
        });
    });

    it("should allow to override core services/decorators", function() {
        $include(null, function($mockable) {
            $mockable.value("$log", {});
        });

        $invoke(["$log"], function($log) {
            expect($log).toEqual({});
        });
    });
});