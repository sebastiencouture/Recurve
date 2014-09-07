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

    it("should resolve service/decorators of dependent modules", function(){

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