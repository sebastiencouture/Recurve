"use strict";

describe("$promise", function() {
    var $promise;

    beforeEach(function() {
        $invoke(["$promise"], function(promise) {
            $promise = promise;
        });
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

        it("should reject on error with the error as the reason", function() {
            var promise = $promise(function() {
                throw new Error("a");
            });

            promise.then(function() {
                assert(false);
                done();
            }, function(reason) {
                expect(reason).toEqual(new Error("a"));
                done();
            })
        });

        it("should resolve only once", function(done) {
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

            var resolveCount = 0;
            var rejectCount = 0;

            promise.then(function() {
                return thenable;
            }).then(function() {
                resolveCount++;
            }, function() {
                rejectCount++;
            });

            setTimeout(function() {
                resolver(1);
                rejector(1);
                resolver(1);
                rejector(1);

                setTimeout(function() {
                    expect(resolveCount).toEqual(1);
                    expect(rejectCount).toEqual(0);
                    done();

                }, 50);
            }, 50);
        });

        it("should resolve with first fulfilled value", function(done) {
            var fulfilledPromise = $promise(function(resolve) {
                resolve(1);
            });

            var promise = $promise(function(resolve) {
                resolve(fulfilledPromise);
            });

            promise.then(function(value) {
                expect(value).toEqual(1);
                done();
            }, function() {
                assert(false);
                done();
            });
        });

        it("should resolve with first fulfilled value for thenable", function(done) {
            var fulfilledThenable = {
                then: function(onFulfilled) {
                    setTimeout(function() {
                        onFulfilled(1);
                    }, 0);
                }
            };

            var promise = $promise(function(resolve) {
                resolve(fulfilledThenable);
            });

            promise.then(function(value) {
                expect(value).toEqual(1);
                done();
            }, function() {
                assert(false);
                done();
            });
        });

        it("should reject with first rejected reason", function(done) {
            var fulfilledPromise = $promise(function(resolve, reject) {
                reject(1);
            });

            var promise = $promise(function(resolve) {
                resolve(fulfilledPromise);
            });

            promise.then(function() {
                assert(false);
                done();
            }, function(reason) {
                expect(reason).toEqual(1);
                done();
            });
        });

        it("should reject with first rejected reason for thenable", function(done) {
            var fulfilledThenable = {
                then: function(onFulfilled, onRejected) {
                    setTimeout(function() {
                        onRejected(1);
                    }, 0);
                }
            };

            var promise = $promise(function(resolve) {
                resolve(fulfilledThenable);
            });

            promise.then(function() {
                assert(false);
                done();
            }, function(reason) {
                expect(reason).toEqual(1);
                done();
            });
        });

        describe("resolve", function() {

        });

        describe("reject", function () {

        });

        describe("defer", function() {

        });

        describe("all", function() {
            it("should fulfill after all promises are fulfilled", function(done) {
                done();
            });

            it("should reject after one promise is rejected", function(done) {
                done();
            });

            it("should return in order array of all fulfilled values", function(done) {
                done();
            });

            it("should allow non promise like values", function(done) {
                done();
            });

            it("should allow thenables", function(done) {
                done();
            });

            it("should reject if not array parameter", function(done) {
                $promise.all({}).then(function() {
                    expect(false);
                    done();
                }, function(reason) {
                    expect(reason).toEqual(new TypeError("must pass an array to all"));
                    done();
                });
            });
        });

        describe("race", function() {
            it("should fulfill after one promise is fulfilled", function(done) {
                done();
            });

            it("should reject after one promise is rejected", function(done) {
                done();
            });

            it("should return value of first fulfilled promise", function(done) {
                done();
            });

            it("should return reason of first rejected promise", function(done) {
                done();
            });

            it("should ignore non promise like values", function(done) {
                done();
            });

            it("should allow thenables", function(done) {
                done();
            });

            it("should reject if not array parameter", function(done) {
                $promise.race({}).then(function() {
                    expect(false);
                    done();
                }, function(reason) {
                    expect(reason).toEqual(new TypeError("must pass an array to race"));
                    done();
                });
            });
        });

        it("should resolve asynchronously", function() {

        });

        it("should reject asynchronously", function() {

        })

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
    })
});