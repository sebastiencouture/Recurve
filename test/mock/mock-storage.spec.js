"use strict";

describe("recurveMock-$storage", function() {

    spec("$localStorage");
    spec("$sessionStorage");

    function spec(name) {
        var $storage;

        beforeEach(function() {
            $invoke([name], function(storage) {
                $storage = storage;
            });
        });

        it("should be invokable", function() {
            expect($storage).toBeDefined();
            expect(isFunction($storage)).toEqual(false);
        });

        it("should set and get same value", function() {
            $storage.set("a", "b");
            expect($storage.get("a")).toEqual("b");
        });

        describe("get", function() {
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
                $storage.set("a", "");
                expect($storage.get("a")).toEqual("");
            });

            it("should parse json", function() {
                $storage.set("a", toJson({b:"c"}));
                expect($storage.get("a")).toEqual({b: "c"});
            });

            it("should return raw for malformed json", function() {
                $storage.set("a", "{b:");
                expect($storage.get("a")).toEqual("{b:");
            });

            it("should preserve leading and trailing spaces", function() {
                $storage.set("a", " b ");
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

            it("should save leading and trailing spaces", function() {
                $storage.set(" a ", " b ");
                expect($storage.get(" a ")).toEqual(" b ");
            });
        });

        describe("remove", function() {
            it("should remove", function() {
                $storage.set("a", "b");
                $storage.remove("a");

                expect($storage.get("a")).toEqual(null);
            });

            it("should return true if exists", function() {
                $storage.set("a", "b");
                expect($storage.remove("a")).toEqual(true);
            });

            it("should return false if doesn't exist", function() {
                expect($storage.remove("a")).toEqual(false);
            });

            it("should not throw error for null key", function(){
                $storage.remove(null);
            });

            it("should not throw error for undefined key", function(){
                $storage.remove(undefined);
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

            var callback = jasmine.createSpy("callback");
            $storage.forEach(callback);

            expect(callback).not.toHaveBeenCalled();
        });

        describe("forEach", function() {
            it("should iterate all items", function() {
                $storage.set("a", 1);
                $storage.set("b", 2);

                var expected = [["a", 1], ["b", 2]];

                $storage.forEach(function(value, name) {
                    var match = false;
                    forEach(expected, function(item){
                        if (item[0] === name && item[1] === value) {
                            match = true;
                            return false;
                        }
                    });

                    expect(match).toEqual(true);
                });
            });

            it("should call iterator with context", function() {
                $storage.set("a", 1);

                var context = null;
                $storage.forEach(function() {
                    context = this;
                }, this);

                expect(context).toBe(this);
            });
        });
    }
});