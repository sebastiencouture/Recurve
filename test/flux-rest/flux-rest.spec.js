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

                });

                it("should return httpPromise object on send", function() {

                });
            });

            describe("query", function() {
                it("should send as http GET method", function() {

                });

                it("should return httpPromise object on send", function() {

                });
            });

            describe("query", function() {
                it("should send as http DELETE method", function() {

                });

                it("should return httpPromise object on send", function() {

                });
            });

            describe("other", function() {
                it("should send as defined http method", function() {

                });

                it("should return httpPromise object on send", function() {

                });
            });
        });

        describe("actions", function() {
            it("should create success, error and cancel actions for get end point", function() {

            });

            it("should create success, error and cancel actions for save end point", function() {

            });

            it("should create success, error and cancel actions for query end point", function() {

            });

            it("should create success, error and cancel actions for delete end point", function() {

            });

            it("should trigger success action on success", function() {

            });

            it("should trigger error action on error", function() {

            });

            it("should trigger cancel action on cancel", function() {

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
                it("should replace named params in url", function() {

                });

                it("should append any other params as query params", function() {

                });

                it("should append url to base rest url", function() {

                });

                it("should strip additional leading slashes from url", function() {

                });

                it("should strip additional trailing slashes from base url", function() {

                });

                it("should throw error if no url", function() {
                    expect(function() {
                        rest.resource("a");
                    }).toThrowError("expected url to be set");
                });
            });

            describe("params", function() {
                it("should merge resource default params with rest defaults for http options", function() {

                });

                it("should merge end point params with resource/rest defaults for http options", function() {

                });
            });

            describe("endPoints", function() {
                it("should create additional end points", function() {

                });

                it("should override default end points", function() {

                });

                it("should return httpPromise object on send", function() {

                });

                it("should return httpPromise object on send", function() {

                });

                it("should merge second function parameter as data key into sent http options", function() {

                });

                it("should not merge data into http options if only one function parameter", function(){

                });
            });
        });
    });
});