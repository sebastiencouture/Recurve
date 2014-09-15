"use strict";

describe("$eventEmitterFactory", function(){
    var eventEmitter;
    var triggered;
    var triggerCount;

    function triggerHandler() {
        triggered = true;
        triggerCount++;
    }

    beforeEach(function() {
        $invoke(["$eventEmitterFactory"], function($eventEmitterFactory){
            eventEmitter = $eventEmitterFactory.create();
        });

        triggered = false;
        triggerCount = 0;
    });

    it("should have a create method", function(){
        $invoke(["$eventEmitterFactory"], function($eventEmitterFactory){
            expect($eventEmitterFactory.create).toBeDefined();
        });
    });

    describe("on", function(){
        it("should call callback for event", function(){
            eventEmitter.on("a", triggerHandler);
            eventEmitter.trigger("a");

            expect(triggered).toEqual(true);
        });

        it("should call multiple callbacks for same event", function(){
            var aTriggered = false;
            var bTriggered = false;

            function triggerAHandler() {
                triggerCount++;
                aTriggered = true;
            }

            function triggerBHandler() {
                triggerCount++;
                bTriggered = true;
            }

            eventEmitter.on("a", triggerAHandler);
            eventEmitter.on("a", triggerBHandler);
            eventEmitter.trigger("a");

            expect(aTriggered).toEqual(true);
            expect(bTriggered).toEqual(true);
            expect(triggerCount).toEqual(2);
        });

        it("should call callbacks for multiple events", function(){

        });

        it("should call same callback for multiple events", function(){

        });

        it("should allow multiple events for same callback to be specified at once", function(){

        });

        it("should call callback with context", function(){
            var that = this;

            function triggerHandler() {
                expect(this).toBe(that);
            }

            eventEmitter.on("a", triggerHandler, this);
            eventEmitter.trigger("a");
        });

        it("should call callback with arguments", function(){
            function triggerHandler(a, b) {
                expect(arguments.length).toEqual(2);
                expect(a).toEqual(1);
                expect(b).toEqual(2);

                triggered = true;
            }

            eventEmitter.on("a", triggerHandler);
            eventEmitter.trigger("a", 1, 2);

            expect(triggered).toBe(true);
        });

        it("should ignore duplicate callbacks", function(){
            eventEmitter.on("a", triggerHandler);
            eventEmitter.on("a", triggerHandler);
            eventEmitter.trigger("a");

            expect(triggerCount).toEqual(1);
        });

        it("should throw error for null event", function(){
            expect(function(){
                eventEmitter.on(null, function(){});
            }).toThrow(new Error("event must exist"));
        });

        it("should throw error for undefined event", function(){
            expect(function(){
                eventEmitter.on(null, function(){});
            }).toThrow(new Error("event must exist"));
        });

        it("should throw error for null callback", function(){
            expect(function(){
                eventEmitter.on("a", null);
            }).toThrow(new Error("callback must exist"));
        });

        it("should throw error for undefined callback", function(){
            expect(function(){
                eventEmitter.on("a", undefined);
            }).toThrow(new Error("callback must exist"));
        });
    });

    describe("once", function() {
        it("should call callback for event", function(){
            eventEmitter.once("a", triggerHandler);
            eventEmitter.trigger("a");

            expect(triggered).toEqual(true);
        });

        it("should call multiple callbacks for same event", function(){
            var aTriggered = false;
            var bTriggered = false;

            function triggerAHandler() {
                triggerCount++;
                aTriggered = true;
            }

            function triggerBHandler() {
                triggerCount++;
                bTriggered = true;
            }

            eventEmitter.once("a", triggerAHandler);
            eventEmitter.once("a", triggerBHandler);
            eventEmitter.trigger("a");

            expect(aTriggered).toEqual(true);
            expect(bTriggered).toEqual(true);
            expect(triggerCount).toEqual(2);
        });

        it("should call callbacks for multiple events", function(){

        });

        it("should call same callback for multiple events", function(){

        });

        it("should allow multiple events for same callback to be specified at once", function(){

        });

        it("should only call once", function(){
            eventEmitter.once("a", triggerHandler);
            eventEmitter.trigger("a");
            eventEmitter.trigger("a");

            expect(triggerCount).toEqual(1);
        });

        it("should call callback with context", function(){
            var that = this;

            function triggerHandler() {
                expect(this).toBe(that);
            }

            eventEmitter.once("a", triggerHandler, this);
            eventEmitter.trigger("a");
        });

        it("should call callback with arguments", function(){
            function triggerHandler(a, b) {
                expect(arguments.length).toEqual(2);
                expect(a).toEqual(1);
                expect(b).toEqual(2);

                triggered = true;
            }

            eventEmitter.once("a", triggerHandler);
            eventEmitter.trigger("a", 1, 2);

            expect(triggered).toBe(true);
        });

        it("should ignore duplicate callbacks", function(){
            function triggerHandler() {
                triggerCount++;
            }

            eventEmitter.once("a", triggerHandler);
            eventEmitter.once("a", triggerHandler);
            eventEmitter.trigger("a");

            expect(triggerCount).toEqual(1);
        });

        it("should throw error for null event", function(){
            expect(function(){
                eventEmitter.on(null, function(){});
            }).toThrow(new Error("event must exist"));
        });

        it("should throw error for undefined event", function(){
            expect(function(){
                eventEmitter.on(null, function(){});
            }).toThrow(new Error("event must exist"));
        });

        it("should throw error for null callback", function(){
            expect(function(){
                eventEmitter.on("a", null);
            }).toThrow(new Error("callback must exist"));
        });

        it("should throw error for undefined callback", function(){
            expect(function(){
                eventEmitter.on("a", undefined);
            }).toThrow(new Error("callback must exist"));
        });
    });

    describe("off", function(){
        it("should remove callback for an event", function(){
            eventEmitter.on("a", triggerHandler);
            eventEmitter.off("a", triggerHandler);
            eventEmitter.trigger("a");

            expect(triggered).toBe(false);
        });

        it("should remove all with same context for an event", function(){
            function triggerAHandler() {
                triggerCount++;
            }

            function triggerBHandler() {
                triggerCount++;
            }

            function triggerCHandler() {
                triggerCount++;
            }

            eventEmitter.on("a", triggerAHandler, this);
            eventEmitter.on("a", triggerBHandler, this);
            eventEmitter.on("a", triggerCHandler, {});
            eventEmitter.off("a", null, this);
            eventEmitter.trigger("a");

            expect(triggerCount).toEqual(1);
        });

        it("should remove all with same context for all events", function(){

        });

        it("should remove none if no callback or context", function(){

        });

        it("should remove all when no callback and context", function(){

        });
    });

    describe("trigger", function(){
        it("should throw error for null event", function(){
            expect(function(){
                eventEmitter.trigger(null);
            }).toThrow(new Error("event must exist"));
        });

        it("should throw error for undefined event", function(){
            expect(function(){
                eventEmitter.trigger(null);
            }).toThrow(new Error("event must exist"));
        });
    });

    it("should disable", function(){

    });

    it("should re-enable", function(){

    });

    it("should remove all callbacks", function(){

    });
});