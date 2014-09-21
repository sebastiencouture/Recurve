"use strict";

describe("$cache", function() {
    var $cache;
    var cache;

    beforeEach(function(){
        $invoke(["$cache"], function(factory){
            $cache = factory;
            cache = factory("a");
        });
    });

    it("should be invokable", function(){
        expect($cache).toBeDefined();
        expect(isFunction($cache)).toEqual(true);
    });

    describe("factory", function(){
        it("should create", function(){
            var cache = $cache("a");
            expect(cache).toBeDefined();
            expect(isFunction(cache)).toEqual(false);
        });

        it("should return same instance", function(){
            expect($cache("a")).toBe($cache("a"));
        });

        it("should return different instance for each name", function(){
            expect($cache("a")).not.toBe($cache("b"));
        });

        it("should throw error for null name", function(){
            expect(function(){
                $cache(null);
            }).toThrow(new Error("cache name must be specified"));
       });

        it("should throw error for undefined name", function(){
            expect(function(){
                $cache(undefined);
            }).toThrow(new Error("cache name must be specified"));
        });
    });

    describe("get", function() {
        it("should return null for null key", function(){
            expect(cache.get(null)).toEqual(null);
        });

        it("should return null for null key", function(){
            expect(cache.get(undefined)).toEqual(null);
        });

        it("should return undefined for key not set", function(){
            expect(cache.get("a")).toEqual(null);
        });
    });

    describe("set", function(){
        it("should do nothing for null key", function(){
            cache.set(null);
            expect(cache.get(null)).toEqual(null);
        });

        it("should do nothing for undefined key", function(){
            cache.set(null);
            expect(cache.get(null)).toEqual(null);
        });
    });

    it("should return value set", function(){
        cache.set("a", 1);
        expect(cache.get("a")).toEqual(1);
    });

    it("should override value set", function(){
        cache.set("a", 1);
        cache.set("a", 2);
        expect(cache.get("a")).toEqual(2);
    });

    describe("remove", function(){
        it("should remove", function(){
            cache.set("a", 1);
            cache.remove("a");
            expect(cache.get("a")).toEqual(null);
        });

        it("should return true if exists", function() {
            cache.set("a", "b");
            expect(cache.remove("a")).toEqual(true);
        });

        it("should return false if doesn't exist", function() {
            expect(cache.remove("a")).toEqual(false);
        });

        it("should not throw error for null key", function(){
            cache.remove(null);
        });

        it("should not throw error for undefined key", function(){
            cache.remove(undefined);
        });
    });

    describe("exists", function(){
        it("should return true for key that exists", function(){
            cache.set("a", 1);
            expect(cache.exists("a")).toEqual(true);
        });

        it("should return false for null key", function(){
            expect(cache.exists(null)).toEqual(false);
        });

        it("should return false for null key", function(){
            expect(cache.exists(undefined)).toEqual(false);
        });

        it("should return false for key not set", function(){
            expect(cache.exists("a")).toEqual(false);
        });
    });

    it("should clear all key/values", function(){
        cache.set("a", 1);
        cache.set("b", 1);
        cache.clear();
        expect(cache.exists("a")).toEqual(false);
        expect(cache.exists("b")).toEqual(false);
    });

    describe("countLimit", function(){
        it("should default to no limit", function(){
            expect(cache.countLimit()).toEqual(0);
        });

        it("should return value set", function(){
            cache.setCountLimit(1);
            expect(cache.countLimit()).toEqual(1);
        });

        it("should evict most costly past limit", function(){
            cache.setCountLimit(2);

            cache.set("a", 1, 1);
            cache.set("b", 2, 10);
            cache.set("c", 3, 1);

            expect(cache.get("a")).toBeDefined();
            expect(cache.get("b")).toEqual(null);
            expect(cache.get("c")).toBeDefined();
        });

        it("should evict upon setting new limit", function(){
            cache.set("a", 1, 1);
            cache.set("b", 2, 10);
            cache.set("c", 3, 1);

            expect(cache.get("a")).toEqual(1);
            expect(cache.get("b")).toEqual(2);
            expect(cache.get("c")).toEqual(3);

            cache.setCountLimit(2);

            expect(cache.get("a")).toEqual(1);
            expect(cache.get("b")).toEqual(null);
            expect(cache.get("c")).toEqual(3);
        });

        it("should evict first in as tie breaker for most costly past limit", function(){
            cache.setCountLimit(2);

            cache.set("a", 1, 1);
            cache.set("b", 2, 10);
            cache.set("c", 3, 10);

            expect(cache.get("a")).toEqual(1);
            expect(cache.get("b")).toEqual(null);
            expect(cache.get("c")).toEqual(3);
        });
    });

    describe("totalCostLimit", function(){
        it("should default to no limit", function(){
            expect(cache.totalCostLimit()).toEqual(0);
        });

        it("should return value set", function(){
            cache.setTotalCostLimit(1);
            expect(cache.totalCostLimit()).toEqual(1);
        });

        it("should evict most costly past limit", function(){
            cache.setTotalCostLimit(5);

            cache.set("a", 1, 4);
            cache.set("b", 2, 1);
            cache.set("c", 3, 3);

            expect(cache.get("a")).toEqual(null);
            expect(cache.get("b")).toEqual(2);
            expect(cache.get("c")).toEqual(3);
        });

        it("should evict upon setting new limit", function(){
            cache.set("a", 1, 4);
            cache.set("b", 2, 1);
            cache.set("c", 3, 3);

            expect(cache.get("a")).toEqual(1);
            expect(cache.get("b")).toEqual(2);
            expect(cache.get("c")).toEqual(3);

            cache.setTotalCostLimit(5);

            expect(cache.get("a")).toEqual(null);
            expect(cache.get("b")).toEqual(2);
            expect(cache.get("c")).toEqual(3);
        });

        it("should evict first in as tie breaker for most costly past limit", function(){
            cache.setTotalCostLimit(4);

            cache.set("a", 1, 2);
            cache.set("b", 2, 2);
            cache.set("c", 3, 1);

            expect(cache.get("a")).toEqual(null);
            expect(cache.get("b")).toEqual(2);
            expect(cache.get("c")).toEqual(3);
        });
    });

    describe("forEach", function() {
        it("should iterate all key/values", function(){
            cache.set("a", 1, 2);
            cache.set("b", 2, 2);
            cache.set("c", 3, 1);

            var pairs = [];
            cache.forEach(function(value, key) {
                pairs.push({value: value, key: key});
            });

            expect(pairs.length).toEqual(3);
            expect(pairs[0]).toEqual({value: 1, key: "a"});
            expect(pairs[1]).toEqual({value: 2, key: "b"});
            expect(pairs[2]).toEqual({value: 3, key: "c"});
        });

        it("should call iterator with context", function() {
            cache.set("a", 1);

            var context = null;
            cache.forEach(function() {
                context = this;
            }, this);

            expect(context).toBe(this);
        });
    });

    it("should destroy cache", function(){
        var a = $cache("a");
        a.set("a", 1);

        $cache.destroy("a");

        expect(a).not.toBe($cache("a"));
        expect(a.get("a")).toEqual(null);
    });

    it("should destroy all caches", function(){
        var a = $cache("a");
        a.set("a", 1);

        var b = $cache("b");
        b.set("a", 1);

        $cache.destroyAll();

        expect(a).not.toBe($cache("a"));
        expect(a.get("a")).toEqual(null);

        expect(b).not.toBe($cache("b"));
        expect(b.get("a")).toEqual(null);
    });
});