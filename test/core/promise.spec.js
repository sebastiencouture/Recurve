"use strict";

describe("$promise", function() {
    var $promise;

    beforeEach(function() {
        $invoke(["$promise"], function(promise) {
            $promise = promise;
        })
    });

    it("should be invokable", function() {
        expect($promise).toBeDefined();
        expect(isFunction($promise)).toEqual(true);
    });

    describe("factory", function() {
        it("should fulfill if resolved with value", function(done) {
            var promise = $promise(function(resolve) {
                resolve(1);
            });

            promise.then(function(value) {
                expect(value).toEqual(1);
                done();
            });
        });

        it("should reject if rejected with reason", function(done) {
            var promise = $promise(function(resolve, reject) {
                reject(1);
            });

            promise.then(function() {
                assert(false);
                done();
            }, function(reason) {
                expect(reason).toEqual(1);
                done();
            })
        });
    })
});