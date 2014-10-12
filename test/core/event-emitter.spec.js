"use strict";

describe("$eventEmitter", function(){
    var eventEmitter;
    var triggered;
    var triggerCount;

    function triggerHandler() {
        triggered = true;
        triggerCount++;
    }

    beforeEach(function() {
        $invoke(["$eventEmitter"], function($eventEmitter){
            eventEmitter = $eventEmitter();
        });

        triggered = false;
        triggerCount = 0;
    });

    it("should be invokable", function(){
        $invoke(["$eventEmitter"], function($eventEmitter){
            expect($eventEmitter).toBeDefined();
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
            eventEmitter.on("b", triggerBHandler);

            eventEmitter.trigger("a");
            expect(aTriggered).toEqual(true);
            expect(triggerCount).toEqual(1);

            triggerCount = 0;
            eventEmitter.trigger("b");
            expect(bTriggered).toEqual(true);
            expect(triggerCount).toEqual(1);
        });

        it("should call same callback for multiple events", function(){
            eventEmitter.on("a", triggerHandler);
            eventEmitter.on("b", triggerHandler);

            eventEmitter.trigger("a");
            eventEmitter.trigger("b");

            expect(triggerCount).toEqual(2);
        });

        it("should allow multiple events for same callback to be specified at once", function(){
            eventEmitter.on("a b c", triggerHandler);

            eventEmitter.trigger("a");
            expect(triggerCount).toEqual(1);

            eventEmitter.trigger("b");
            expect(triggerCount).toEqual(2);

            eventEmitter.trigger("c");
            expect(triggerCount).toEqual(3);
        });

        it("should call callback with context", function(){
            var that = this;

            function triggerHandler() {
                /*jshint validthis:true */
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

    // TODO TBD repeated "on" tests
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
            eventEmitter.once("b", triggerBHandler);

            eventEmitter.trigger("a");
            expect(aTriggered).toEqual(true);
            expect(triggerCount).toEqual(1);

            triggerCount = 0;
            eventEmitter.trigger("b");
            expect(bTriggered).toEqual(true);
            expect(triggerCount).toEqual(1);
        });

        it("should call same callback for multiple events", function(){
            eventEmitter.once("a", triggerHandler);
            eventEmitter.once("b", triggerHandler);

            eventEmitter.trigger("a");
            eventEmitter.trigger("b");

            expect(triggerCount).toEqual(2);
        });

        it("should allow multiple events for same callback to be specified at once", function(){
            eventEmitter.once("a b c", triggerHandler);

            eventEmitter.trigger("a");
            expect(triggerCount).toEqual(1);

            eventEmitter.trigger("b");
            expect(triggerCount).toEqual(2);

            eventEmitter.trigger("c");
            expect(triggerCount).toEqual(3);
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
                /*jshint validthis:true */
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
        function triggerAHandler() {
            triggerCount++;
        }

        function triggerBHandler() {
            triggerCount++;
        }

        function triggerCHandler() {
            triggerCount++;
        }

        it("should remove callback for an event", function(){
            eventEmitter.on("a", triggerHandler);
            eventEmitter.off("a", triggerHandler);
            eventEmitter.trigger("a");

            expect(triggered).toEqual(false);
        });

        it("should not remove other callbacks for other events", function(){
            eventEmitter.on("a", triggerHandler);
            eventEmitter.on("b", triggerHandler);
            eventEmitter.off("a", triggerHandler);
            eventEmitter.trigger("a");
            eventEmitter.trigger("b");

            expect(triggerCount).toEqual(1);
        });

        it("should remove all with same context for an event", function(){
            eventEmitter.on("a", triggerAHandler, this);
            eventEmitter.on("a", triggerBHandler, this);
            eventEmitter.on("a", triggerCHandler, {});
            eventEmitter.off("a", null, this);
            eventEmitter.trigger("a");

            expect(triggerCount).toEqual(1);
        });

        it("should remove all with same context for all events", function(){
            eventEmitter.on("a", triggerAHandler, this);
            eventEmitter.on("b", triggerBHandler, this);
            eventEmitter.on("c", triggerCHandler, {});
            eventEmitter.off(null, null, this);
            eventEmitter.trigger("a");
            eventEmitter.trigger("b");
            eventEmitter.trigger("c");

            expect(triggerCount).toEqual(1);
        });

        it("should remove all for undefined event, callback and context", function(){
            eventEmitter.on("a", triggerHandler, this);
            eventEmitter.on("b", triggerHandler, {});
            eventEmitter.off();
            eventEmitter.trigger("a");

            expect(triggered).toEqual(false);
        });

        it("should remove all for null event, callback and context", function(){
            eventEmitter.on("a", triggerHandler, this);
            eventEmitter.on("b", triggerHandler, {});
            eventEmitter.off(null, null, null);
            eventEmitter.trigger("a");

            expect(triggered).toEqual(false);
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
                eventEmitter.trigger(undefined);
            }).toThrow(new Error("event must exist"));
        });
    });

    describe("clear", function(){
        it("should remove all callbacks", function(){
            eventEmitter.on("a", triggerHandler, this);
            eventEmitter.on("b", triggerHandler, {});
            eventEmitter.clear();
            eventEmitter.trigger("a");
            eventEmitter.trigger("b");

            expect(triggered).toEqual(false);
        });
    });

    it("should disable", function(){
        eventEmitter.on("a", triggerHandler, this);
        eventEmitter.disable();
        eventEmitter.trigger("a");

        expect(triggered).toEqual(false);
    });

    it("should re-enable", function(){
        eventEmitter.on("a", triggerHandler, this);
        eventEmitter.disable();
        eventEmitter.trigger("a");
        eventEmitter.disable(false);
        eventEmitter.trigger("a");

        expect(triggerCount).toEqual(1);
    });
});