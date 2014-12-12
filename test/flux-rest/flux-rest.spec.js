"use strict";

describe("$rest", function() {
    var $httpProvider;
    var $rest;
    var rest;

    beforeEach(function() {
        $include(recurve.flux.$module);
        $include(recurve.flux.rest.$module);

        $invoke(["$httpProvider", "$rest"], function(httpProvider, restFactory) {
            $httpProvider = httpProvider;
            $rest = restFactory;
            rest = $rest();
        });
    });

    afterEach(function() {
        $httpProvider.flush();
        $httpProvider.verifyExpectations();
        $httpProvider.verifyPending();
    });

    it("should be invokable", function() {
        expect($rest).toBeDefined();
        expect(isFunction($rest)).toEqual(true);
    });

    it("should create rest object", function() {
        expect(rest).toBeDefined();
        expect(isFunction(rest)).toEqual(false);
    });

    describe("resource", function() {
        it("should create resource with name on rest object", function() {
            rest.resource("a", "url");
            expect(rest.a).toBeDefined();
        });

        it("it should create default end points: get, save, query and delete", function() {
            rest.resource("a", "url");
            expect(isFunction(rest.a.get)).toEqual(true);
            expect(isFunction(rest.a.save)).toEqual(true);
            expect(isFunction(rest.a.query)).toEqual(true);
            expect(isFunction(rest.a["delete"])).toEqual(true);
        });

        describe("end points", function() {
            var handler;

            beforeEach(function() {
                rest.resource("a", "www.a.com");
            });

            describe("get", function() {
                it("should send as http GET method", function() {
                    handler = $httpProvider.on("GET", "www.a.com");
                    handler.expect();

                    rest.a.get();
                });

                it("should return httpPromise object on send", function() {
                    var httpPromise = rest.a.get();

                    expect(isFunction(httpPromise.then)).toEqual(true);
                    expect(isFunction(httpPromise.success)).toEqual(true);
                    expect(isFunction(httpPromise.error)).toEqual(true);

                    $httpProvider.clearExpectations();
                    $httpProvider.clearPending();
                });
            });

            describe("save", function() {
                it("should send as http POST method", function() {
                    handler = $httpProvider.on("POST", "www.a.com");
                    handler.expect();

                    rest.a.save();
                });

                it("should merge second function parameter as data key into sent http options", function() {
                    handler = $httpProvider.on("POST", "www.a.com");
                    handler.expect({"data": "a"});

                    rest.a.save(null, "a");
                });

                it("should return httpPromise object on send", function() {
                    var httpPromise = rest.a.save();

                    expect(isFunction(httpPromise.then)).toEqual(true);
                    expect(isFunction(httpPromise.success)).toEqual(true);
                    expect(isFunction(httpPromise.error)).toEqual(true);

                    $httpProvider.clearExpectations();
                    $httpProvider.clearPending();
                });
            });

            describe("query", function() {
                it("should send as http GET method", function() {
                    handler = $httpProvider.on("GET", "www.a.com");
                    handler.expect();

                    rest.a.query();
                });

                it("should return httpPromise object on send", function() {
                    var httpPromise = rest.a.query();

                    expect(isFunction(httpPromise.then)).toEqual(true);
                    expect(isFunction(httpPromise.success)).toEqual(true);
                    expect(isFunction(httpPromise.error)).toEqual(true);

                    $httpProvider.clearExpectations();
                    $httpProvider.clearPending();
                });
            });

            describe("delete", function() {
                it("should send as http DELETE method", function() {
                    handler = $httpProvider.on("DELETE", "www.a.com");
                    handler.expect();

                    rest.a["delete"]();
                });

                it("should return httpPromise object on send", function() {
                    var httpPromise = rest.a["delete"]();

                    expect(isFunction(httpPromise.then)).toEqual(true);
                    expect(isFunction(httpPromise.success)).toEqual(true);
                    expect(isFunction(httpPromise.error)).toEqual(true);

                    $httpProvider.clearExpectations();
                    $httpProvider.clearPending();
                });
            });

            describe("additional", function() {
                beforeEach(function() {
                    rest.resource("a", "www.a.com", null, {custom: {method: "X"}});
                });

                it("should send as defined http method", function() {
                    handler = $httpProvider.on("X", "www.a.com");
                    handler.expect();

                    rest.a.custom();
                });

                it("should return httpPromise object on send", function() {
                    var httpPromise = rest.a.custom();

                    expect(isFunction(httpPromise.then)).toEqual(true);
                    expect(isFunction(httpPromise.success)).toEqual(true);
                    expect(isFunction(httpPromise.error)).toEqual(true);

                    $httpProvider.clearExpectations();
                    $httpProvider.clearPending();
                });
            });
        });

        describe("actions", function() {
            beforeEach(function() {
                rest.resource("a", "www.a.com");
            });

            function testActionExistence(method) {
                expect(rest.a[method].successAction).toBeDefined();
                expect(rest.a[method].errorAction).toBeDefined();
                expect(rest.a[method].cancelAction).toBeDefined();
            }

            it("should create success, error and cancel actions for get end point", function() {
                testActionExistence("get");
            });

            it("should create success, error and cancel actions for save end point", function() {
                testActionExistence("save");
            });

            it("should create success, error and cancel actions for query end point", function() {
                testActionExistence("query");
            });

            it("should create success, error and cancel actions for delete end point", function() {
                testActionExistence("delete");
            });

            describe("trigger", function() {
                var handler;
                var successCallback;
                var errorCallback;
                var cancelCallback;

                beforeEach(function() {
                    handler = $httpProvider.on("POST", "www.a.com");
                    handler.respond({status: 200});

                    successCallback = jasmine.createSpy("successCallback");
                    errorCallback = jasmine.createSpy("errorCallback");
                    cancelCallback = jasmine.createSpy("cancelCallback");

                    rest.a.save.successAction.on(successCallback);
                    rest.a.save.errorAction.on(errorCallback);
                    rest.a.save.cancelAction.on(cancelCallback);
                });

                it("should only trigger success action on success", function() {
                    rest.a.save();
                    $httpProvider.flush();

                    expect(successCallback).toHaveBeenCalled();
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(cancelCallback).not.toHaveBeenCalled();
                });

                it("should only trigger error action on error", function() {
                    handler.respond({status: 404});
                    rest.a.save();
                    $httpProvider.flush();

                    expect(successCallback).not.toHaveBeenCalled();
                    expect(errorCallback).toHaveBeenCalled();
                    expect(cancelCallback).not.toHaveBeenCalled();
                });

                it("should only trigger cancel action on cancel", function() {
                    var httpPromise = rest.a.save();
                    httpPromise.cancel();
                    $httpProvider.flush();

                    expect(successCallback).not.toHaveBeenCalled();
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(cancelCallback).toHaveBeenCalled();
                });
            });
        });

        describe("method parameters", function() {
            it("should throw error if no name", function() {
                expect(function() {
                    rest.resource();
                }).toThrowError("expected name to be set");
            });

            it("should throw error for reserved 'resource' name", function() {
                expect(function() {
                    rest.resource("resource");
                }).toThrowError("resource cannot be named 'resource'");
            });

            describe("url", function() {
                var handler;

                it("should replace named params in url", function() {
                    handler = $httpProvider.on("GET", "www.test.com/1/2/test/3");
                    handler.expect();

                    rest.resource("a", "www.test.com/:a/:b/test/:c");
                    rest.a.get({a: 1, b: 2, c: 3});
                });

                it("should encode replaced named params in url", function() {
                    handler = $httpProvider.on("GET", "www.test.com/%23/2/test/3");
                    handler.expect();

                    rest.resource("a", "www.test.com/:a/:b/test/:c");
                    rest.a.get({a: "#", b: 2, c: 3});
                });

                it("should append any other params as query params", function() {
                    handler = $httpProvider.on("GET", "www.test.com/1/2/test/3");
                    handler.expect({params: {d: 4, e: 5}});

                    rest.resource("a", "www.test.com/:a/:b/test/:c");
                    rest.a.get({a: 1, b: 2, c: 3, d: 4, e: 5});
                });

                it("should strip additional leading slashes from url", function() {
                    handler = $httpProvider.on("GET", "www.test.com");
                    handler.expect();

                    rest.resource("a", "//www.test.com");
                    rest.a.get();
                });

                it("should strip additional trailing slashes from base url", function() {
                    handler = $httpProvider.on("GET", "www.test.com");
                    handler.expect();

                    rest.resource("a", "www.test.com//");
                    rest.a.get();
                });

                it("should append resource url to rest config url", function() {
                    handler = $httpProvider.on("GET", "www.test.com/b/c");
                    handler.expect();

                    var rest = $rest({url: "www.test.com"});
                    rest.resource("a", "/b/c");
                    rest.a.get();
                });

                it("should add slash between resource url and rest config url if needed", function() {
                    handler = $httpProvider.on("GET", "www.test.com/b/c");
                    handler.expect();

                    var rest = $rest({url: "www.test.com"});
                    rest.resource("a", "b/c");
                    rest.a.get();
                });

                it("should strip additional slashes between config and rest resource url", function() {
                    handler = $httpProvider.on("GET", "www.test.com/b/c");
                    handler.expect();

                    var rest = $rest({url: "www.test.com/"});
                    rest.resource("a", "/b/c");
                    rest.a.get();
                });

                it("should throw error if no url", function() {
                    expect(function() {
                        rest.resource("a");
                    }).toThrowError("expected url to be set");
                });
            });

            describe("params", function() {
                var handler;

                beforeEach(function() {
                    handler = $httpProvider.on("GET", "www.test.com/b");
                });

                it("should merge resource default params with config defaults", function() {
                    handler.expect({params: {a: 1, b: 2}});

                    var rest = $rest({url: "www.test.com", defaults: {params: {a: 1}}});
                    rest.resource("a", "/b", {b: 2});
                    rest.a.get();
                });

                it("should override config defaults with resource default params", function() {
                    handler.expect({params: {a: 2}});

                    var rest = $rest({url: "www.test.com", defaults: {params: {a: 1}}});
                    rest.resource("a", "/b", {a: 2});
                    rest.a.get();
                });

                it("should merge end point params with resource/rest defaults", function() {
                    handler.expect({params: {a: 1, b: 2, c: 3}});

                    var rest = $rest({url: "www.test.com", defaults: {params: {a: 1}}});
                    rest.resource("a", "/b", {b: 2});
                    rest.a.get({c: 3});
                });

                it("should override resource/rest defaults with end point params", function() {
                    handler.expect({params: {a: 3}});

                    var rest = $rest({url: "www.test.com", defaults: {params: {a: 1}}});
                    rest.resource("a", "/b", {a: 2});
                    rest.a.get({a: 3});
                });
            });

            it("should include rest config defaults", function() {
                var handler = $httpProvider.on("GET", "www.test.com/b");
                handler.expect({custom: 1});

                var rest = $rest({url: "www.test.com", defaults: {custom: 1}});
                rest.resource("a", "/b");
                rest.a.get();
            });

            describe("endPoints", function() {
                var handler;

                it("should override default end points", function() {
                    rest.resource("a", "www.test.com", null, {save: {method: "X"}});
                    handler = $httpProvider.on("X", "www.test.com");

                    handler.expect();
                    rest.a.save();
                });

                it("should merge second function parameter as data into http options", function() {
                    rest.resource("a", "www.test.com", null, {save: {method: "POST"}});
                    handler = $httpProvider.on("POST", "www.test.com");

                    handler.expect({data: {a: 1}});
                    rest.a.save(null, {a: 1});
                });
            });
        });
    });
});