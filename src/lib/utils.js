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
    get,
    isFunction
} = require("lodash/fp");

exports.getLogger = () => console.log;

/**
 * Require a middleware, e.g. a module located in /lib/middlewares
 * @param   {String} moduleName - Module name
 * @return  {Mixed} Module exports
 */
exports.requireMiddleware = function requireMiddleware(moduleName) {
    const projectRoot = path.resolve(__dirname, '../lib/middlewares');
    return require(path.join(projectRoot, moduleName));
};

/**
 * Mutate response
 * @param  {Object} res - Response reference
 * @param  {Number} status - Response status
 * @param  {Object} content - Content to be sent back
 * @return {Undefined} Nothing
 */
exports.sendBack = function sendBack(res, status, content) {
    if (isFunction(get("status", res)) && isFunction(get("json", res))) {
        res
            .status(status)
            .json(content);
    }
};
