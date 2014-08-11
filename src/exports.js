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
    Recurve.Cache = require("./recurve-cache.js");
    Recurve.Log = require("./recurve-log.js");
    Recurve.LogConsoleTarget = require("./recurve-log-console.js");
    Recurve.Signal = require("./recurve-signal.js");
    Recurve.Http = require("./recurve-http.js");
    Recurve.GlobalErrorHandler = require("./recurve-global-error-handler.js");
    Recurve.LocalStorage = require("./recurve-local-storage.js");
    Recurve.SessionStorage = require("./recurve-session-storage.js");
    Recurve.PerformanceMonitor = require("./recurve-performance-monitor.js");
    Recurve.LazyLoad = require("./recurve-lazy-load.js");

    window.Recurve = Recurve;
})();