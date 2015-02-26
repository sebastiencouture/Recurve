"use strict";

docsModule.factory("utils", ["$action"], function($action) {
    return {
        createActions: function(names) {
            var actions = {};
            recurve.forEach(names, function(name) {
                actions[name] = $action();
            });

            return actions;
        },

        capitalizeFirstCharacter: function(value) {
            if (!recurve.isString(value) || 0 === value.length) {
                return value;
            }

            return value.charAt(0).toUpperCase() + value.slice(1);
        },

        join: function(array, separator) {
            if (!array) {
                return array;
            }

            if (recurve.isUndefined(separator)) {
                separator = "|";
            }

            return array.join(separator);
        },

        methodNameWithParams: function (method) {
            var params = "";
            if (method.params) {
                params = method.params.map(function(param) {
                    return param.name;
                }).join(", ");
            }

            return method.name + "(" + params + ")";
        }
    };
});