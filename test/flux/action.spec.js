"use strict";

describe("$action", function() {
    var $action;
    var action;
    var callback;

    beforeEach(function() {
        $include(recurve.flux.$module);

        $invoke(["$action"], function(actionFactory) {
            $action = actionFactory;
            action = $action();
        });

        callback = jasmine.createSpy("callback");
    });

    it("should be invokable", function() {
        expect($action).toBeDefined();
        expect(isFunction($action)).toEqual(true);
    });

    it("should create new instance with each call of the service", function() {
        var action2 = $action();

        expect(action).not.toEqual(action2);
    });

    describe("on + trigger", function() {
        it("should call registered listener on trigger", function() {
            action.on(callback);
            action.trigger();

            expect(callback).toHaveBeenCalled();
        });

        it("should call all registered listeners on trigger", function() {
            action.on(callback);
            var callback2 = jasmine.createSpy("callback2");
            action.on(callback2);

            action.trigger();

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });

        it("should call listener callback with payload as argument", function() {
            action.on(callback);
            action.trigger({a: 1});

            expect(callback).toHaveBeenCalledWith({a: 1});
        });
    });

    describe("on", function() {
        it("should call callback with context", function() {
            var that = this;

            function triggerHandler() {
                /*jshint validthis:true */
                expect(this).toBe(that);
            }

            action.on(triggerHandler, this);
            action.trigger();
        });

        it("should only call callback only once for multiple registers", function() {
            action.on(callback);
            action.on(callback);

            action.trigger();

            expect(callback.calls.count()).toEqual(1);
        });

        it("should throw error for null callback", function() {
            expect(function() {
                action.on(null);
            }).toThrowError();
        });

        it("should throw error for undefined callback", function() {
            expect(function() {
                action.on(undefined);
            }).toThrowError();
        });

        it("should throw error for number callback", function() {
            expect(function() {
                action.register(1);
            }).toThrowError();
        });

        it("should throw error for string callback", function() {
            expect(function() {
                action.register("a");
            }).toThrowError();
        });
    });

    describe("trigger", function() {
        function callbackThrowError() {
            throw new Error();
        }

        it("should throw error if called in the middle of another trigger", function() {
            action.on(function() {
                expect(function(){
                    action.trigger();
                }).toThrowError();
            });

            action.trigger();
        });

        it("should not suppress callback errors", function() {
            action.on(callbackThrowError);

            expect(function() {
                action.trigger();
            }).toThrowError();
        });

        it("should allow to trigger after callback throws an error", function() {
            action.on(callbackThrowError);

            expect(function() {
                action.trigger();
            }).toThrowError();

            action.off(callbackThrowError);
            action.on(callback);
            action.trigger();

            expect(callback).toHaveBeenCalled();
        });

        it("should allow to trigger with null argument", function() {
            action.on(callback);
            action.trigger(null);

            expect(callback).toHaveBeenCalledWith(null);
        });

        it("should allow to trigger with undefined argument", function() {
            action.on(callback);
            action.trigger();

            expect(callback).toHaveBeenCalledWith();
        });

        it("should allow to trigger with number argument", function() {
            action.on(callback);
            action.trigger(1);

            expect(callback).toHaveBeenCalledWith(1);
        });

        it("should allow to trigger with string argument", function() {
            action.on(callback);
            action.trigger("a");

            expect(callback).toHaveBeenCalledWith("a");
        });

        it("should allow to trigger with object argument", function() {
            action.on(callback);
            action.trigger({a: 1});

            expect(callback).toHaveBeenCalledWith({a: 1});
        });

        it("should allow to trigger with multiple arguments", function() {
            action.on(callback);
            action.trigger({a: 1}, "test");

            expect(callback).toHaveBeenCalledWith({a: 1}, "test");
        });
    });

    describe("waitFor", function() {
        var dataStore = {};
        var dependentDataStore = {};

        it("should wait for other listener before continuing", function() {
            callback.and.callFake(function() {
                expect(dependentCallback).not.toHaveBeenCalled();
                action.waitFor([dependentDataStore]);
                expect(dependentCallback).toHaveBeenCalled();
            });

            var dependentCallback = jasmine.createSpy("dependentCallback");

            action.on(callback, null, dataStore);
            action.on(dependentCallback, null, dependentDataStore);

            action.trigger();

            expect(callback).toHaveBeenCalled();
        });

        it("should only call listeners once", function() {
            callback.and.callFake(function() {
                expect(dependentCallback).toHaveBeenCalled();
                action.waitFor([dependentDataStore]);
                expect(dependentCallback.calls.count()).toEqual(1);
            });

            var dependentCallback = jasmine.createSpy("dependentCallback");

            action.on(dependentCallback, null, dependentDataStore);
            action.on(callback, null, dataStore);

            action.trigger();

            expect(callback).toHaveBeenCalled();
        });

        it("should wait for multiple listeners before continuing", function() {
            callback.and.callFake(function() {
                expect(dependentCallback1).not.toHaveBeenCalled();
                expect(dependentCallback2).not.toHaveBeenCalled();

                action.waitFor([dependentDataStore1, dependentDataStore2]);

                expect(dependentCallback1.calls.count()).toEqual(1);
                expect(dependentCallback2.calls.count()).toEqual(1);
            });

            var dependentDataStore1 = {};
            var dependentCallback1 = jasmine.createSpy("dependentCallback1");

            var dependentDataStore2 = {};
            var dependentCallback2 = jasmine.createSpy("dependentCallback2");

            action.on(callback, null, dataStore);
            action.on(dependentCallback1, null, dependentDataStore1);
            action.on(dependentCallback2, null, dependentDataStore2);

            action.trigger();

            expect(callback).toHaveBeenCalled();
        });

        it("should handle nested waits", function() {
            callback.and.callFake(function() {
                expect(dependentCallback1).not.toHaveBeenCalled();
                expect(dependentCallback2).not.toHaveBeenCalled();

                action.waitFor([dependentDataStore1]);

                expect(dependentCallback1.calls.count()).toEqual(1);
                expect(dependentCallback2.calls.count()).toEqual(1);
            });

            var dependentDataStore1 = {};
            var dependentCallback1 = jasmine.createSpy("dependentCallback1");
            dependentCallback1.and.callFake(function() {
                expect(dependentCallback2).not.toHaveBeenCalled();
                action.waitFor([dependentDataStore2]);
                expect(dependentCallback2.calls.count()).toEqual(1);
            });

            var dependentDataStore2 = {};
            var dependentCallback2 = jasmine.createSpy("dependentCallback2");

            action.on(callback, null, dataStore);
            action.on(dependentCallback1, null, dependentDataStore1);
            action.on(dependentCallback2, null, dependentDataStore2);

            action.trigger();

            expect(callback).toHaveBeenCalled();
        });

        it("should throw error for circular dependency", function() {
            callback.and.callFake(function() {
                expect(dependentCallback).not.toHaveBeenCalled();
                expect(function() {
                    action.waitFor([dependentDataStore]);
                }).toThrowError("circular dependency detected while waiting for current action listener at index 0");
            });

            var dependentCallback = jasmine.createSpy("dependentCallback");
            dependentCallback.and.callFake(function() {
                action.waitFor([dataStore]);
            });

            action.on(callback, null, dataStore);
            action.on(dependentCallback, null, dependentDataStore);

            action.trigger();
        });

        it("should throw error if not triggering an action", function() {
            action.on(callback, null, dataStore);

            expect(function() {
                action.waitFor([dataStore]);
            }).toThrowError("can only wait for while in the middle of triggering an action");
        });

        it("should throw error if no listener for the data store to wait for", function() {
            action.on(callback, null, dataStore);
            action.on(function(){}, null, {});

            callback.and.callFake(function() {
                expect(function(){
                    action.waitFor([{}]);
                }).toThrowError("no action listener found for the wait for data store at index 0");
            });

            action.trigger();
        });

        it("should throw error if current listener did not specify data store", function() {
            action.on(callback);
            action.on(function(){}, null, dependentDataStore);

            callback.and.callFake(function() {
                expect(function(){
                    action.waitFor([dependentDataStore]);
                }).toThrowError("data store must be set for current action listener to detect circular dependencies");
            });

            action.trigger();
        });

        it("should continue immediately for empty array", function() {
            action.on(callback, null, dataStore);
            callback.and.callFake(function() {
                action.waitFor([]);
                makeSureContinued();
            });

            var makeSureContinued = jasmine.createSpy("makeSureContinued");

            action.trigger();
            expect(makeSureContinued).toHaveBeenCalled();
        });
    });

    describe("off", function() {
        it("should not call callback on future triggers", function() {
            action.on(callback);
            action.off(callback);

            action.trigger();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should throw error if there is no listener for the callback", function() {
            expect(function() {
                action.off(callback);
            }).toThrowError();
        });
    });
});