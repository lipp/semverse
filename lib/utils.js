'use strict';

const path = require('path');
//const lodash = require('lodash/fp');

/* Require a module from the project Root directory
 * @param   {String}    moduleName      Module name
 * @return  {Mixed}                     Module exports
 */
function requireFromProjectRoot(moduleName) {
    const projectRoot = path.resolve(__dirname, '../');
    return require(path.join(projectRoot, moduleName));
}

/* Require a module based on its test name
 * @param   {String}    testFileName    Tested module name
 * @return  {Mixed}                     Module exports
 */
function requireTestedModule(testFileName) {
    const
        r = /([\w\/]*)tests\/(unit|e2e)\/([\w\/]*)/,
        result = r.exec(testFileName);
    return result
        ? require(result[1] + result[3])
        : null;
}

/* Require a middleware
 * @param   {String}    middleware      Tested module name
 * @return  {Mixed}                     Module exports
 */
function requireMiddleware(middleware {
    return require(path.resolve(__dirname, middleware);
}

module.exports = {
    requireFromProjectRoot: requireFromProjectRoot,
    requireTestedModule: requireTestedModule
};

