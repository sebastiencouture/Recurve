"use strict";

describe("recurveMock-$async", function() {
    var $async;
    var callback;

    beforeEach(function() {
        callback = jasmine.createSpy("callback");

        $invoke(["$async"], function(async) {
            $async = async;
        });
    });

    it("should be invokable", function() {
        expect($async).toBeDefined();
        expect(isFunction($async)).toEqual(true);
    });

    describe("factory", function() {
        it("should call function after elapsed time", function(done) {
            $async(callback, 0);

            expect(callback).not.toHaveBeenCalled();

            window.setTimeout(function() {
                expect(callback).toHaveBeenCalled();
                done();
            }, 10);
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

        it("should allow same function to be registered multiple times", function(done) {
            $async(callback, 5);
            $async(callback, 0);
            $async(callback, 10);

            expect(callback).not.toHaveBeenCalled();

            window.setTimeout(function() {
                expect(callback.calls.count()).toEqual(3);
                done();
            }, 10);
        });
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

    describe("flush", function() {
        var callback2;
        var callback3;

        beforeEach(function() {
            callback2 = jasmine.createSpy("callback2");
            callback3 = jasmine.createSpy("callback3");
        });

        it("should return elapsed time", function() {
            expect($async.flush(5)).toEqual(5);
            expect($async.flush(10)).toEqual(15);
        });

        it("should invoke all pending synchronously", function() {
            $async(callback, 0);
            $async(callback2, 0);
            $async(callback3, 0);

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
            expect(callback3).not.toHaveBeenCalled();

            $async.flush();

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });

        it("should only invoke once", function() {
            $async(callback, 0);
            $async(callback2, 0);
            $async(callback3, 0);

            $async.flush();
            $async.flush();

            expect(callback.calls.count()).toEqual(1);
            expect(callback2.calls.count()).toEqual(1);
            expect(callback3.calls.count()).toEqual(1);
        });

        it("should not call again on timer complete", function(done) {
            $async(callback, 0);
            $async(callback2, 0);
            $async(callback3, 0);

            $async.flush();

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

            $async(callback, 0);
            $async(callback2, 5);
            $async(callback3, 10);

            $async.flush();
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

            $async(callback, 0);
            $async(callback2, 0);
            $async(callback3, 0);

            $async.flush();
        });

        it("should only invoke up to and including elapsed time", function() {
            $async(callback, 0);
            $async(callback2, 1);
            $async(callback3, 10);

            $async.flush(1);

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).not.toHaveBeenCalled();
        });

        it("should invoke none if none before elapsed time", function() {
            $async(callback, 5);
            $async(callback2, 5);
            $async(callback3, 10);

            $async.flush(0);

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
            expect(callback3).not.toHaveBeenCalled();
        });

        it("should invoke remaining after flush up to elapsed time", function() {
            $async(callback, 5);
            $async(callback2, 5);
            $async(callback3, 10);

            $async.flush(5);

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).not.toHaveBeenCalled();

            $async.flush(5);

            expect(callback3).toHaveBeenCalled();
        });

        it("should invoke inner async calls in order", function() {
            callback.and.callFake(function() {
                $async(callback2, 5);

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

            $async(callback, 5);
            $async(callback3, 7);

            $async.flush();
        });

        it("should not invoke completed", function(done) {
            $async(callback, 0);
            $async(callback2, 10);
            $async(callback3, 10);

            window.setTimeout(function() {
                expect(callback).toHaveBeenCalled();
                $async.flush();

                expect(callback.calls.count()).toEqual(1);
                expect(callback2).toHaveBeenCalled();
                expect(callback3).toHaveBeenCalled();

                done();
            }, 0);
        });

        it("should not invoke canceled", function() {
            var id = $async(callback, 10);
            $async(callback2, 10);
            $async(callback3, 10);

            $async.cancel(id);
            $async.flush();

            expect(callback).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });
    });
});