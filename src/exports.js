(function(){
    "use strict";

    var Recurve = window.Recurve || {};

    Recurve.StringUtils = require("./recurve-string.js");
    Recurve.WindowUtils = require("./recurve-window.js");
    Recurve.ArrayUtils = require("./recurve-array.js");
    Recurve.DateUtils = require("./recurve-date.js");
    Recurve.ObjectUtils = require("./recurve-object.js");

    Recurve.assert = require("./recurve-assert.js");

    Recurve.Proto = require("./recurve-proto.js");
    Recurve.Log = require("./recurve-log.js");
    Recurve.LogConsoleTarget = require("./recurve-log-console.js");
    Recurve.Signal = require("./recurve-signal.js");
    Recurve.Http = require("./recurve-http.js");
    Recurve.GlobalErrorHandler = require("./recurve-global-error-handler.js");

    window.Recurve = Recurve;
})();