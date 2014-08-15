"use strict";

var ObjectUtils = require("./object.js");

module.exports = {
    createElement: function(name, attributes) {
        var element = document.createElement(name);

        ObjectUtils.forEach(attributes, function(value, key) {
            element.setAttribute(key, value);
        });

        return element;
    },

    elementSupportsOnEvent: function(element, name) {
        return name in element;
    }
};