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
    curry,
    get,
    isFunction
} = require("lodash/fp");
const BPromise = require("bluebird");

// No logger module for the moment, so just dump everything into console
exports.getLogger = () => console.log;

/**
 * Compute a module absolute path from its root based path
 * @param {String} relativePath - Module relative path from project root
 * @return {String} Module absolute path
 */
exports.getModulePath = function getModulePath(relativePath) {
    return path.join(path.resolve(__dirname, "../"), relativePath);
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
 * Require a model, e.g. a module located in <project_root>/models
 * @param {String} moduleName - Module name
 * @return {Mixed} Model exports
 */
exports.requireModel = function requireModel(moduleName) {
    return require(exports.getModulePath(path.join("models", moduleName)));
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
 * @name logAndResolve
 * @description Log an error and resolve it again
 * @curried
 * @param {String} logFn - Log function
 * @param {String} level - Log level
 * @param {String} message - Message that will be logged
 * @param {Mixed} value - Value to be resolved with
 * @return {Promise<Mixed>} Same value
 */
exports.logAndResolve = curry(function logAndResolve(logFn, level, message, value) {
    logFn(level, message);
    return BPromise.resolve(value);
});

/**
 * @name logAndReject
 * @description Log an error and reject it again
 * @curried
 * @param {String} logFn - Log function
 * @param {String} level - Log level
 * @param {String} message - Message that will be logged
 * @param {Object} error - Error object
 * @return {Promise<Error>} Same error object
 */
exports.logAndReject = curry(function logAndReject(logFn, level, message, error) {
    logFn(level, message);
    return BPromise.reject(error);
});
