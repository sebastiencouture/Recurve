/* global addStateRouterService,
 addStateConfigService,
 addStateConfigCollectionService,
 addStateService,
 addStateStoreService,
 addStateTransitionService,
 addStateComponentService,
 addStateLinkService,
 addStateMixinService,
 addStateNavigationMixinService,
 addStateScrollMixinService
 */

(function() {
    "use strict";

    recurve.flux.react = {};
    var module = recurve.flux.react.$module = recurve.module();

    addStateRouterService(module);
    addStateConfigService(module);
    addStateConfigCollectionService(module);
    addStateService(module);
    addStateStoreService(module);
    addStateTransitionService(module);
    addStateComponentService(module);
    addStateLinkService(module);
    addStateMixinService(module);
    addStateNavigationMixinService(module);
    addStateScrollMixinService(module);

    var moduleFactory = recurve.module;
    recurve.module = function() {
        var module = moduleFactory.apply(moduleFactory, arguments);

        module.component = function(name, dependencies, factory) {
            return module.factory(name, dependencies, function() {
                return React.createClass(factory.apply(null, arguments));
            });
        };
        module.mixin = module.factory;

        return module;
    };

    module.exports(["$stateRouter", "$stateStore", "$State", "$StateLink",
        "$stateMixin", "$stateNavigationMixin", "$stateScrollMixin"]);
})();