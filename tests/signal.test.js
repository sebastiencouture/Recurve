var Signal = require("../src/signal.js");

describe("Recurve.Signal", function() {
    var signal;
    var triggered;
    var triggerCount;

    beforeEach(function() {
        signal = new Signal();
        triggered = false;
        triggerCount = 0;
    });

    it("should add with no arguments", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.trigger();

        expect(triggered).toBe(true);
    });

    it("should add with arguments", function() {
        function onTrigger(name, location) {
            expect(arguments.length).toEqual(2);
            expect(name).toMatch("Sebastien");
            expect(location).toMatch("New Westminster");

            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.trigger("Sebastien", "New Westminster");

        expect(triggered).toBe(true);
    });

    it("should add once", function() {
        function onTrigger() {
            triggerCount++;
        }

        signal.addOnce(onTrigger, this);
        signal.trigger();
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should add multiple", function() {
        var firstTriggered;
        var secondTriggered;

        function onTriggerFirst() {
            triggerCount++;
            firstTriggered = true;
        }

        function onTriggerSecond() {
            secondTriggered = true;
            triggerCount++;
        }

        signal.add(onTriggerFirst, this);
        signal.add(onTriggerSecond, this);
        signal.trigger();

        expect(firstTriggered).toBe(true);
        expect(secondTriggered).toBe(true);
        expect(triggerCount).toEqual(2);
    });

    it("should ignore duplicate callbacks", function() {
        function onTrigger() {
            triggerCount++;
        }

        signal.add(onTrigger, this);
        signal.add(onTrigger, this);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should handle null callbacks", function() {
        signal.add(null, this);
        signal.trigger();

        expect(triggered).toBe(false);
    });

    it("should remove", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.remove(onTrigger);
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

        signal.add(onTriggerFirst, this);
        signal.add(onTriggerSecond, this);
        signal.removeAll();
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

        signal.add(onTriggerFirst, this);
        signal.add(onTriggerSecond, this);
        signal.remove(onTriggerSecond);
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

        signal.add(onTriggerFirst, this);
        signal.add(onTriggerSecond, this);
        signal.add(onTriggerThird, {});
        signal.remove(null, this);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });

    it("should remove none if no callback, or context", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.remove();
        signal.trigger();

        expect(triggered).toBe(true);
    });

    it("should disable", function() {
        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.disable();
        signal.trigger();

        expect(triggered).toBe(false);
    });

    it("should use correct context on callback", function() {
        var that = this;

        function onTrigger() {
            expect(this).toBe(that);
        }

        signal.add(onTrigger, this);
        signal.trigger();
    });
});