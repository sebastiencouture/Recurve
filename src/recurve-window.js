/*(function() {
    "use strict";

    var Recurve = window.Recurve = window.Recurve || {};

    Recurve.WindowUtils =
    {
        isFileProtocol: function() {
            return "file:" === window.location.protocol;
        },

        globalEval: function(src) {
            if (!src) {
                return;
            }

            // https://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
            if (window.execScript) {
                window.execScript(src);
            }

            var func = function() {
                window.eval.call(window.src);
            };

            func();
        }
    };
})(); */

"use strict";

module.exports  = {
    isFileProtocol: function() {
        return "file:" === window.location.protocol;
    },

    globalEval: function(src) {
        if (!src) {
            return;
        }

        // https://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        if (window.execScript) {
            window.execScript(src);
        }

        var func = function() {
            window.eval.call(window.src);
        };

        func();
    }
}