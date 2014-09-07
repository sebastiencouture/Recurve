"use strict";

// TODO TBD move to service
module.exports  = {
    globalEval: function($window, src) {
        if (!src) {
            return;
        }

        // https://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        if ($window.execScript) {
            $window.execScript(src);
        }

        var func = function() {
            $window.eval.call($window.src);
        };

        func();
    }
}