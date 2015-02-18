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

    describe("getErrorState", function() {
        it("should return the state that errors", function() {
            var errorState = {name: "b", error: new Error("oops!")};
            states = [];
            states.push({name: "a"});
            states.push(errorState);
            states.push({name: "c"});

            $stateRouter.changeAction.trigger(states);

            expect($stateStore.getErrorState()).toEqual(errorState);
        });

        it("should return null if no errors", function() {
            triggerStateChange();
            expect($stateStore.getErrorState()).toEqual(null);
        });
    });

    describe("getError", function() {
        it("should return the error", function() {
            var error = new Error("oops!");
            states = [];
            states.push({name: "a"});
            states.push({name: "b", error: error});
            states.push({name: "c"});

            $stateRouter.changeAction.trigger(states);

            expect($stateStore.getError()).toEqual(error);
        });

        it("should return null if no errors", function() {
            triggerStateChange();
            expect($stateStore.getError()).toEqual(null);
        });
    });

    it("should trigger changed after updating", function() {
        var callback = jasmine.createSpy("callback");
        $stateStore.changed.on(callback);
        triggerStateChange();

        expect(callback.calls.count()).toEqual(1);
    });
});