/* global addHttpProviderService */

"use strict";

describe("$httpProvider", function() {
    var $httpProvider;
    var $httpJsonp;
    var $httpXhr;
    var httpDeffered;
    var httpJsonpInstanceSend;
    var httpXhrInstanceSend;

    beforeEach(function() {
        httpJsonpInstanceSend = jasmine.createSpy("send");
        var httpJsonp = jasmine.createSpy("$httpJsonp").and.returnValue({
            send: httpJsonpInstanceSend
        });

        httpXhrInstanceSend = jasmine.createSpy("send");
        var httpXhr = jasmine.createSpy("$httpXhr").and.returnValue({
            send: httpXhrInstanceSend
        });

        $include(null, function($mockable) {
            addHttpProviderService($mockable);

            $mockable.value("$httpJsonp", httpJsonp);
            $mockable.value("$httpXhr", httpXhr);

        });

        $invoke(["$httpProvider", "$httpJsonp", "$httpXhr", "$httpDeferred"], function(httpProvider, httpJsonp, httpXhr, $httpDeferred) {
            $httpProvider = httpProvider;
            $httpJsonp = httpJsonp;
            $httpXhr = httpXhr;
            httpDeffered = $httpDeferred();
        });
    });

    it("should be invokable", function() {
        expect($httpProvider).toBeDefined();
        expect(isFunction($httpProvider)).toEqual(false);
    });

    describe("xhr", function() {
        it("should create httpXhr for everything but jsonp method", function() {
            $httpProvider.send({method: "get"}, httpDeffered);
            expect($httpXhr).toHaveBeenCalled();
        });

        it("should pass through all options", function() {
            $httpProvider.send({method: "get", Accept: "application/json"}, httpDeffered);
            expect($httpXhr).toHaveBeenCalledWith({method: "get", Accept: "application/json"});
        });

        it("should add the request to http deferred", function() {
            $httpProvider.send({method: "get"}, httpDeffered);
            expect(httpDeffered.request).toBeDefined();
        });

        it("should send the request", function() {
            $httpProvider.send({method: "get"}, httpDeffered);
            expect(httpXhrInstanceSend).toHaveBeenCalled();
        });
    });

    describe("jsonp", function() {
        it("should create httpJson object for jsonp method", function() {
            $httpProvider.send({method: "jsonp"}, httpDeffered);
            expect($httpJsonp).toHaveBeenCalled();
        });

        it("should pass through all options", function() {
            $httpProvider.send({method: "jsonp", Accept: "application/json"}, httpDeffered);
            expect($httpJsonp).toHaveBeenCalledWith({method: "jsonp", Accept: "application/json"});
        });

        it("should add the request to http deferred", function() {
            $httpProvider.send({method: "jsonp"}, httpDeffered);
            expect(httpDeffered.request).toBeDefined();
        });

        it("should send the request", function() {
            $httpProvider.send({method: "jsonp"}, httpDeffered);
            expect(httpJsonpInstanceSend).toHaveBeenCalled();
        });
    });
});