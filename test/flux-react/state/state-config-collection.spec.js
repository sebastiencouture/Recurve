"use strict";

describe("$stateConfigCollection", function() {
    var collection;
    var $stateConfigCollection;
    var stateConfigSpy;

    beforeEach(function() {
        recurve.flux.react.$module.exports([]);
        $include(recurve.flux.react.$module);

        $include(recurve.flux.react.$module, function(mockable) {
            stateConfigSpy = jasmine.createSpy("stateConfigSpy");
            mockable.value("$stateConfig", stateConfigSpy);
        });

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
        it("should create state config object", function() {

        });

        it("should add each with unique name", function() {

        });

        it("should replace if has same name", function() {

        });

        it("should throw error if name includes parent but there is no parent in the collection", function() {

        });

        describe("path resolution", function() {
            it("should remove leading slashes", function() {

            });

            it("should remove trailing slashes", function() {

            });

            it("should append parent path", function() {

            });

            it("should not append multiple slashes between parent and child", function() {

            });

            it("should set path to '' for default config", function() {

            });

            it("should throw error if path provided and default set to true", function() {

            });

            it("should set path to '*' for notFound config", function() {

            });

            it("should throw error if path provided and notFound set to true", function() {

            });

            it("should throw error if no path", function() {

            });
        });
    });

    describe("get", function() {
        it("should return state config with same name", function() {

        });

        it("should return null if no state config exists with the name", function() {

        });
    });

    describe("getParent", function() {
        it("should return the immediate parent config", function() {

        });

        it("should return null if no parent config", function() {

        });
    });
});