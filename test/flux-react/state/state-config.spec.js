"use strict";

describe("$stateConfig", function() {
    var $stateConfig;

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.react.$module);

        $invoke(["$stateConfig"], function(stateConfig) {
            $stateConfig = stateConfig;
        });
    });

    it("should be invokable", function() {
        expect($stateConfig).toBeDefined();
        expect(isFunction($stateConfig)).toEqual(true);
    });

    describe("getAncestors", function() {
        it("should return all ancestors in order", function() {
            var grandParent = $stateConfig("grandParent");
            var parent = $stateConfig("parent", null, grandParent);
            var child = $stateConfig("child", null, parent);

            expect(child.getAncestors()).toEqual([parent, grandParent]);
        });

        it("should return empty array if none", function() {
            expect($stateConfig().getAncestors()).toEqual([]);
        })
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
        })
    });
});