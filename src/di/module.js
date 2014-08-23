"use strict";

var modules = {};

function Module(name, dependencies) {
    this.name = name;
    this.dependencies = dependencies;
}

Module.prototype = {

};

module.exports = Module;