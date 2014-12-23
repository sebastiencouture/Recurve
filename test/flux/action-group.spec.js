"use strict";

describe("$actionGroup", function() {
    var $actionGroup;
    var actionGroup;
    var $action;
    var action;
    var callback;

    beforeEach(function() {
        $include(recurve.flux.$module);

        $invoke(["$action", "$actionGroup"], function(actionFactory, actionGroupFactory) {
            $actionGroup = actionGroupFactory;
            actionGroup = $actionGroup();
            $action = actionFactory;
            action = $action();
        });

        callback = jasmine.createSpy("callback");
    });

    it("should be invokable", function() {
        expect($actionGroup).toBeDefined();
        expect(isFunction($actionGroup)).toEqual(true);
    });

    describe("on", function() {
        var context = {};
        var dataStore = {};

        it("should call on with the provided params for registered action", function() {
            spyOn(action, "on");
            actionGroup.add(action);
            actionGroup.on(callback, context, dataStore);

            expect(action.on).toHaveBeenCalledWith(callback, context, dataStore);
        });

        it("should call on for multiple registered actions", function() {
            spyOn(action, "on");
            actionGroup.add(action);

            var action2 = $action();
            spyOn(action2, "on");
            actionGroup.add(action2);

            actionGroup.on(callback, context, dataStore);

            expect(action.on).toHaveBeenCalledWith(callback, context, dataStore);
            expect(action2.on).toHaveBeenCalledWith(callback, context, dataStore);
        });

        it("should do nothing if no registered actions or listeners", function() {
            actionGroup.on(callback, context, dataStore);
        });
    });

    describe("off", function() {
        it("should call off for a registered action", function() {
            spyOn(action, "off");
            actionGroup.add(action);
            actionGroup.off(callback);

            expect(action.off).toHaveBeenCalledWith(callback);
        });

        it("should call off for multiple registered actions", function() {
            spyOn(action, "off");
            actionGroup.add(action);

            var action2 = $action();
            spyOn(action2, "off");
            actionGroup.add(action2);

            actionGroup.off(callback);

            expect(action.off).toHaveBeenCalledWith(callback);
        });

        it("should do nothing if no registered actions or listeners", function() {
            actionGroup.off(callback);
        });
    });

    describe("add", function() {
        it("should throw error upon adding same action more than once", function() {
            actionGroup.add(action);
            expect(function() {
                actionGroup.add(action);
            }).toThrowError("action is already in the group");
        });

        it("should call on for all registered listeners", function() {
            spyOn(action, "on");
            actionGroup.on(callback);
            actionGroup.add(action);

            expect(action.on).toHaveBeenCalled();
        });

        it("should not register a listener with any actions added after removing a listener", function() {
            spyOn(action, "on");
            actionGroup.on(callback);
            actionGroup.off(callback);
            actionGroup.add(action);

            expect(action.on).not.toHaveBeenCalled();
        });
    });

    describe("remove", function() {
        it("should throw error on trying to remove action that isn't registered", function() {
            expect(function() {
                actionGroup.remove(action);
            }).toThrowError("action is not in the group");
        });

        it("should call off for all registered listeners", function() {
            spyOn(action, "off");
            actionGroup.add(action);
            actionGroup.on(callback);
            actionGroup.remove(action);

            expect(action.off).toHaveBeenCalled();
        });

        it("should not try to remove a listener with any actions removed after removing a listener", function() {
            actionGroup.add(action);
            actionGroup.on(callback);
            actionGroup.off(callback);

            spyOn(action, "off");
            actionGroup.remove(action);

            expect(action.off).not.toHaveBeenCalled();
        });
    });

    describe("waitFor", function() {
        var dataStore = {};

        it("should call waitFor on action currently being triggered", function() {
            var dataStore2 = {a: "1"};
            action.on(function() {
                actionGroup.waitFor([dataStore]);
            }, null, dataStore2);
            action.on(callback, null, dataStore);

            actionGroup.add(action);

            spyOn(action, "waitFor");
            action.trigger("a");

            expect(action.waitFor).toHaveBeenCalledWith([dataStore]);
        });

        it("should do nothing if no action is currently being triggered", function() {
            actionGroup.add(action);
            actionGroup.waitFor([dataStore]);
        });

        it("should do nothing if no registered actions", function() {
            actionGroup.waitFor([dataStore]);
        });
    });
});