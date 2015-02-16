"use strict";

function addStateComponentService(module) {
    module.factory("$State", ["$stateStore", "$stateMixin"], function($stateStore, $stateMixin) {

        return React.createClass({
            displayName: "$State",

            mixins: [$stateMixin],

            getChildContext: function() {
                return this.createChildContext(this.context.$depth);
            },

            render: function() {
                return this.renderComponent(this.context.$state, this.context.$depth);
            }
        });
    });
}