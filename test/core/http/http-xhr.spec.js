"use strict";

describe("$httpXhr", function() {
    var instance;

    function MockXMLHttpRequest() {
        instance = this;
    }

    MockXMLHttpRequest.prototype = {
        open: jasmine.createSpy("open"),
        send: jasmine.createSpy("send"),
        abort: jasmine.createSpy("abort"),
        setRequestHeader: jasmine.createSpy("setRequestHeader"),
        getAllResponseHeaders: jasmine.createSpy("getAllResponseHeaders"),
        getResponseHeader: jasmine.createSpy("getResponseHeader")
    };

    var $httpXhr;

    beforeEach(function() {
        instance = null;

        $include(null, function($mockable) {
            $mockable.value("$window", {
                protocol: {
                    location: ""
                },

                setTimeout: function(fn, timeout) {
                    window.setTimeout(fn, timeout);
                },

                XMLHttpRequest: MockXMLHttpRequest
            });
        });

        $invoke(["$httpXhr"], function(httpXhr) {
            $httpXhr = httpXhr;
        })
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

    });

    it("should send request data", function() {

    });

    describe("promise", function() {
        it("should return promise", function() {

        });

        it("should resolve promise on success", function() {

        });

        it("should reject promise on error", function() {

        });
    });

    describe("response", function() {
        describe("status code", function() {
            it("should return status", function() {

            });

            it("should fix 0 status when accessing files", function() {

            });

            it("should fix 0 status when data returned", function() {

            });

            it("should fix IE status 1223", function() {

            });

            it("should return success for valid status code", function() {

            });

            it("should return success for file access with 0 status code", function() {

            });

            it("should return error for error status code", function() {

            });
        });

        describe("response data", function() {
            it("should return text for anything but xml", function() {

            });

            it("should return xml for xml accept type", function() {

            });

            it("should derive accept type from content-type if no accept", function() {

            });
        });

        it("should return status text", function() {

        });

        it("should return headers", function() {

        });

        it("should return passed in options", function() {

        });

        describe("cancel/abort", function() {
            it("should cancel request", function() {

            });

            it("should not read properties on cancel", function() {

            });

            it("should return error for canceled request", function() {

            });
        });
    });
});