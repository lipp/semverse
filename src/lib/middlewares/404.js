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

const {
    get
} = require("lodash/fp");
const BPromise = require("bluebird");

/**
 * Instanciate PageNotFound middleware
 * This simple middleware will answer to any request with a 404 error
 * @param  {Object} context - Current context
 * @return {Promise<Function>} PageNotFound middleware function
 */
exports.factory = (context) => BPromise
    .try(function() {
        const log = context.utils.getLogger(context);
        const sendBack = context.utils.sendBack;

        log("info", "Adding PageNotFound handler");

        return function pageNotFoundMiddleware(req, res, next) {
            log("error", `A request tried to access an unknown page: ${get("method", req)} ${get("path", req)}`);
            sendBack(res, 404);
            next();
        };
    });
