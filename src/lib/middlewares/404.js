/**
 * ### 404 Middleware
 *
 * This middleware sends back a 404 response status for every request.
 * It has to be loaded after all other routing middleware to serve as a default
 * route.
 *
 * @module Middlewares/404
 */
"use strict";

const path = require("path");

const {
    get
} = require("lodash/fp");

const utils = require(path.resolve(__dirname, "../utils"));
const log = utils.log;
const sendBack = utils.sendBack;

log("info", "Adding PageNotFound handler");

module.exports = function(req, res, next) {
    log(
        "error",
        `Unknown route: ${get("method", req)} ${get("path", req)}`
    );
    sendBack(res, 404);
    next();
};
