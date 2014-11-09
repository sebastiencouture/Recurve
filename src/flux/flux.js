/* global addActionService,
 addDataStoreService,
 addRestActionEmitterService,
 addStateActionEmitterService
*/

(function() {
    "use strict";

    recurve.flux = {};
    var module = recurve.flux.$module = recurve.module();

    addActionService(module);
    addDataStoreService(module);
    addRestActionEmitterService(module);
    addStateActionEmitterService(module);
})();