"use strict";

const path = require("path");

const {
    get,
    isFunction
} = require("lodash/fp");

exports.getLogger = () => console.log;

/* Require a module from the project Root directory
 * @param   {String}    moduleName      Module name
 * @return  {Mixed}                     Module exports
 */
exports.requireFromProjectRoot = function requireFromProjectRoot(moduleName) {
    const projectRoot = path.resolve(__dirname, '../');
    return require(path.join(projectRoot, moduleName));
};


/* Mutate response
 * @param  {Object} res - Response reference
 * @param  {Number} status - Response status
 * @param  {Object} content - Content to be sent back
 * @return {Undefined} Nothing
 */
exports.sendBack = function sendBack(res, status, content) {
    const resStatus = get("status", res);
    const resJson = get("json", res);
    if (isFunction(resStatus) && isFunction(resJson)) {
        resStatus(status);
        resJson(content);
    }
};
