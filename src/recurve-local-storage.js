"use strict";

var Storage = require("./recurve-storage.js")

module.exports = Storage.extend([
    function ctor(useCache, cache) {
        this._super(useCache, cache);

        this._storage = window.localStorage;
    }
]);