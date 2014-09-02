"use strict";

var ObjectUtils = require("../../utils/object.js");
var StringUtils = require("../../utils/string.js");

module.exports = function(recurveModule) {
    recurveModule.value("$httpTransformer", httpTransformer);
};

var httpTransformer = {
    serialize: function(data, contentType) {
        var ignoreCase = true;

        if (StringUtils.contains(contentType, "application/x-www-form-urlencoded", ignoreCase)) {
            if (ObjectUtils.isObject(data) && !ObjectUtils.isFile(data)) {
                data = ObjectUtils.toFormData(data);
            }
        }
        else if (StringUtils.contains(contentType, "application/json", ignoreCase)) {
            if (ObjectUtils.isObject(data) && !ObjectUtils.isFile(data)) {
                data = ObjectUtils.toJson(data);
            }
        }
        else {
            // do nothing - nothing to serialize
        }

        return data;
    },

    parse: function(data) {
        if (data) {
            try {
                data = ObjectUtils.toJson(data);
            }
            catch (error) {
                // do nothing - not json, or invalid json
            }
        }

        return data;
    }
};
