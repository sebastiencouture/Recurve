"use strict";

describe("$timeout mock", function() {
    var $timeout;
    var callback;

    beforeEach(function() {
        callback = jasmine.createSpy("callback");

        $invoke(["$timeout"], function(timeout) {
            $timeout = timeout;
        });
    });

    it("should be invokable", function() {
        expect($timeout).toBeDefined();
        expect(isFunction($timeout)).toEqual(true);
    });

    describe("factory", function() {
        it("should call function after elapsed time", function(done) {
            $timeout(callback, 0);

            expect(callback).not.toHaveBeenCalled();

            window.setTimeout(function() {
                expect(callback).toHaveBeenCalled();
                done();
            }, 10);
        });

        it("should all multiple functions to be registered", function(done) {
            var callback2 = jasmine.createSpy("callback2");
            var callback3 = jasmine.createSpy("callback3");

            $timeout(callback, 5);
            $timeout(callback2, 0);
            $timeout(callback3, 10);

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
    });

    describe("cancel", function() {
        it("should return id that can be used to cancel", function() {
            expect($timeout(callback)).toBeDefined();
        });

        it("should cancel and not call", function(done) {
            var id = $timeout(callback, 0);
            $timeout.cancel(id);

            window.setTimeout(function() {
                expect(callback).not.toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    describe("flush", function() {
        var callback2;
        var callback3;

        beforeEach(function() {
            callback2 = jasmine.createSpy("callback2");
            callback3 = jasmine.createSpy("callback3");
        });

        it("should invoke all pending synchronously", function() {
            $timeout(callback, 0);
            $timeout(callback2, 0);
            $timeout(callback3, 0);

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
            expect(callback3).not.toHaveBeenCalled();

            $timeout.flush();

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });

        it("should only invoke once", function() {
            $timeout(callback, 0);
            $timeout(callback2, 0);
            $timeout(callback3, 0);

            $timeout.flush();
            $timeout.flush();

            expect(callback.calls.count()).toEqual(1);
            expect(callback2.calls.count()).toEqual(1);
            expect(callback3.calls.count()).toEqual(1);
        });

        it("should not call again on timeout timer complete", function(done) {
            $timeout(callback, 0);
            $timeout(callback2, 0);
            $timeout(callback3, 0);

            $timeout.flush();

            window.setTimeout(function() {
                expect(callback.calls.count()).toEqual(1);
                expect(callback2.calls.count()).toEqual(1);
                expect(callback3.calls.count()).toEqual(1);

                done();
            }, 0);
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

            $timeout(callback, 0);
            $timeout(callback2, 5);
            $timeout(callback3, 10);

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

            $timeout(callback, 0);
            $timeout(callback2, 0);
            $timeout(callback3, 0);

            $timeout.flush();
        });

        it("should only invoke up to and including max time", function(done) {
            $timeout(callback, 0);
            $timeout(callback2, 1);
            $timeout(callback3, 10);

            $timeout.flush(1);

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).not.toHaveBeenCalled();

            window.setTimeout(function() {
                expect(callback3).toHaveBeenCalled();
                done();
            }, 10);
        });

        it("should invoke none if none before max time", function(done) {
            $timeout(callback, 5);
            $timeout(callback2, 5);
            $timeout(callback3, 10);

            $timeout.flush(0);

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

        it("should not invoke completed", function(done) {
            $timeout(callback, 0);
            $timeout(callback2, 10);
            $timeout(callback3, 10);

            window.setTimeout(function() {
                expect(callback).toHaveBeenCalled();
                $timeout.flush();

                expect(callback.calls.count()).toEqual(1);
                expect(callback2).toHaveBeenCalled();
                expect(callback3).toHaveBeenCalled();

                done();
            });
        });

        it("should not invoke canceled", function() {
            var id = $timeout(callback, 10);
            $timeout(callback2, 10);
            $timeout(callback3, 10);

            $timeout.cancel(id);
            $timeout.flush();

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });
    });
});