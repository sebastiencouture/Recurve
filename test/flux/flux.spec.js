"use strict";

describe("recurve.flux", function() {
    var module;

    beforeEach(function() {
        $include(recurve.flux.$module);
        module = recurve.module();
    });

    it("should include action factory alias", function() {
        expect(module.action).toBeDefined();
        expect(module.action).toBe(module.factory);
    });

    it("should include store factory alias", function() {
        expect(module.store).toBeDefined();
        expect(module.store).toBe(module.factory);
    });
});