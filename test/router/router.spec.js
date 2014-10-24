"use strict";

describe("$router", function() {
    var $router;

    beforeEach(function() {
        $include(recurve.router.$module);

        $invoke(["$router"], function(router) {
            $router = router;
        });
    });

    it("should be invokable", function() {
        expect($router).toBeDefined();
        expect(isFunction($router)).toEqual(false);
    });


});