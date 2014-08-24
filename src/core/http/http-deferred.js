"use strict";

var Proto = require("../../utils/proto.js");

var Signal = require("../signal.js");

module.exports = Proto.define([
    function ctor() {
        this._succeeded = new Signal();
        this._errored = new Signal();
    },

    {
        resolve: function(response) {
            this._succeeded.trigger(response);
            this._cleanUp();
        },

        reject: function(response) {
            this._errored.trigger(response);
            this._cleanUp();
        },

        promise: {
            then: function(onSuccess, onError) {
                this._succeeded.addOnce(onSuccess);
                this._errored.addOnce(onError);
            },

            success: function(onSuccess) {
                this._succeeded.addOnce(function(response) {
                    onSuccess(response.data, response.status, response.statusText,
                        response.headers, response.options, response.canceled);
                });
            },

            error: function(onError) {
                this._errored.addOnce(function(response) {
                    onError(response.data, response.status, response.statusText,
                        response.headers, response.options, response.canceled);
                });

            },

            cancel: function() {
                this.request && this.request.cancel();
            }
        },

        _cleanUp: function() {
            this._succeeded.removeAll();
            this._succeeded = null;

            this._errored.removeAll();
            this._errored = null;
        }
    }
]);