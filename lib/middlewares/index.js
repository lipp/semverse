'use strict';

const path = require('path');

/*
 * Config port getter. Default is 9100
 * @param  {Object}     utils       Utility functions library reference
 * @param  {Object}     config      Config reference
 * @return {Number}                 Config port
 */
function getPort(utils, config) {
    return utils.get('port', config, 9100);
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
    log('info', 'Initializing middlewares...');
    return Promise.all(utils
            .flow(
                utils.get('middlewareList'),
                utils.tap(list => log('info', 'Middleware list: ', JSON.stringify(list))),
                utils.map(middlewareName => path.resolve('./lib/middlewares', middlewareName)),
                utils.map(require),
                utils.map(middlewareModule => middlewareModule(utils, config, log))
            )(config))
        .then(utils.map(mwf => app.use(mwf)))
        .then(() => log('info', 'Done initializing middlewares'))
        .catch(err => {
            log('info', 'Stack: ', err.stack);
            throw err;
        });
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
        log('info', 'COUCOU !');
        next();
    });
    app.use((err, req, res, next) => {
        log('error', 'ERROR: ', err.stack);
        next(err);
    });

    log('info', 'Starting service...');
    const port = getPort(utils, config);
    return mwInit(utils, app, config, log)
        .then(() => app.listen(
            port, () => log('info', `Service successfully started on port ${port}`)
        ))
        //.catch((err) => {
        //  log('error', 'Fatal error while starting the service' + err.toString());
        //  throw err;
        //});
}

module.exports = start;
