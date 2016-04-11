'use strict';

/*
 * Config port getter. Default is 9100
 * @param  {Object}     _           Utility functions library reference
 * @param  {Object}     config      Config reference
 * @param  {Object}     log         Log function reference
 * @return {Number}                 Config port
 */
function getPort(_, config, log) {
    try {
        return _.get(config, 'port', 9100);
    } catch (err) {
        log('error', 'getPort: an error happened: ', err.toString());
    }
}

/*
 * Middleware initializer
 * Pull all middleware names from config and apply them to the app
 * @param  {Object}     _           Utility functions library reference
 * @param  {Object}     app         Service reference
 * @param  {Object}     config      Config reference
 * @param  {Object}     log         Log function reference
 * @return {Promise}                Fulfilled when all middlewares are initialized
 */
function mwInit(_, app, config, log) {
    try {
        return Promise.all(_
            .get(config, 'middlewareList', [])
            .map(middlewareName => './lib/' + middlewareName)
            .map(require)
            .map(middlewareModule => middleware.init(_, app, config, log))
            .map(app.use));
    } catch (err) {
        log('error', 'mwInit: an error happened: ', err.toString());
    }
}

/*
 * Service starter
 * Init all middlewares and make the app listen on config hostname/port
 * @param  {Object}     _           Utility functions library reference
 * @param  {Object}     app         Service reference
 * @param  {Object}     config      Config reference
 * @param  {Object}     log         Log function reference
 * @return {Promise}                Fulfilled with true if no errors
 */
function start(_, app, config, log) {
    return mwInit(_, app, config, log)
        .then(() => app.listen(
            getPort(_, config, log),
            () => log('info', `Service successfully started on at port ${port}`)
        )
        .catch((err) => {
            log('error', 'Fatal error while starting the service: ' + err.toString());
        });
}

module.exports = start;
