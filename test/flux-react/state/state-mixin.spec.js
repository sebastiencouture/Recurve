"use strict";

describe("$stateMixin", function() {
    var $stateMixin;
    var $stateRouter;

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.$module);
        $include(recurve.flux.react.$module);

        $include(null, function(module) {
            module.decorator("$stateRouter", null, function($stateRouter) {
                spyOn($stateRouter, "navigate");
                spyOn($stateRouter, "back");
                spyOn($stateRouter, "forward");
                spyOn($stateRouter, "reload");

                return $stateRouter;
            });
        });

        $invoke(["$stateRouter", "$stateMixin"], function(stateRouterService, stateMixinService) {
            $stateRouter = stateRouterService;
            $stateMixin = stateMixinService;
        });
    });

    it("should be invokable", function() {
        expect($stateMixin).toBeDefined();
        expect(isFunction($stateMixin)).toEqual(false);
    });

    it("should proxy navigate to $stateRouter", function() {
        $stateMixin.navigate("a", "b", "c", "d");
        expect($stateRouter.navigate).toHaveBeenCalledWith("a", "b", "c", "d");
    });

    it("should proxy back to $stateRouter", function() {
        $stateMixin.back();
        expect($stateRouter.back).toHaveBeenCalled();
    });

    it("should proxy forward to $stateRouter", function() {
        $stateMixin.forward();
        expect($stateRouter.forward).toHaveBeenCalled();
    });

    it("should proxy reload to $stateRouter", function() {
        $stateMixin.reload();
        expect($stateRouter.reload).toHaveBeenCalled();
    });
});