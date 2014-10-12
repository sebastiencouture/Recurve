"use strict";

describe("$promise", function() {

    function shouldNotBeCalled(valueOrReason) {
        assert(false, "onFulfilled or onRejected called when should not: " + valueOrReason);
    }

    var $promise;
    var $async;
    var onFulfilled;
    var onRejected;

    beforeEach(function() {
        $invoke(["$async", "$promise"], function(async, promise) {
            $async = async;
            $promise = promise;
        });

        onFulfilled = jasmine.createSpy("onFulfilled");
        onRejected = jasmine.createSpy("onRejected");
    });

    it("should be invokable", function() {
        expect($promise).toBeDefined();
        expect(isFunction($promise)).toEqual(true);
    });

    describe("factory", function() {
        it("should fulfill if resolved with value", function() {
            var promise = $promise(function(resolve) {
                resolve(1);
            });

            promise.then(onFulfilled);

            $async.flush();
            expect(onFulfilled).toHaveBeenCalledWith(1);
        });

        it("should reject if rejected with reason", function() {
            var promise = $promise(function(resolve, reject) {
                reject(1);
            });

            promise.then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith(1);
        });

        it("should reject on error with the error as the reason", function() {
            var promise = $promise(function() {
                throw new Error("a");
            });

            promise.then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith(new Error("a"));
        });

        it("should resolve only once", function() {
            var resolver;
            var rejector;

            var thenable = {
                then: function(resolve, reject) {
                    resolver = resolve;
                    rejector = reject;
                }
            };

            var promise = $promise(function(resolve) {
                resolve(1);
            });

            promise.then(function() {
                return thenable;
            }).then(onFulfilled, onRejected);

            $async(function() {
                resolver(1);
                rejector(1);
                resolver(1);
                rejector(1);
            }, 1);

            $async.flush();

            expect(onFulfilled.calls.count()).toEqual(1);
            expect(onRejected.calls.count()).toEqual(0);
        });

        it("should resolve with first fulfilled value", function() {
            var fulfilledPromise = $promise(function(resolve) {
                resolve(1);
            });

            var promise = $promise(function(resolve) {
                resolve(fulfilledPromise);
            });

            promise.then(onFulfilled, shouldNotBeCalled);

            $async.flush();
            expect(onFulfilled).toHaveBeenCalledWith(1);
        });

        it("should resolve with first fulfilled value for thenable", function() {
            var fulfilledThenable = {
                then: function(onFulfilled) {
                    $async(function() {
                        onFulfilled(1);
                    });
                }
            };

            var promise = $promise(function(resolve) {
                resolve(fulfilledThenable);
            });

            promise.then(onFulfilled, shouldNotBeCalled);

            $async.flush();
            expect(onFulfilled).toHaveBeenCalledWith(1);
        });

        it("should reject with first rejected reason", function() {
            var fulfilledPromise = $promise(function(resolve, reject) {
                reject(1);
            });

            var promise = $promise(function(resolve) {
                resolve(fulfilledPromise);
            });

            promise.then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith(1);
        });

        it("should reject with first rejected reason for thenable", function() {
            var fulfilledThenable = {
                then: function(onFulfilled, onRejected) {
                    $async(function() {
                        onRejected(1);
                    });
                }
            };

            var promise = $promise(function(resolve) {
                resolve(fulfilledThenable);
            });

            promise.then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith(1);
        });

        it("should throw error if resolver is undefined", function() {
            expect(function() {
                $promise();
            }).toThrow();
        });

        it("should throw error if resolver is null", function() {
            expect(function() {
                $promise(null);
            }).toThrow();
        });

        it("should throw error if resolver is number", function() {
            expect(function() {
                $promise(1);
            }).toThrow();
        });

        it("should throw error if resolver is object", function() {
            expect(function() {
                $promise({});
            }).toThrow();
        });
    });

    describe("defer", function() {
        var deferred;

        beforeEach(function() {
            deferred = $promise.defer();
        });

        it("should include a promise property", function() {
            expect(deferred.promise).toBeDefined();
        });

        it("should resolve promise upon calling resolve with value", function() {
            expect(deferred.resolve).toBeDefined();

            deferred.promise.then(onFulfilled, shouldNotBeCalled);

            deferred.resolve("a");

            $async.flush();
            expect(onFulfilled).toHaveBeenCalledWith("a");
        });

        it("should reject the promise upon calling reject with reason", function() {
            expect(deferred.reject).toBeDefined();

            deferred.promise.then(shouldNotBeCalled, onRejected);

            deferred.reject("a");

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith("a");
        });
    });

    // Promises/A+ spec: https://github.com/promises-aplus/promises-spec#notes
    describe("then", function() {
        var deferred;

        beforeEach(function() {
            deferred = $promise.defer();
        });

        describe("both onFulfilled and onRejected are optional arguments", function() {

            it("if onFulfilled is not a function, it must be ignored", function() {
                deferred.promise.then(1, shouldNotBeCalled);
                deferred.resolve("a");

                $async.flush();
            });

            it("if onRejected is not a function, it must be ignored", function() {
                deferred.promise.then(shouldNotBeCalled, 1);
                deferred.reject("a");

                $async.flush();
            });
        });

        describe("if onFulfilled is a function", function() {
            it("it must be called after promise is fulfilled, with promise's value as its first argument", function() {
                deferred.promise.then(onFulfilled, shouldNotBeCalled);

                deferred.resolve("a");

                $async.flush();
                expect(onFulfilled).toHaveBeenCalledWith("a");
            });

            it("it must not be called before promise is fulfilled", function() {
                deferred.promise.then(onFulfilled, shouldNotBeCalled);

                expect(onFulfilled).not.toHaveBeenCalled();
                deferred.resolve("a");

                $async.flush();
                expect(onFulfilled).toHaveBeenCalled();
            });

            it("it must not be called more than once", function() {
                deferred.promise.then(onFulfilled, shouldNotBeCalled);

                deferred.resolve("a");
                deferred.resolve("b");
                deferred.resolve("c");

                $async.flush();
                expect(onFulfilled.calls.count()).toEqual(1);
            });
        });

        describe("if onRejected is a function", function() {
            it("it must be called after promise is rejected, with promise's reason as its first argument", function() {
                deferred.promise.then(shouldNotBeCalled, onRejected);
                deferred.reject("a");

                $async.flush();
                expect(onRejected).toHaveBeenCalledWith("a");
            });

            it("it must not be called before promise is rejected", function() {
                deferred.promise.then(shouldNotBeCalled, onRejected);

                expect(onRejected).not.toHaveBeenCalled();
                deferred.reject("a");

                $async.flush();
                expect(onRejected).toHaveBeenCalled();
            });

            it("it must not be called more than once", function() {
                deferred.promise.then(shouldNotBeCalled, onRejected);

                deferred.reject("a");
                deferred.reject("b");
                deferred.reject("c");

                $async.flush();
                expect(onRejected.calls.count()).toEqual(1);
            });
        });

        describe("onFulfilled or onRejected must not be called until the execution context stack contains only platform code", function() {
            it("should call onFulfilled async", function() {
                var onFulfilled = jasmine.createSpy("onFulfilled");
                deferred.promise.then(onFulfilled, shouldNotBeCalled);

                deferred.resolve("a");
                expect(onFulfilled).not.toHaveBeenCalled();

                $async.flush();
                expect(onFulfilled).toHaveBeenCalled();
            });

            it("should call onRejected async", function() {
                var onRejected = jasmine.createSpy("onRejected");
                deferred.promise.then(shouldNotBeCalled, onRejected);

                deferred.reject("a");
                expect(onRejected).not.toHaveBeenCalled();

                $async.flush();
                expect(onRejected).toHaveBeenCalled();
            });
        });

        // onFulfilled and onRejected must be called as functions (i.e. with no this value)

        describe("then may be called multiple times on the same promise", function() {
            it("if/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then", function() {
                var count = 0;

                deferred.promise.then(function() {
                    count++;
                    expect(count).toEqual(1);
                }, shouldNotBeCalled);

                deferred.promise.then(function() {
                    count++;
                    expect(count).toEqual(2);
                }, shouldNotBeCalled);

                deferred.promise.then(function() {
                    count++;
                    expect(count).toEqual(3);
                }, shouldNotBeCalled);

                deferred.resolve("a");
                $async.flush();
            });

            it("if/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then", function() {
                var count = 0;

                deferred.promise.then(shouldNotBeCalled, function() {
                    count++;
                    expect(count).toEqual(1);
                });

                deferred.promise.then(shouldNotBeCalled, function() {
                    count++;
                    expect(count).toEqual(2);
                });

                deferred.promise.then(shouldNotBeCalled, function() {
                    count++;
                    expect(count).toEqual(3);
                });

                deferred.reject("a");
                $async.flush();
            });
        });

        describe("then must return a promise", function() {
            it("should return a promise", function() {
                var promise = deferred.promise.then();

                expect(promise).toBeDefined();
                expect(promise.then).toBeDefined();
                expect(promise.catch).toBeDefined();
            });

            // this is mostly covered in "resolve" tests
            it("if either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x)", function() {
                var promise2 = deferred.promise.then(function() {
                    return "b";
                });

                promise2.then(onFulfilled, shouldNotBeCalled);

                deferred.resolve("a");
                $async.flush();

                expect(onFulfilled).toHaveBeenCalledWith("b");
            });

            it("if either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason", function() {
                var error = new Error("e");
                var promise2 = deferred.promise.then(function() {
                    throw error;
                }, shouldNotBeCalled);

                promise2.then(shouldNotBeCalled, onRejected);

                deferred.resolve("a");
                $async.flush();

                expect(onRejected).toHaveBeenCalledWith(error);
            });

            it("if onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1", function() {
                var promise2 = deferred.promise.then(null, shouldNotBeCalled);

                promise2.then(onFulfilled, shouldNotBeCalled);

                deferred.resolve("a");
                $async.flush();

                expect(onFulfilled).toHaveBeenCalledWith("a");
            });

            it("if onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1", function() {
                var promise2 = deferred.promise.then(shouldNotBeCalled, null);

                promise2.then(shouldNotBeCalled, onRejected);

                deferred.reject("a");
                $async.flush();

                expect(onRejected).toHaveBeenCalledWith("a");
            });
        });
    });

    describe("catch", function() {
        it("should be called on reject", function() {
            var promise = $promise(function(resolve, reject) {
                reject("a");
            });

            promise.catch(onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith("a");
        });
    });

    // Promises/A+ spec: https://github.com/promises-aplus/promises-spec#notes
    describe("resolve", function() {
        describe("if x is a promise, adopt its state", function() {
            it("if x is pending, promise must remain pending until x is fulfilled or rejected.", function() {
                var deferred = $promise.defer();
                var promise = $promise.resolve(deferred.promise);

                promise.then(onFulfilled, shouldNotBeCalled);

                $async.flush();
                expect(onFulfilled).not.toHaveBeenCalled();

                deferred.resolve(1);
                $async.flush();

                expect(onFulfilled).toHaveBeenCalled();
            });

            it("if/when x is fulfilled, fulfill promise with the same value", function() {
                var deferred = $promise.defer();
                var promise = $promise.resolve(deferred.promise);

                promise.then(onFulfilled, shouldNotBeCalled);

                $async.flush();
                deferred.resolve(1);
                $async.flush();

                expect(onFulfilled).toHaveBeenCalledWith(1);
            });

            it("if/when x is rejected, reject promise with the same reason", function() {
                var deferred = $promise.defer();
                var promise = $promise.resolve(deferred.promise);

                promise.then(shouldNotBeCalled, onRejected);

                $async.flush();
                deferred.reject(1);
                $async.flush();

                expect(onRejected).toHaveBeenCalledWith(1);
            });
        });

        describe("otherwise, if x is an object or function", function() {
            // TODO TBD do we care about this?
            it("Let then be x.then", function() {
                // https://github.com/jakearchibald/es6-promise/blob/master/test/tests/extension-test.js
                /*if (!isFunction(Object.defineProperty)) {
                    return;
                }

                var thenable = {};
                var count = 0;

                Object.defineProperty(thenable, 'then', {
                    get: function() {
                        count++;
                        return function() {
                        };
                    }
                });

                expect(count).toEqual(0);
                $promise.resolve(thenable);
                expect(count).toEqual(1);*/
            });

            it("if retrieving the property x.then results in a thrown exception e, reject promise with e as the reason", function() {
                // TODO TBD don't think there is anyway to test this?
            });

            describe("if then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where", function() {
                it("if/when resolvePromise is called with a value y, run [[Resolve]](promise, y)", function() {
                    var deferred = $promise.defer();
                    var promise = $promise.resolve(deferred.promise);

                    promise.then(onFulfilled, shouldNotBeCalled);

                    $async.flush();
                    deferred.resolve(1);
                    $async.flush();

                    expect(onFulfilled).toHaveBeenCalledWith(1);
                });

                it("if/when rejectPromise is called with a reason r, reject promise with r", function() {
                    var deferred = $promise.defer();
                    var promise = $promise.resolve(deferred.promise);
                    var error = new Error("a");

                    promise.then(shouldNotBeCalled, onRejected);

                    $async.flush();
                    deferred.reject(error);
                    $async.flush();

                    expect(onRejected).toHaveBeenCalledWith(error);
                });

                it("if both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.", function() {
                    var deferred = $promise.defer();
                    var promise = $promise.resolve(deferred.promise);

                    promise.then(onFulfilled, onRejected);

                    $async.flush();

                    deferred.resolve(1);
                    deferred.resolve(2);
                    deferred.reject(3);
                    deferred.reject(4);

                    $async.flush();

                    expect(onFulfilled.calls.count()).toEqual(1);
                    expect(onFulfilled).toHaveBeenCalledWith(1);
                    expect(onRejected).not.toHaveBeenCalled();
                });

                describe("if calling then throws an exception e,", function() {
                    it("if resolvePromise or rejectPromise have been called, ignore it", function() {
                        var thenable = {
                            then: function(resolve){
                                resolve(1);
                                throw new Error("a");
                            }
                        };

                        var promise = $promise.resolve(thenable);
                        promise.then(onFulfilled, shouldNotBeCalled);

                        $async.flush();
                        expect(onFulfilled).toHaveBeenCalledWith(1);
                    });

                    it("otherwise, reject promise with e as the reason.", function() {
                        var error = new Error("a");
                        var thenable = {
                            then: function(){
                                throw error;
                            }
                        };

                        var promise = $promise.resolve(thenable);
                        promise.then(shouldNotBeCalled, onRejected);

                        $async.flush();
                        expect(onRejected).toHaveBeenCalledWith(error);
                    });
                });
            });

            it("if then is not a function, fulfill promise with x", function() {
                var thenable = {
                    then: 1
                };

                var promise = $promise.resolve(thenable);
                promise.then(onFulfilled, shouldNotBeCalled);

                $async.flush();
                expect(onFulfilled).toHaveBeenCalledWith(thenable);
            });
        });

        it("if x is not an object or function, fulfill promise with x", function() {
            var promise = $promise.resolve("a");
            promise.then(onFulfilled, shouldNotBeCalled);

            $async.flush();
            expect(onFulfilled).toHaveBeenCalledWith("a");
        });
    });

    describe("reject", function () {
        it("should reject with reason", function() {
            var promise = $promise.reject("a");
            promise.then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith("a");
        });
    });

    describe("all", function() {
        it("should fulfill after all promises are fulfilled", function() {
            var firstResolved;
            var secondResolved;
            var thirdResolved;

            var promise1 = $promise(function(resolve) {
                firstResolved = true;
                resolve(1);
            });

            var promise2 = $promise(function(resolve) {
                secondResolved = true;
                resolve(1);
            });

            var promise3 = $promise(function(resolve) {
                thirdResolved = true;
                resolve(1);
            });

            $promise.all([promise1, promise2, promise3]).then(function() {
                expect(firstResolved).toEqual(true);
                expect(secondResolved).toEqual(true);
                expect(thirdResolved).toEqual(true);
            }, shouldNotBeCalled);

            $async.flush();
        });

        it("should reject after one promise is rejected", function() {
            var promise1 = $promise(function(resolve) {
                resolve(1);
            });

            var promise2 = $promise(function(resolve, reject) {
                reject("a");
            });

            var promise3 = $promise(function(resolve) {
                resolve(1);
            });

            $promise.all([promise1, promise2, promise3]).then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith("a");
        });

        it("should only reject once", function() {
            var promise1 = $promise(function(resolve) {
                resolve(1);
            });

            var promise2 = $promise(function(resolve, reject) {
                reject("a");
            });

            var promise3 = $promise(function(resolve) {
                resolve(1);
            });

            $promise.all([promise1, promise2, promise3]).then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected.calls.count()).toEqual(1);
        });

        it("should return in order array of all fulfilled values", function() {
            var count = 0;

            var promise1 = $promise(function(resolve) {
                resolve(count++);
            });

            var promise2 = $promise(function(resolve) {
                resolve(count++);
            });

            var promise3 = $promise(function(resolve) {
                resolve(count++);
            });

            $promise.all([promise1, promise2, promise3]).then(function(values) {
                expect(count).toEqual(3);
                expect(values.length).toEqual(3);
                expect(values[0]).toEqual(0);
                expect(values[1]).toEqual(1);
                expect(values[2]).toEqual(2);
            }, shouldNotBeCalled);

            $async.flush();
        });

        it("should fulfill with empty array", function() {
            $promise.all([]).then(function(values) {
                expect(values.length).toEqual(0);
            }, shouldNotBeCalled);

            $async.flush();
        });

        it("should fulfill with mix of promises, thenables, and non promise like values", function() {
            var promise = $promise(function(resolve) {
                resolve(1);
            });

            var thenable = {
                then: function(onFulfilled) {
                    $async(function() {
                        onFulfilled(2);
                    }, 0);
                }
            };

            $promise.all([promise, thenable, 3]).then(function(values) {
                expect(values.length).toEqual(3);
                expect(values[0]).toEqual(1);
                expect(values[1]).toEqual(2);
                expect(values[2]).toEqual(3);
            }, shouldNotBeCalled);

            $async.flush();
        });

        it("should reject if not an array", function() {
            $promise.all({}).then(onFulfilled, onRejected);

            $async.flush();
            expect(onFulfilled).not.toHaveBeenCalled();
            expect(onRejected).toHaveBeenCalledWith(new TypeError("must pass an array to all"));
        });
    });

    describe("race", function() {
        it("should fulfill after one promise is fulfilled", function() {
            var promise1 = $promise(function() {});

            var promise2 = $promise(function(resolve) {
                resolve(1);
            });

            var promise3 = $promise(function() {});

            $promise.race([promise1, promise2, promise3]).then(onFulfilled, shouldNotBeCalled);

            $async.flush();
            expect(onFulfilled).toHaveBeenCalledWith(1);
        });

        it("should only resolve once", function() {
            var promise1 = $promise(function() {});

            var promise2 = $promise(function(resolve) {
                resolve(1);
            });

            var promise3 = $promise(function() {});

            $promise.race([promise1, promise2, promise3]).then(onFulfilled, shouldNotBeCalled);

            $async.flush();
            expect(onFulfilled.calls.count()).toEqual(1);
        });

        it("should reject after one promise is rejected", function() {
            var promise1 = $promise(function() {});

            var promise2 = $promise(function(resolve, reject) {
                reject(1);
            });

            var promise3 = $promise(function() {});

            $promise.race([promise1, promise2, promise3]).then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith(1);
        });

        it("should only reject once", function() {
            var promise1 = $promise(function() {});

            var promise2 = $promise(function(resolve, reject) {
                reject(1);
            });

            var promise3 = $promise(function() {});

            $promise.race([promise1, promise2, promise3]).then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected.calls.count()).toEqual(1);
        });

        it("should return value of first fulfilled promise", function() {
            var promise1 = $promise(function(resolve) {
                $async(function(){
                    resolve(1);
                }, 30);
            });

            var promise2 = $promise(function(resolve) {
                $async(function(){
                    resolve(2);
                }, 10);
            });

            var promise3 = $promise(function(resolve) {
                $async(function(){
                    resolve(3);
                }, 20);
            });

            $promise.race([promise1, promise2, promise3]).then(onFulfilled, shouldNotBeCalled);

            $async.flush();
            expect(onFulfilled).toHaveBeenCalledWith(2);
        });

        it("should return reason of first rejected promise", function() {
            var promise1 = $promise(function(resolve, reject) {
                $async(function(){
                    reject(1);
                }, 30);
            });

            var promise2 = $promise(function(resolve, reject) {
                $async(function(){
                    reject(2);
                }, 10);
            });

            var promise3 = $promise(function(resolve, reject) {
                $async(function(){
                    reject(3);
                }, 20);
            });

            $promise.race([promise1, promise2, promise3]).then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith(2);
        });

        it("should prioritize by array order on next frame", function() {
            var promise1 = $promise(function(resolve) {
                resolve(1);
            });

            var promise2 = $promise(function(resolve) {
                resolve(2);
            });

            $promise.race([promise1, promise2, 3]).then(onFulfilled, shouldNotBeCalled);

            $async.flush();
            expect(onFulfilled).toHaveBeenCalledWith(1);
        });

        it("should fulfill with mix of promises, thenables, and non promise like values", function() {
            var promise = $promise(function(resolve) {
                resolve(1);
            });

            var thenable = {
                then: function(onFulfilled) {
                    onFulfilled(2);
                }
            };

            $promise.race([promise, thenable, 3]).then(onFulfilled, shouldNotBeCalled);

            $async.flush();
            expect(onFulfilled).toHaveBeenCalledWith(2);
        });

        it("should not resolve an empty array", function() {
            $promise.race([]).then(onFulfilled, onRejected);

            $async.flush();
            expect(onFulfilled).not.toHaveBeenCalled();
            expect(onRejected).not.toHaveBeenCalled();
        });

        it("should reject if not an array", function() {
            $promise.race({}).then(shouldNotBeCalled, onRejected);

            $async.flush();
            expect(onRejected).toHaveBeenCalledWith(new TypeError("must pass an array to race"));
        });
    });
});