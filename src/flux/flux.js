/* global addActionService,
 addActionGroupService,
 addStoreService
*/

(function() {
    "use strict";

    recurve.flux = {};
    var module = recurve.flux.$module = recurve.module();

    addActionService(module);
    addActionGroupService(module);
    addStoreService(module);

    var moduleFactory = recurve.module;
    recurve.module = function() {
        var module = moduleFactory.apply(moduleFactory, arguments);

        module.store = module.factory;
        module.action = module.factory;

        return module;
    };
})();