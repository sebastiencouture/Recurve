"use strict";

function addDispatcherService(module) {
    module.factory("$dispatcher", null, function() {
        var actionDispatchers = [];

        function getActionDispatcher(id) {
            var found;
            recurve.forEach(actionDispatchers, function(actionDispatcher) {
                if(actionDispatcher.id === id) {
                    found = actionDispatcher;
                    return false;
                }
            });

            return found;
        }

        function getCurrentDispatching() {
            var found;
            recurve.forEach(actionDispatchers, function(actionDispatcher) {
                if(actionDispatcher.dispatchingAction) {
                    found = actionDispatcher;
                    return false;
                }
            });

            return found;
        }

        var actionDispatcherPrototype = {
            init: function(id, context) {
                this.id = id;
                this.context = context;
            },

            add: function(callback) {
                this.handlers.push(Object.create(actionHandlerPrototype).init(callback));
            },

            trigger: function(action) {
                this.dispatchingAction = action;

                recurve.forEach(this.handlers, function(handler) {
                    if (!handler.triggered) {
                        handler.trigger(action);
                    }
                });

                recurve.forEach(this.handlers, function(handler) {
                    handler.triggered = false;
                });

                this.dispatchingAction = undefined;
            },

            waitOn: function(contexts) {
                // TODO TBD improve message: context1 -> context2 -> context1
                recurve.assert(!this.waiting, "wait on circular reference detected for {0}", this.id);

                this.waiting = true;

                recurve.forEach(contexts, function(context) {
                    recurve.assert(this.context !== context, "cannot wait on same context for {0}", this.id);
                    recurve.forEach(this.handlers, function(handler) {
                        if (context === handler.context && !handler.triggered) {
                            handler.trigger(this.dispatchingAction);
                        }
                    }, this);
                }, this);

                this.waiting = false;
            }
        };

        var actionHandlerPrototype = {
            init: function(callback) {
                this.callback = callback;
            },

            trigger: function(action) {
                this.triggered = true;
                this.callback.call(null, action);
            }
        };

        return {
            trigger: function(action) {
                var actionDispatcher = getActionDispatcher(action.id);
                if (actionDispatcher) {
                    actionDispatcher.trigger(action);
                }
            },

            on: function(actionId, callback, context) {
                var actionDispatcher = getActionDispatcher(actionId);
                if (!actionDispatcher) {
                    actionDispatcher = Object.create(actionDispatcherPrototype).init(actionId, context);
                }

                actionDispatcher.add(callback);
            },

            waitOn: function(contexts) {
                var actionDispatcher = getCurrentDispatching();
                recurve.assert(actionDispatcher, "no action is currently being dispatched to wait on");

                actionDispatcher.waitOn(contexts);
            }
        };
    });
}