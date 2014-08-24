"use strict";

var Proto = require("../utils/proto.js");
var ArrayUtils = require("../utils/array.js");
var ObjectUtils = require("../utils/object.js");
var assert = require("../utils/assert.js");

// TODO TBD should be a service
var Signal = require("../signal.js");

module.exports = Proto.define([
    function ctor() {
        this._signals = {};
    },

    {
        on: function(event, callback, context) {
            assert(callback, "callback must exist");

            var signal = this._createSignal(event);
            signal.add(callback, context);
        },

        once: function(event, callback, context) {
            assert(callback, "callback must exist");

            var signal = this._createSignal(event);
            signal.addOnce(callback, context);
        },

        off: function(event, callback, context) {
            if (event) {
                if (!callback && !context) {
                    delete this._signals[event];
                }
                else {
                    var signal = this._getSignal(event);
                    if (signal) {
                        signal.remove(callback, context);
                    }
                }
            }
            else {
                if (!callback && !context) {
                    this._signals = {};
                }
                else {
                    ObjectUtils.forEach(this._signals, function(signal) {
                        signal.remove(callback, context);
                    });
                }
            }
        },

        trigger: function(event) {
            if (this._disabled) {
                return;
            }

            var signal = this._getSignal(event);
            if (signal) {
                var args = ArrayUtils.argumentsToArray(arguments, 1);
                signal.trigger.apply(signal, args);
            }
        },

        offAll: function() {
            this.off();
        },

        disable: function(value) {
            if (undefined === value) {
                value = true;
            }

            this._disabled = value;
        },

        _createSignal: function(event) {
            var signal = this._getSignal(event);
            if (!signal) {
                signal = new Signal();
                this._signals[event] = signal;
            }

            return signal;
        },

        _getSignal: function(event) {
            return this._signals[event];
        }
    }
]);