"use strict";

describe("$state", function() {
    var $router;
    var $state;

    beforeEach(function() {
        $include(recurve.flux.$module);
        $include(recurve.flux.state.$module);

        $invoke(["$router", "$state"], function(routerService, stateService) {
            $router = routerService;
            $state = stateService;
        });
    });

    function testCallRouterMethod(method) {
        it("should call $router." + method, function() {
            spyOn($router, method);
            $state[method]();

            expect($router[method]).toHaveBeenCalled();
        });
    }

    it("should be invokable", function() {
        expect($state).toBeDefined();
        expect(isFunction($state)).toEqual(false);
    });

    describe("start", function() {
        testCallRouterMethod("start");
    });

    describe("state config", function() {
        it("should call $router.on with path", function() {

        });

        it("should include parent path", function() {

        });

        it("should resolve parent name with multiple '.''s in the name", function() {

        });

        it("should strip additional slashes joining parent and child path", function() {

        });

        it("should override state with same name", function() {

        });

        it("should throw error for parent that does not exist", function() {

        });

        it("should throw error for null name", function() {

        });

        it("should throw error for empty name", function() {

        });

        it("should throw error for null path", function() {

        });

        it("should throw error for empty path", function() {

        });
    });

    describe("nameToPath", function() {
        it("should return path specified in config", function() {

        });

        it("should include parent path", function() {

        });

        it("should replace named params", function() {

        });

        it("should append additional params to the path as query params", function() {

        });

        it("should return null if state does not exist", function() {

        });
    });

    describe("navigate", function() {
        it("should replace parameters in the path", function() {

        });

        it("should include parent path", function() {

        });

        it("should include parent data", function() {

        });

        it("should pass through options to $router.navigate", function() {

        });

        it("should pass through history state to $router.navigate", function() {

        });

        it("should force reload if same path for options.reload=true", function() {

        });

        it("should not force a reload if different path for options.reload=true", function() {

        });

        it("should throw error for state that does not exist", function() {

        });
    });

    describe("actions", function() {
        describe("startChangeAction", function() {
            it("should trigger before changeAction/errorAction", function() {

            });

            it("should trigger before resolving data", function() {

            });

            it("should include name and route params as action parameters", function() {

            });
        });

        describe("changeAction", function() {
            it("should include name, route params and data as action parameters", function() {

            });

            it("should trigger after resolving data", function() {

            });
        });

        describe("errorAction", function() {
            it("should include error, name, route params and data as action parameters", function() {

            });
        });
    });

    describe("data resolve", function() {
        it("should trigger change action if no data to resolve", function() {

        });

        it("should trigger change action if no resolve key on the state config object", function() {

        });

        it("should set the resolved data to the corresponding key on the returned object", function() {

        });

        it("should allow static data", function() {

        });

        it("should allow data returned by function call", function() {

        });

        it("should wait for promise returned by function call", function() {

        });

        it("should wait for all promises to resolve before triggering change action", function() {

        });

        it("should allow mixture of promises and static data", function() {

        });

        it("should trigger error action if resolve factory method throws error", function() {

        });

        it("should merge resolved data over config data", function() {

        });

        it("should trigger error action if resolve promise errors", function() {

        });

        it("should resolve parent data first", function() {

        });

        it("should pass in resolved parent data to child resolve methods", function() {

        });

        it("should inherit parent resolved data", function() {

        });

        it("should overwrite parent resolved data", function() {

        });
    });

    describe("data custom", function() {
        it("should not invoke methods", function() {

        });

        it("should inherit parent data", function() {

        });

        it("should overwrite parent data", function() {

        });

        it("should overwrite with resolved data", function() {

        });
    });

    describe("back", function() {
        testCallRouterMethod("back");
    });

    describe("forward", function() {
        testCallRouterMethod("forward");
    });

    describe("reload", function() {
        testCallRouterMethod("reload");
    });

    describe("rootPath", function() {
        it("should set the root on $router", function() {

        });
    });
});