"use strict";

describe("$signalFactory", function(){
    var signal;
    var triggered;
    var triggerCount;

    beforeEach(function() {
        $invoke(["$signalFactory"], function($signalFactory){
            signal = $signalFactory.create();
        });

        triggered = false;
        triggerCount = 0;
    });

    it("should have a create method", function(){
        $invoke(["$signalFactory"], function($signalFactory){
            expect($signalFactory.create).toBeDefined();
        });
    });

    it("should add with no arguments", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.on(onTrigger, this);
        signal.trigger();

        expect(triggered).toBe(true);
    });

    it("should add with arguments", function() {
        function onTrigger(a, b) {
            expect(arguments.length).toEqual(2);
            expect(a).toEqual("a");
            expect(b).toEqual("b");

            triggered = true;
        }

        signal.on(onTrigger, this);
        signal.trigger("a", "b");

        expect(triggered).toBe(true);
    });

    it("should add once", function() {
        function onTrigger() {
            triggerCount++;
        }

        signal.once(onTrigger, this);
        signal.trigger();
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should add multiple", function() {
        var firstTriggered = false;
        var secondTriggered = false;

        function onTriggerFirst() {
            triggerCount++;
            firstTriggered = true;
        }

        function onTriggerSecond() {
            secondTriggered = true;
            triggerCount++;
        }

        signal.on(onTriggerFirst, this);
        signal.on(onTriggerSecond, this);
        signal.trigger();

        expect(firstTriggered).toBe(true);
        expect(secondTriggered).toBe(true);
        expect(triggerCount).toEqual(2);
    });

    it("should ignore duplicate callbacks", function() {
        function onTrigger() {
            triggerCount++;
        }

        signal.on(onTrigger, this);
        signal.on(onTrigger, this);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should handle null callbacks", function() {
        expect(function(){
            signal.on(null, this);
        }).toThrow(new Error("callback must exist"));
    });

    it("should use correct context on callback", function() {
        var that = this;

        function onTrigger() {
            expect(this).toBe(that);
        }

        signal.on(onTrigger, this);
        signal.trigger();
    });

    it("should remove", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.on(onTrigger, this);
        signal.off(onTrigger);
        signal.trigger();

        expect(triggered).toBe(false);
    });

    it("should remove all", function() {
        function onTriggerFirst() {
            triggerCount++;
        }

        function onTriggerSecond() {
            triggerCount++;
        }

        signal.on(onTriggerFirst, this);
        signal.on(onTriggerSecond, this);
        signal.clear();
        signal.trigger();

        expect(triggerCount).toEqual(0);
    });

    it("should remove only second", function() {
        function onTriggerFirst() {
            triggerCount++;
        }

        function onTriggerSecond() {
            triggerCount++;
        }

        signal.on(onTriggerFirst, this);
        signal.on(onTriggerSecond, this);
        signal.off(onTriggerSecond);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should only remove all with same context", function() {
        function onTriggerFirst() {
            triggerCount++;
        }

        function onTriggerSecond() {
            triggerCount++;
        }

        function onTriggerThird() {
            triggerCount++;
        }

        signal.on(onTriggerFirst, this);
        signal.on(onTriggerSecond, this);
        signal.on(onTriggerThird, {});
        signal.off(null, this);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should remove none if no callback, or context", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.on(onTrigger, this);
        signal.off();
        signal.trigger();

        expect(triggered).toBe(true);
    });

    it("should disable", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.on(onTrigger, this);
        signal.disable();
        signal.trigger();

        expect(triggered).toBe(false);
    });

    it("should re-enable", function(){
        function onTrigger() {
            triggerCount++;
        }

        signal.on(onTrigger, this);
        signal.disable();
        signal.trigger();
        signal.disable(false);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });
});