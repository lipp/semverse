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
const {
    curry
} = require("lodash/fp");
const BPromise = require("bluebird");

const {
    get,
    isFunction
} = require("lodash/fp");

exports.getLogger = () => console.log;

/**
 * Compute a module absolute path from its root based path
 * @param {String} relativePath - Module relative path from project root
 * @return {String} Module absolute path
 */
exports.getModulePath = function getModulePath(relativePath) {
    const projectRoot = path.resolve(__dirname, "../");
    return path.join(projectRoot, relativePath);
};

/**
 * Require a middleware, e.g. a module located in <project_root>/lib/middlewares
 * @param {String} moduleName - Module name
 * @return {Mixed} Module exports
 */
exports.requireMiddleware = function requireMiddleware(moduleName) {
    return require(exports.getModulePath(path.join("lib/middlewares", moduleName)));
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
exports.sendBack = curry(function sendBack(res, status, content) {
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
exports.logAndReject = curry(function logAndReject(logFn, message, error) {
    logFn(message);
    return BPromise.reject(error);
});
