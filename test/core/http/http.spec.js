"use strict";

describe("$http", function() {
    var $http;

    beforeEach(function() {
        $invoke(["$http"], function(http) {
            $http = http;
        });
    });

    it("should be invokable", function() {
        expect($http).toBeDefined();
        expect(isFunction($http)).toEqual(true);
    });

    describe("options", function() {

    });

    describe("headers", function() {

    });

    describe("url", function() {

    });

    describe("data", function() {

    });

    describe("serialize", function() {

    });

    describe("promise", function() {

    });

    describe("parse", function() {

    });

    describe("get", function() {

    });

    describe("post", function() {

    });

    describe("jsonp", function() {

    });

    describe("head", function() {

    });

    describe("put", function() {

    });

    describe("patch", function() {

    });
});