/**
 *  Created by Sebastien Couture on 2014-7-11.
 *  Copyright (c) 2014 Sebastien Couture. All rights reserved.
 *
 *  Permission is hereby granted, free of charge, to any person
 *  obtaining a copy of this software and associated documentation
 *  files (the "Software"), to deal in the Software without
 *  restriction, including without limitation the rights to use,
 *  copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *  OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
    "use strict";

    var Signal = Recurve.Signal;

    QUnit.test("add - no arguments", function(assert) {
        var signal = new Signal();
        var triggered;

        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.trigger();

        assert.ok(triggered, "should triggered");
    });

    QUnit.test("add - with arguments", function(assert) {
        var signal = new Signal();
        var triggered;

        function onTrigger(name, location) {
            assert.equal(arguments.length, 2, "2 arguments");
            assert.equal(name, "Sebastien", "same name");
            assert.equal(location, "New Westminster","same address");

            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.trigger("Sebastien", "New Westminster");

        assert.ok(triggered, "should triggered");
    });

    QUnit.test("add - once", function(assert) {
        var signal = new Signal();
        var triggerCount = 0;

        function onTrigger() {
            triggerCount++;
        }

        signal.addOnce(onTrigger, this);
        signal.trigger();
        signal.trigger();

        assert.equal(1, triggerCount, "one should be triggered");
    });

    QUnit.test("add - multiple", function(assert) {
        var signal = new Signal();

        var triggerCount = 0;
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

        assert.ok(firstTriggered, "first should be triggered");
        assert.ok(secondTriggered, "second should be triggered");
        assert.equal(2, triggerCount, "two should be triggered");
    });

    QUnit.test("add - no callback", function(assert) {
        var signal = new Signal();
        var triggered;

        function onTrigger() {
            triggered = true;
        }

        signal.add(null, this);
        signal.trigger();

        assert.ok(!triggered, "none should be triggered");
    });

    QUnit.test("remove", function(assert) {
        var signal = new Signal();
        var triggered;

        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.remove(onTrigger);
        signal.trigger();

        assert.ok(!triggered, "none should triggered");
    });


    QUnit.test("remove - all", function(assert) {
        var signal = new Signal();
        var triggerCount = 0;

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

        assert.equal(0, triggerCount, "none should be triggered");
    });

    QUnit.test("remove - only second", function(assert) {
        var signal = new Signal();
        var triggerCount = 0;

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

        assert.equal(1, triggerCount, "one should be triggered");
    });

    QUnit.test("remove - no callback", function(assert) {
        var signal = new Signal();
        var triggered;

        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.remove();
        signal.trigger();

        assert.ok(triggered, "should be triggered");
    });

    QUnit.test("disable", function(assert) {
        var signal = new Signal();
        var triggered;

        function onTrigger() {
            triggered = true;
        }

        signal.add(onTrigger, this);
        signal.disable();
        signal.trigger();

        assert.ok(!triggered, "none should triggered");
    });

    QUnit.test("context", function(assert) {
        var signal = new Signal();
        var that = this;

        function onTrigger() {
            assert.equal(this, that, "contexts should be equal")
        }

        signal.add(onTrigger, this);
        signal.trigger();
    });
})();