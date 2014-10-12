"use strict";

describe("recurveMock-$cookies", function() {
    var $cookies;

    beforeEach(function() {
        $invoke(["$cookies"], function(cookies) {
            $cookies = cookies;
        });
    });

    it("should be invokable", function() {
        expect($cookies).toBeDefined();
        expect(isFunction($cookies)).toEqual(false);
    });

    it("should return for existing key", function(){
        $cookies.set("a", "b");
        expect($cookies.get("a")).toEqual("b");
    });

    describe("set", function() {
        it("should set number", function() {
            $cookies.set("a", 1);
            expect($cookies.get("a")).toEqual(1);
        });

        it("should set quoted string", function() {
            $cookies.set("a", 'b\"');
            expect($cookies.get("a")).toEqual('b"');
        });

        it("should set object", function() {
            $cookies.set("a", {b: "c"});
            expect($cookies.get("a")).toEqual({b: "c"});
        });

        it("should set special characters", function() {
            $cookies.set("a", "$");
            expect($cookies.get("a")).toEqual("$");
        });

        it("should set empty value", function() {
            $cookies.set("a", "");
            expect($cookies.get("a")).toEqual("");
        });

        it("should set null", function() {
            $cookies.set("a", null);
            expect($cookies.get("a")).toEqual(null);
        });

        it("should set undefined as string", function() {
            $cookies.set("a", undefined);
            expect($cookies.get("a")).toEqual("undefined");
        });

        it("should set leading and trailing spaces", function() {
            $cookies.set(" a ", " b ");
            expect($cookies.get(" a ")).toEqual(" b ");
        });

        it("should set with options", function() {
            expect($cookies.set("a", "b", {domain:".test.com"}));
        });
    });

    describe("get", function() {
        it("should return null for unknown key", function() {
            expect($cookies.get("a")).toEqual(null);
        });

        it("should return null for null key", function() {
            expect($cookies.get(null)).toEqual(null);
        });

        it("should return null for undefined key", function() {
            expect($cookies.get()).toEqual(null);
        });

        it("should return empty value", function() {
            $cookies.set("a", "");
            expect($cookies.get("a")).toEqual("");
        });

        it("should not return expired cookie", function() {
            $cookies.set("a", "b", {expires: -1});
            expect($cookies.get("a")).toEqual(null);
        });

        it("should return cookie that has not yet expired", function() {
            $cookies.set("a", "b", {expires: 1});
            expect($cookies.get("a")).toEqual("b");
        });

        it("should not return cookie for different path", function() {
            $cookies.set("a", "b", {path:"/test"});
            expect($cookies.get("a")).toEqual(null);
        });

        it("should return cookie for '/' path", function() {
            $cookies.set("a", "b", {path:"/"});
            expect($cookies.get("a")).toEqual("b");
        });

        it("should return cookie for empty path", function() {
            $cookies.set("a", "b", {path:""});
            expect($cookies.get("a")).toEqual("b");
        });

        it("should not return cookie for different domain", function() {
            $include(null, function($mockable) {
                $mockable.value("$document", {
                    location: {
                        host: "domA"
                    }
                });
            });

            $invoke(["$cookies"], function(cookies) {
                $cookies = cookies;
            });

            $cookies.set("a", "b", {domain:"domB"});
            expect($cookies.get("a")).toEqual(null);
        });

        it("should return cookie for same domain", function() {
            $include(null, function($mockable) {
                $mockable.value("$document", {
                    location: {
                        host: "domA"
                    }
                });
            });

            $invoke(["$cookies"], function(cookies) {
                $cookies = cookies;
            });

            $cookies.set("a", "b", {domain:"domA"});
            expect($cookies.get("a")).toEqual("b");
        });
    });

    describe("remove", function() {
        it("should remove", function() {
            $cookies.set("a", "b");
            $cookies.remove("a");

            expect($cookies.get("a")).toEqual(null);
        });

        it("should remove and return true if exists", function(){
            $cookies.set("a", "b");
            expect($cookies.remove("a")).toEqual(true);
        });

        it("should return false if doesn't exist", function() {
            expect($cookies.remove("a")).toEqual(false);
        });

        it("should not throw error for null key", function(){
            $cookies.remove(null);
        });

        it("should not throw error for undefined key", function(){
            $cookies.remove(undefined);
        });

        it("should remove with same path specified", function() {
            $cookies.set("a", "b", {path: "/"});
            expect($cookies.remove("a", {path: "/"})).toEqual(true);
        });

        it("should not remove if different path", function(){
            $cookies.set("a", "b", {path: "/"});
            expect($cookies.remove("a", {path: "/a"})).toEqual(false);
        });

        it("should not remove if different domain", function() {
            $cookies.set("a", "b");
            expect($cookies.remove("a", {domain: ".test.com"})).toEqual(false);
        });
    });

    describe("exists", function() {
        it("should return true if exists", function() {
            $cookies.set("a", "b");
            expect($cookies.exists("a")).toEqual(true);
        });

        it("should return false if only exists for different path", function() {
            $cookies.set("a", "b", {path: "/a"});
            expect($cookies.exists("a")).toEqual(false);
        });

        it("should return false if only exists for different domain", function() {
            $cookies.set("a", "b", {domain: ".test.com"});
            expect($cookies.exists("a")).toEqual(false);
        });

        it("should return false if doesn't exist", function() {
            expect($cookies.exists("a")).toEqual(false);
        });

        it("should return false for null key", function() {
            expect($cookies.exists(null)).toEqual(false);
        });

        it("should return false for undefined key", function() {
            expect($cookies.exists(undefined)).toEqual(false);
        });
    });

    describe("forEach", function() {
        it("should iterate all cookies", function() {
            $cookies.set("a", 1);
            $cookies.set("b", 2);

            var expected = [["a", 1], ["b", 2]];
            var index = 0;

            $cookies.forEach(function(value, name) {
                expect(expected[index]).toEqual([name, value]);
                index++;
            });
        });

        it("should call iterator with context", function() {
            $cookies.set("a", 1);

            var context = null;
            $cookies.forEach(function() {
                context = this;
            }, this);

            expect(context).toBe(this);
        });
    });

    it("should clear all cookies", function(){
        $cookies.set("a", 1);
        $cookies.set("b", 2);
        $cookies.set("c", 3);

        $cookies.clear();

        var callback = jasmine.createSpy("callback");
        $cookies.forEach(callback);

        expect(callback).not.toHaveBeenCalled();
    });
});