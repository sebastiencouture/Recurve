"use strict";

docsModule.factory("stateDataStore", ["$dataStore", "$state"], function($dataStore, $state) {
    var dataStore = $dataStore();
    var current = null;
    var error = null;

    $state.changeAction.on(function(name, params, data) {
        error = null;
        current = {
            name: name,
            params: params,
            data: data
        };
        dataStore.changed.trigger();
    });

    $state.errorAction.on(function(message, name, params) {
        error = {
            name: name,
            message: message,
            params: params
        };
        dataStore.changed.trigger();
    });

    return recurve.extend(dataStore, {
        getCurrent: function() {
            return current;
        },

        getError: function() {
            return error;
        },

        isLoading: function() {
            return null === current;
        },

        isCurrentApi: function() {
            if (!current) {
                return false;
            }

            return "api" === current.name || "apiModule" === current.name ||
                "apiModuleType" === current.name || "apiModuleResource" === current.name;
        },

        isCurrentTutorial: function() {
            if (!current) {
                return false;
            }

            return "tutorial" === current.name || "tutorialStep" === current.name;
        },

        isCurrentGuide: function() {
            if (!current) {
                return false;
            }

            return "guide" === current.name || "guideStep" === current.name;
        }
    });
});