"use strict";

describe("$dispatcher", function() {
    var $dispatcher;
    var callback;

    beforeEach(function() {
        $include(recurve.flux.$module);

        $invoke(["$dispatcher"], function(dispatcher) {
            $dispatcher = dispatcher;
        });

        callback = jasmine.createSpy("callback");
    });

    it("should be invokable", function() {
        expect($dispatcher).toBeDefined();
        expect(isFunction($dispatcher)).toEqual(false);
    });

    describe("register + dispatch", function() {
        it("should call registered callback on dispatch", function() {
            $dispatcher.register(callback);
            $dispatcher.dispatch({});

            expect(callback).toHaveBeenCalled();
        });

        it("should call all registered callbacks on dispatch", function() {
            $dispatcher.register(callback);
            var callback2 = jasmine.createSpy("callback2");
            $dispatcher.register(callback2);

            $dispatcher.dispatch({});

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });

        it("should call callback with payload as argument", function() {
            $dispatcher.register(callback);
            $dispatcher.dispatch({a: 1});

            expect(callback).toHaveBeenCalledWith({a: 1});
        });
    });

    describe("register", function() {
        it("should return a token", function() {
            var token = $dispatcher.register(callback);
            expect(token).toBeDefined();
        });

        it("should return different token with each register", function() {
            var token = $dispatcher.register(callback);
            var token2 = $dispatcher.register(callback);

            expect(token).not.toEqual(token2);
        });

        it("should throw error for null callback", function() {
            expect(function() {
                $dispatcher.register(null);
            }).toThrowError();
        });

        it("should throw error for undefined callback", function() {
            expect(function() {
                $dispatcher.register();
            }).toThrowError();
        });

        it("should throw error for number callback", function() {
            expect(function() {
                $dispatcher.register(1);
            }).toThrowError();
        });

        it("should throw error for string callback", function() {
            expect(function() {
                $dispatcher.register("a");
            }).toThrowError();
        });
    });

    describe("dispatch", function() {
        it("should throw error if in the middle of a dispatch", function() {
            $dispatcher.register(function() {
                expect(function() {
                    $dispatcher.dispatch();
                }).toThrowError();
            });

            $dispatcher.dispatch();
        });

        it("should not suppress callback errors", function() {
            $dispatcher.register(function() {
                throw new Error();
            });

            expect(function() {
                $dispatcher.dispatch();
            }).toThrowError();
        });

        it("should allow to dispatch after callback throws an error", function() {
            var token = $dispatcher.register(function() {
                throw new Error();
            });

            expect(function() {
                $dispatcher.dispatch();
            }).toThrowError();

            $dispatcher.unregister(token);
            $dispatcher.dispatch();
        });

        it("should allow to dispatch with null payload", function() {
            $dispatcher.register(callback);
            $dispatcher.dispatch(null);

            expect(callback).toHaveBeenCalled();
        });

        it("should allow to dispatch with undefined payload", function() {
            $dispatcher.register(callback);
            $dispatcher.dispatch();

            expect(callback).toHaveBeenCalled();
        });

        it("should allow to dispatch with number payload", function() {
            $dispatcher.register(callback);
            $dispatcher.dispatch(1);

            expect(callback).toHaveBeenCalled();
        });

        it("should allow to dispatch with string payload", function() {
            $dispatcher.register(callback);
            $dispatcher.dispatch("a");

            expect(callback).toHaveBeenCalled();
        });
    });

    describe("waitFor", function() {
        it("should wait for other registered token before continuing", function() {

        });

        it("should wait for multiple registered tokens before continuing", function() {

        });

        it("should only call callbacks once", function() {

        });

        it("should throw error for circular reference", function() {

        });

        it("should throw error if not dispatching", function() {

        });

        it("should throw error if no registered callback for a token", function() {

        });

        it("should continue immediately for empty array", function() {

        });
    });

    describe("unregister", function() {
        it("should not call callback on future dispatches", function() {

        });

        it("should throw error if there is no registered callback for the token", function() {

        });

        it("should throw error for null token", function() {

        });

        it("should throw error for undefined token", function() {

        });
    });
});