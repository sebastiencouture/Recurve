"use strict";

describe("container", function(){
    var containerA;
    var moduleA;

    beforeEach(function(){
        moduleA = module();
    });

    describe("invoke", function() {
        it("should resolve factory", function(){

        });

        it("should resolve value", function(){

        });

        it("should resolve Type", function(){

        });

        it("should resolve Type factory", function(){

        });

        it("should resolve config", function(){

        });

        it("should resolve dependencies", function(){
            moduleA = module();
            moduleA.value("a", 1);
            moduleA.value("b", 2);
            moduleA.factory("c", ["a"], function(a){
                return "a=" + a;
            });

            containerA = container(moduleA);

            containerA.invoke(["c"], function(c){
                expect(c).toEqual("a=1");
            })
        });

        it("should decorate", function(){

        });

        it("should override decorators for a service", function(){

        });

        it("should override services", function(){

        });

        it("should resolve config as $config dependency", function(){

        });
    });

    describe("instantiate", function(){

    });

    describe("get", function(){

    });

    describe("load", function() {

    });

    describe("circular dependencies", function(){

    });

    describe("exports", function(){

    });
});