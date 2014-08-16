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
        // TODO TBD if not going to support IE8 then don't need to worry about onreadystatechange
        function readyStateHandler() {
            if (StringUtils.isEqualIgnoreCase("loaded", element.readyState) ||
                StringUtils.isEqualIgnoreCase("complete", element.readyState)) {
                callback({type: "load"});
            }
        }

        if ("load" === event &&
            this.elementSupportsOnEvent(element, "onreadystatechange")) {
            element.onreadystatechange = readyStateHandler;
        }
        else {
            element.addEventListener(event, callback);
        }
    },

    removeEventListener: function(element, event, callback) {
        if ("load" === event &&
            this.elementSupportsOnEvent(element, "onreadystatechange")) {
            element.onreadystatechange = null;
        }
        else {
            element.removeEventListener(event, callback);
        }
    },

    elementSupportsOnEvent: function(element, name) {
        return name in element;
    }
};