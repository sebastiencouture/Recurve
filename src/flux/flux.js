/* global addActionCreatorService,
 addDispatcherService,
 addDataStoreService,
 addRestActionCreatorService,
 addStateActionCreatorService
*/

(function() {
    "use strict";

    recurve.flux = {};
    var module = recurve.flux.$module = recurve.module();

    addActionCreatorService(module);
    addDispatcherService(module);
    addDataStoreService(module);
    addRestActionCreatorService(module);
    addStateActionCreatorService(module);
})();