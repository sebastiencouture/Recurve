"use strict";

describe("recurveMock-$httpProvider", function() {
    var $httpDeferred;
    var $httpProvider;
    var handler;

    beforeEach(function() {
        $invoke(["$httpDeferred", "$httpProvider"], function(httpDeferred, httpProvider) {
            $httpDeferred = httpDeferred;
            $httpProvider = httpProvider;
        });

        handler = $httpProvider.on("GET", "www.a.com");
    });

    it("should be invokable", function() {
        expect($httpProvider).toBeDefined();
        expect(isFunction($httpProvider)).toEqual(false);
        expect($httpProvider.send).toBeDefined();
    });

    describe("send", function() {
        it("should return promise", function() {
            var promise = $httpProvider.send({method: "get"}, $httpDeferred());

            expect(promise).toBeDefined();
            expect(promise.then).toBeDefined();
        });

        it("should return httpDeferred promise", function() {
            var httpDeferred = $httpDeferred();
            var promise = $httpProvider.send({method: "get"}, httpDeferred);

            expect(promise).toBe(httpDeferred.promise);
        });
    });

    describe("on", function() {
        it("should return handler", function() {
            expect(handler).toBeDefined();
            expect(handler.respond).toBeDefined();
            expect(handler.expect).toBeDefined();
            expect(handler.callCount).toBeDefined();
        });

        it("should return same handler for repeated calls for same method and url", function() {
            var handler2 = $httpProvider.on("GET", "www.a.com");
            expect(handler).toBe(handler2);
        });

        it("should handle method parameter as case insensitive", function() {
            var handler2 = $httpProvider.on("get", "www.a.com");
            expect(handler).toBe(handler2);
        });

        // TODO TBD most if not all servers are probably setup to handle case insensitive
        it("should handle url parameter as case sensitive", function() {
            var handler2 = $httpProvider.on("get", "www.A.com");
            expect(handler).not.toBe(handler2);
        });

        it("should return different handler for same url but different method", function() {
            var handler2 = $httpProvider.on("POST", "www.a.com");
            expect(handler).not.toBe(handler2);
        });

        it("should return different handler for different url and method", function() {
            var handler2 = $httpProvider.on("GET", "www.b.com");
            expect(handler).not.toBe(handler2);
        });
    });

    describe("respond", function() {
        var callback;
        var promise;

        beforeEach(function() {
            var httpDeferred = $httpDeferred();
            promise = httpDeferred.promise;

            $httpProvider.send({method: "GET", url: "www.a.com"}, httpDeferred);
            callback = jasmine.createSpy("callback");
        });

        it("should be chainable", function() {
            expect(handler.respond()).toEqual(handler);
        });

        it("should resolve promise on success status code", function() {
            handler.respond({status: 200});
            promise.success(callback);

            $httpProvider.flush();
            expect(callback).toHaveBeenCalled();
        });

        it("should reject promise on error status code", function() {
            handler.respond({status: 400});
            promise.error(callback);

            $httpProvider.flush();
            expect(callback).toHaveBeenCalled();
        });

        it("should resolve promise if no status code", function() {
            handler.respond({});
            promise.success(callback);

            $httpProvider.flush();
            expect(callback).toHaveBeenCalled();
        });

        it("should throw error if no data and no expected count set", function() {
            handler.respond();
            promise.then(callback, callback);

            expect(function() {
                $httpProvider.flush();
                expect(callback).not.toHaveBeenCalled();
            }).toThrow();

            expect(callback).not.toHaveBeenCalled();
        });

        it("should allow response to be changed", function() {
            handler.respond({status: 200});
            handler.respond({status: 400});
            promise.error(callback);

            $httpProvider.flush();
            expect(callback).toHaveBeenCalled();
        });

        it("should allow response to be changed after responded", function() {
            handler.respond({status: 200});
            promise.then(callback);

            $httpProvider.flush();
            expect(callback).toHaveBeenCalled();

            handler.respond({status: 400});

            var httpDeferred = $httpDeferred();
            promise = httpDeferred.promise;

            $httpProvider.send({method: "GET", url: "www.a.com"}, httpDeferred);
            callback = jasmine.createSpy("callback");

            promise.error(callback);

            $httpProvider.flush();
            expect(callback).toHaveBeenCalled();
        });

        it("should return response on success", function() {
            handler.respond({status: 200, data: "a"});
            promise.then(callback);

            $httpProvider.flush();
            expect(callback).toHaveBeenCalledWith({status: 200, data: "a"});
        });

        it("should return response on error", function() {
            handler.respond({status: 400, data: "a"});
            promise.then(null, callback);

            $httpProvider.flush();
            expect(callback).toHaveBeenCalledWith({status: 400, data: "a"});
        });
    });

    describe("callCount", function() {
        it("should return number of times handler has been called", function() {
            handler.respond({});

            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());

            $httpProvider.flush();
            expect(handler.callCount()).toEqual(2);
        });

        it("should include calls with no response data for expected", function() {
            handler.respond().expect(null, 2);

            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());

            $httpProvider.flush();
            expect(handler.callCount()).toEqual(2);
        });

        it("should return 0 if handler not called", function() {
            handler.respond();

            $httpProvider.flush();
            expect(handler.callCount()).toEqual(0);
        });
    });

    describe("verifyPending", function() {
        beforeEach(function() {
            handler.respond({});
        });

        it("should throw error if pending requests", function() {
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());

            expect(function() {
                $httpProvider.verifyPending();
            }).toThrow();
        });

        it("should do nothing if no pending requests", function() {
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyPending();
            }).not.toThrow();
        });

        it("should include description of each pending request", function() {
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "POST", url: "www.b.com"}, $httpDeferred());

            expect(function() {
                $httpProvider.verifyPending();
            }).toThrow(new Error("pending requests:\nmethod: GET, url: www.a.com,\nmethod: POST, url: www.b.com,\n"));
        });

        it("should not include description of fulfilled requests", function() {
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "POST", url: "www.b.com"}, $httpDeferred());

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyPending();
            }).toThrow(new Error("pending requests:\nmethod: POST, url: www.b.com,\n"));
        });
    });

    describe("flush", function() {
        var callback;
        var callback2;
        var callback3;

        beforeEach(function() {
            var httpDeferred = $httpDeferred();
            $httpProvider.send({method: "GET", url: "www.a.com"}, httpDeferred);
            callback = jasmine.createSpy("callback");
            httpDeferred.promise.then(callback);

            httpDeferred = $httpDeferred();
            $httpProvider.send({method: "GET", url: "www.a.com"}, httpDeferred);
            callback2 = jasmine.createSpy("callback2");
            httpDeferred.promise.then(callback2);

            httpDeferred = $httpDeferred();
            $httpProvider.send({method: "GET", url: "www.a.com"}, httpDeferred);
            callback3 = jasmine.createSpy("callback3");
            httpDeferred.promise.then(callback3);

            handler.respond({status: 200});
        });

        it("should flush all requests", function() {
            $httpProvider.flush();

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });

        it("should flush x requests", function() {
            $httpProvider.flush(2);

            expect(callback).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).not.toHaveBeenCalled();
        });

        it("should remove request that is handled", function() {
            $httpProvider.flush();
            $httpProvider.verifyPending();
        });

        it("should not remove request that has no handler", function() {
            $httpProvider.flush(2);

            expect(function() {
                $httpProvider.verifyPending();
            }).toThrow(new Error("pending requests:\nmethod: GET, url: www.a.com,\n"));
        });
    });

    describe("verifyExpectations", function() {
        it("should throw error if not all handlers called expected number of times", function() {
            handler.expect();

            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow();
        });

        it("should do nothing if all handlers called expected number of times", function() {
            handler.expect(null, 2);

            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should do nothing if no handlers", function() {
            $invoke(["$httpDeferred", "$httpProvider"], function(httpDeferred, httpProvider) {
                $httpDeferred = httpDeferred;
                $httpProvider = httpProvider;
            });

            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should include description of each handler that did not meet expectation", function() {
            handler.expect();

            var handler2 = $httpProvider.on("GET", "www.b.com");
            handler2.expect();

            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.b.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.b.com"}, $httpDeferred());

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow(new Error("outstanding expectations:\nmethod: GET, url: www.a.com, expected calls: 1, actual: 2,\nmethod: GET, url: www.b.com, expected calls: 1, actual: 2,\n"));
        });

        it("should not include description if met expectation", function() {
            handler.expect(null, 1);

            var handler2 = $httpProvider.on("GET", "www.b.com");
            handler2.expect(null, 2);

            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.b.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.b.com"}, $httpDeferred());

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow(new Error("outstanding expectations:\nmethod: GET, url: www.a.com, expected calls: 1, actual: 2,\n"));
        });

        it("should include expected options in the description", function() {
            handler.expect({data: "a"});

            $httpProvider.send({method: "GET", url: "www.a.com", data: "b"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow(new Error('outstanding expectations:\nmethod: GET, url: www.a.com, expected calls: 1, actual: 0, expected options: {"data":"a"}, actual: {"method":"GET","url":"www.a.com","data":"b"},\n'));
        });
    });

    describe("expect", function() {
        it("should be chainable", function() {
            expect(handler.expect()).toEqual(handler);
        });

        it("should default to expect one call and no expected options", function() {
            handler.expect();

            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should meet expectations for empty expected options object", function() {
            handler.expect({});

            $httpProvider.send({method: "GET", url: "www.a.com", data: {a: 1}}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should treat expected options method parameter as case insensitive", function() {
            handler.expect({method: "GET"});

            $httpProvider.send({method: "get", url: "www.a.com"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should meet expectations for null expected options object", function() {
            handler.expect(null);

            $httpProvider.send({method: "GET", url: "www.a.com", data: {a: 1}}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should allow to be set multiple times", function() {
            handler.expect(null, 1);
            handler.expect(null, 2);

            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
            $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should meet expectations if expected options match request options", function() {
            handler.expect({data: "a"});

            $httpProvider.send({method: "GET", url: "www.a.com", data: "a"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should meet expectations for options object parameters", function() {
            handler.expect({data: {a: 1}});

            $httpProvider.send({method: "GET", url: "www.a.com", data: {a: 1}}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should meet expectations for partial options object parameters", function() {
            handler.expect({data: {a: 1}});

            $httpProvider.send({method: "GET", url: "www.a.com", data: {a: 1, b: 2}}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should not meet expectations if expected options don't match request options", function() {
            handler.expect({data: "a"});

            $httpProvider.send({method: "GET", url: "www.a.com", data: "b"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow();
        });

        it("should meet expectations if all expected options match but request includes additional options", function() {
            handler.expect({data: "a"});

            $httpProvider.send({method: "GET", url: "www.a.com", data: "a", other: "a"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should not meet expectations if expected options match but count does not", function() {
            handler.expect({data: "a"}, 2);

            $httpProvider.send({method: "GET", url: "www.a.com", data: "b"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow();
        });

        it("should meet expectations for url with params option object not included in handler url", function() {
            handler.expect();

            $httpProvider.send({method: "get", url: "www.a.com", params: {a: 1}}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });

        it("should meet expectations for url with query parameters included in handler url", function() {
            handler = $httpProvider.on("GET", "www.a.com?a=2");
            handler.expect();

            $httpProvider.send({method: "get", url: "www.a.com?a=2"}, $httpDeferred());
            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).not.toThrow();
        });
    });

    it("should clear expectations", function() {
        handler.respond({});
        handler.expect();

        $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
        $httpProvider.flush();

        expect(function() {
            $httpProvider.verifyExpectations();
        }).not.toThrow();

        $httpProvider.clearExpectations();

        $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
        $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
        $httpProvider.flush();

        expect(function() {
            $httpProvider.verifyExpectations();
        }).not.toThrow();
    });

    it("should invoke handler for multiple requests with same method and url", function() {
        handler.respond({});
        handler.expect(null, 3);

        $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
        $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
        $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
        $httpProvider.flush();

        expect(function() {
            $httpProvider.verifyExpectations();
        }).not.toThrow();
    });

    it("should invoke different handler for same url but different method", function() {
        handler.expect();
        $httpProvider.on("POST", "www.a.com").expect();
        $httpProvider.on("DELETE", "www.a.com").expect();

        $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
        $httpProvider.send({method: "POST", url: "www.a.com"}, $httpDeferred());
        $httpProvider.send({method: "DELETE", url: "www.a.com"}, $httpDeferred());
        $httpProvider.flush();

        expect(function() {
            $httpProvider.verifyExpectations();
        }).not.toThrow();
    });

    it("should invoke different handler for different url and method", function() {
        handler.expect();
        $httpProvider.on("POST", "www.b.com").expect();
        $httpProvider.on("DELETE", "www.c.com").expect();

        $httpProvider.send({method: "GET", url: "www.a.com"}, $httpDeferred());
        $httpProvider.send({method: "POST", url: "www.b.com"}, $httpDeferred());
        $httpProvider.send({method: "DELETE", url: "www.c.com"}, $httpDeferred());
        $httpProvider.flush();

        expect(function() {
            $httpProvider.verifyExpectations();
        }).not.toThrow();
    });
});