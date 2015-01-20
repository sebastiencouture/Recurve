"use strict";

docsModule.factory("utils", ["$action"], function($action) {
    return {
        createActions: function(names) {
            var actions = {};
            recurve.forEach(names, function(name) {
                actions[name] = $action();
            });

            return actions;
        }
    };
});