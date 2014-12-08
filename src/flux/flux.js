/* global addActionService,
 addActionGroupService,
 addDataStoreService
*/

(function() {
    "use strict";

    // flux => includes just core of action, action-group and data-store
    // flux-rest?
    // flux-state?
    // app module? dependencies on flux, flux-state, and reactjs... sets up some boilerplate start up +
    // initialization functionality... only implement after create some demos
    // reactjs module with some helpers?

    recurve.flux = {};
    var module = recurve.flux.$module = recurve.module();

    addActionService(module);
    addActionGroupService(module);
    addDataStoreService(module);
})();