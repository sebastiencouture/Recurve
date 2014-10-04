"use strict";

describe("$http", function() {
    var $httpProvider;
    var $http;

    beforeEach(function() {
        $invoke(["$httpProvider", "$http"], function(httpProvider, http) {
            $httpProvider = httpProvider;
            $http = http;
        });
    });

    afterEach(function() {
        $httpProvider.flush();
        $httpProvider.verifyExpectations();
    });

    it("should be invokable", function() {
        expect($http).toBeDefined();
        expect(isFunction($http)).toEqual(true);
    });

    describe("defaults", function() {
        var handler;

        beforeEach(function() {
            handler = $httpProvider.on("get", "www.a.com");
        });

        it("should default to get", function() {
            handler.expect({method: "get"});
            $http({url: "www.a.com"});
        });

        it("should default to json data type", function() {
            handler.expect({dataType: "json"});
            $http({url: "www.a.com"});
        });

        it("should default to browser cache", function() {
            handler.expect({cache: true});
            $http({url: "www.a.com"});
        });

        it("should default to not emulate http", function() {
            handler.expect({emulateHttp: false});
            $http({url: "www.a.com"});
        });

        // TODO TBD others
    });

    describe("headers", function() {
        it("should override default headers", function() {

        });

        it("should override in case insensitive manner", function() {

        });

        it("should add X-Requested-With if not set", function() {

        });

        it("should add X-Requested-With only if not cross domain", function() {

        });

        it("should not send content-type if no data", function() {

        });

        it("should set defaults for custom HTTP type", function() {

        });
    });

    describe("url", function() {
        it("should append random parameter to prevent browser cache", function() {

        });

        // in-depth testing of adding parameters to URL is already
        // covered in common.spec for addParametersToUrl
        it("should add parameters", function() {

        });
    });

    describe("emulateHttp", function() {
        it("should emulate put", function() {

        });

        it("should emulate patch", function() {

        });

        it("should emulate delete", function() {

        });
    });

    describe("serialize", function() {
        it("should serialize object to json", function() {

        });

        it("should serialize object to form data", function() {

        });

        it("should ignore strings", function() {

        });

        it("should ignore File objects", function() {

        });

        it("should ignore Blob objects", function() {

        });

        it("should allow to override", function() {

        });

        it("should have access to content type", function() {

        });
    });

    describe("parse", function() {
        it("should parse valid json", function() {

        });

        it("should return invalid json but not throw error", function() {

        });

        it("should pass through data otherwise", function() {

        });

        it("should allow to override", function() {

        });
    });

    it("should return httpDeferred promise", function() {

    });

    describe("short methods", function() {
        describe("get", function() {
            it("should allow options", function() {

            });

            it("should set default headers", function() {

            });
        });

        describe("post", function() {
            it("should allow options", function() {

            });

            it("should set default headers", function() {

            });
        });

        describe("jsonp", function() {
            it("should allow options", function() {

            });

            it("should set default headers", function() {

            });
        });

        describe("head", function() {
            it("should allow options", function() {

            });

            it("should set default headers", function() {

            });
        });

        describe("put", function() {
            it("should allow options", function() {

            });

            it("should set default headers", function() {

            });
        });

        describe("patch", function() {
            it("should allow options", function() {

            });

            it("should set default headers", function() {

            });
        });
    });
});