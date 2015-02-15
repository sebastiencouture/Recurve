"use strict";

describe("$stateStore", function() {
    var $stateRouter;
    var $stateStore;
    var states;

    function triggerStateChange() {
        states = [];
        states.push({name: "a"});
        states.push({name: "b"});
        states.push({name: "c"});

        $stateRouter.changeAction.trigger(states);
    }

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.$module);
        $include(recurve.flux.react.$module);

        $invoke(["$stateRouter", "$stateStore"], function(stateRouterService, stateStoreService) {
            $stateRouter = stateRouterService;
            $stateStore = stateStoreService;
        });
    });

    it("should be invokable", function() {
        expect($stateStore).toBeDefined();
        expect(isFunction($stateStore)).toEqual(false);
    });

    describe("getAll", function() {
        it("should return the set of states triggered by the router", function() {
            triggerStateChange();
            expect($stateStore.getAll()).toEqual(states);
        });

        it("should return empty array when no states", function() {
            expect($stateStore.getAll()).toEqual([]);
        });
    });

    describe("getName", function() {
        it("should return the name of the leaf state", function() {
            triggerStateChange();
            expect($stateStore.getName()).toEqual("c");
        });

        it("should return null name when no states", function() {
            expect($stateStore.getName()).toEqual(null);
        });
    });

    describe("getAtDepth", function() {
        beforeEach(function() {
            triggerStateChange();
        });

        it("should return state at the depth", function() {
            expect($stateStore.getAtDepth(1).name).toEqual("b");
        });

        it("should return null for negative depth", function() {
            expect($stateStore.getAtDepth(-1)).toEqual(null);
        });

        it("should return null for depth that is too large", function() {
            expect($stateStore.getAtDepth(4)).toEqual(null);
        });
    });

    describe("getMaxDepth", function() {
        it("should return the max depth", function() {
            triggerStateChange();
            expect($stateStore.getMaxDepth()).toEqual(2);
        });

        it("should return -1 for no states", function() {
            expect($stateStore.getMaxDepth()).toEqual(-1);
        });
    });

    it("should trigger changed after updating", function() {
        var callback = jasmine.createSpy("callback");
        $stateStore.changed.on(callback);
        triggerStateChange();

        expect(callback.calls.count()).toEqual(1);
    });
});