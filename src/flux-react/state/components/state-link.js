"use strict";

function addStateLinkComponentService(module) {
    module.factory("$StateLink", ["$stateRouter"], function($stateRouter) {

        function ignoreClick(event) {
            return isLeftClick(event) || isModifiedClick(event);
        }

        function isLeftClick(event) {
            return event.button === 0;
        }

        function isModifiedClick(event) {
            return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
        }

        return React.createClass({
            displayName: "$StateLink",

            propTypes: {
                to: React.PropTypes.string.isRequired,
                params: React.PropTypes.object,
                onClick: React.PropTypes.func
            },

            render: function() {
                var props = recurve.extend({}, this.props);
                recurve.extend(props, {
                    href: $stateRouter.nameToHref(this.props.to, this.props.params),
                    onClick: this._clickHandler
                });

                return React.createElement("a", props, this.props.children);
            },

            _clickHandler: function(event) {
                var result;
                if (this.props.onClick) {
                    result = this.props.onClick(event);
                }

                if (ignoreClick(event)) {
                    return;
                }

                var ignore = false;
                if (false === result || event.defaultPrevented) {
                    ignore = true;
                }

                event.stopPropagation();
                event.preventDefault();

                if (!ignore) {
                    $stateRouter.navigate(this.props.to, this.props.params);
                }
            }
        });
    });
}