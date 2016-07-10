/**
 * ### Error middleware
 *
 * If anything goes wrong, this middleware will know and take action
 * accordingly.
 *
 * @module Middlewares/Error
 */
"use strict";

const path = require("path");

const {
    get
} = require("lodash/fp");

const utils = require(path.resolve(__dirname, "../utils"));
const log = utils.log;
const sendBack = utils.sendBack;

log("info", "Adding Error handler");

module.exports = function(error, req, res, next) {
    log("error", `An error has not been handled internally ${get("stack", error)}`);
    log("error", `Request was ${get("method", req)} ${get("path", req)}`);
    sendBack(res, 500, error);
    next(error);
};
