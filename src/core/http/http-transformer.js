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

    parse: function(xhr, accept) {
        var data;
        var ignoreCase = true;

        if (StringUtils.contains(accept, "application/xml", ignoreCase) ||
            StringUtils.contains(accept, "text/xml", ignoreCase)) {
            data = xhr.responseXML;
        }
        else if (StringUtils.contains(accept, "application/json", ignoreCase)) {
            if (data) {
                data = ObjectUtils.toJson(xhr.responseText);
            }
        }
        else {
            data = xhr.responseText;
        }

        return data;
    }
};
