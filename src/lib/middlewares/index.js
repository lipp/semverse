/**
 * ### Middleware loader
 *
 * This module loads middlewares as they are set in the current configuration
 *
 * @module Middlewares/Loader
 */
"use strict";

const path = require("path");

const {
    curry,
    flow,
    get,
    map,
    tap,
    flattenDeep
} = require("lodash/fp");
const BPromise = require("bluebird");

const utils = require(path.resolve(__dirname, "../utils"));
const log = utils.log;
const logAndResolve = utils.logAndResolve;
const logAndReject = utils.logAndReject;
/**
 * @name registerMiddleware
 * @description Register a middleware
 * @curried
 * @param  {Object} service - service reference
 * @param  {Function} middleware - Middleware function
 * @return {Object} Service reference
 */
exports.registerMiddleware = curry((service, middleware) => service.use(middleware));

/**
 * Pull all middleware names from config, retrieve the related modules,
 * instanciate every middleware and register them in the service
 * @param {Object} config - Current configuration
 * @param {Object} service - Service reference
 * @return {Promise<Object>} Service reference
 */
exports.loadMiddlewares = function loadMiddlewares(config, service) {
    log("debug", `Config is ${JSON.stringify(config)}`);
    log("info", "Loading middlewares...");
    return BPromise
        .try(() => flow(
            // Retrieve the middleware list from the config
            get("service.middlewareList"),
            // Handle empty middlewareList cases
            (a) => a || [],
            // Log it
            tap((a) => log("debug", `Middleware list: ${JSON.stringify(a)}`)),
            // Require everything
            map((name) => require(utils.getModulePath(path.join("lib/middlewares", name)))),
            // Wait for all initializations to resolve
            (middlewarePromises) => BPromise.all(middlewarePromises),
            // Then register them in the service
            (allresolved) => allresolved
            .then(flattenDeep)
            .then(map(exports.registerMiddleware(service)))
            .then(logAndResolve("info", "Successfully intitialized middlewares"))
            .catch(logAndReject("error", "Error while loading middlewares"))
        )(config));
};
