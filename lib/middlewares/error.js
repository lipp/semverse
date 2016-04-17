'use strict';

/* Initialize Error middleware
 * @param  {Object}     utils       Utility functions library reference
 * @param  {Object}     config      Config reference
 * @param  {Object}     log         Log function reference
 * @return {Function}               Error handler middleware function
 */
function init(utils, config, log) {
    log('info', 'Initializing Error handler');
    return function errorHandler(error, req, res, next) {
        log('error', 'An error has not been handled internally', error.stack);
        next(error);
    };
}

module.exports = init;
