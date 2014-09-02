var dontInvokeConstructor = {};

function isFunction(value) {
    return value && "function" == typeof value;
}

var Proto = function() {
    // do nothing
};

/**
 * Create object that inherits from this object
 *
 * @param options   array consisting of constructor, prototype/"member" variables/functions,
 *                  and namespace/"static" variables/function
 */
Proto.define = function(options) {
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
    }

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
Proto.mixin = function(properties) {
    return Proto.mixinWith(this, properties);
};

/**
 * Mixin a set of variables/functions as prototypes for the object. Any variables/functions
 * that already exist with the same name will be overridden.
 *
 * @param properties    variables/functions to mixin with this object
 */
Proto.mixinWith = function(obj, properties) {
    for (key in properties) {
        obj.prototype[key] = properties[key];
    }
};

module.exports = Proto;