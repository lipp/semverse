/**
 * ### Main configuration loader
 *
 * This module is in charge of loading and overloading all config files in
 * order of importance.
 *
 * @module Configuration/Loader
 */
"use strict";
const lodash = require("lodash");

const configDefault = require("./default");
const configEnvironment = require("./environment");

module.exports = lodash.merge({},
configDefault,
configEnvironment);
