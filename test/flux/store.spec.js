"use strict";

describe("$store", function() {
    var $store;
    var store;
    var action;
    var callback = function() {};

    beforeEach(function() {
        $include(recurve.flux.$module);

        $invoke(["$store", "$action"], function(storeFactory, $action) {
            $store = storeFactory;
            store = $store();
            action = $action();
        });
    });

    it("should be invokable", function() {
        expect($store).toBeDefined();
        expect(isFunction($store)).toEqual(true);
    });

    it("should provide onAction helper that adds listener to the action", function() {
        spyOn(action, "on");

        store.onAction(action, callback, this);
        expect(action.on).toHaveBeenCalledWith(callback, this, store);
    });

    it("should provide offAction helper that removes listener from the action", function() {
        spyOn(action, "off");

        store.offAction(action, callback);
        expect(action.off).toHaveBeenCalledWith(callback);
    });

    it("should include changed signal", function() {
        callback = jasmine.createSpy("callback");
        store.changed.on(callback);

        store.changed.trigger();

        expect(callback).toHaveBeenCalled();
    });
});