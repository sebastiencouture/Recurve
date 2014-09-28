"use strict";

describe("$timeout", function() {
    var $timeout;
    var callback;

    beforeEach(function() {
        callback = jasmine.createSpy("callback");

        $include(null, function($mockable) {
            addTimeoutService($mockable);
        });

        $invoke(["$timeout"], function(timeout) {
            $timeout = timeout;
        });
    });

    it("should be invokable", function() {
        expect($timeout).toBeDefined();
        expect(isFunction($timeout)).toEqual(true);
    });

    it("should call function after elapsed time", function(done) {
        $timeout(callback, 0);
        expect(callback).not.toHaveBeenCalled();

        setTimeout(function() {
            expect(callback).toHaveBeenCalled();
            done();
        }, 0);
    });

    it("should cancel", function(done) {
        var id = $timeout(callback, 0);
        expect(callback).not.toHaveBeenCalled();

        $timeout.cancel(id);

        setTimeout(function() {
            expect(callback).not.toHaveBeenCalled();
            done();
        }, 0);
    });
})