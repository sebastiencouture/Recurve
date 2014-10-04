"use strict";

describe("$httpDeferred", function() {
    var httpDeferred;
    var $async;
    var callback;

    beforeEach(function() {
        $invoke(["$async", "$httpDeferred"], function(async, $httpDeferred) {
            $async = async;
            httpDeferred = $httpDeferred();
        });

        callback = jasmine.createSpy("callback");
    });

    it("should return deferred promise", function() {
        expect(httpDeferred).toBeDefined();
        expect(httpDeferred.promise).toBeDefined();
        expect(httpDeferred.resolve).toBeDefined();
        expect(httpDeferred.reject).toBeDefined();
    });

    describe("success", function() {
        it("should call on resolve", function(done) {
            httpDeferred.promise.success(function() {
                done();
            });

            httpDeferred.resolve({});
        });

        it("should return all arguments", function() {
            httpDeferred.promise.success(callback);

            httpDeferred.resolve(
                {data: 1, status: 2, statusText: 3,
                headers: {a: 1}, options: {b: 2}, canceled: false});

            $async.flush();
            expect(callback).toHaveBeenCalledWith(1, 2, 3, {a: 1}, {b: 2}, false);
        });

        it("should return the deferred promise to chain success/error", function() {
            var returned = httpDeferred.promise.success(function() {});
            expect(returned).toBe(httpDeferred.promise);
        });
    });

    describe("error", function() {
        it("should call on reject", function() {
            httpDeferred.promise.error(callback);

            httpDeferred.reject({});

            $async.flush();
            expect(callback).toHaveBeenCalled();
        });

        it("should return all arguments", function() {
            httpDeferred.promise.error(callback);

            httpDeferred.reject(
                {data: 1, status: 2, statusText: 3,
                    headers: {a: 1}, options: {b: 2}, canceled: true});

            $async.flush();
            expect(callback).toHaveBeenCalledWith(1, 2, 3, {a: 1}, {b: 2}, true);
        });

        it("should return the deferred promise to chain success/error", function() {
            var returned = httpDeferred.promise.error(function() {});
            expect(returned).toBe(httpDeferred.promise);
        });
    });
});