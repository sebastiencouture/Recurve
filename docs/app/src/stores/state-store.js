"use strict";

docsModule.factory("stateStore", ["$store", "$state"], function($store, $state) {
    var store = $store();
    var current = {name: "loading"};

    store.onAction($state.changeAction, function(name, params, data) {
        current = {
            name: name,
            params: params,
            data: data
        };
        store.changed.trigger();
    });

    store.onAction($state.errorAction, function(details, name, params) {
        current = {
            name: "error",
            details: details,
            params: params
        };
        store.changed.trigger();
    });

    return recurve.extend(store, {
        getCurrent: function() {
            return current;
        },

        isLoading: function() {
            return "loading" === current.name;
        },

        isError: function() {
            return "error" === current.name;
        },

        isApi: function() {
            return "api" === current.name || "apiModule" === current.name ||
                "apiModuleType" === current.name || "apiModuleResource" === current.name;
        },

        isTutorial: function() {
            return "tutorial" === current.name || "tutorialStep" === current.name;
        },

        isGuide: function() {
            return "guide" === current.name || "guideStep" === current.name;
        }
    });
});