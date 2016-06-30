/**
 * ### Middleware loader
 *
 * This module loads middlewares as they are set in the current configuration
 *
 * @module Middlewares/Loader
 */
"use strict";

const {
    curry,
    flow,
    get,
    has,
    map,
    tap,
    flattenDeep
} = require("lodash/fp");
const BPromise = require("bluebird");

exports.factory = function factory(context) {

    const utils = context.utils;

    const log = utils.getLogger(context);
    const logAndResolve = utils.logAndResolve(log);
    const logAndReject = utils.logAndReject(log);

    const instance = {};

    /**
     * @name registerMiddleware
     * @description Register a middleware
     * @curried
     * @param  {Object} service - service reference
     * @param  {Function} middleware - Middleware function
     * @return {Boolean} True on success
     */
    instance.registerMiddleware = curry((service, middleware) => service.use(middleware));

    /**
     * Initialize a middleware with the current context
     * @param  {Function} middleware - Middleware function
     * @return {Promise} Fulfilled on success
     */
    instance.initMiddleware = function initMiddleware(middleware) {
        if (has("factory", middleware)) {
            return middleware.factory(context);
        }
        return BPromise.reject(
            new Error(`Middleware is missing a factory method: ${middleware}`)
        );
    };

    /**
     * Middleware loader
     * Pull all middleware names from config and register them in the service
     * @param  {Object} service - Service reference
     * @return {Promise} Fulfilled when all middlewares are initialized
     */
    instance.loadMiddlewares = function loadMiddlewares() {
        const config = context.config;
        const requireMiddleware = context.utils.requireMiddleware;
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
                map(requireMiddleware),
                // Call all middlewares factories to get middleware instances
                map(instance.initMiddleware),
                // Wait for all initializations to resolve
                (middlewarePromises) => BPromise.all(middlewarePromises),
                // Then register them in the service
                (allresolved) => allresolved
                .then(flattenDeep)
                .then(map(instance.registerMiddleware(context.service)))
                .then(() => logAndResolve("info", "Successfully intitialized middlewares", context))
                .catch(logAndReject("error", "Error while loading middlewares"))
            )(config));
    };

    return instance;
};
