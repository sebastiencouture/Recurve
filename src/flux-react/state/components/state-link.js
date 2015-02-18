"use strict";

function addStateLinkComponentService(module) {
    module.factory("$StateLink", ["$stateRouter", "$stateStore"], function($stateRouter, $stateStore) {

        function ignoreClickEvent(event) {
            return isLeftClickEvent(event) || isModifierClickEvent(event);
        }

        function isLeftClickEvent(event) {
            return event.button === 0;
        }

        function isModifierClickEvent(event) {
            return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
        }

        function getClassName(props) {
            var className = "";
            if (props.className) {
                className += props.className;
            }
            if (isActive(props.to)) {
                className += " " + props.activeClassName;
            }

            return className;
        }

        function isActive(stateName) {
            return $stateStore.getName() === stateName;
        }

        return React.createClass({
            displayName: "$StateLink",

            propTypes: {
                to: React.PropTypes.string.isRequired,
                params: React.PropTypes.object,
                activeClassName: React.PropTypes.string.isRequired,
                activeStyle: React.PropTypes.object,
                onClick: React.PropTypes.func
            },

            getDefaultProps: function () {
                return {
                    activeClassName: "active"
                };
            },

            render: function() {
                var props = recurve.extend({}, this.props);
                recurve.extend(props, {
                    href: $stateRouter.nameToHref(this.props.to, this.props.params),
                    className: getClassName(this.props),
                    onClick: this._clickHandler
                });

                if (this.props.activeStyle && isActive(this.props)) {
                    props.style = this.props.activeStyle;
                }

                return React.createElement("a", props, this.props.children);
            },

            _clickHandler: function(event) {
                var result;
                if (this.props.onClick) {
                    result = this.props.onClick(event);
                }

                if (ignoreClickEvent(event)) {
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