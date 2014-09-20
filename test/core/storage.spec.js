"use strict";

describe("storage", function() {

    describe("$localStorage", spec("$localStorage"));
    describe("$sessionStorage", spec("$sessionStorage"));

    function spec(name) {
        return function() {
            var $storage;

            beforeEach(function(){
                $invoke([name], function(storage) {
                    $storage = storage;
                });
            });

            it("should be invokable", function() {
                expect($storage).toBeDefined();
                expect(isFunction($storage)).toEqual(false);
            });

            describe("set", function() {

            });

            describe("get", function() {

            });

            describe("setWithExpiration", function() {

            });

            describe("getWithExpiration", function() {

            });

            describe("remove", function() {

            });

            describe("exists", function() {

            });

            it("should clear all items", function() {

            });

            it("should iterate all items", function() {

            });
        };
    }
});