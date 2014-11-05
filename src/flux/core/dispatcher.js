"use strict";

function addDispatcherService(module) {
    module.factory("$dispatcher", null, function() {
        var handlers = {};
        var nextToken = 1;
        var currentDispatchingToken;
        var currentPayload;

        var handlerPrototype = {
            init: function(callback) {
                this.callback = callback;
                this.token = nextToken++;

                return this;
            },

            dispatch: function() {
                if (this.dispatched) {
                    return;
                }

                currentDispatchingToken = this;
                this.callback.call(null, currentPayload);
                this.dispatched = true;
            },

            reset: function() {
                this.dispatched = false;
            }
        };

        return {
            register: function(callback) {
                recurve.assert(recurve.isFunction(callback), "callback must exist");

                var handler = Object.create(handlerPrototype).init(callback);
                handlers[handler.token] = handler;

                return handler.token;
            },

            unregister: function(token) {
                recurve.assert(token, "token must exist");
                recurve.assert(handlers[token], "no registered callback exists for '{0}' token", token);

                delete handlers[token];
            },

            dispatch: function(payload) {
                recurve.assert(!currentDispatchingToken, "cannot dispatch while in the middle of a dispatch");

                currentPayload = payload;

                try {
                    recurve.forEach(handlers, function(handler) {
                        handler.dispatch(payload);
                    });
                }
                finally {
                    recurve.forEach(handlers, function(handler) {
                        handler.reset();
                    });

                    currentDispatchingToken = undefined;
                    currentPayload = undefined;
                }
            },

            waitFor: function(tokens) {
                recurve.assert(currentDispatchingToken, "can only wait while in the middle of a dispatch");

                recurve.forEach(tokens, function(token) {
                    recurve.assert(token !== currentDispatchingToken,
                        "circular dependency detected while waiting for '{0}'", token);

                    var handler = handlers[token];
                    recurve.assert(handler, "no registered callback exists for '{0}' token", token);

                    handler.dispatch();
                });
            }
        };
    });
}