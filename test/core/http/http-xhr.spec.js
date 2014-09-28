"use strict";

describe("$httpXhr", function() {
    function MockXMLHttpRequest() {
        instance = this;

        this.open = jasmine.createSpy("open");
        this.send = jasmine.createSpy("send");
        this.abort = jasmine.createSpy("abort");
        this.setRequestHeader = jasmine.createSpy("setRequestHeader");
        this.getAllResponseHeaders = jasmine.createSpy("getAllResponseHeaders");
        this.getResponseHeader = jasmine.createSpy("getResponseHeader");
    }

    function shouldNotBeCalled() {
        assert(false, "fulfilled or rejected promise callback called when should not be");
    }

    var $httpXhr;
    var instance;

    beforeEach(function() {
        instance = null;

        $include(null, function($mockable) {
            $mockable.value("$window", {
                location: {
                    protocol: ""
                },

                setTimeout: function(fn, timeout) {
                    window.setTimeout(fn, timeout);
                },

                XMLHttpRequest: MockXMLHttpRequest
            });
        });

        $invoke(["$httpXhr"], function(httpXhr) {
            $httpXhr = httpXhr;
        });
    })

    it("should be invokable", function() {
        expect($httpXhr).toBeDefined();
        expect(isFunction($httpXhr)).toEqual(true);
    });

    describe("config", function() {
        it("should set with credentials", function() {
            $httpXhr({withCredentials: true, method: "get"}).send();
            expect(instance.withCredentials).toEqual(true);
        });

        it("should set response type", function() {
            $httpXhr({responseType: "json", method: "get"}).send();
            expect(instance.responseType).toEqual("json");
        });

        it("should set timeout", function() {
            $httpXhr({timeout: 1, method: "get"}).send();
            expect(instance.timeout).toEqual(1);
        });

        it("should add request headers", function() {
            var headers = {
                "X-Test-A" : "a",
                "X-Test-B" : "b"
            };

            $httpXhr({headers: headers, method: "get"}).send();

            expect(instance.setRequestHeader).toHaveBeenCalledWith("X-Test-A", "a");
            expect(instance.setRequestHeader).toHaveBeenCalledWith("X-Test-B", "b");
        });
    });

    it("should open with method, url, and always be async", function() {
        $httpXhr({method: "get", url: "www.test.com"}).send();
        expect(instance.open).toHaveBeenCalledWith("GET", "www.test.com", true);
    });

    it("should send request data", function() {
        $httpXhr({method: "get", data: "abc"}).send();
        expect(instance.send).toHaveBeenCalledWith("abc");
    });

    describe("promise", function() {
        var promise;

        beforeEach(function() {
            promise = $httpXhr({method: "get"}).send();
        });

        it("should return promise", function() {
            expect(promise).toBeDefined();
            expect(promise.then).toBeDefined();
        });

        it("should resolve promise on success", function(done) {
            promise.then(function(response) {
                expect(response).toBeDefined();
                done();
            }, shouldNotBeCalled);

            instance.readyState = 4;
            instance.status = 200;
            instance.onreadystatechange();
        });

        it("should reject promise on error", function(done) {
            promise.then(shouldNotBeCalled, function(response) {
                expect(response).toBeDefined();
                done();
            });

            instance.readyState = 4;
            instance.status = 404;
            instance.onreadystatechange();
        });

        it("should only complete on readystate 4", function(done) {
            var called = false;
            promise.then(function() {
                called = true;
            }, shouldNotBeCalled);

            instance.readyState = 3;
            instance.status = 200;
            instance.onreadystatechange();

            setTimeout(function() {
                expect(called).toEqual(false);
                done();
            }, 0);
        });
    });

    describe("response", function() {
        var promise;
        var httpXhr;

        beforeEach(function() {
            httpXhr = $httpXhr({method: "get"})
            promise = httpXhr.send();

            instance.readyState = 4;
        });

        describe("status code", function() {
            it("should return success for valid status code", function(done) {
                promise.then(function() {
                    done();
                }, shouldNotBeCalled);

                instance.status = 200;
                instance.onreadystatechange();
            });

            it("should return error for error status code", function(done) {
                promise.then(shouldNotBeCalled, function() {
                    done();
                });

                instance.status = 404;
                instance.onreadystatechange();
            });

            it("should return status", function(done) {
                promise.then(function(response) {
                    expect(response.status).toEqual(200);
                    done();
                }, shouldNotBeCalled);

                instance.status = 200;
                instance.onreadystatechange();
            });

            it("should fix 0 status when accessing files but no data returned", function(done) {
                $include(null, function($mockable) {
                    $mockable.value("$window", {
                        location: {
                            protocol: "file:"
                        },

                        setTimeout: function(fn, timeout) {
                            window.setTimeout(fn, timeout);
                        },

                        XMLHttpRequest: MockXMLHttpRequest
                    });
                });

                $invoke(["$httpXhr"], function(httpXhr) {
                    $httpXhr = httpXhr;
                });

                promise = $httpXhr({method: "get"}).send();
                instance.readyState = 4;

                promise.then(shouldNotBeCalled, function(response) {
                    expect(response.status).toEqual(404);
                    done();
                });

                instance.status = 0;
                instance.onreadystatechange();
            });

            it("should fix 0 status when data returned", function(done) {
                promise.then(function(response) {
                    expect(response.status).toEqual(200);
                    done();
                }, shouldNotBeCalled);

                instance.responseText = "a";
                instance.status = 0;
                instance.onreadystatechange();
            });

            it("should fix IE status 1223", function(done) {
                promise.then(function(response) {
                    expect(response.status).toEqual(204);
                    done();
                }, shouldNotBeCalled);

                instance.status = 1223;
                instance.onreadystatechange();
            });
        });

        describe("response data", function() {
            it("should return text for anything but xml accept type or content type", function(done) {
                promise = $httpXhr({method: "get", headers: {"Accept": "application/json"}}).send();

                promise.then(function(response) {
                    expect(response.data).toEqual('{"a":1}');
                    done();
                }, shouldNotBeCalled);

                instance.readyState = 4;
                instance.responseText = '{"a":1}';
                instance.responseXML = "a";
                instance.status = 200;
                instance.onreadystatechange();
            });

            it("should return xml for xml accept type", function(done) {
                promise = $httpXhr({method: "get", headers: {"Accept": "text/xml"}}).send();

                promise.then(function(response) {
                    expect(response.data).toEqual("a");
                    done();
                }, shouldNotBeCalled);

                instance.readyState = 4;
                instance.responseText = '{"a":1}';
                instance.responseXML = "a";
                instance.status = 200;
                instance.onreadystatechange();
            });

            it("should derive accept type from content-type if no accept type", function(done) {
                promise.then(function(response) {
                    expect(response.data).toEqual("a");
                    done();
                }, shouldNotBeCalled);

                instance.responseText = '{"a":1}';
                instance.responseXML = "a";
                instance.status = 200;
                instance.getResponseHeader.and.returnValue("application/xml; text");
                instance.onreadystatechange();
            });
        });

        it("should return status text", function(done) {
            promise.then(function(response) {
                expect(response.statusText).toEqual("a");
                done();
            }, shouldNotBeCalled);

            instance.statusText = "a";
            instance.status = 200;
            instance.onreadystatechange();
        });

        it("should return headers", function(done) {
            promise.then(function(response) {
                expect(response.headers).toEqual("a: b");
                done();
            }, shouldNotBeCalled);

            instance.statusText = "a";
            instance.status = 200;
            instance.getAllResponseHeaders.and.returnValue("a: b");

            instance.onreadystatechange();
        });

        it("should return passed in options", function(done) {
            promise.then(function(response) {
                expect(response.options).toEqual({method: "get"});
                done();
            }, shouldNotBeCalled);

            instance.status = 200;
            instance.onreadystatechange();
        });

        describe("cancel/abort", function() {
            it("should cancel request and reject promise", function(done) {
                promise.then(shouldNotBeCalled, function(response) {
                    expect(response.canceled).toEqual(true);
                    done();
                });

                instance.status = 200;
                httpXhr.cancel();
                instance.onreadystatechange();
            });

            it("should not read properties", function(done) {
                promise.then(shouldNotBeCalled, function(response) {
                    expect(instance.getAllResponseHeaders).not.toHaveBeenCalled();
                    expect(instance.getResponseHeader).not.toHaveBeenCalled();
                    expect(response.status).toEqual(0);
                    expect(response.statusText).toEqual("");
                    expect(response.headers).toEqual(null);
                    expect(response.data).toEqual(null);
                    done();
                });

                instance.status = 200;
                httpXhr.cancel();
                expect(instance.abort).toHaveBeenCalled();
                instance.onreadystatechange();
            });
        });
    });
});