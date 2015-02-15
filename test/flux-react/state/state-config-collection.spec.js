"use strict";

describe("$stateConfigCollection", function() {
    var collection;
    var $stateConfigCollection;

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.react.$module);

        $invoke(["$stateConfigCollection"], function(stateConfigCollectionService) {
            $stateConfigCollection = stateConfigCollectionService;
            collection = $stateConfigCollection();
        });
    });

    it("should be invokable", function() {
        expect($stateConfigCollection).toBeDefined();
        expect(isFunction($stateConfigCollection)).toEqual(true);
    });

    describe("add", function() {
        it("should return state config object", function() {
            var config = collection.add("a", {path: "test", resolver:{}});
            expect(config).toBeDefined();
        });

        it("should add each with unique name", function() {
            collection.add("a", {path: "test", resolver:{}});
            collection.add("b", {path: "test2", resolver:{}});

            expect(collection.get("a")).toBeDefined();
            expect(collection.get("b")).toBeDefined();
        });

        it("should replace if has same name", function() {
            collection.add("a", {path: "test", resolver:{}});
            collection.add("a", {path: "test2", resolver:{}});

            expect(collection.get("a").path).toEqual("test2");
        });

        it("should throw error if name includes parent but there is no parent in the collection", function() {
            expect(function() {
                collection.add("a.b", {path: "test", resolver:{}});
            }).toThrowError("no parent exists for state config 'a.b'");
        });

        describe("path resolution", function() {
            function testPath(path, expected) {
                collection.add("a", {path: path, resolver:{}});
                expect(collection.get("a").path).toEqual(expected);
            }

            it("should remove leading slashes", function() {
                testPath("test//", "test");
            });

            it("should remove trailing slashes", function() {
                testPath("//test", "test");
            });

            it("should append parent path", function() {
                collection.add("a", {path: "test", resolver:{}});
                collection.add("a.b", {path: "name", resolver:{}});
                expect(collection.get("a.b").path).toEqual("test/name");
            });

            it("should not append multiple slashes between parent and child", function() {
                collection.add("a", {path: "/test/", resolver:{}});
                collection.add("a.b", {path: "/name", resolver:{}});
                expect(collection.get("a.b").path).toEqual("test/name");
            });

            it("should set path to '' for default config", function() {
                collection.add("a", {default: true, resolver:{}});
                expect(collection.get("a").path).toEqual("");
            });

            it("should throw error if path provided and default set to true", function() {
                expect(function() {
                    collection.add("a", {default: true, path:"test"});
                }).toThrowError("path should not be set for default state config 'a'");
            });

            it("should set path to '.*' for notFound config", function() {
                collection.add("a", {notFound: true, resolver:{}});
                expect(collection.get("a").path).toEqual(".*");
            });

            it("should throw error if path provided and notFound set to true", function() {
                expect(function() {
                    collection.add("a", {notFound: true, path:"test", resolver:{}});
                }).toThrowError("path should not be set for not found state config 'a'");
            });

            it("should throw error if no path", function() {
                expect(function() {
                    collection.add("a", {});
                }).toThrowError("no path for state config 'a'");
            });

            it("should throw error for RegExp object path", function() {
                expect(function() {
                    collection.add("a", {path: /a/g});
                }).toThrowError("path must be a string for state config 'a'");
            });
        });
    });

    it("should return null if no state config exists with the name", function() {
        expect(collection.get("a")).toEqual(null);
    });

    describe("getParent", function() {
        it("should return the immediate parent config", function() {
            var parent = collection.add("a", {path: "test", resolver:{}});
            collection.add("a.b", {path: "name", resolver:{}});

            expect(collection.getParent("a.b")).toEqual(parent);
        });

        it("should return null if no parent config", function() {
            expect(collection.getParent("a.b")).toEqual(null);
        });
    });

    describe("getFromPath", function() {
        it("should return the config for the path", function() {
            var config = collection.add("a", {path: "test", resolver: {}});
            expect(collection.getFromPath("test")).toEqual(config);
        });

        it("should return null if no config for the path", function() {
            expect(collection.getFromPath("test")).toEqual(null);
        });
    });
});