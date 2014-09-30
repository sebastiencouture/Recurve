"use strict";

describe("$timeout decorator mock", function() {
    var $timeout;
    var callback;
    var callback2;
    var callback3;

    beforeEach(function() {
        $invoke(["$timeout"], function(timeout) {
            $timeout = timeout;
        });

        callback = jasmine.createSpy("callback");
        callback2 = jasmine.createSpy("callback2");
        callback3 = jasmine.createSpy("callback3");
    });

    describe("flush", function() {
        it("should invoke all pending synchronously", function() {
            $timeout(0).then(callback);
            $timeout(0).then(callback2);
            $timeout(0).then(callback3);

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
            expect(callback3).not.toHaveBeenCalled();

            $timeout.flush();

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });

        it("should invoke all pending in order by time", function() {
            callback.and.callFake(function() {
                expect(callback2).not.toHaveBeenCalled();
                expect(callback3).not.toHaveBeenCalled();
            });

            callback2.and.callFake(function() {
                expect(callback).toHaveBeenCalled();
                expect(callback3).not.toHaveBeenCalled();
            });

            callback3.and.callFake(function() {
                expect(callback).toHaveBeenCalled();
                expect(callback2).toHaveBeenCalled();
            });

            $timeout(0).then(callback);
            $timeout(5).then(callback2);
            $timeout(10).then(callback3);

            $timeout.flush();
        });

        it("should invoke all pending in order by add order as tie breaker", function() {
            callback.and.callFake(function() {
                expect(callback2).not.toHaveBeenCalled();
                expect(callback3).not.toHaveBeenCalled();
            });

            callback2.and.callFake(function() {
                expect(callback).toHaveBeenCalled();
                expect(callback3).not.toHaveBeenCalled();
            });

            callback3.and.callFake(function() {
                expect(callback).toHaveBeenCalled();
                expect(callback2).toHaveBeenCalled();
            });

            $timeout(0).then(callback);
            $timeout(0).then(callback2);
            $timeout(0).then(callback3);

            $timeout.flush();
        });

        it("should only invoke up to and including max time", function() {
            $timeout(0).then(callback);
            $timeout(1).then(callback2);
            $timeout(10).then(callback3);

            $timeout.flush(1);

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).not.toHaveBeenCalled();

            $timeout.flush();

            expect(callback3).toHaveBeenCalled();
        });
    });
});