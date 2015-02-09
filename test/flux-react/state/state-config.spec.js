"use strict";

describe("$stateConfig", function() {
    var $stateConfig;

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.react.$module);

        $invoke(["$stateConfig"], function(stateConfigService) {
            $stateConfig = stateConfigService;
        });
    });

    it("should be invokable", function() {
        expect($stateConfig).toBeDefined();
        expect(isFunction($stateConfig)).toEqual(true);
    });

    describe("validation", function() {
        it("should throw error if no name is set", function() {
            expect(function() {
                $stateConfig();
            }).toThrowError("expected name to be set for state config");
        });

        it("should throw error if no path", function() {
            expect(function() {
                $stateConfig("a", {});
            }).toThrowError("expected path to be set for state config 'a'");
        });

        it("should not throw error for empty path", function() {
            $stateConfig("a", {path: "", resolver: {}});
        });

        it("should throw error if no resolver", function() {
            expect(function() {
                $stateConfig("a", {path: "a"});
            }).toThrowError("expected resolver to be set for state config 'a'");
        });
    });

    describe("getAncestors", function() {
        it("should return all ancestors in order", function() {
            var grandParent = $stateConfig("grandParent", {path: "", resolver: {}});
            var parent = $stateConfig("parent", {path: "", parent: grandParent, resolver: {}});
            var child = $stateConfig("child", {path: "", parent: parent, resolver: {}});

            expect(child.getAncestors()).toEqual([parent, grandParent]);
        });

        it("should return empty array if none", function() {
            expect($stateConfig("a", {path: "", resolver: {}}).getAncestors()).toEqual([]);
        });
    });

    describe("getParentNameFromName", function() {
        it("should return parent name", function() {
            expect($stateConfig.getParentNameFromName("parent.child")).toEqual("parent");
        });

        it("should include ancestors of parent in the name", function() {
            expect($stateConfig.getParentNameFromName("grandParent.parent.child")).toEqual("grandParent.parent");
        });

        it("should return null if no parent", function() {
            expect($stateConfig.getParentNameFromName("child")).toEqual(null);
        });
    });

    describe("hasParentFromName", function() {
        it("should return true if there is parent", function() {
            expect($stateConfig.hasParentFromName("parent.child")).toEqual(true);
        });

        it("should return true if the parent name includes ancestors", function() {
            expect($stateConfig.hasParentFromName("grandParent.parent.child")).toEqual(true);
        });

        it("should return false if no parent", function() {
            expect($stateConfig.hasParentFromName("child")).toEqual(false);
        });
    });
});