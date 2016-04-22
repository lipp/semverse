"use strict";

const path = require("path");

/*
 * Config port getter. Default is 9100
 * @param  {Object}     utils       Utility functions library reference
 * @param  {Object}     config      Config reference
 * @return {Number}                 Config port
 */
function getPort(utils, config) {
    return utils.get("port", config, 9100);
}

/*
 * Middleware initializer
 * Pull all middleware names from config and apply them to the app
 * @param  {Object}     utils       Utility functions library reference
 * @param  {Object}     app         Service reference
 * @param  {Object}     config      Config reference
 * @param  {Object}     log         Log function reference
 * @return {Promise}                Fulfilled when all middlewares are initialized
 */
function mwInit(utils, app, config, log) {
    // @TODO Replace with destructuring at some point
    // Useful for knowing what we need from utils
    try {
        const flow = utils.flow;
        const get = utils.get;
        const map = utils.map;
        const tap = utils.tap;

        log("info", "Initializing middlewares...");
        return Promise.all(flow(
                // Retrieve the MW List from the config
                get("middlewareList"),
                // Log it
                tap(list => log("info", "Middleware list: ", list)),
                // Transform it into a path+filename list
                map(middlewareName => path.resolve(__dirname, middlewareName)),
                // Require everything
                map(require),
                // Call all middlewares to initialize them
                map(middlewareModule => app.use(
                    (req, res, next) => middleware(utils, req, res, next, config, log)))
            )(config))
            .then(() => log("info", "Done initializing middlewares"))
            .catch(err => {
                log("info", "Error while initializing middlewares: ", err.stack);
                throw err;
            });
    } catch (err) {
        return Promise.reject(err);
    }
}

/*
 * Service starter
 * Init all middlewares and make the app listen on config hostname/port
 * @param  {Object}     utils       Utility functions library reference
 * @param  {Object}     app         Service reference
 * @param  {Object}     config      Config reference
 * @param  {Object}     log         Log function reference
 * @return {Promise}                Fulfilled with true if no errors
 */
function start(utils, app, config, log) {
    app.use((req, res, next) => {
        log("info", "COUCOU !");
        next();
    });
    app.use((err, req, res, next) => {
        log("error", "ERROR: ", err.stack);
        next(err);
    });

    log("info", "Starting service...");
    const port = getPort(utils, config);
    return mwInit(utils, app, config, log)
        .then(() => app.listen(
            port, () => log("info", `Service successfully started on port ${port}`)
        ))
        .catch((err) => {
            log("error", "Fatal error while starting the service: ", err.stack);
        });
}

module.exports = process.env.NODE_ENV !== "test" ? start : {
    getPort,
    mwInit,
    start
};
