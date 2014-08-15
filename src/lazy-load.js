"use strict";

var DomUtils = require("./utils/dom.js");
var StringUtils = require("./utils/string.js");

module.exports = {
    js: function(url, onComplete, onError) {
        var element = DomUtils.createElement("link", {type: "text/css", rel: "stylesheet", href: url});
        load(element, onComplete, onError);
    },

    css: function(url, onComplete, onError) {
        var element = DomUtils.createElement("script", {type: "text/javascript", src: url});
        load(element, onComplete, onError);
    }
};

function load(element, onComplete, onError) {
    function readyStateHandler() {
        if (StringUtils.isEqualIgnoreCase("loaded", element.readyState) ||
            StringUtils.isEqualIgnoreCase("complete", element.readyState)) {
            loadedHandler();
        }
    }

    function loadedHandler() {
        clearCallbacks();
        onComplete();
    }

    function errorHandler(event) {
        clearCallbacks();
        onError(event);
    }

    function clearCallbacks() {
        element.onload = null;
        element.onreadystatechange = null;
        element.onerror = null;
    }

    // Maintain execution order
    // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    // http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
    element.async = false;
    element.defer = false;

    // http://pieisgood.org/test/script-link-events/
    // TODO TBD link tags don't support any type of load callback on old WebKit (Safari 5)
    // TODO TBD if not going to support IE8 then don't need to worry about onreadystatechange
    if (DomUtils.elementSupportsOnEvent(element, "onreadystatechange")) {
        element.onreadystatechange = readyStateHandler
    }
    else {
        element.onload = loadedHandler;
    }

    element.onerror = errorHandler;

    document.head.appendChild(element);
}