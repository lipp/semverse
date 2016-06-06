"use strict";

const lodash = require("lodash/fp");
const BPromise = require("bluebird");

/* Initialize Error middleware
 * @param  {Object} context - Current context
 * @return {Promise<Function>} Error handler middleware function
 */
exports.factory = (context) => BPromise
    .try(function() {
        const get = lodash.get;
        const getLogger = get("utils.getLogger", context);
        const log = getLogger(context);

        const sendBack = get("utils.sendBack", context);

        log("info", 'Adding Error handler');

        return function errorMiddleware(error, req, res, next) {
            log("error", `An error has not been handled internally ${get("stack", error)}`);
            log("error", `Request was ${get("method", req)} ${get("path", req)}`);
            sendBack(res, 500, error);
            next(error);
        };
    });
