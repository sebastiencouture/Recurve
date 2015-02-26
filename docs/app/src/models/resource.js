"use strict";

docsModule.factory("resource", null, function() {
    return function(data) {
        function findFirst(type) {
            return recurve.find(data, "rdoc", type);
        }

        function findAll(type) {
            var matches = [];
            recurve.forEach(data, function(comment) {
                if (type === comment.rdoc) {
                    matches.push(comment);
                }
            });

            return matches;
        }

        return {
            getModule: function() {
                return findFirst("module");
            },

            getService: function() {
                return findFirst("service");
            },

            getMethods: function() {
                return findAll("method");
            },

            getMethodByName: function(name) {
                return recurve.find(this.getMethods(), "name", name);
            },

            getObjects: function() {
                return findAll("object");
            },

            getObjectByName: function(name) {
                return recurve.find(this.getObjects(), "name", name);
            },

            getProperties: function() {
                return findAll("property");
            },

            getConfigs: function() {
                return findAll("config");
            }
        };
    }
});