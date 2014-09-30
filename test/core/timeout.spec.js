"use strict";

describe("$timeout", function() {
    var $timeout;
    var promise;
    var fn;

    beforeEach(function() {
        $invoke(["$timeout"], function(timeout) {
            $timeout = timeout;
        });

        promise = $timeout(0);
        fn = jasmine.createSpy("fn");
    });

    it("should be invokable", function() {
        expect($timeout).toBeDefined();
        expect(isFunction($timeout)).toEqual(true);
    });

    it("should return promise", function() {
        expect(promise).toBeDefined();
        expect(promise.then).toBeDefined();
    });

    it("should resolve promise on timeout", function(done) {
        promise.then(fn);
        expect(fn).not.toHaveBeenCalled();

        window.setTimeout(function() {
            expect(fn).toHaveBeenCalled();
            done()
        }, 30);
    });

    it("should reject promise on cancel", function(done) {
        promise.then(null, fn);
        $timeout.cancel(promise);

        window.setTimeout(function() {
            expect(fn).toHaveBeenCalledWith("canceled");
            done();
        }, 30);
    });
});