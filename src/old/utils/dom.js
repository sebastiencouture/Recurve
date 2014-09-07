"use strict";

var ObjectUtils = require("./object.js");
var StringUtils = require("./string.js");

module.exports = {
    createElement: function(name, attributes) {
        var element = document.createElement(name);

        ObjectUtils.forEach(attributes, function(value, key) {
            element.setAttribute(key, value);
        });

        return element;
    },

    addEventListener: function(element, event, callback) {
        // http://pieisgood.org/test/script-link-events/
        // TODO TBD link tags don't support any type of load callback on old WebKit (Safari 5)
        function readyStateHandler() {
            if (StringUtils.isEqualIgnoreCase("loaded", element.readyState) ||
                StringUtils.isEqualIgnoreCase("complete", element.readyState)) {
                callback({type: "load"});
            }
        }

        // IE8 :T
        if ("load" === event &&
            elementSupportsEvent(element, "onreadystatechange")) {
            element.onreadystatechange = readyStateHandler;
        }
        else {
            element.addEventListener(event, callback);
        }
    },

    removeEventListener: function(element, event, callback) {
        if ("load" === event &&
            elementSupportsEvent(element, "onreadystatechange")) {
            element.onreadystatechange = null;
        }
        else {
            element.removeEventListener(event, callback);
        }
    }
};

function elementSupportsEvent(element, name) {
    return name in element;
}