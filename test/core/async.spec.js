"use strict";

describe("$async", function() {
    var $async;
    var callback;

    beforeEach(function() {
        callback = jasmine.createSpy("callback");

        $include(null, function($mockable) {
            addAsyncService($mockable);
        });

        $invoke(["$async"], function(async) {
            $async = async;
        });
    });

    it("should be invokable", function() {
        expect($async).toBeDefined();
        expect(isFunction($async)).toEqual(true);
    });

    it("should call function after elapsed time", function(done) {
        $async(callback, 0);
        expect(callback).not.toHaveBeenCalled();

        setTimeout(function() {
            expect(callback).toHaveBeenCalled();
            done();
        }, 0);
    });

    it("should allow multiple functions to be registered", function(done) {
        var callback2 = jasmine.createSpy("callback2");
        var callback3 = jasmine.createSpy("callback3");

        $async(callback, 5);
        $async(callback2, 0);
        $async(callback3, 10);

        expect(callback).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
        expect(callback3).not.toHaveBeenCalled();

        window.setTimeout(function() {
            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();

            done();
        }, 10);
    });

    it("should allow function to be registered multiple times", function(done) {
        $async(callback, 5);
        $async(callback, 0);
        $async(callback, 10);

        expect(callback).not.toHaveBeenCalled();

        window.setTimeout(function() {
            expect(callback.calls.count()).toEqual(3);
            done();
        }, 10);
    });

    describe("cancel", function() {
        it("should return id that can be used to cancel", function() {
            expect($async(callback)).toBeDefined();
        });

        it("should cancel and not call", function(done) {
            var id = $async(callback, 0);
            $async.cancel(id);

            window.setTimeout(function() {
                expect(callback).not.toHaveBeenCalled();
                done();
            }, 0);
        });
    });
});