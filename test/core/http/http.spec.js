/* global WebKitBlobBuilder: false */

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
            handler = $httpProvider.on("GET", "www.a.com");
        });

        it("should default to get", function() {
            handler.expect({method: "GET"});
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

    // TODO TBD need to test at XHR level since this will pass due to mock http provider
    it("should upper case method", function() {
        handler = $httpProvider.on("GET", "www.a.com").expect();
        $http({url: "www.a.com", method: "gEt"});
    });

    describe("headers", function() {
        beforeEach(function() {
            handler = $httpProvider.on("POST", "www.a.com");
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

            handler = $httpProvider.on("GET", "www.a.com");
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

                    method: "GET"
                });
            });

            $invoke(["$httpProvider", "$http"], function(httpProvider, http) {
                $httpProvider = httpProvider;
                $http = http;
            });

            handler = $httpProvider.on("GET", "www.a.com");
            handler.expect({headers: {A: 2}});
            $http({url: "www.a.com"});
        });

        it("should upper camel case header keys", function() {
            handler.expect({headers: {"Content-Type": "text"}});
            $http({url: "www.a.com", method: "POST", data: {}, headers: {"content-type": "text"}});
        });

        it("should override default headers", function() {
            handler.expect({headers: {"Content-Type": "text"}});
            $http({url: "www.a.com", method: "POST",data: {}, headers: {"Content-Type": "text"}});
        });

        it("should override in case insensitive manner", function() {
            handler.expect({headers: {"Content-Type": "text"}});
            $http({url: "www.a.com", method: "POST", data: {}, headers: {"content-type": "text"}});
        });

        it("should add X-Requested-With if not set", function() {
            handler.expect({headers: {"X-Requested-With":"XMLHttpRequest"}});
            $http({url: "www.a.com", method: "POST"});
        });

        it("should not override X-Requested-With", function() {
            handler.expect({headers: {"X-Requested-With":"a"}});
            $http({url: "www.a.com", method: "POST", headers: {"X-Requested-With":"a"}});
        });

        it("should add X-Requested-With only if not cross domain", function() {
            handler.expect({headers: {"X-Requested-With":"XMLHttpRequest"}}).respond({});
            $http({url: "www.a.com", method: "POST", crossDomain: true});

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow();

            $httpProvider.clearExpectations();
        });

        it("should not send content-type if no data", function() {
            handler.expect({headers: {"Content-Type" : "application/json; charset=UTF-8"}}).respond({});
            $http({url: "www.a.com", method: "POST", crossDomain: true});

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow();

            $httpProvider.clearExpectations();
        });

        it("should set defaults for custom HTTP type", function() {
            handler = $httpProvider.on("TRACE", "www.a.com");
            handler.expect({dataType: "json"});
            $http({url: "www.a.com", method: "TRACE"});
        });

        it("should not modify Accept header if already set", function() {
            handler.expect({headers: {Accept: "a"}});
            $http({url: "www.a.com", method: "POST", headers: {Accept: "a"}});
        });

        it("should add Accept header for text dataType", function() {
            handler.expect({headers: {Accept: "text/plain,*/*;q=0.01"}});
            $http({url: "www.a.com", method: "POST", dataType: "text"});
        });

        it("should add Accept header for html dataType", function() {
            handler.expect({headers: {Accept: "text/html,*/*;q=0.01"}});
            $http({url: "www.a.com", method: "POST", dataType: "html"});
        });

        it("should add Accept header for xml dataType", function() {
            handler.expect({headers: {Accept: "application/xml,text/xml,*/*;q=0.01"}});
            $http({url: "www.a.com", method: "POST", dataType: "xml"});
        });

        it("should add Accept header for json dataType", function() {
            handler.expect({headers: {Accept: "application/json,text/javascript,*/*;q=0.01"}});
            $http({url: "www.a.com", method: "POST", dataType: "json"});
        });

        it("should add default Accept header otherwise", function() {
            handler.expect({headers: {Accept: "*/*"}});
            $http({url: "www.a.com", method: "POST", dataType: "a"});
        });
    });

    describe("url", function() {
        beforeEach(function() {
            handler = $httpProvider.on("GET", "www.a.com");
        });

        it("should append random param to prevent browser cache", function() {
            handler.expect({params: {cache: /[0-9]{13}/}});
            $http({url: "www.a.com", cache: false});
        });

        // in-depth testing of adding params to URL is already
        // covered in common.spec for addParamsToUrl(..)
        it("should add params", function() {
            handler.expect({params: {a: 1, b: 2}});
            $http({url: "www.a.com", params: {a: 1, b: 2}});
        });

        it("should replace query params", function() {
            handler = $httpProvider.on("GET", "www.a.com?a=99");
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
            test("PUT");
        });

        it("should emulate patch", function() {
            test("PATCH");
        });

        it("should emulate delete", function() {
            test("DELETE");
        });

        it("should not emulate others", function() {
            handler = $httpProvider.on("get", "www.a.com").respond({});
            handler.expect({data: {_method: "GET"}});
            $http({url: "www.a.com", method: "GET", emulateHttp: true});

            $httpProvider.flush();

            expect(function() {
                $httpProvider.verifyExpectations();
            }).toThrow();

            $httpProvider.clearExpectations();
        });
    });

    describe("serialize", function() {
        beforeEach(function() {
            handler = $httpProvider.on("POST", "www.a.com");
        });

        // toJson covered in detail in common.spec
        it("should serialize object to json", function() {
            handler.expect({data: '{"a":1,"b":2}'});
            $http({url: "www.a.com", method: "POST", data: {a: 1, b: 2}});
        });

        // toFormData covered in detail in common.spec
        it("should serialize object to form data", function() {
            handler.expect({data: "a=1&b=2"});
            $http({url: "www.a.com", method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, data: {a: 1, b: 2}});
        });

        it("should pass through for strings", function() {
            handler.expect({data: "a"});
            $http({url: "www.a.com", method: "POST", data: "a"});
        });

        it("should pass through File objects", function() {
            // TODO TBD can't think of any non shitty way of doing this...
        });

        if (window.Blob) {
            it("should pass through Blob objects", function() {
                var blob;

                // Phantomjs: https://code.google.com/p/phantomjs/issues/detail?id=1013
                if (typeof(Blob) === typeof(Function)) {
                    blob = new Blob([]);
                }
                else {
                    var builder = new WebKitBlobBuilder();
                    builder.append("a");
                    blob = builder.getBlob();
                }

                handler.expect({data: blob});
                $http({url: "www.a.com", method: "POST", data: blob});
            });
        }

        describe("override", function() {
            var serializer;

            beforeEach(function() {
                serializer = jasmine.createSpy("serializer").and.callFake(function(data) {
                    return data;
                });

                handler = $httpProvider.on("POST", "www.a.com").expect();
                $http({url: "www.a.com", method: "POST", data: "a", serialize: serializer});
            });

            it("should allow to override", function() {
                expect(serializer).toHaveBeenCalled();
            });

            it("should pass in data and content type", function() {
                expect(serializer).toHaveBeenCalledWith('a', 'application/json; charset=UTF-8');
            });
        });
    });

    // Covered in more detail in http-deferred spec
    describe("promise", function() {
        var promise;
        var callback;

        beforeEach(function() {
            handler = $httpProvider.on("GET", "www.a.com").expect();
            promise = $http({url: "www.a.com"});
            callback = jasmine.createSpy("callback");
        });

        it("should return httpDeferred promise", function() {
            expect(promise).toBeDefined();
            expect(promise.then).toBeDefined();
            expect(promise.success).toBeDefined();
            expect(promise.error).toBeDefined();
        });

        it("should resolve on success (then function)", function() {
            handler.respond({status: 200});
            promise.then(callback);

            $httpProvider.flush();

            expect(callback).toHaveBeenCalled();
        });

        it("should resolve on success (success function)", function() {
            handler.respond({status: 200});
            promise.success(callback);

            $httpProvider.flush();

            expect(callback).toHaveBeenCalled();
        });

        it("should reject on error (then function)", function() {
            handler.respond({status: 400});
            promise.then(null, callback);

            $httpProvider.flush();

            expect(callback).toHaveBeenCalled();
        });

        it("should reject on error (error function)", function() {
            handler.respond({status: 400});
            promise.error(callback);

            $httpProvider.flush();

            expect(callback).toHaveBeenCalled();
        });
    });

    // fromJson covered in detail in common.spec
    describe("parse", function() {
        beforeEach(function() {
            handler = $httpProvider.on("GET", "www.a.com").expect();
        });

        it("should parse valid json", function() {
            handler.respond({data: '{"a":1,"b":2}'});

            $http({url: "www.a.com", method: "GET"}).success(function(data) {
                expect(data).toEqual({a: 1, b: 2});
            });

            $httpProvider.flush();
        });

        it("should pass through strings", function() {
            handler.respond({data: "a"});

            $http({url: "www.a.com", method: "GET"}).success(function(data) {
                expect(data).toEqual("a");
            });

            $httpProvider.flush();
        });

        it("should pass through numbers", function() {
            handler.respond({data: 1});

            $http({url: "www.a.com", method: "GET"}).success(function(data) {
                expect(data).toEqual(1);
            });

            $httpProvider.flush();
        });

        it("should return invalid json as string", function() {
            handler.respond({data: '{"a":1'});

            $http({url: "www.a.com", method: "GET"}).success(function(data) {
                expect(data).toEqual('{"a":1');
            });

            $httpProvider.flush();
        });

        describe("override", function() {
            var parser;

            beforeEach(function() {
                parser = jasmine.createSpy("parser").and.callFake(function(data) {
                    return data;
                });

                handler = $httpProvider.on("GET", "www.a.com").expect().respond({data: "a"});
                $http({url: "www.a.com", method: "GET", data: "a", parse: parser});

                $httpProvider.flush();
            });

            it("should allow to override", function() {
                expect(parser).toHaveBeenCalled();
            });

            it("should pass in data", function() {
                expect(parser).toHaveBeenCalledWith("a");
            });
        });
    });

    describe("short methods", function() {
        var options = {headers: {A: 1}};

        describe("get", function() {
            beforeEach(function() {
                handler = $httpProvider.on("GET", "www.a.com");
            });

            it("should have method", function() {
                handler.expect();
                $http.get("www.a.com");
            });

            it("should allow options", function() {
                handler.expect(options);
                $http.get("www.a.com", options);
            });
        });

        describe("post", function() {
            beforeEach(function() {
                handler = $httpProvider.on("POST", "www.a.com");
            });

            it("should have method", function() {
                handler.expect();
                $http.post("www.a.com");
            });

            it("should allow data and options params", function() {
                handler.expect(extend(options, {data: "a"}));
                $http.post("www.a.com", "a", options);
            });
        });

        describe("jsonp", function() {
            beforeEach(function() {
                handler = $httpProvider.on("JSONP", "www.a.com");
            });

            it("should have method", function() {
                handler.expect();
                $http.jsonp("www.a.com");
            });

            it("should allow options", function() {
                handler.expect(options);
                $http.jsonp("www.a.com", options);
            });
        });

        describe("head", function() {
            beforeEach(function() {
                handler = $httpProvider.on("HEAD", "www.a.com");
            });

            it("should have method", function() {
                handler.expect();
                $http.head("www.a.com");
            });

            it("should allow options", function() {
                handler.expect(options);
                $http.head("www.a.com", options);
            });
        });

        describe("put", function() {
            beforeEach(function() {
                handler = $httpProvider.on("PUT", "www.a.com");
            });

            it("should have method", function() {
                handler.expect();
                $http.put("www.a.com");
            });

            it("should allow data and options params", function() {
                handler.expect(extend(options, {data: "a"}));
                $http.put("www.a.com", "a", options);
            });
        });

        describe("patch", function() {
            beforeEach(function() {
                handler = $httpProvider.on("PATCH", "www.a.com");
            });

            it("should have method", function() {
                handler.expect();
                $http.patch("www.a.com");
            });

            it("should allow data and options params", function() {
                handler.expect(extend(options, {data: "a"}));
                $http.patch("www.a.com", "a", options);
            });
        });

        describe("delete", function() {
            beforeEach(function() {
                handler = $httpProvider.on("DELETE", "www.a.com");
            });

            it("should have method", function() {
                handler.expect();
                $http["delete"]("www.a.com");
            });

            it("should allow options", function() {
                handler.expect(options);
                $http["delete"]("www.a.com", options);
            });
        });
    });
});