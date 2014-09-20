"use strict";

describe("storage", function() {

    describe("$localStorage", spec("$localStorage", window.localStorage));
    describe("$localStorage with cache", spec("$localStorage", window.localStorage, true));
    describe("$localStorage not supported", specNotSupported("$localStorage"));

    describe("$sessionStorage", spec("$sessionStorage", window.sessionStorage));
    describe("$sessionStorage with cache", spec("$sessionStorage", window.sessionStorage, true));
    describe("$sessionStorage not supported", specNotSupported("$sessionStorage"));

    function spec(name, provider, useCache) {
        return function() {
            var $storage;

            beforeEach(function(){
                if (useCache) {
                    $include(null, function($mockable) {
                        $mockable.config(name, {
                            useCache: true
                        });
                    });
                }

                $invoke([name], function(storage) {
                    $storage = storage;
                });

                $storage.clear();
            });

            it("should be invokable", function() {
                expect($storage).toBeDefined();
                expect(isFunction($storage)).toEqual(false);
            });

            describe("get", function() {
                it("should return for existing key", function(){
                    provider.setItem("a", "b")
                    expect($storage.get("a")).toEqual("b");
                });

                it("should return null for unknown key", function() {
                    expect($storage.get("a")).toEqual(null);
                });

                it("should return null for null key", function() {
                    expect($storage.get(null)).toEqual(null);
                });

                it("should return null for undefined key", function() {
                    expect($storage.get()).toEqual(null);
                });

                it("should return empty value", function() {
                    provider.setItem("a", "");
                    expect($storage.get("a")).toEqual("");
                });

                it("should parse json", function() {
                    provider.setItem("a", toJson({b:"c"}));
                    expect($storage.get("a")).toEqual({b: "c"});
                });

                it("should return raw for malformed json", function(){
                    provider.setItem("a", "{b:");
                    expect($storage.get("a")).toEqual("{b:");
                });

                it("should preserve leading and trailing spaces", function() {
                    provider.setItem("a", " b ");
                    expect($storage.get("a")).toEqual(" b ");
                });
            });

            describe("set", function() {
                it("should save", function() {
                    $storage.set("a", "b");
                    expect($storage.get("a")).toEqual("b");
                });

                it("should save number", function() {
                    $storage.set("a", 1);
                    expect($storage.get("a")).toEqual(1);
                });

                it("should save quoted string", function() {
                    $storage.set("a", 'b\"');
                    expect($storage.get("a")).toEqual('b"');
                });

                it("should save object", function() {
                    $storage.set("a", {b: "c"});
                    expect($storage.get("a")).toEqual({b: "c"});
                });

                it("should save special characters", function() {
                    $storage.set("a", "$");
                    expect($storage.get("a")).toEqual("$");
                });

                it("should save empty value", function() {
                    $storage.set("a", "");
                    expect($storage.get("a")).toEqual("");
                });

                it("should save null", function() {
                    $storage.set("a", null);
                    expect($storage.get("a")).toEqual(null);
                });

                it("should save undefined as string", function() {
                    $storage.set("a", undefined);
                    expect($storage.get("a")).toEqual("undefined");
                });

                it("should save leading and trailing spaces", function() {
                    $storage.set(" a ", " b ");
                    expect($storage.get(" a ")).toEqual(" b ");
                });

                it("should save with expires as Date instance", function() {
                    var oneDayFromNow = new Date();
                    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

                    $storage.set("a", "b", oneDayFromNow);
                    expect($storage.get("a")).toEqual("b");
                });

                it("should save with expires as number", function() {
                    $storage.set("a", "b", 1);
                    expect($storage.get("a")).toEqual("b");
                });

                it("should return null if expired", function() {
                    $storage.set("a", "b", -1);
                    expect($storage.get("a")).toEqual(null);
                });

                it("should save with no expiration for null expiry date", function() {
                    $storage.set("a", "b", null);
                    expect($storage.get("a")).toEqual("b");
                });

                it("should save with no expiration for undefined expiry date", function() {
                    $storage.set("a", "b", undefined);
                    expect($storage.get("a")).toEqual("b");
                });
            });

            describe("remove", function() {
                it("should remove and return true", function() {
                    $storage.set("a", "b");
                    $storage.remove("a");

                    expect(provider.getItem("a")).toEqual(null);
                });

                it("should return false if doesn't exist", function() {
                    expect($storage.remove("a")).toEqual(false);
                });
            });

            describe("exists", function() {
                it("should return true if exists", function() {
                    $storage.set("a", "b");
                    expect($storage.exists("a")).toEqual(true);
                });

                it("should return false if doesn't exist", function() {
                    expect($storage.exists("a")).toEqual(false);
                });

                it("should return false for null key", function() {
                    expect($storage.exists(null)).toEqual(false);
                });

                it("should return false for undefined key", function() {
                    expect($storage.exists(undefined)).toEqual(false);
                });
            });

            it("should clear all items", function() {
                $storage.set("a", 1);
                $storage.set("b", 2);
                $storage.set("c", 3);

                $storage.clear();

                expect(provider.length).toEqual(0);
            });

            it("should iterate all items", function() {
                $storage.set("a", 1);
                $storage.set("b", 2);

                var expected = [["b", 2], ["a", 1]];
                var index = 0;

                $storage.forEach(function(value, name) {
                    expect(expected[index]).toEqual([name, value]);
                    index++;
                });
            });
        };
    }

    function specNotSupported(name) {
        return function() {
            var $storage;
            var $log;

            beforeEach(function(){
                $include(null, function($mockable) {
                    $mockable.value("$window", {
                        localStorage: {
                            setItem: null,
                            removeItem: null
                        },
                        sessionStorage: {
                            setItem: null,
                            removeItem: null
                        }
                    });
                });

                $invoke([name, "$log"], function(storage, log) {
                    $storage = storage;
                    $log = log;
                });
            });

            afterEach(function() {
                $log.clear();
            });

            it("should return not supported", function() {
                expect($storage.isSupported()).toEqual(false);
            });

            it("should log warning", function() {
                expect($log.logs.warn.shift()).toEqual(["storage is not supported"]);
            });

            it("should not save", function() {
                $storage.set("a", "b");
                expect($storage.get("a")).toEqual(null);
            });

            it("should return false to remove", function() {
                $storage.set("a", "b");
                expect($storage.remove("a")).toEqual(false);
            });

            it("should return false for exists", function() {
                $storage.set("a", "b");
                expect($storage.exists("a")).toEqual(false);
            });

            it("should do nothing for clear", function() {
                $storage.set("a", "b");
                $storage.clear();

                expect($storage.exists("a")).toEqual(false);
            });

            it("should iterate nothing", function() {
                $storage.set("a", 1);
                $storage.set("b", 2);

                var count = 0;

                $storage.forEach(function() {
                    count++;
                });

                expect(count).toEqual(0);
            });
        };
    }
});