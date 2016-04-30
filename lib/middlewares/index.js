"use strict";

module.exports = function factory(utilsRef, configRef, logRef) {

    const { flow, get, map, tap } = utilsRef;
    const config = configRef;
    const log = logRef;

    return {
        /*
         * Use a middleware
         * @param  {Object}             app         App reference
         * @param  {Function}           middleware  Middleware function
         * @return {Boolean}            True on success
         */
        useMiddleware(app, middleware) {
            return app.use(middleware);
        },

        /*
         * Initialize a middleware
         * @param  {Object}             utils           Utils collection
         * @param  {Object}             config          Config reference
         * @param  {Function}           log             Log Function
         * @param  {Function}           middleware      Middleware function
         * @return {Promise.Boolean}    True on success
         */
        initMiddleware(middleware) {
            return middleware(utils, config, log);
        },

        /*
         * Config port getter. Default is 9100
         * @return {Number}             Config port
         */
        getPort() {
            return get("port", config, 9100);
        },

        /*
         * Middleware initializer
         * Pull all middleware names from config and apply them to the app
         * @param  {Object}             app         Service reference
         * @return {Promise.Boolean}    True when all middlewares are initialized
         */
        mwInit(app) {
            log("info", "Initializing middlewares...");
            return flow(
                // Retrieve the middleware list from the config
                get("middlewareList"),
                // Log it
                tap((list) => log("info", "Middleware list: ", list)),
                // Require everything
                map(requireModule),
                // Call all middlewares factories to create middleware
                // functions
                map(exports.initMiddleware),
                // Wait for all initializations to resolve
                Promise.all,
                p => p
                .then(map(exports.useMiddleware))
                .then(() => log("info", "Successfully intitialized middlewares"))
                .then(() => true)
                .catch((err) => log("error",
                    "Error while initializing middlewares: ",
                    err.stack))
            )(config);
        },

        /*
         * Service starter
         * Init all middlewares and make the app listen on config hostname/port
         * @param  {Object}     utils       Utility functions library reference
         * @param  {Object}     app         Service reference
         * @param  {Object}     config      Config reference
         * @param  {Object}     log         Log function reference
         * @return {Promise}                Fulfilled with true if no errors
         */
        start(app) {
            //app.use(function (req, res, next) {
                //log("info", "COUCOU !");
                //next();
            //});
            //app.use(function (err, req, res, next) {
                //log("error", "ERROR: ", err.stack);
                //next(err);
            //});
            const port = exports.getPort();
            log("info", "Starting service...");
            return mwInit(app)
                .then(() => app.listen(
                    port,
                    () => log("info", `Service successfully started on port ${port}`)
                ))
                .catch((err) => log("error",
                    "Fatal error while starting the service: ",
                    err.stack));
        }
    };
}
exports = module.exports;
