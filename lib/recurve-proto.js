/**
 *  Created by Sebastien Couture on 2013-12-21.
 *  Copyright (c) 2013 Sebastien Couture. All rights reserved.
 *
 *  Permission is hereby granted, free of charge, to any person
 *  obtaining a copy of this software and associated documentation
 *  files (the "Software"), to deal in the Software without
 *  restriction, including without limitation the rights to use,
 *  copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *  OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
    var Recurve = window.Recurve = window.Recurve || {};

    var dontInvokeConstructor = {};

    function isFunction(value) {
        return value && "function" == typeof value;
    }

    Recurve.Proto = function() {
        // do nothing
    };

    /**
     * Create object that inherits from this object
     *
     * @param options   array consisting of constructor, prototype/"member" variables/functions,
     *                  and namespace/"static" variables/function
     */
    Recurve.Proto.define = function(options) {
        if (!options || 0 === options.length) {
            return this;
        }

        var possibleConstructor = options[0];

        var properties;
        var staticProperties;

        if (isFunction(possibleConstructor)) {
            properties = 1 < options.length ? options[1] : {};
            properties[ "$ctor" ] = possibleConstructor;

            staticProperties = options[2];
        }
        else {
            properties = options[0];
            staticProperties = options[1];
        }

        function ProtoObj(param)
        {
            if (dontInvokeConstructor != param &&
                isFunction(this.$ctor)) {
                this.$ctor.apply( this, arguments );
            }
        };

        ProtoObj.prototype = new this(dontInvokeConstructor);

        // Prototype/"member" properties
        for (key in properties) {
            addProtoProperty(key, properties[key], ProtoObj.prototype[key]);
        }

        function addProtoProperty(key, property, superProperty)
        {
            if (!isFunction(property) ||
                !isFunction(superProperty)) {
                ProtoObj.prototype[key] = property;
            }
            else
            {
                // Create function with ref to base method
                ProtoObj.prototype[key] = function()
                {
                    this._super = superProperty;
                    return property.apply(this, arguments);
                };
            }
        }

        ProtoObj.prototype.constructor = ProtoObj;

        // Namespaced/"Static" properties
        ProtoObj.extend = this.extend || this.define;
        ProtoObj.mixin = this.mixin;

        for (key in staticProperties)
        {
            ProtoObj[key] = staticProperties[key];
        }

        return ProtoObj;
    };

    /**
     * Mixin a set of variables/functions as prototypes for this object. Any variables/functions
     * that already exist with the same name will be overridden.
     *
     * @param properties    variables/functions to mixin with this object
     */
    Recurve.Proto.mixin = function(properties) {
        Recurve.Proto.mixinWith(this, properties);
    };

    /**
     * Mixin a set of variables/functions as prototypes for the object. Any variables/functions
     * that already exist with the same name will be overridden.
     *
     * @param properties    variables/functions to mixin with this object
     */
    Recurve.Proto.mixinWith = function(obj, properties) {
        for (key in properties) {
            obj.prototype[key] = properties[key];
        }
    }
})();