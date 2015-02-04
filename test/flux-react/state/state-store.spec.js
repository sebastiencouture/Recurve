"use strict";

describe("$stateStore", function() {
    var $stateStore;
    var $stateRouter;
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

    it("should return the set of states triggered by the router", function() {
        triggerStateChange();
        expect($stateStore.getStates()).toEqual(states);
    });

    it("should return the name of the leaf state", function() {
        triggerStateChange();
        expect($stateStore.getName()).toEqual("c");
    });

    it("should trigger changed after updating", function() {
        var callback = jasmine.createSpy("callback");
        $stateStore.changed.on(callback);
        triggerStateChange();

        expect(callback.calls.count()).toEqual(1);
    });

    it("should return empty array when no states", function() {
        expect($stateStore.getStates()).toEqual([]);
    });

    it("should return null name when no states", function() {
        expect($stateStore.getName()).toEqual(null);
    });
});