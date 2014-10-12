"use strict";

describe("$signal", function(){
    var signal;
    var triggered;
    var triggerCount;

    function triggerHandler() {
        triggered = true;
        triggerCount++;
    }

    beforeEach(function() {
        $invoke(["$signal"], function($signal){
            signal = $signal();
        });

        triggered = false;
        triggerCount = 0;
    });

    it("should be invokable", function(){
        $invoke(["$signal"], function($signal){
            expect($signal).toBeDefined();
        });
    });

    describe("on", function(){
        it("should call callback", function(){
            signal.on(triggerHandler);
            signal.trigger();

            expect(triggered).toEqual(true);
        });

        it("should call multiple callbacks", function(){
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

            signal.on(triggerAHandler);
            signal.on(triggerBHandler);
            signal.trigger();

            expect(aTriggered).toEqual(true);
            expect(bTriggered).toEqual(true);
            expect(triggerCount).toEqual(2);
        });

        it("should call callback with context", function(){
            var that = this;

            function triggerHandler() {
                /*jshint validthis:true */
                expect(this).toBe(that);
            }

            signal.on(triggerHandler, this);
            signal.trigger();
        });

        it("should call callback with arguments", function(){
            function triggerHandler(a, b) {
                expect(arguments.length).toEqual(2);
                expect(a).toEqual(1);
                expect(b).toEqual(2);

                triggered = true;
            }

            signal.on(triggerHandler);
            signal.trigger(1, 2);

            expect(triggered).toBe(true);
        });

        it("should ignore duplicate callbacks", function(){
            signal.on(triggerHandler);
            signal.on(triggerHandler);
            signal.trigger("a");

            expect(triggerCount).toEqual(1);
        });

        it("should throw error for null callback", function(){
            expect(function(){
                signal.on(null);
            }).toThrow(new Error("callback must exist"));
        });

        it("should throw error for undefined callback", function(){
            expect(function(){
                signal.on(undefined);
            }).toThrow(new Error("callback must exist"));
        });
    });

    describe("once", function(){
        it("should call callback", function(){
            signal.once(triggerHandler);
            signal.trigger();

            expect(triggered).toEqual(true);
        });

        it("should call multiple callbacks", function(){
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

            signal.once(triggerAHandler);
            signal.once(triggerBHandler);
            signal.trigger();

            expect(aTriggered).toEqual(true);
            expect(bTriggered).toEqual(true);
            expect(triggerCount).toEqual(2);
        });

        it("should only call once", function(){
            signal.once(triggerHandler);
            signal.trigger();
            signal.trigger();

            expect(triggerCount).toEqual(1);
        });

        it("should call callback with context", function(){
            var that = this;

            function triggerHandler() {
                /*jshint validthis:true */
                expect(this).toBe(that);
            }

            signal.once(triggerHandler, this);
            signal.trigger();
        });

        it("should call callback with arguments", function(){
            function triggerHandler(a, b) {
                expect(arguments.length).toEqual(2);
                expect(a).toEqual(1);
                expect(b).toEqual(2);

                triggered = true;
            }

            signal.once(triggerHandler);
            signal.trigger(1, 2);

            expect(triggered).toBe(true);
        });

        it("should ignore duplicate callbacks", function(){
            signal.once(triggerHandler);
            signal.once(triggerHandler);
            signal.trigger("a");

            expect(triggerCount).toEqual(1);
        });

        it("should throw error for null callback", function(){
            expect(function(){
                signal.once(null);
            }).toThrow(new Error("callback must exist"));
        });

        it("should throw error for undefined callback", function(){
            expect(function(){
                signal.once(undefined);
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

        it("should remove callback", function(){
            signal.on(triggerAHandler);
            signal.on(triggerBHandler);
            signal.off(triggerAHandler);
            signal.trigger();

            expect(triggerCount).toEqual(1);
        });

        it("should remove all with same context", function(){
            signal.on(triggerAHandler, this);
            signal.on(triggerBHandler, this);
            signal.on(triggerCHandler, {});
            signal.off(null, this);
            signal.trigger();

            expect(triggerCount).toEqual(1);
        });

        it("should remove all for undefined callback and context", function(){
            signal.on(triggerHandler, this);
            signal.on(triggerHandler, {});
            signal.off();
            signal.trigger();

            expect(triggered).toEqual(false);
        });

        it("should remove all for null callback and context", function(){
            signal.on(triggerHandler, this);
            signal.on(triggerHandler, {});
            signal.off(null, null);
            signal.trigger();

            expect(triggered).toEqual(false);
        });
    });

    describe("clear", function(){
        it("should remove all callbacks", function(){
            signal.on(triggerHandler, this);
            signal.on(triggerHandler, {});
            signal.clear();
            signal.trigger("a");

            expect(triggered).toEqual(false);
        });
    });

    it("should disable", function(){
        signal.on("a", triggerHandler, this);
        signal.disable();
        signal.trigger();

        expect(triggered).toEqual(false);
    });

    it("should re-enable", function(){
        signal.on(triggerHandler, this);
        signal.disable();
        signal.trigger();
        signal.disable(false);
        signal.trigger();

        expect(triggerCount).toEqual(1);
    });
});