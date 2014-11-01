(function() {
    "use strict";

    recurve.flux = {};
    var module = recurve.flux.$module = recurve.module();

    addActionCreatorService(module);
    addDispatcherService(module);
    addDataStoreService(module);
})();