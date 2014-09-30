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

    it("should cancel", function(done) {
        var id = $async(callback, 0);
        expect(callback).not.toHaveBeenCalled();

        $async.cancel(id);

        setTimeout(function() {
            expect(callback).not.toHaveBeenCalled();
            done();
        }, 0);
    });
})