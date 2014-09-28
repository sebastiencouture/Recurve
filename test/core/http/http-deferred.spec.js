"use strict";

describe("$httpDeferred", function() {
    var httpDeferred;

    beforeEach(function() {
        $invoke(["$httpDeferred"], function($httpDeferred) {
            httpDeferred = $httpDeferred();
        })
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

        it("should return all arguments", function(done) {
            httpDeferred.promise.success(function(data, status, statusText, headers, options, canceled) {
                expect(data).toEqual(1);
                expect(status).toEqual(2);
                expect(statusText).toEqual(3);
                expect(headers).toEqual({a: 1});
                expect(options).toEqual({b: 2});
                expect(canceled).toEqual(false);

                done();
            });

            httpDeferred.resolve(
                {data: 1, status: 2, statusText: 3,
                headers: {a: 1}, options: {b: 2}, canceled: false});
        });

        it("should return the deferred promise to chain success/error", function() {
            var returned = httpDeferred.promise.success(function() {});
            expect(returned).toBe(httpDeferred.promise);
        });
    });

    describe("error", function() {
        it("should call on reject", function(done) {
            httpDeferred.promise.error(function() {
                done();
            });

            httpDeferred.reject({});
        });

        it("should return all arguments", function(done) {
            httpDeferred.promise.error(function(data, status, statusText, headers, options, canceled) {
                expect(data).toEqual(1);
                expect(status).toEqual(2);
                expect(statusText).toEqual(3);
                expect(headers).toEqual({a: 1});
                expect(options).toEqual({b: 2});
                expect(canceled).toEqual(true);

                done();
            });

            httpDeferred.reject(
                {data: 1, status: 2, statusText: 3,
                    headers: {a: 1}, options: {b: 2}, canceled: true});
        });

        it("should return the deferred promise to chain success/error", function() {
            var returned = httpDeferred.promise.error(function() {});
            expect(returned).toBe(httpDeferred.promise);
        });
    });
});