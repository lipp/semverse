/**
 * ### Error middleware
 *
 * If anything goes wrong, this middleware will know and take action
 * accordingly.
 *
 * @module Middlewares/Error
 */
"use strict";

const {
    get
} = require("lodash/fp");
const BPromise = require("bluebird");

/**
 * Instanciate Error middleware
 * @param  {Object} context - Current context
 * @return {Promise<Function>} Error handler middleware function
 */
exports.factory = function factory(context) {
    return BPromise
        .try(function() {
            const log = context.utils.getLogger(context);
            const sendBack = get("utils.sendBack", context);

            log("info", "Adding Error handler");

            return function errorMiddleware(error, req, res, next) {
                log("error", `An error has not been handled internally ${get("stack", error)}`);
                log("error", `Request was ${get("method", req)} ${get("path", req)}`);
                sendBack(res, 500, error);
                next(error);
            };
        });
};
