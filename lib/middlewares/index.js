'use strict';

const path = require('path');

/*
 * Config port getter. Default is 9100
 * @param  {Object}     _           Utility functions library reference
 * @param  {Object}     config      Config reference
 * @return {Number}                 Config port
 */
function getPort(_, config) {
    return _.get(config, 'port', 9100);
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
    log('info', 'Initializing middlewares...');
    return Promise.all(_
        .flow(
            //_.get('middlewareList', []),
            serviceConfig => serviceConfig.middlewareList,
            list => log('info', 'Middleware list: [' + list + ']'),
            _.map(middlewareName => path.resolve('./lib/middlewares', middlewareName)),
            _.map(require),
            _.map(middlewareModule => middlewareModule(_, app, config, log))
            )(config))
        .then(_.map(app.use))
        .then(() => log('info', 'Done initializing middlewares'));
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
    log('info', 'Starting service...');
    const port = getPort(_, config, log);
    return mwInit(_, app, config, log)
        .then(() => app.listen(
            port,
            () => log('info', `Service successfully started on port ${port}`)
            )
        )
        //.catch((err) => {
        //  log('error', 'Fatal error while starting the service' + err.toString());
        //  throw err;
        //});
}

module.exports = start;
