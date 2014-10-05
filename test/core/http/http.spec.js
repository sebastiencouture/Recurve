"use strict";

describe("$http", function() {
    var $httpProvider;
    var $http;
    var handler;

    beforeEach(function() {
        $invoke(["$httpProvider", "$http"], function(httpProvider, http) {
            $httpProvider = httpProvider;
            $http = http;
        });
    });

    afterEach(function() {
        $httpProvider.flush();
        $httpProvider.verifyExpectations();
        $httpProvider.verifyPending();
    });

    it("should be invokable", function() {
        expect($http).toBeDefined();
        expect(isFunction($http)).toEqual(true);
    });

    describe("defaults", function() {
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

        it("should default to not cross domain", function() {
            handler.expect({crossDomain: false});
            $http({url: "www.a.com"});
        });

        it("should override defaults", function() {
            handler.expect({emulateHttp: true});
            $http({url: "www.a.com", emulateHttp: true});
        });
    });

    describe("headers", function() {
        beforeEach(function() {
            handler = $httpProvider.on("post", "www.a.com");
        });

        it("should merge default all headers with method specific defaults", function() {
            $include(null, function($mockable) {
                $mockable.config("$http", {
                    headers: {
                        all: {
                            A: 1
                        },

                        get: {
                            B: 2
                        }
                    },

                    method: "get"
                });
            });

            $invoke(["$httpProvider", "$http"], function(httpProvider, http) {
                $httpProvider = httpProvider;
                $http = http;
            });

            handler = $httpProvider.on("get", "www.a.com");
            handler.expect({headers: {A: 1, B: 2}});
            $http({url: "www.a.com"});
        });

        it("should override default all headers with method specific headers", function() {
            $include(null, function($mockable) {
                $mockable.config("$http", {
                    headers: {
                        all: {
                            A: 1
                        },

                        get: {
                            A: 2
                        }
                    },

                    method: "get"
                });
            });

            $invoke(["$httpProvider", "$http"], function(httpProvider, http) {
                $httpProvider = httpProvider;
                $http = http;
            });

            handler = $httpProvider.on("get", "www.a.com");
            handler.expect({headers: {A: 2}});
            $http({url: "www.a.com"});
        });

        // TOOD TBD should it do this?
        it("should upper case first letter of each header key word", function() {

        });

        it("should override default headers", function() {
            handler.expect({headers: {"Content-Type": "text"}});
            $http({url: "www.a.com", method: "post",data: {}, headers: {"Content-Type": "text"}});
        });

        it("should override in case insensitive manner", function() {
            handler.expect({headers: {"Content-Type": "text"}});
            $http({url: "www.a.com", method: "post", data: {}, headers: {"content-type": "text"}});
        });

        it("should add X-Requested-With if not set", function() {
            handler.expect({headers: {"X-Requested-With":"XMLHttpRequest"}});
            $http({url: "www.a.com", method: "post"});
        });

        it("should not override X-Requested-With", function() {
            handler.expect({headers: {"X-Requested-With":"a"}});
            $http({url: "www.a.com", method: "post", headers: {"X-Requested-With":"a"}});
        });

        it("should add X-Requested-With only if not cross domain", function() {
            handler.expect({headers: {"X-Requested-With":"XMLHttpRequest"}}).respond({});
            $http({url: "www.a.com", method: "post", crossDomain: true});

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow();

            $httpProvider.clearExpectations();
        });

        it("should not send content-type if no data", function() {
            handler.expect({headers: {"Content-Type" : "application/json; charset=UTF-8"}}).respond({});
            $http({url: "www.a.com", method: "post", crossDomain: true});

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow();

            $httpProvider.clearExpectations();
        });

        it("should set defaults for custom HTTP type", function() {
            handler = $httpProvider.on("custom", "www.a.com");
            handler.expect({dataType: "json"});
            $http({url: "www.a.com", method: "custom"});
        });
    });

    describe("url", function() {
        beforeEach(function() {
            handler = $httpProvider.on("get", "www.a.com");
        });

        // TODO TBD need to figure out better way to test this and look at the
        // actual generated URL
        it("should append random parameter to prevent browser cache", function() {
            handler.expect({params: {cache: Date.now()}});
            $http({url: "www.a.com", cache: false});
        });

        // in-depth testing of adding parameters to URL is already
        // covered in common.spec for addParametersToUrl(..)
        it("should add parameters", function() {
            handler.expect({params: {a: 1, b: 2}});
            $http({url: "www.a.com", params: {a: 1, b: 2}});
        });

        it("should replace query parameters", function() {
            handler = $httpProvider.on("get", "www.a.com?a=99");
            handler.expect({params: {a: 1, b: 2}});
            $http({url: "www.a.com?a=99", params: {a: 1, b: 2}});
        });
    });

    describe("emulateHttp", function() {
        function test(method) {
            handler = $httpProvider.on(method, "www.a.com");
            handler.expect({data: {_method: method}});
            $http({url: "www.a.com", method: method, emulateHttp: true});
        }

        it("should emulate put", function() {
            test("put");
        });

        it("should emulate patch", function() {
            test("patch");
        });

        it("should emulate delete", function() {
            test("delete");
        });

        it("should not emulate others", function() {
            handler = $httpProvider.on("get", "www.a.com").respond({});
            handler.expect({data: {_method: "get"}});
            $http({url: "www.a.com", method: "get", emulateHttp: true});

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow();

            $httpProvider.clearExpectations();
        });
    });

    describe("serialize", function() {
        beforeEach(function() {
            handler = $httpProvider.on("post", "www.a.com");
        });

        // toJson covered in detail in common.spec
        it("should serialize object to json", function() {
            handler.expect({data: '{"a":1,"b":2}'});
            $http({url: "www.a.com",method: "post", data: {a: 1, b: 2}});
        });

        // toFormData covered in detail in common.spec
        it("should serialize object to form data", function() {

        });

        it("should pass through for strings", function() {

        });

        it("should pass through File objects", function() {

        });

        it("should pass through Blob objects", function() {

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