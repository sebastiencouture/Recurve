describe("module", function(){

    var module;

    beforeEach(function(){
        module = createModule();
    });

    describe("factory", function() {
        it("should require name and function provider", function() {
            expect(function(){module.factory()}).toThrow();
            expect(function(){module.factory("a")}).toThrow();

            module.factory("a", null, function(){});
        });
    });

    describe("value", function() {
        it("should require name", function() {
            expect(function(){module.value()}).toThrow();

            module.value("a", 1);
        });
    });

    describe("type", function() {
        it("should require name and function constructor provider", function() {
            expect(function(){module.type()}).toThrow();
            expect(function(){module.type("test")}).toThrow();

            module.type("a", null, function(){});
        });
    });

    describe("typeFactory", function(){
        it("should require name and function constructor provider", function() {
            expect(function(){module.typeFactory()}).toThrow();
            expect(function(){module.typeFactory("test")}).toThrow();

            module.typeFactory("a", null, function(){});
        });
    });

    describe("config", function(){
        it("should require name", function() {
            expect(function(){module.config()}).toThrow();

            module.config("a", 1);
        });
    });

    describe("decorator", function(){
        it("should require name", function() {
            expect(function(){module.decorator()}).toThrow();
            expect(function(){module.decorator("test")}).toThrow();

            module.decorator("a", null, function(){});
        });
    });

    describe("resolve dependent service/decorators", function(){
        var a;
        var b;

        beforeEach(function(){
            a = createModule();
            b = createModule(a);
        });

        it("should resolve services", function(){
            a.value("valueA", 1);
            b.value("valueB", 2);

            b.resolveDependencies();

            expect(a.getServices()["valueA"]).toBeDefined();
            expect(a.getServices()["valueB"]).not.toBeDefined();
            expect(b.getServices()["valueA"]).toBeDefined();
            expect(b.getServices()["valueB"]).toBeDefined();
        });

        it("should resolve service overrides", function(){
            a.value("valueA", 1);
            b.value("valueA", 2);

            b.resolveDependencies();

            expect(a.getServices()["valueA"]).toEqual({type: "value", value: 1});
            expect(b.getServices()["valueA"]).toEqual({type: "value", value: 2});
        });

        it("should resolve decorators", function(){
            a.decorator("decoratorA", null, function(){});
            b.decorator("decoratorB", null, function(){});

            b.resolveDependencies();

            expect(a.getDecorators()["decoratorA"]).toBeDefined();
            expect(a.getDecorators()["decoratorB"]).not.toBeDefined();
            expect(b.getDecorators()["decoratorA"]).toBeDefined();
            expect(b.getDecorators()["decoratorB"]).toBeDefined();
        });

        it("should resolve decorator overrides", function(){
            function decoratorA(){

            }
            function decoratorB(){

            }

            a.decorator("decoratorA", null, decoratorA);
            b.decorator("decoratorA", null, decoratorB);

            b.resolveDependencies();

            expect(a.getDecorators()["decoratorA"]).toEqual({type: "decorator", dependencies: null, value: decoratorA});
            expect(b.getDecorators()["decoratorA"]).toEqual({type: "decorator", dependencies: null, value: decoratorB});
        });
    });

    it("should enable chaining", function() {
        module.factory("a", null, function(){}).
            value("b", {}).
            type("c", null, function(){}).
            typeFactory("d", null, function(){}).
            config("e", {}).
            decorator("e", null, function(){});
    });
});