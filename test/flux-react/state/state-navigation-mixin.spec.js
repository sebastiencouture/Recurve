"use strict";

describe("$stateNavigationMixin", function() {
    var $stateNavigationMixin;
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

        $invoke(["$stateRouter", "$stateNavigationMixin"],
            function(stateRouterService, stateNavigationMixinService) {
            $stateRouter = stateRouterService;
            $stateNavigationMixin = stateNavigationMixinService;
        });
    });

    it("should be invokable", function() {
        expect($stateNavigationMixin).toBeDefined();
        expect(isFunction($stateNavigationMixin)).toEqual(false);
    });

    it("should $stateNavigationMixin navigate to $stateRouter", function() {
        $stateNavigationMixin.navigate("a", "b", "c", "d");
        expect($stateRouter.navigate).toHaveBeenCalledWith("a", "b", "c", "d");
    });

    it("should proxy back to $stateRouter", function() {
        $stateNavigationMixin.back();
        expect($stateRouter.back).toHaveBeenCalled();
    });

    it("should proxy forward to $stateRouter", function() {
        $stateNavigationMixin.forward();
        expect($stateRouter.forward).toHaveBeenCalled();
    });

    it("should proxy reload to $stateRouter", function() {
        $stateNavigationMixin.reload();
        expect($stateRouter.reload).toHaveBeenCalled();
    });
});