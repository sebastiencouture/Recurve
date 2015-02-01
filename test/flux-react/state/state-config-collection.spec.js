"use strict";

describe("$stateConfigCollection", function() {
    var collection;
    var $stateConfigCollection;

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.react.$module);

        $invoke(["$stateConfigCollection"], function(stateConfigCollection) {
            $stateConfigCollection = stateConfigCollection;
            collection = $stateConfigCollection();
        });
    });

    it("should be invokable", function() {
        expect($stateConfigCollection).toBeDefined();
        expect(isFunction($stateConfigCollection)).toEqual(true);
    });

    describe("add", function() {
        it("should return state config object", function() {
            var config = collection.add("a", {path: "test"});
            expect(config).toBeDefined();
        });

        it("should add each with unique name", function() {
            collection.add("a", {path: "test"});
            collection.add("b", {path: "test2"});

            expect(collection.get("a")).toBeDefined();
            expect(collection.get("b")).toBeDefined();
        });

        it("should replace if has same name", function() {
            collection.add("a", {path: "test"});
            collection.add("a", {path: "test2"});

            expect(collection.get("a").path).toEqual("test2");
        });

        it("should throw error if name includes parent but there is no parent in the collection", function() {
            expect(function() {
                collection.add("a.b", {path: "test"});
            }).toThrowError("no parent exists for state config 'a.b'");
        });

        describe("path resolution", function() {
            function testPath(path, expected) {
                collection.add("a", {path: path});
                expect(collection.get("a").path).toEqual(expected);
            }

            it("should remove leading slashes", function() {
                testPath("test//", "test");
            });

            it("should remove trailing slashes", function() {
                testPath("//test", "test");
            });

            it("should append parent path", function() {
                collection.add("a", {path: "test"});
                collection.add("a.b", {path: "name"});
                expect(collection.get("a.b").path).toEqual("test/name");
            });

            it("should not append multiple slashes between parent and child", function() {
                collection.add("a", {path: "/test/"});
                collection.add("a.b", {path: "/name"});
                expect(collection.get("a.b").path).toEqual("test/name");
            });

            it("should set path to '' for default config", function() {
                collection.add("a", {default: true});
                expect(collection.get("a").path).toEqual("");
            });

            it("should throw error if path provided and default set to true", function() {
                expect(function() {
                    collection.add("a", {default: true, path:"test"});
                }).toThrowError("path should not be set for default state config 'a'");
            });

            it("should set path to '*' for notFound config", function() {
                collection.add("a", {notFound: true});
                expect(collection.get("a").path).toEqual("*");
            });

            it("should throw error if path provided and notFound set to true", function() {
                expect(function() {
                    collection.add("a", {notFound: true, path:"test"});
                }).toThrowError("path should not be set for not found state config 'a'");
            });

            it("should throw error if no path", function() {
                expect(function() {
                    collection.add("a", {});
                }).toThrowError("no path for state config 'a'");
            });
        });
    });

    it("should return null if no state config exists with the name", function() {
        expect(collection.get("a")).toEqual(null);
    });

    describe("getParent", function() {
        it("should return the immediate parent config", function() {
            var parent = collection.add("a", {path: "test"});
            collection.add("a.b", {path: "name"});

            expect(collection.getParent("a.b")).toEqual(parent);
        });

        it("should return null if no parent config", function() {
            expect(collection.getParent("a.b")).toEqual(null);
        });
    });
});