/**
 * ### Utilities library
 *
 * All functions that are not related to a specific logic and that can be
 * reused across modules
 *
 * @module Library/Utilities
 */
"use strict";

const path = require("path");
const lodash = require("lodash/fp");
const BPromise = require("bluebird");

const {
    get,
    isFunction
} = require("lodash/fp");

exports.getLogger = () => console.log;

/**
 * Require a middleware, e.g. a module located in /lib/middlewares
 * @param {String} moduleName - Module name
 * @return {Mixed} Module exports
 */
exports.requireMiddleware = function requireMiddleware(moduleName) {
    const projectRoot = path.resolve(__dirname, "../lib/middlewares");
    return require(path.join(projectRoot, moduleName));
};

/**
 * @name sendBack
 * @description Mutate response
 * @curried
 * @param {Object} res - Response reference
 * @param {Number} status - Response status
 * @param {Object} content - Content to be sent back
 * @return {Undefined} Nothing
 */
exports.sendBack = lodash.curry(function sendBack(res, status, content) {
    if (isFunction(get("status", res)) && isFunction(get("json", res))) {
        res
            .status(status)
            .json(content);
    }
});

/**
 * @name logAndReject
 * @description Log an error and reject it again
 * @curried
 * @param {String} logFn - Log function
 * @param {String} message - Message that will be logged
 * @param {Object} error - Error object
 * @return {Promise<Error>} Same error object
 */
exports.logAndReject = lodash.curry(function logAndReject(logFn, message, error) {
    logFn(message);
    return BPromise.reject(error);
});
