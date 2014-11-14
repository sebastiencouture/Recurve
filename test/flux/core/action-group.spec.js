"use strict";

describe("$actionGroup", function() {
    var $actionGroup;
    var actionGroup;
    var action;
    var callback;

    beforeEach(function() {
        $include(recurve.flux.$module);

        $invoke(["$action", "$actionGroup"], function($action, actionGroupFactory) {
            $actionGroup = actionGroupFactory;
            actionGroup = $actionGroup();
            action = $action();
        });

        callback = jasmine.createSpy("callback");
    });

    it("should be invokable", function() {
        expect($actionGroup).toBeDefined();
        expect(isFunction($actionGroup)).toEqual(true);
    });
});