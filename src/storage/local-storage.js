"use strict";

var Storage = require("./storage.js")

module.exports = new Storage(window.localStorage);