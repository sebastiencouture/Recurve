"use strict";

ddescribe("$state", function(){
    var $state;

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.react.$module);

        $invoke(["$state"], function(stateFactory) {
            $state = stateFactory;
        });
    });

    it("should be invokable", function() {
        expect($state).toBeDefined();
        expect(isFunction($state)).toEqual(true);
    });

    it("should merge with parent data", function() {

    });

    it("should not alter parent data object", function() {

    });

    describe("beforeResolve", function() {
        it("should call method on the resolver", function() {

        });

        it("should call onRedirect callback if invoked", function() {

        });

        it("should do nothing if no method on the resolver", function() {

        });
    });

    describe("resolve", function() {
        
    });

    describe("afterResolve", function() {
        it("should call method on the resolver", function() {

        });

        it("should call onRedirect callback if invoked", function() {

        });

        it("should do nothing if no method on the resolver", function() {

        });
    });
});