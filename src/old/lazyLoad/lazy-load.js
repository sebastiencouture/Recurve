(function(){
    "use strict";

    var DomUtils = require("../utils/dom.js");

    var lazyLoadModule = recurve.createModule("rcLazyLoad");
    
    lazyLoadModule.value("$lazyLoad", {
        js: function(url, onComplete, onError) {
            var element = DomUtils.createElement("link", {type: "text/css", rel: "stylesheet", href: url});
            load(element, onComplete, onError);
        },

        css: function(url, onComplete, onError) {
            var element = DomUtils.createElement("script", {type: "text/javascript", src: url});
            load(element, onComplete, onError);
        }
    });

    function load(element, onComplete, onError) {
        function loadedHandler() {
            cleanup();
            onComplete();
        }

        function errorHandler(event) {
            cleanup();
            onError(event);
        }

        function cleanup() {
            DomUtils.removeEventListener(element, "load", loadedHandler);
            DomUtils.removeEventListener(element, "error", errorHandler);
        }

        // Maintain execution order
        // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
        // http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
        element.async = false;
        element.defer = false;

        DomUtils.addEventListener(element, "load", loadedHandler);
        DomUtils.addEventListener(element, "error", errorHandler);

        document.head.appendChild(element);
    }
})();