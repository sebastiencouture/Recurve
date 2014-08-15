"use strict";

var Storage = require("./recurve-storage.js")

module.exports = new Storage(window.localStorage);