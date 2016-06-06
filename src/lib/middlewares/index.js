"use strict";

const lodash = require("lodash/fp");
const BPromise = require("bluebird");

exports.factory = function factory(context) {

    const utils = lodash.get("utils", context);
    const config = lodash.get("config", context);

    const curry = lodash.curry;
    const flow = lodash.flow;
    const get = lodash.get;
    const map = lodash.map;
    const tap = lodash.tap;

    const requireFromProjectRoot = lodash.get("requireFromProjectRoot", utils);
    const getLogger = lodash.get("getLogger", utils);

    const log = getLogger(context);

    const instance = {};

    /*
     * @name registerMiddleware
     * @description Register a middleware
     * @curried
     * @param  {Object} app - App reference
     * @param  {Function} middleware - Middleware function
     * @return {Boolean} True on success
     */
    instance.registerMiddleware = curry((app, middleware) => app.use(middleware));

    /*
     * Initialize a middleware with the current context
     * @param  {Function} middleware - Middlewre function
     * @return {Promise} Fulfilled on success
     */
    instance.initMiddleware = function initMiddleware(middleware) {
        if (lodash.has("factory", middleware)) {
            return middleware.factory(context);
        }
    };

    /*
     * Config port getter. Default is 9100
     * @return {Number} Configured port
     */
    instance.getPort = function getPort() {
        return get("port", config) || 9100;
    };

    /*
     * Middleware loader
     * Pull all middleware names from config and register them in the app
     * @param  {Object} app - Service reference
     * @return {Promise} Fulfilled when all middlewares are initialized
     */
    instance.loadMiddlewares = function loadMiddlewares(app) {
        log("debug", `Config is ${JSON.stringify(config)}`);
        log("info", `Loading middlewares...`);
        return BPromise
            .try(() => flow(
                // Retrieve the middleware list from the config
                get("middlewareList"),
                // Handle empty middlewareList cases
                (a) => a || [],
                // Log it
                tap((a) => log("debug", `Middleware list: ${JSON.stringify(a)}`)),
                // Require everything
                map(requireFromProjectRoot),
                // Call all middlewares factories to get middleware instances
                map(instance.initMiddleware),
                // Wait for all initializations to resolve
                (middlewarePromises) => BPromise.all(middlewarePromises),
                // Then register them in the service
                (allresolved) => allresolved
                .then(map(instance.registerMiddleware(app)))
                .then(() => log("info", `Successfully intitialized middlewares`))
                .catch(function(error) {
                    log("error", `Error while loading middlewares: ${error}`);
                    return BPromise.reject(error);
                })
            )(config));
    };

    /*
     * Service starter
     * Init all middlewares and make the app listen on config hostname/port
     * @param  {Object} app - Service reference
     * @return {Promise} Fulfilled when instance is successfully started
     */
    instance.startInstance = function startInstance(app) {
        return BPromise
            .try(function() {
                const port = instance.getPort();
                log("info", `Starting service instance on port ${port}...`);
                return instance.loadMiddlewares(app)
                    .then(() => app.listen(
                        port, () => log("info",
                            `Service instance successfully started`
                        )
                    ))
                    .catch(function(error) {
                        log("critical",
                            `Fatal error while starting the service instance: ${error}`
                        );
                        return BPromise.reject(error);
                    });
            });
    };

    return instance;
};
