"use strict";

describe("container", function(){
    var containerA;
    var moduleA;

    beforeEach(function(){
        moduleA = module();
    });

    describe("create", function(){
        it("should allow modules to be passed as array", function(){
           container([moduleA]);
        });

        it("should allow single module to be passed without an array", function(){
            container(moduleA);
        });

        it("should thrown an error for null", function(){
            expect(function(){container(null)}).toThrow(new Error("no modules specified for container"));
        });

        it("should thrown an error for undefined", function(){
            expect(function(){container(undefined)}).toThrow(new Error("no modules specified for container"));
        });

        it("should thrown an error for empty array", function(){
            expect(function(){container([])}).toThrow(new Error("no modules specified for container"));

        });
    });

    describe("resolve/invoke with a module", function() {
        it("should resolve factory", function(){
            moduleA.factory("a", null, function(a){
                return 1;
            });

            containerA = container(moduleA);
            containerA.invoke(["a"], function(a){
                expect(a).toEqual(1);
            });
        });

        it("should resolve factory dependencies", function(){
            moduleA.value("a", 1);
            moduleA.factory("c", ["a"], function(a){
                return "a=" + a;
            });

            containerA = container(moduleA);
            containerA.invoke(["c"], function(c){
                expect(c).toEqual("a=1");
            });
        });

        it("should resolve value", function(){
            moduleA.value("a", 1);

            containerA = container(moduleA);
            containerA.invoke(["a"], function(a){
                expect(a).toEqual(1);
            });
        });

        it("should resolve Type", function(){
            function Animal() {
            }

            Animal.prototype.doSomething = function(){
                return "meow";
            };

            moduleA.type("animal", null, Animal);

            containerA = container(moduleA);
            containerA.invoke(["animal"], function(animal) {
                expect(isFunction(animal)).toEqual(false);
                expect(animal).not.toBe(Animal);
                expect(animal.doSomething).toBeDefined();
                expect(animal.doSomething()).toEqual("meow");
            });
        });

        it("should resolve Type dependencies", function(){
            moduleA.value("name", "pony");

            function Animal(name) {
                this.name = name;
            }

            Animal.prototype.describe = function(){
                return "my name is " + this.name;
            };

            moduleA.type("animal", ["name"], Animal);

            containerA = container(moduleA);
            containerA.invoke(["animal"], function(animal){
                expect(animal.describe()).toEqual("my name is pony");
            });
        });

        it("should resolve Type factory", function(){
            function Animal() {
            }

            Animal.prototype.doSomething = function(){
                return "meow";
            };

            moduleA.typeFactory("animalFactory", null, Animal);

            containerA = container(moduleA);
            containerA.invoke(["animalFactory"], function(animalFactory) {
                expect(isFunction(animalFactory)).toEqual(false);
                expect(animalFactory.create).toBeDefined();

                var animal = animalFactory.create();

                expect(isFunction(animal)).toEqual(false);
                expect(animal.doSomething).toBeDefined();
                expect(animal.doSomething()).toEqual("meow");
            });
        });

        it("should resolve Type factory with additional parameters", function(){
            function Animal(name) {
                this.name = name;
            }

            Animal.prototype.describe = function(){
                return "my name is " + this.name;
            };

            moduleA.typeFactory("animalFactory", null, Animal);

            containerA = container(moduleA);
            containerA.invoke(["animalFactory"], function(animalFactory) {
                var animal = animalFactory.create("pony");

                expect(isFunction(animal)).toEqual(false);
                expect(animal.describe).toBeDefined();
                expect(animal.describe()).toEqual("my name is pony");
            });
        });

        it("should resolve Type factory dependencies", function(){
            moduleA.value("name", "pony");

            function Animal(name) {
                this.name = name;
            }

            Animal.prototype.describe = function(){
                return "my name is " + this.name;
            };

            moduleA.typeFactory("animalFactory", ["name"], Animal);

            containerA = container(moduleA);
            containerA.invoke(["animalFactory"], function(animalFactory) {
                var animal = animalFactory.create();
                expect(animal.describe()).toEqual("my name is pony");
            });
        });

        it("should resolve type factory dependencies with additional parameters", function(){
            moduleA.value("type", "cat");

            function Animal(type, name) {
                this.type = type;
                this.name = name;
            }

            Animal.prototype.describe = function(){
                return this.type + ":" + this.name;
            };

            moduleA.typeFactory("animalFactory", ["type"], Animal);

            containerA = container(moduleA);
            containerA.invoke(["animalFactory"], function(animalFactory) {
                var animal = animalFactory.create("pony");
                expect(animal.describe()).toEqual("cat:pony");
            });
        });

        it("should resolve config as config.<name>", function(){
            moduleA.config("a", 1);

            containerA = container(moduleA);
            containerA.invoke(["config.a"], function(a){
                expect(a).toEqual(1);
            });
        });

        it("should resolve multiple services", function(){
            moduleA.value("a", 1);
            moduleA.value("b", 2);

            containerA = container(moduleA);
            containerA.invoke(["a", "b"], function(a, b){
                expect(a).toEqual(1);
                expect(b).toEqual(2);
            })
        });

        it("should throw an error if unable to resolve", function(){
            containerA = container(moduleA);
            expect(function(){
                containerA.invoke(["a"], function(){});
            }).toThrow(new Error("no service exists with the name a"));
        });

        it("should throw an error if unable to resolve service dependency", function(){
            moduleA.factory("a", ["b"], function(){});

            containerA = container(moduleA);
            expect(function(){
                containerA.invoke(["a"], function(){});
            }).toThrow(new Error("no service exists with the name b"));
        });

        it("should resolve factory as dependency", function(){
            moduleA.factory("a", ["b"], function(b){return b;});
            moduleA.factory("b", null, function(){return 1;});

            containerA = container(moduleA);

            containerA.invoke(["a"], function(a){
                expect(a).toEqual(1);
            });
        });

        it("should resolve value as dependency", function(){
            moduleA.factory("a", ["b"], function(b){return b;});
            moduleA.value("b", 1);

            containerA = container(moduleA);

            containerA.invoke(["a"], function(a){
                expect(a).toEqual(1);
            });
        });

        it("should resolve Type as dependency", function(){
            function Animal() {
            }

            Animal.prototype.doSomething = function(){
                return "meow";
            };

            moduleA.type("b", null, Animal);
            moduleA.factory("a", ["b"], function(b){
                return b.doSomething();
            });

            containerA = container(moduleA);

            containerA.invoke(["a"], function(a){
                expect(a).toEqual("meow");
            });
        });

        it("should resolve Type factory as dependency", function(){
            function Animal() {
            }

            Animal.prototype.doSomething = function(){
                return "meow";
            };

            moduleA.typeFactory("b", null, Animal);
            moduleA.factory("a", ["b"], function(b){
                return b.create().doSomething();
            });

            containerA = container(moduleA);

            containerA.invoke(["a"], function(a){
                expect(a).toEqual("meow");
            });
        });

        it("should resolve config as dependency", function(){
            moduleA.factory("a", ["config.a"], function(config){return config;});
            moduleA.config("a", 1);

            containerA = container(moduleA);

            containerA.invoke(["a"], function(a){
                expect(a).toEqual(1);
            });
        });

        it("should resolve config as $config dependency", function(){
            moduleA.factory("a", ["$config"], function(config){return config;});
            moduleA.config("a", 1);

            containerA = container(moduleA);

            containerA.invoke(["a"], function(a){
                expect(a).toEqual(1);
            });
        });

        describe("decorate", function(){
            it("should decorate a factory", function(){
                moduleA.factory("a", null, function(){
                   return {
                       describe: function(){
                           return "meow";
                       }
                   }
                });

                moduleA.decorator("a", null, function($delegate) {
                    var describe = $delegate.describe;
                    $delegate.describe = function(){
                        return describe() + "!";
                    };

                    return $delegate;
                });

                containerA = container(moduleA);
                containerA.invoke(["a"], function(a){
                    expect(a.describe()).toEqual("meow!");
                });
            });

            it("should decorate a Type", function(){
                function Animal() {
                }

                Animal.prototype.describe = function(){
                    return "meow";
                };

                moduleA.type("a", null, Animal);
                moduleA.decorator("a", null, function($delegate) {
                    var describe = $delegate.describe;
                    $delegate.describe = function(){
                        return describe() + "!";
                    };

                    return $delegate;
                });

                containerA = container(moduleA);
                containerA.invoke(["a"], function(a){
                    expect(a.describe()).toEqual("meow!");
                });
            });

            it("should decorate a value", function(){
                moduleA.value("a", 1);
                moduleA.decorator("a", null, function($delegate) {
                    return $delegate + 1;
                });

                containerA = container(moduleA);
                containerA.invoke(["a"], function(a){
                    expect(a).toEqual(2);
                });
            });

            it("should decorate a config", function(){
                moduleA.config("a", 1);
                moduleA.decorator("config.a", null, function($delegate) {
                    return $delegate + 1;
                });

                containerA = container(moduleA);
                containerA.invoke(["config.a"], function(a){
                    expect(a).toEqual(2);
                });
            });

            it("should support dependencies", function(){
                moduleA.factory("a", null, function(){
                    return {
                        describe: function(){
                            return "meow";
                        }
                    }
                });
                moduleA.value("b", 2);

                moduleA.decorator("a", ["b"], function($delegate, b) {
                    var describe = $delegate.describe;
                    $delegate.describe = function(){
                        return describe() + b;
                    };

                    return $delegate;
                });

                containerA = container(moduleA);
                containerA.invoke(["a"], function(a){
                    expect(a.describe()).toEqual("meow2");
                });
            });

            it("should throw an error if decorator doesn't return a value", function(){
                moduleA.value("a", 1);
                moduleA.decorator("a", null, function($delegate) {});

                containerA = container(moduleA);
                expect(function(){
                    containerA.invoke(["a"], function(a){});
                }).toThrow(new Error("decorator a must return an instance"));
            });
        });
    });

    describe("resolve/invoke with multiple modules", function(){
        var moduleB;

        beforeEach(function(){
            moduleB = module();
        });

        it("should override decorators for a service", function(){

        });

        it("should override services", function(){

        });
    });

    describe("get", function(){
        it("should return instance", function(){

        });

        it("should always return same instance", function(){

        });

        it("should return null if doesn't exist", function(){

        });

        it("should return null for null", function(){

        });

        it("should return null for undefined", function(){

        });
    });

    // TODO TBD dont know if this can be tested
    describe("load", function() {
        it("should load all instances", function(){

        });
    });

    describe("circular dependencies", function(){

    });

    describe("exports", function(){

    });
});