"use strict";

const path = require("path");

const { tbd } = require(path.resolve(__dirname, "../lib/utils"));

exports.getService = tbd("getService");

//const _ = require("lodash");
//const configDefault = require("./default");
//const configEnvironment = require("./environment");

//module.exports = _.merge({},
//configDefault,
//configEnvironment);
