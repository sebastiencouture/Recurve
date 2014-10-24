"use strict";

describe("$history", function() {
    var $history;
    var callback;

    function async(fn) {
        setTimeout(fn, 0);
    }

    beforeEach(function() {
        $include(recurve.router.$module, function($mockable) {
            $mockable.value("$document", {
                readyState: "complete"
            });
        });

        $invoke(["$history"], function(history) {
            $history = history;
        });

        callback = jasmine.createSpy("callback");
        $history.popped.on(callback);
    });

    it("should be invokable", function() {
        expect($history).toBeDefined();
        expect(isFunction($history)).toEqual(false);
    });

    it("should not call popped on push", function(done) {
        $history.start();
        $history.pushState(null, null, "/a");

        async(function() {
            expect(callback).not.toHaveBeenCalled();
            done();
        });
    });

    it("should not call popped on replace", function(done) {
        $history.start();
        $history.replaceState(null, null, "/a");

        async(function() {
            expect(callback).not.toHaveBeenCalled();
            done();
        });
    });

    iit("should call popped on back", function(done) {
        $history.start();
        $history.pushState(2, null, "/a");
        $history.pushState(3, null, "/b");
        $history.back();

        $history.popped.on(function(event) {
            console.log(event.state);
        });

        async(function() {
            expect(callback).toHaveBeenCalled();
            done();
        });
    });

    it("should call popped on forward", function(done) {
        $history.start();
        $history.pushState(null, null, "/a");
        $history.pushState(null, null, "/b");
        $history.back();

        async(function() {
            callback = jasmine.createSpy("callback");
            $history.popped.on(callback);

            $history.forward();

            async(function() {
                expect(callback).toHaveBeenCalled();
                done();
            });
        });
    });

    it("should call popped on go", function(done) {
        $history.start();
        $history.pushState(null, null, "/a");
        $history.go(-1);

        async(function() {
            expect(callback).toHaveBeenCalled();
            done();
        });
    });

    it("should only trigger popped signal if started", function() {

    });
});