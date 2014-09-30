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

    // Most tests covered under $async
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

        it("should invoke inner timeout calls in order", function() {
            callback.and.callFake(function() {
                $timeout(5).then(callback2);

                expect(callback2).not.toHaveBeenCalled();
                expect(callback3).not.toHaveBeenCalled();
            });

            callback2.and.callFake(function() {
                expect(callback).toHaveBeenCalled();
                expect(callback3).toHaveBeenCalled();
            });

            callback3.and.callFake(function() {
                expect(callback).toHaveBeenCalled();
                expect(callback2).not.toHaveBeenCalled();
            });

            $timeout(5).then(callback);
            $timeout(7).then(callback3);

            $timeout.flush();
        });
    });
});