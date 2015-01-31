"use strict";

describe("recurve.flux.react", function() {
    var module;

    beforeEach(function() {
        $include(recurve.flux.react.$module);
        module = recurve.module();
    });

    it("should include component factory alias", function() {
        expect(module.component).toBeDefined();
    });

    it("should include mixin factory alias", function() {
        expect(module.mixin).toBeDefined();
        expect(module.mixin).toBe(module.factory);
    });
});