"use strict";

docsModule.factory("stateDataStore", ["$dataStore", "$state"], function($dataStore, $state) {
    var dataStore = $dataStore();
    var current = {name: "loading"};

    $state.changeAction.on(function(name, params, data) {
        current = {
            name: name,
            params: params,
            data: data
        };
        dataStore.changed.trigger();
    });

    $state.errorAction.on(function(details, name, params) {
        current = {
            name: "error",
            details: details,
            params: params
        };
        dataStore.changed.trigger();
    });

    return recurve.extend(dataStore, {
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