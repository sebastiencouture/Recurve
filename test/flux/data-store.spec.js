"use strict";

describe("$dataStore", function() {
    var $dataStore;
    var dataStore;
    var action;
    var callback = function() {};

    beforeEach(function() {
        $include(recurve.flux.$module);

        $invoke(["$dataStore", "$action"], function(dataStoreFactory, $action) {
            $dataStore = dataStoreFactory;
            dataStore = $dataStore();
            action = $action();
        });
    });

    it("should be invokable", function() {
        expect($dataStore).toBeDefined();
        expect(isFunction($dataStore)).toEqual(true);
    });

    it("should provide onAction helper that adds listener to the action", function() {
        spyOn(action, "on");

        dataStore.onAction(action, callback, this);
        expect(action.on).toHaveBeenCalledWith(callback, this, dataStore);
    });

    it("should provide offAction helper that removes listener from the action", function() {
        spyOn(action, "off");

        dataStore.offAction(action, callback);
        expect(action.off).toHaveBeenCalledWith(callback);
    });

    it("should include changed signal", function() {
        callback = jasmine.createSpy("callback");
        dataStore.changed.on(callback);

        dataStore.changed.trigger();

        expect(callback).toHaveBeenCalled();
    });
});